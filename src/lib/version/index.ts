/**
 * Versioning utilities.
 *
 * Static functions for working with version strings.
 * Used to compare versions and determine current running version.
 *
 * Usage:
 *   const runningVersion = Version.determineVersion();
 *   if (runningVersion) {
 *     const comparison = Version.compareVersions(runningVersion, '1.0.1');
 *    if (comparison === 1) {
 *     console.log('Running version is newer than 1.0.1');
 *    } else if (comparison === -1) {
 *      console.log('Running version is older than 1.0.1');
 *   } else {
 *    console.log('Running version is equal to 1.0.1');
 *  } else {
 *   console.log('No version found');
 * }
 */
export { default as Version } from './version';
export { default as currentVersion } from './currentVersion';
