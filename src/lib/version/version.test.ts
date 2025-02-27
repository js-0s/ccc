import { afterAll, test, jest } from '@jest/globals';

import { Version } from './index';
import currentVersion from './currentVersion';
jest.mock('./currentVersion');
const currentVersionMocked = jest.mocked(currentVersion);

// simplified implementation, currentVersion does git stuff we dont want to
// test here
currentVersionMocked.mockImplementation(
  () => process.env.BUILD_VERSION ?? null,
);

const originalEnvBuildVersion = process.env.BUILD_VERSION;
afterAll(() => {
  process.env.BUILD_VERSION = originalEnvBuildVersion;
});

test('it is possible to derive version from BUILD_VERSION', () => {
  process.env.BUILD_VERSION = '1.0.0';
  const version = Version.getRunning();
  expect(version).toEqual('1.0.0');
});
test('it is possible to derive version when BUILD_VERSION has git-format string', () => {
  process.env.BUILD_VERSION = '3.7.1-30-gd0ff0364';
  const version = Version.getRunning();
  expect(version).toEqual('3.7.1-30-gd0ff0364');
});
test('when BUILD_VERSION is not defined null is returned for our version', () => {
  delete process.env.BUILD_VERSION;
  const version = Version.getRunning();
  expect(version).toEqual(null);
});

test('same versions compare as equal', () => {
  const comparison = Version.compare('1.0.0', '1.0.0');
  expect(comparison).toEqual(0);
});
test('higher version compares as newer', () => {
  const comparison = Version.compare('1.0.1', '1.0.0');
  expect(comparison).toEqual(1);
});
test('lower version compares as older', () => {
  const comparison = Version.compare('1.0.0', '1.0.1');
  expect(comparison).toEqual(-1);
});
test('different major versions compare as newer', () => {
  const comparison = Version.compare('2.0.0', '1.0.0');
  expect(comparison).toEqual(1);
});
test('different minor versions compare as newer', () => {
  const comparison = Version.compare('1.1.0', '1.0.0');
  expect(comparison).toEqual(1);
});
test('different patch versions compare as newer', () => {
  const comparison = Version.compare('1.0.1', '1.0.0');
  expect(comparison).toEqual(1);
});
test('different major versions compare as older', () => {
  const comparison = Version.compare('1.0.0', '2.0.0');
  expect(comparison).toEqual(-1);
});
test('different minor versions compare as older', () => {
  const comparison = Version.compare('1.0.0', '1.1.0');
  expect(comparison).toEqual(-1);
});
test('different patch versions compare as older', () => {
  const comparison = Version.compare('1.0.0', '1.0.1');
  expect(comparison).toEqual(-1);
});
test('different major versions compare as newer even if minor and patch are higher', () => {
  const comparison = Version.compare('2.0.0', '1.1.0');
  expect(comparison).toEqual(1);
});
test('different minor versions compare as newer even if patch is higher', () => {
  const comparison = Version.compare('1.1.0', '1.0.1');
  expect(comparison).toEqual(1);
});
test('different major versions compare as older even if minor and patch are lower', () => {
  const comparison = Version.compare('1.1.1', '2.0.0');
  expect(comparison).toEqual(-1);
});
test('different minor versions compare as older even if patch is lower', () => {
  const comparison = Version.compare('1.0.1', '1.1.0');
  expect(comparison).toEqual(-1);
});
test('equal versions of different lengths compare correctly when first is shorter', () => {
  const comparison = Version.compare('1.0', '1.0.0');
  expect(comparison).toEqual(0);
});
test('equal versions of different lengths compare correctly when second is shorter', () => {
  const comparison = Version.compare('1.0.0', '1.0');
  expect(comparison).toEqual(0);
});
test('equal versions of different lengths compare correctly when both are shorter', () => {
  const comparison = Version.compare('1.0', '1.0');
  expect(comparison).toEqual(0);
});
test('different versions of different lengths compare correctly when one of the versions is missing the minor part', () => {
  const comparison = Version.compare('1', '1.1');
  expect(comparison).toEqual(-1);
});
test('different versions of different lengths compare correctly when one of the versions is missing the patch part', () => {
  const comparison = Version.compare('1.1', '1.1.1');
  expect(comparison).toEqual(-1);
});
test('different versions of different lengths compare correctly when one of the versions is missing the minor and patch parts', () => {
  const comparison = Version.compare('1', '1.1.1');
  expect(comparison).toEqual(-1);
});
test('different versions of different lengths compare correctly when one of the versions is missing the minor and patch parts in the other order', () => {
  const comparison = Version.compare('1.1.1', '1');
  expect(comparison).toEqual(1);
});
test('different versions of different lengths compare correctly when one of the versions is missing the patch part in the other order', () => {
  const comparison = Version.compare('1.1.1', '1.1');
  expect(comparison).toEqual(1);
});
test('numbers other than 0 1 and 2 work at all', () => {
  const comparison = Version.compare('4.8.8', '6.1.1');
  expect(comparison).toEqual(-1);
});
test('versions that are null are treated as 0', () => {
  const comparison = Version.compare(null, '0.0.0');
  expect(comparison).toEqual(0);
});
test('version that is an empty string is treated as 0', () => {
  const comparison = Version.compare('', '0.0.0');
  expect(comparison).toEqual(0);
});
test('version that is undefined is treated as 0', () => {
  const comparison = Version.compare(undefined, '0.0.0');
  expect(comparison).toEqual(0);
});
test('version in git format is compared correctly', () => {
  const comparison = Version.compare(
    '3.7.1-30-gd0ff0364',
    '3.7.1-30-gd0ff0364',
  );
  expect(comparison).toEqual(0);
});
test('version in git format is compared correctly when different', () => {
  const comparison = Version.compare(
    '3.7.1-30-gd0ff0364',
    '3.7.1-30-gd0ff0365',
  );
  expect(comparison).toEqual(-1);
});
test('version in git format is compared correctly when different in the other direction', () => {
  const comparison = Version.compare(
    '3.7.1-30-gd0ff0364',
    '3.7.1-30-gd0ff0363',
  );
  expect(comparison).toEqual(1);
});
test('versions with comma delimiters work', () => {
  const comparison = Version.compare('1.0.0', '1,0,0');
  expect(comparison).toEqual(0);
});
test('versions with dash delimiters work', () => {
  const comparison = Version.compare('1.0.0', '1-0-0');
  expect(comparison).toEqual(0);
});
test('versions with mixed delimiters work', () => {
  const comparison = Version.compare('1.0.0', '1-0,0');
  expect(comparison).toEqual(0);
});
test('versions with mixed delimiters work when different', () => {
  const comparison = Version.compare('1.0.0', '1-0,1');
  expect(comparison).toEqual(-1);
});
test('versions with text on one side and numbers on the other work', () => {
  const comparison = Version.compare('1.0.0', '1-0,1-alpha');
  expect(comparison).toEqual(-1);
});
test('versions with text on both sides work', () => {
  const comparison = Version.compare('1.0.0-alpha', '1-0,0-alpha');
  expect(comparison).toEqual(0);
});
test('versions with text on both sides work when different', () => {
  const comparison = Version.compare('1.0.0-alpha', '1-0,0-beta');
  expect(comparison).toEqual(-1);
});
test('versions with text on both sides work when different in the other direction', () => {
  const comparison = Version.compare('1.0.0-beta', '1-0,0-alpha');
  expect(comparison).toEqual(1);
});
test('versions where one side is number only and other side is text only work', () => {
  const comparison = Version.compare('1.0.0', 'alpha');
  expect(comparison).toEqual(-1);
});
test('versions where one side is text only and other side is number only work', () => {
  const comparison = Version.compare('alpha', '1.0.0');
  expect(comparison).toEqual(1);
});
test('versions that contain a mix of text and numbers in the same segment work', () => {
  const comparison = Version.compare('1.0.0-alpha1', '1-0,0-alpha2');
  expect(comparison).toEqual(-1);
});
test('versions that contain a mix of text and numbers in the same segment work when different in the other direction', () => {
  const comparison = Version.compare('1.0.0-alpha2', '1-0,0-alpha1');
  expect(comparison).toEqual(1);
});
test('versions that contain a mix of text and numbers in the same segment work when equal', () => {
  const comparison = Version.compare('1.0.0-alpha1', '1-0,0-alpha1');
  expect(comparison).toEqual(0);
});
test('versions with many segments work', () => {
  const comparison = Version.compare(
    '1.0.0-alpha1-beta2-gamma3',
    '1-0,0-alpha1-beta2-gamma3',
  );
  expect(comparison).toEqual(0);
});
test('versions with many segments work when different', () => {
  const comparison = Version.compare(
    '1.0.0-alpha1-beta2-gamma3',
    '1-0,0-alpha1-beta2-gamma4',
  );
  expect(comparison).toEqual(-1);
});
test('versions with many segments work when different in the other direction', () => {
  const comparison = Version.compare(
    '1.0.0-alpha1-beta2-gamma4',
    '1-0,0-alpha1-beta2-gamma3',
  );
  expect(comparison).toEqual(1);
});
test('versions that contain empty segments work', () => {
  const comparison = Version.compare('1.0.0--alpha1', '1-0,0--alpha1');
  expect(comparison).toEqual(0);
});
test('versions that contain empty segments work when different', () => {
  const comparison = Version.compare('1.0.0--alpha1', '1-0,0-alpha2');
  expect(comparison).toEqual(-1);
});
test('versions that contain empty segments work when one side is empty', () => {
  const comparison = Version.compare('1.0.0--', '1-0,0-alpha1');
  expect(comparison).toEqual(-1);
});
test('versions that contain empty segments work when the other side is empty', () => {
  const comparison = Version.compare('1.0.0-alpha1', '1-0,0--');
  expect(comparison).toEqual(1);
});
test('versions that contain empty segments work when both sides are empty', () => {
  const comparison = Version.compare('1.0.0--', '1-0,0--');
  expect(comparison).toEqual(0);
});
