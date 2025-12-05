"""管理 API 路由"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from ..services.gray_service import rules_cache

from ..models import (
    get_session,
    GrayRuleDB, WhitelistDB,
    GrayRuleCreate, GrayRuleUpdate, GrayRuleResponse,
    WhitelistCreate, WhitelistResponse,
    ApiResponse
)

router = APIRouter(prefix="/admin", tags=["管理接口"])


# ============== 灰度规则管理 ==============

@router.get("/rules")
async def list_rules(
    session: AsyncSession = Depends(get_session),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    is_enabled: Optional[bool] = None
):
    """获取规则列表"""
    query = select(GrayRuleDB).order_by(GrayRuleDB.priority.desc())
    
    if is_enabled is not None:
        query = query.where(GrayRuleDB.is_enabled == is_enabled)
    
    query = query.offset(skip).limit(limit)
    result = await session.execute(query)
    rules = result.scalars().all()
    
    return ApiResponse.success(data=[GrayRuleResponse.model_validate(r) for r in rules])


@router.post("/rules")
async def create_rule(
    rule: GrayRuleCreate,
    session: AsyncSession = Depends(get_session)
):
    """创建灰度规则"""
    # 检查名称是否重复
    existing = await session.execute(
        select(GrayRuleDB).where(GrayRuleDB.name == rule.name)
    )
    if existing.scalar_one_or_none():
        return ApiResponse.error(message="规则名称已存在")
    
    db_rule = GrayRuleDB(**rule.model_dump())
    session.add(db_rule)
    await session.commit()
    await session.refresh(db_rule)
    
    rules_cache.clear() # 清除缓存
    return ApiResponse.success(data=GrayRuleResponse.model_validate(db_rule))


@router.get("/rules/{rule_id}")
async def get_rule(
    rule_id: int,
    session: AsyncSession = Depends(get_session)
):
    """获取单个规则详情"""
    result = await session.execute(
        select(GrayRuleDB).where(GrayRuleDB.id == rule_id)
    )
    rule = result.scalar_one_or_none()
    
    if not rule:
        return ApiResponse.error(message="规则不存在")
    
    return ApiResponse.success(data=GrayRuleResponse.model_validate(rule))


@router.put("/rules/{rule_id}")
async def update_rule(
    rule_id: int,
    rule_update: GrayRuleUpdate,
    session: AsyncSession = Depends(get_session)
):
    """更新灰度规则"""
    result = await session.execute(
        select(GrayRuleDB).where(GrayRuleDB.id == rule_id)
    )
    db_rule = result.scalar_one_or_none()
    
    if not db_rule:
        return ApiResponse.error(message="规则不存在")
    
    # 更新字段
    update_data = rule_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_rule, key, value)
    
    await session.commit()
    await session.refresh(db_rule)
    
    rules_cache.clear() # 清除缓存
    return ApiResponse.success(data=GrayRuleResponse.model_validate(db_rule))


@router.delete("/rules/{rule_id}")
async def delete_rule(
    rule_id: int,
    session: AsyncSession = Depends(get_session)
):
    """删除灰度规则"""
    result = await session.execute(
        select(GrayRuleDB).where(GrayRuleDB.id == rule_id)
    )
    db_rule = result.scalar_one_or_none()
    
    if not db_rule:
        return ApiResponse.error(message="规则不存在")
    
    # 同时删除关联的白名单
    await session.execute(
        delete(WhitelistDB).where(WhitelistDB.rule_id == rule_id)
    )
    
    await session.delete(db_rule)
    await session.commit()
    
    rules_cache.clear() # 清除缓存
    return ApiResponse.success(data={"id": rule_id}, message="删除成功")


@router.patch("/rules/{rule_id}/toggle")
async def toggle_rule(
    rule_id: int,
    session: AsyncSession = Depends(get_session)
):
    """切换规则启用状态"""
    result = await session.execute(
        select(GrayRuleDB).where(GrayRuleDB.id == rule_id)
    )
    db_rule = result.scalar_one_or_none()
    
    if not db_rule:
        return ApiResponse.error(message="规则不存在")
    
    db_rule.is_enabled = not db_rule.is_enabled
    await session.commit()
    
    rules_cache.clear() # 清除缓存
    return ApiResponse.success(data={"is_enabled": db_rule.is_enabled}, message="状态已切换")


# ============== 白名单管理 ==============

@router.get("/rules/{rule_id}/whitelist")
async def list_whitelist(
    rule_id: int,
    session: AsyncSession = Depends(get_session)
):
    """获取规则的白名单列表"""
    result = await session.execute(
        select(WhitelistDB)
        .where(WhitelistDB.rule_id == rule_id)
        .order_by(WhitelistDB.created_at.desc())
    )
    whitelists = result.scalars().all()
    
    return ApiResponse.success(data=[WhitelistResponse.model_validate(w) for w in whitelists])


@router.post("/whitelist")
async def add_whitelist(
    whitelist: WhitelistCreate,
    session: AsyncSession = Depends(get_session)
):
    """添加白名单条目"""
    # 检查规则是否存在
    rule_result = await session.execute(
        select(GrayRuleDB).where(GrayRuleDB.id == whitelist.rule_id)
    )
    if not rule_result.scalar_one_or_none():
        return ApiResponse.error(message="规则不存在")
    
    # 检查是否重复
    existing = await session.execute(
        select(WhitelistDB)
        .where(WhitelistDB.rule_id == whitelist.rule_id)
        .where(WhitelistDB.value == whitelist.value)
    )
    if existing.scalar_one_or_none():
        return ApiResponse.error(message="白名单条目已存在")
    
    db_whitelist = WhitelistDB(**whitelist.model_dump())
    session.add(db_whitelist)
    await session.commit()
    await session.refresh(db_whitelist)
    
    return ApiResponse.success(data=WhitelistResponse.model_validate(db_whitelist))


@router.post("/whitelist/batch")
async def batch_add_whitelist(
    rule_id: int,
    values: List[str],
    value_type: str = "user_id",
    session: AsyncSession = Depends(get_session)
):
    """批量添加白名单"""
    # 检查规则是否存在
    rule_result = await session.execute(
        select(GrayRuleDB).where(GrayRuleDB.id == rule_id)
    )
    if not rule_result.scalar_one_or_none():
        return ApiResponse.error(message="规则不存在")
    
    added = 0
    skipped = 0
    
    for value in values:
        value = value.strip()
        if not value:
            continue
            
        # 检查是否已存在
        existing = await session.execute(
            select(WhitelistDB)
            .where(WhitelistDB.rule_id == rule_id)
            .where(WhitelistDB.value == value)
        )
        if existing.scalar_one_or_none():
            skipped += 1
            continue
        
        db_whitelist = WhitelistDB(
            rule_id=rule_id,
            value=value,
            value_type=value_type,
            is_enabled=True
        )
        session.add(db_whitelist)
        added += 1
    
    await session.commit()
    
    return ApiResponse.success(data={"added": added, "skipped": skipped}, message="批量添加完成")


@router.delete("/whitelist/{whitelist_id}")
async def delete_whitelist(
    whitelist_id: int,
    session: AsyncSession = Depends(get_session)
):
    """删除白名单条目"""
    result = await session.execute(
        select(WhitelistDB).where(WhitelistDB.id == whitelist_id)
    )
    db_whitelist = result.scalar_one_or_none()
    
    if not db_whitelist:
        return ApiResponse.error(message="白名单条目不存在")
    
    await session.delete(db_whitelist)
    await session.commit()
    
    return ApiResponse.success(data={"id": whitelist_id}, message="删除成功")


@router.patch("/whitelist/{whitelist_id}/toggle")
async def toggle_whitelist(
    whitelist_id: int,
    session: AsyncSession = Depends(get_session)
):
    """切换白名单启用状态"""
    result = await session.execute(
        select(WhitelistDB).where(WhitelistDB.id == whitelist_id)
    )
    db_whitelist = result.scalar_one_or_none()
    
    if not db_whitelist:
        return ApiResponse.error(message="白名单条目不存在")
    
    db_whitelist.is_enabled = not db_whitelist.is_enabled
    await session.commit()
    
    return ApiResponse.success(data={"is_enabled": db_whitelist.is_enabled}, message="状态已切换")

