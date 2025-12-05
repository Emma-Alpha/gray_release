"""灰度决策 API 路由"""
from typing import Optional
from fastapi import APIRouter, Depends, Header, Request, Response
from sqlalchemy.ext.asyncio import AsyncSession

from ..models import get_session, GrayDecisionRequest, GrayDecisionResponse, ApiResponse
from ..services.gray_service import GrayService

router = APIRouter(prefix="/gray", tags=["灰度决策"])


@router.post("/decide")
async def decide_gray(
    request: GrayDecisionRequest,
    session: AsyncSession = Depends(get_session)
):
    """
    灰度决策接口
    
    根据传入的用户信息判断是否需要灰度，返回目标版本信息
    """
    service = GrayService(session)
    decision = await service.make_decision(request)
    return ApiResponse.success(data=decision)


@router.get("/auth")
async def nginx_auth_request(
    request: Request,
    response: Response,
    session: AsyncSession = Depends(get_session),
    x_user_id: Optional[str] = Header(None, alias="X-User-Id"),
    x_real_ip: Optional[str] = Header(None, alias="X-Real-IP"),
    x_forwarded_for: Optional[str] = Header(None, alias="X-Forwarded-For"),
):
    """
    Nginx auth_request 子请求接口
    
    Nginx 通过 auth_request 模块调用此接口进行灰度决策。
    返回的响应头会被 Nginx 用于决定路由：
    - X-Gray-Target: gray / stable
    - X-Gray-Upstream: 目标上游地址
    - X-Gray-Matched: 匹配的规则名称
    
    Nginx 配置示例:
    ```
    location / {
        auth_request /auth;
        auth_request_set $gray_target $upstream_http_x_gray_target;
        auth_request_set $gray_upstream $upstream_http_x_gray_upstream;
        
        if ($gray_target = "gray") {
            proxy_pass $gray_upstream;
        }
        
        proxy_pass http://stable_upstream;
    }
    ```
    """
    # 提取客户端 IP
    client_ip = x_real_ip or (x_forwarded_for.split(",")[0].strip() if x_forwarded_for else None)
    
    # 提取所有请求头
    headers_dict = dict(request.headers)
    
    # 提取 cookies
    cookies_dict = dict(request.cookies)
    
    # 构建决策请求
    decision_request = GrayDecisionRequest(
        user_id=x_user_id,
        ip=client_ip,
        headers=headers_dict,
        cookies=cookies_dict,
        path=str(request.url.path)
    )
    
    # 获取决策结果
    service = GrayService(session)
    decision = await service.make_decision(decision_request)

    # 设置响应头供 Nginx 使用
    response.headers["X-Gray-Target"] = decision.target_version
    if decision.target_upstream:
        response.headers["X-Gray-Upstream"] = decision.target_upstream
    if decision.matched_rule:
        response.headers["X-Gray-Matched"] = decision.matched_rule
    response.headers["X-Gray-Reason"] = decision.reason
    
    # auth_request 成功返回 200
    return ApiResponse.success(data={"status": "ok", "decision": decision})


@router.get("/health")
async def health_check():
    """健康检查接口"""
    return ApiResponse.success(data={"status": "healthy", "service": "gray-release-bff"})

