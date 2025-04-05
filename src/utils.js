// utils.js

/**
 * Increments the last package number by 1.
 * If lastPackageNo is not a valid number, defaults to 1.
 */
export function incrementPackageNumber(pkg) {
    const match = pkg.match(/^(BN-)(\d+)$/);
    if (match) {
      const prefix = match[1];
      const number = parseInt(match[2], 10) + 1;
      return `${prefix}${number.toString().padStart(3, '0')}`;
    }
    return pkg;
  }
  

  /**
   * Groups packing slip data by package number.
   * Returns an object where keys are package numbers and values are arrays of slips.
   */
  export function groupByPackage(data) {
    return data.reduce((acc, item) => {
        const key = item.packageNumber;
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      }, {});
  }
  