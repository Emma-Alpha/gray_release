"""FastAPI 应用主入口"""
import sys
sys.path.insert(0, '..')

from contextlib import asynccontextmanager
from fastapi import FastAPI, APIRouter, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from .models import init_db, ApiResponse
from .routes import gray, admin
from config import CORS_ORIGINS, HOST, PORT


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    # 启动时初始化数据库
    await init_db()
    print("✅ Database initialized")
    yield
    # 关闭时清理资源
    print("👋 Shutting down...")


app = FastAPI(
    title="灰度发布管理系统",
    description="""
## 前端灰度发布管理系统 BFF 层

提供以下功能：
- 🎯 灰度决策 API（供 Nginx auth_request 调用）
- 📋 灰度规则管理
- 📝 白名单管理

### Nginx 集成方式

使用 `auth_request` 模块，Nginx 在处理请求前先调用 `/gray/auth` 接口获取灰度决策。
决策结果通过响应头返回，Nginx 根据响应头决定路由到哪个上游服务。
    """,
    version="1.0.0",
    lifespan=lifespan
)

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 创建 API 路由（统一前缀 /api）
api_router = APIRouter(prefix="/api")
api_router.include_router(gray.router)
api_router.include_router(admin.router)

# 注册路由
app.include_router(api_router)


# ============== 全局异常处理 ==============

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """全局异常处理"""
    return JSONResponse(
        status_code=200,
        content=ApiResponse.error(message=str(exc)).model_dump()
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """请求参数验证异常处理"""
    errors = exc.errors()
    error_msg = "; ".join([f"{e['loc'][-1]}: {e['msg']}" for e in errors])
    return JSONResponse(
        status_code=200,
        content=ApiResponse.error(message=f"参数验证错误: {error_msg}").model_dump()
    )


@app.get("/")
async def root():
    """根路径"""
    return ApiResponse.success(data={
        "service": "灰度发布管理系统",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "灰度决策": "/api/gray/decide",
            "Nginx认证": "/api/gray/auth",
            "规则管理": "/api/admin/rules",
            "健康检查": "/api/gray/health"
        }
    })


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=HOST, port=PORT, reload=True)

