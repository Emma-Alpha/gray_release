require("esbuild-register");
const { getConventionRoutes } = require("../../router/routesConvention");
const { getRoutes } = require("../../router/getRoutes");
const path = require("path");
const fs = require("fs");

class RoutesConventionsRspackPlugin {
  constructor(options = {}) {
    this.options = {
      base: "src/pages",
      exclude: [
        /\/components?\//,
        /\/models\//,
        /\/utils?\//,
        /^_/,
        /\.d\.ts$/,
        /\.(test|spec|e2e)\.(ts|tsx|js|jsx)$/,
      ],
      ...options,
    };
  }

  generateRoutes() {
    const routesFilePath = path.resolve(process.cwd(), "src/routes.ts");

    if (fs.existsSync(routesFilePath)) {
      try {
        delete require.cache[routesFilePath];
        const routesModule = require(routesFilePath);
        const configRoutes = routesModule.routes;

        if (
          configRoutes &&
          Array.isArray(configRoutes) &&
          configRoutes.length > 0
        ) {
          console.log("📋 使用配置式路由...", configRoutes);
          return getRoutes(configRoutes);
        } else {
          console.log("📋 routes文件存在但为空，使用约定式路由...");
        }
      } catch (error) {
        console.warn("⚠️ 读取routes文件失败，使用约定式路由...", error.message);
      }
    } else {
      console.log("📋 routes文件不存在，使用约定式路由...");
    }

    const routes = getConventionRoutes({
      base: path.resolve(process.cwd(), this.options.base),
      prefix: "pages/",
      exclude: this.options.exclude,
    });
    return routes;
  }

  apply(compiler) {
    const pluginName = "RoutesConventionsRspackPlugin";

    compiler.hooks.beforeCompile.tapAsync(pluginName, (params, callback) => {
      try {
        console.log("🚀 生成约定式路由...");
        const routes = this.generateRoutes();

        // 找到 DefinePlugin 并更新路由数据
        const definePlugin = compiler.options.plugins.find(
          (plugin) => plugin.constructor.name === "DefinePlugin"
        );
        console.log("注入数据 -------->", routes, definePlugin);

        if (definePlugin && definePlugin.definitions) {
          definePlugin.definitions["__CONVENTION_ROUTES__"] =
            JSON.stringify(routes);
        } else if (definePlugin) {
          // 对于 rspack，直接修改 DefinePlugin 的内部定义
          // rspack 的 DefinePlugin 可能将定义存储在不同的属性中
          if (!definePlugin.definitions) {
            definePlugin.definitions = {};
          }
          definePlugin.definitions["__CONVENTION_ROUTES__"] =
            JSON.stringify(routes);

          // 或者尝试直接访问 rspack DefinePlugin 的内部结构
          // 可能需要访问 definePlugin.options 或其他属性
          if (definePlugin.options) {
            definePlugin.options["__CONVENTION_ROUTES__"] =
              JSON.stringify(routes);
          }
        }

        callback();
      } catch (error) {
        console.error("❌ 生成约定式路由失败:", error);
        callback(error);
      }
    });
  }
}

module.exports = RoutesConventionsRspackPlugin;
