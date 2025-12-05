const fs = require("fs");
const path = require("path");

const sourceDir = path.join(__dirname, "../src/locales/default");

// 动态读取源目录下所有 .ts 文件（排除 index.ts）
const files = fs
  .readdirSync(sourceDir)
  .filter((file) => {
    return (
      file.endsWith(".ts") && // 只处理 .ts 文件
      file !== "index.ts" // 排除 index.ts
    );
  })
  .map((file) => path.basename(file, ".ts")); // 去掉 .ts 扩展名

// 使用 ts-node 加载 TypeScript 文件
require("ts-node/register");

const targetDir = path.join(__dirname, "../locales/zh-CN");

// 确保目标目录存在
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

console.log("开始转换 TypeScript 文件到 JSON...\n");

files.forEach((fileName) => {
  try {
    // 动态导入 TypeScript 模块
    const modulePath = path.join(sourceDir, `${fileName}.ts`);
    delete require.cache[require.resolve(modulePath)]; // 清除缓存
    const moduleContent = require(modulePath).default;

    // 转换为 JSON 并保存
    const jsonContent = JSON.stringify(moduleContent, null, 2);
    const targetPath = path.join(targetDir, `${fileName}.json`);

    fs.writeFileSync(targetPath, jsonContent, "utf8");
    console.log(`✅ ${fileName}.ts → ${fileName}.json`);
  } catch (error) {
    console.error(`❌ 转换 ${fileName}.ts 失败:`, error.message);
  }
});

console.log("\n✨ 转换完成！");
