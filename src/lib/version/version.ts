import currentVersion from './currentVersion';

export default class Version {
  /**
   * Compares two version strings
   *
   * Accepts two version strings in the format '3.7.1-30-gd0ff0364'
   * and compares them part by part
   * If one version is longer than the other, the missing
   * parts are considered 0
   * If the parts are equal, the next part is compared
   * If the parts are not equal, the comparison is returned
   * immediately
   * If a part is not a number, it is compared
   * as a string
   * @example Version.compare('3.7.1-30-gd0ff0364', '3.7.1-30-gd0ff0364') // 0
   * @example Version.compare('3.7.1-30-gd0ff0364', '3.7.1-30-gd0ff0365') // -1
   * @example Version.compare('3.7.1-30-gd0ff0364', '3.7.1-30-gd0ff0363') // 1
   *
   * @param {string} v1 - First version string
   * @param {string} v2 - Second version string
   * @returns {number} - 1 if v1 > v2, -1 if v1 < v2, 0 if v1 == v2
   */
  static compare(v1: string, v2: string) {
    const v1Parts = v1?.split(/[\.,-]/);
    const v2Parts = v2?.split(/[\.,-]/);

    for (let i = 0; i < Math.max(v1Parts?.length, v2Parts?.length); i++) {
      const v1Part = v1Parts[i] || '0';
      const v2Part = v2Parts[i] || '0';

      const v1PartNum = Number(v1Part);
      const v2PartNum = Number(v2Part);

      if (!isNaN(v1PartNum) && !isNaN(v2PartNum)) {
        if (v1PartNum > v2PartNum) return 1;
        if (v1PartNum < v2PartNum) return -1;
      } else {
        if (v1Part > v2Part) return 1;
        if (v1Part < v2Part) return -1;
      }
    }

    return 0;
  }
  /**
   * Determines the version of the current build
   *
   * The version is determined by the BUILD_VERSION environment
   * variable
   * If the variable is not set, null is returned
   * @returns {string} - The version string
   */
  static getRunning() {
    return currentVersion();
  }
}
