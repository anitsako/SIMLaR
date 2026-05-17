import { runWithStartContext } from '@tanstack/start-storage-context';

export function runTestServerFn<T>(fn: () => Promise<T>) {
  return runWithStartContext(
    // @ts-ignore Ignoring type error for test context
    {
      getRouter: () => ({}) as any,
      request: new Request('http://localhost/test'),
      startOptions: {},
      contextAfterGlobalMiddlewares: {},
      executedRequestMiddlewares: new Set(),
    },
    fn
  );
}
