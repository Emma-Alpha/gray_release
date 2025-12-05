"""灰度决策服务"""
from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from urllib.parse import unquote
import jwt
import time

from ..models import GrayRuleDB, WhitelistDB, GrayDecisionRequest, GrayDecisionResponse


# ===== 全局缓存（进程级别）=====
class RulesCache:
    """规则缓存管理器"""
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._rules = None
            cls._instance._rules_time = 0
            cls._instance._whitelists: Dict[int, List] = {}
            cls._instance._whitelists_time: Dict[int, float] = {}
            cls._instance._ttl = 60  # 缓存 60 秒
        return cls._instance
    
    def get_rules(self):
        if self._rules and (time.time() - self._rules_time) < self._ttl:
            print(f"命中规则缓存: {self._rules}")
            return self._rules
        return None
    
    def set_rules(self, rules):
        self._rules = rules
        self._rules_time = time.time()
    
    def get_whitelist(self, rule_id: int):
        if rule_id in self._whitelists:
            if (time.time() - self._whitelists_time.get(rule_id, 0)) < self._ttl:
                return self._whitelists[rule_id]
        return None
    
    def set_whitelist(self, rule_id: int, whitelist):
        self._whitelists[rule_id] = whitelist
        self._whitelists_time[rule_id] = time.time()
    
    def clear(self):
        """清除所有缓存（规则更新时调用）"""
        self._rules = None
        self._rules_time = 0
        self._whitelists.clear()
        self._whitelists_time.clear()


# 全局缓存实例
rules_cache = RulesCache()


class GrayService:
    """灰度决策核心服务"""
    
    def __init__(self, session: AsyncSession):
        self.session = session
    
    async def get_all_enabled_rules(self) -> List[GrayRuleDB]:
        """获取所有启用的规则，按优先级排序"""
         # 先检查缓存
        cached = rules_cache.get_rules()
        if cached is not None:
            return cached

        result = await self.session.execute(
            select(GrayRuleDB)
            .where(GrayRuleDB.is_enabled == True)
            .order_by(GrayRuleDB.priority.desc())
        )
        rules = result.scalars().all()
        
        # 存入缓存
        rules_cache.set_rules(rules)
        return rules
    
    async def get_whitelist_by_rule(self, rule_id: int) -> List[WhitelistDB]:
        """获取规则关联的白名单"""
        # 先检查缓存
        cached = rules_cache.get_whitelist(rule_id)
        if cached is not None:
            return cached

        result = await self.session.execute(
            select(WhitelistDB)
            .where(WhitelistDB.rule_id == rule_id)
            .where(WhitelistDB.is_enabled == True)
        )
        whitelist = result.scalars().all()
        
        # 存入缓存
        rules_cache.set_whitelist(rule_id, whitelist)
        return whitelist
    
    async def check_whitelist_match(self, rule: GrayRuleDB, request: GrayDecisionRequest) -> bool:
        """检查白名单匹配"""
        # 获取规则对应的白名单
        whitelists = await self.get_whitelist_by_rule(rule.id)
        whitelist_values = set(w.value for w in whitelists)
        
        # 同时检查规则内嵌的 match_values
        if rule.match_values:
            whitelist_values.update(rule.match_values)
        
        if not whitelist_values:
            return False
        
        # 根据不同的值类型进行匹配
        for wl in whitelists:
            if wl.value_type == "user_id" and request.user_id:
                if request.user_id in whitelist_values:
                    return True
            elif wl.value_type == "ip" and request.ip:
                if request.ip in whitelist_values:
                    return True
        
        # 检查规则自带的 match_values
        if request.user_id and request.user_id in whitelist_values:
            return True
        if request.ip and request.ip in whitelist_values:
            return True
            
        return False
    
    async def check_header_match(self, rule: GrayRuleDB, request: GrayDecisionRequest) -> bool:
        """检查 Header 匹配"""
        if not request.headers or not rule.match_key:
            return False
        
        header_value = request.headers.get(rule.match_key)
        if header_value and rule.match_values:
            return header_value in rule.match_values
        return False
    
    async def check_cookie_match(self, rule: GrayRuleDB, request: GrayDecisionRequest) -> bool:
        """检查 Cookie 匹配"""
        if not request.cookies or not rule.match_key:
            return False
        
        cookie_value = request.cookies.get(rule.match_key)
        # print(f"cookie_value: {cookie_value}")
        # jwt token 需要解码
        if cookie_value:
            cookie_value = unquote(cookie_value)
            if  cookie_value.startswith("JWT"):
                cookie_value = cookie_value.split(" ")[1]
                token_payload = jwt.decode(cookie_value, options={"verify_signature": False})
                # print(token_payload['data'])
                if token_payload['data']['cname'] in rule.match_values or token_payload['data']['name'] in rule.match_values:
                    return True
                return False
        return False
    
    async def check_ip_match(self, rule: GrayRuleDB, request: GrayDecisionRequest) -> bool:
        """检查 IP 匹配"""
        if not request.ip or not rule.match_values:
            return False
        return request.ip in rule.match_values
    
    async def make_decision(self, request: GrayDecisionRequest) -> GrayDecisionResponse:
        """
        做出灰度决策
        
        决策流程:
        1. 获取所有启用的规则（按优先级排序）
        2. 按顺序匹配规则
        3. 返回第一个匹配的规则结果
        4. 无匹配则返回默认版本（stable）
        """
        rules = await self.get_all_enabled_rules()
        
        for rule in rules:
            matched = False
            
            if rule.match_type == "whitelist":
                matched = await self.check_whitelist_match(rule, request)
            elif rule.match_type == "header":
                matched = await self.check_header_match(rule, request)
            elif rule.match_type == "cookie":
                matched = await self.check_cookie_match(rule, request)
            elif rule.match_type == "ip":
                matched = await self.check_ip_match(rule, request)
            
            if matched:
                return GrayDecisionResponse(
                    should_gray=True,
                    target_version=rule.target_version,
                    target_upstream=rule.target_upstream,
                    matched_rule=rule.name,
                    reason=f"Matched rule: {rule.name} ({rule.match_type})"
                )
        
        # 默认返回稳定版本
        return GrayDecisionResponse(
            should_gray=False,
            target_version="stable",
            target_upstream=None,
            matched_rule=None,
            reason="No rule matched, default to stable"
        )

