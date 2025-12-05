"""数据模型定义"""
from datetime import datetime
from typing import Optional, List
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, JSON
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from pydantic import BaseModel, Field

import sys
sys.path.append('..')
from config import DATABASE_URL

# SQLAlchemy 配置
engine = create_async_engine(DATABASE_URL, echo=True)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()


# ============== SQLAlchemy ORM 模型 ==============

class GrayRuleDB(Base):
    """灰度规则数据库模型"""
    __tablename__ = "gray_rules"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False, comment="规则名称")
    description = Column(Text, nullable=True, comment="规则描述")
    is_enabled = Column(Boolean, default=True, comment="是否启用")
    priority = Column(Integer, default=0, comment="优先级，数字越大优先级越高")
    
    # 匹配条件
    match_type = Column(String(50), default="whitelist", comment="匹配类型: whitelist, header, cookie, ip")
    match_key = Column(String(100), nullable=True, comment="匹配键名（如header名、cookie名）")
    match_values = Column(JSON, default=list, comment="匹配值列表（白名单列表）")
    
    # 灰度目标
    target_version = Column(String(50), default="gray", comment="目标版本标识")
    target_upstream = Column(String(200), nullable=True, comment="目标上游服务地址")
    
    # 时间戳
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class WhitelistDB(Base):
    """白名单数据库模型"""
    __tablename__ = "whitelists"
    
    id = Column(Integer, primary_key=True, index=True)
    rule_id = Column(Integer, nullable=False, comment="关联的规则ID")
    value = Column(String(200), nullable=False, comment="白名单值")
    value_type = Column(String(50), default="user_id", comment="值类型: user_id, ip, cookie, header")
    remark = Column(String(200), nullable=True, comment="备注")
    is_enabled = Column(Boolean, default=True, comment="是否启用")
    created_at = Column(DateTime, default=datetime.utcnow)


# ============== Pydantic 请求/响应模型 ==============

class GrayRuleCreate(BaseModel):
    """创建灰度规则请求"""
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    is_enabled: bool = True
    priority: int = 0
    match_type: str = "whitelist"
    match_key: Optional[str] = None
    match_values: List[str] = []
    target_version: str = "gray"
    target_upstream: Optional[str] = None


class GrayRuleUpdate(BaseModel):
    """更新灰度规则请求"""
    name: Optional[str] = None
    description: Optional[str] = None
    is_enabled: Optional[bool] = None
    priority: Optional[int] = None
    match_type: Optional[str] = None
    match_key: Optional[str] = None
    match_values: Optional[List[str]] = None
    target_version: Optional[str] = None
    target_upstream: Optional[str] = None


class GrayRuleResponse(BaseModel):
    """灰度规则响应"""
    id: int
    name: str
    description: Optional[str]
    is_enabled: bool
    priority: int
    match_type: str
    match_key: Optional[str]
    match_values: List[str]
    target_version: str
    target_upstream: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class WhitelistCreate(BaseModel):
    """创建白名单请求"""
    rule_id: int
    value: str = Field(..., min_length=1, max_length=200)
    value_type: str = "user_id"
    remark: Optional[str] = None
    is_enabled: bool = True


class WhitelistResponse(BaseModel):
    """白名单响应"""
    id: int
    rule_id: int
    value: str
    value_type: str
    remark: Optional[str]
    is_enabled: bool
    created_at: datetime

    class Config:
        from_attributes = True


class GrayDecisionRequest(BaseModel):
    """灰度决策请求"""
    user_id: Optional[str] = None
    ip: Optional[str] = None
    headers: Optional[dict] = None
    cookies: Optional[dict] = None
    path: Optional[str] = None


class GrayDecisionResponse(BaseModel):
    """灰度决策响应"""
    should_gray: bool = False
    target_version: str = "stable"
    target_upstream: Optional[str] = None
    matched_rule: Optional[str] = None
    reason: str = "default"


# ============== 统一响应模型 ==============

from typing import Any, Generic, TypeVar

T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    """统一 API 响应格式"""
    code: int = 0  # 0 表示成功，1 表示失败
    message: str = ""
    data: Optional[T] = None

    @classmethod
    def success(cls, data: Any = None, message: str = "") -> "ApiResponse":
        """成功响应"""
        return cls(code=0, message=message, data=data)
    
    @classmethod
    def error(cls, message: str = "error", code: int = 1, data: Any = None) -> "ApiResponse":
        """失败响应"""
        return cls(code=code, message=message, data=data)


# 初始化数据库
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_session() -> AsyncSession:
    async with async_session() as session:
        yield session

