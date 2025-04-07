// utils.js

/**
 * Increments the last package number by 1.
 * If lastPackageNo is not a valid number, defaults to 1.
 */
export function incrementPackageNumber(pkg, wayBillNo, prefix = "STC") {
  if (wayBillNo) {
    const regex = new RegExp(`^${prefix}-${wayBillNo}-(\\d+)$`);
    const match = pkg.match(regex);
    if (match) {
      const number = parseInt(match[1], 10) + 1;
      return `${prefix}-${wayBillNo}-${number.toString().padStart(3, '0')}`;
    } else {
      return `${prefix}-${wayBillNo}-001`;
    }
  } else {
    const match = pkg.match(new RegExp(`^${prefix}-(\\d+)$`));
    if (match) {
      const number = parseInt(match[1], 10) + 1;
      return `${prefix}-${number.toString().padStart(3, '0')}`;
    } else {
      return `${prefix}-001`;
    }
  }
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
  