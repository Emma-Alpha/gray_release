module.exports = {
  // 测试环境
  testEnvironment: 'jsdom',

  // 根目录
  rootDir: '.',

  // 模块文件扩展名
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // 转换配置
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },

  // 测试文件匹配模式
  testMatch: ['<rootDir>/src/**/__tests__/**/*.(ts|tsx|js)', '<rootDir>/src/**/*.(test|spec).(ts|tsx|js)'],

  // 路径映射 (注意：这里是 moduleNameMapper，不是 moduleNameMapping)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/pages/$1',
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@config/(.*)$': '<rootDir>/config/$1',
    '^@store/(.*)$': '<rootDir>/store/$1',
    '^@locales/(.*)$': '<rootDir>/locales/$1',
    // 静态资源模拟
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/__mocks__/fileMock.js',
  },

  // 设置文件
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

  // 忽略的文件/目录
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],

  // 模块路径忽略
  modulePathIgnorePatterns: ['<rootDir>/dist/'],

  // 覆盖率配置
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/setupTests.ts',
    '!src/__tests__/test-utils.tsx', // 排除测试工具
  ],

  // 覆盖率阈值
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },

  // 覆盖率报告格式
  coverageReporters: ['text', 'lcov', 'html'],
};
