import * as yup from "yup";

/**
 * Date validation utilities for form validation
 * Ensures logical date constraints (no past travel dates, no expired passports, etc.)
 */

/**
 * Create a Date object from month/day/year strings
 */
export function createDateFromParts(
  month: string | null | undefined,
  day: string | null | undefined,
  year: string | null | undefined
): Date | null {
  // Check for empty strings explicitly (empty string is falsy but we want to be explicit)
  if (!month || month === '' || !day || day === '' || !year || year === '') return null;
  
  try {
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date;
  } catch {
    return null;
  }
}

/**
 * Safely convert Yup value to string or null
 */
function toValue(value: string | null | undefined): string | null {
  if (value === undefined || value === null || value === '') return null;
  return value;
}

/**
 * Check if date is in the past
 */
export function isDateInPast(date: Date | null): boolean {
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date < today;
}

/**
 * Check if date is in the future
 */
export function isDateInFuture(date: Date | null): boolean {
  if (!date) return false;
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today
  date.setHours(23, 59, 59, 999); // End of selected date
  return date > today;
}

/**
 * Check if date is today or in the past
 */
export function isDateTodayOrPast(date: Date | null): boolean {
  if (!date) return false;
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date <= today;
}

/**
 * Check if date is within next N years (e.g., check if travel date is not too far in future)
 */
export function isDateWithinFutureYears(date: Date | null, years: number): boolean {
  if (!date) return false;
  const futureDate = new Date();
  futureDate.setFullYear(futureDate.getFullYear() + years);
  date.setHours(0, 0, 0, 0);
  futureDate.setHours(0, 0, 0, 0);
  return date <= futureDate;
}

/**
 * Check if date is within past N years (e.g., check if passport issue is recent enough)
 */
export function isDateWithinPastYears(date: Date | null, years: number): boolean {
  if (!date) return false;
  const pastDate = new Date();
  pastDate.setFullYear(pastDate.getFullYear() - years);
  date.setHours(0, 0, 0, 0);
  pastDate.setHours(0, 0, 0, 0);
  return date >= pastDate;
}

/**
 * Check if date A is before date B
 */
export function isDateBefore(dateA: Date | null, dateB: Date | null): boolean {
  if (!dateA || !dateB) return false;
  dateA.setHours(0, 0, 0, 0);
  dateB.setHours(0, 0, 0, 0);
  return dateA < dateB;
}

/**
 * Check if date A is before or equal to date B
 */
export function isDateBeforeOrEqual(dateA: Date | null, dateB: Date | null): boolean {
  if (!dateA || !dateB) return false;
  dateA.setHours(0, 0, 0, 0);
  dateB.setHours(0, 0, 0, 0);
  return dateA <= dateB;
}

/**
 * Check if date is valid (not invalid Date object)
 */
export function isValidDate(date: Date | null): boolean {
  if (!date) return false;
  return !isNaN(date.getTime());
}

/**
 * Format a date for error messages
 */
export function formatDate(date: Date | null): string {
  if (!date) return 'invalid date';
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

/**
 * Custom Yup test for date parts validation
 * Validates that month/day/year creates a valid date
 */
export function createValidDateTest(message: string = 'Invalid date') {
  return function(this: yup.TestContext, value: string | null | undefined, context: yup.TestContext) {
    const { path } = context;
    const basePath = path.substring(0, path.lastIndexOf('_'));
    
    let month: string | null | undefined;
    let day: string | null | undefined;
    let year: string | null | undefined;
    
    // Determine which part we're validating
    if (path.includes('_month')) {
      month = toValue(value);
      day = toValue(context.parent[`${basePath}_day`]);
      year = toValue(context.parent[`${basePath}_year`]);
    } else if (path.includes('_day')) {
      month = toValue(context.parent[`${basePath}_month`]);
      day = toValue(value);
      year = toValue(context.parent[`${basePath}_year`]);
    } else if (path.includes('_year')) {
      month = toValue(context.parent[`${basePath}_month`]);
      day = toValue(context.parent[`${basePath}_day`]);
      year = toValue(value);
    }
    
    // If any part is missing, skip validation (handled by required)
    if (!month || !day || !year) return true;
    
    const date = createDateFromParts(month, day, year);
    
    // Check if date is valid (not NaN)
    if (!date || !isValidDate(date)) {
      return this.createError({ message });
    }
    
    // Verify date components match input (prevents rollover bugs with dates like Dec 31)
    // This ensures the Date object actually represents the date the user entered
    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    
    if (date.getDate() !== dayNum || 
        date.getMonth() !== monthNum - 1 || 
        date.getFullYear() !== yearNum) {
      return this.createError({ message });
    }
    
    return true;
  };
}
