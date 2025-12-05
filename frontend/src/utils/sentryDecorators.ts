import { sentryPerformance } from './sentry';

// 函数性能监控装饰器
export function withSentryPerformance(name: string, op = 'function') {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = sentryPerformance.measureFunction(
      originalMethod,
      name,
      op,
    );

    return descriptor;
  };
}

// 异步函数性能监控装饰器
export function withSentryAsyncPerformance(
  name: string,
  op = 'async_function',
) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = sentryPerformance.measureAsyncFunction(
      originalMethod,
      name,
      op,
    );

    return descriptor;
  };
}
