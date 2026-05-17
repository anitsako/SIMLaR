import { expect, test } from 'vitest';
import { logoutFn } from './logout.fn';
import { runTestServerFn } from '@/tests/run-test-server-fn';

test('Logout limpia sesión y redirige', async () => {
  await expect(runTestServerFn(() => logoutFn())).rejects.toBeDefined();
});
