import { beforeAll, afterAll, test, jest } from '@jest/globals';
import { execFileSync } from 'node:child_process';

import currentVersion from './currentVersion';

jest.mock('node:child_process');
const execFileSyncMocked = jest.mocked(execFileSync);
const originalEnvBuildVersion = process.env.BUILD_VERSION;
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
  process.env.BUILD_VERSION = originalEnvBuildVersion;
});

test('returns process.env if set', () => {
  process.env.BUILD_VERSION = 'test-1.2.3';
  const result = currentVersion();
  expect(result).toEqual('test-1.2.3');
});

test('returns git if process.env is not set', () => {
  process.env.BUILD_VERSION = '0.0.0-BUILD.VERSION';
  execFileSyncMocked.mockReturnValueOnce('test-1.2.3\n');
  const result = currentVersion();

  expect(result).toEqual('test-1.2.3');
});
test('returns fallback if exec fails with error-code', () => {
  process.env.BUILD_VERSION = '0.0.0-BUILD.VERSION';
  execFileSyncMocked.mockImplementation(() => {
    const error = new Error();
    error.code = 123;
    throw error;
  });
  const result = currentVersion();

  expect(result).toEqual('local-development-build');
});
test('returns fallback if exec fails with stderr', () => {
  process.env.BUILD_VERSION = '0.0.0-BUILD.VERSION';
  execFileSyncMocked.mockImplementation(() => {
    const error = new Error();
    error.stderr = 'something went wrong';
    throw error;
  });
  const result = currentVersion();

  expect(result).toEqual('local-development-build');
});
test('executes git config if stderr is very specific', () => {
  process.env.BUILD_VERSION = '0.0.0-BUILD.VERSION';
  execFileSyncMocked.mockImplementationOnce(() => {
    const error = new Error();
    error.stderr =
      'fatal: detected dubious ownership in repository at' +
      'git config --global --add safe.directory';
    throw error;
  });
  execFileSyncMocked.mockReturnValueOnce('');
  execFileSyncMocked.mockReturnValueOnce('test-1.2.3');
  const result = currentVersion();

  expect(result).toEqual('test-1.2.3');
});
