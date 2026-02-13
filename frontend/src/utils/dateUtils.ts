/**
 * Utility functions for generating dynamic dates for mock data
 */

/**
 * Get a date relative to now
 * @param days - Number of days from now (negative for past dates)
 * @param hours - Additional hours offset (optional)
 * @param minutes - Additional minutes offset (optional)
 * @returns ISO string date
 */
export const getRelativeDate = (days: number, hours: number = 0, minutes: number = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(date.getHours() + hours);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString();
};

/**
 * Get current date as ISO string
 */
export const getCurrentDate = (): string => {
  return new Date().toISOString();
};

/**
 * Get a random date within the last N days
 * @param maxDaysAgo - Maximum days ago
 * @returns ISO string date
 */
export const getRandomPastDate = (maxDaysAgo: number): string => {
  const randomDays = Math.floor(Math.random() * maxDaysAgo);
  return getRelativeDate(-randomDays);
};

/**
 * Get a random date within the next N days
 * @param maxDaysAhead - Maximum days ahead
 * @returns ISO string date
 */
export const getRandomFutureDate = (maxDaysAhead: number): string => {
  const randomDays = Math.floor(Math.random() * maxDaysAhead) + 1;
  return getRelativeDate(randomDays);
};

/**
 * Generate a date for "last activity" scenarios (recent past)
 */
export const getRecentActivityDate = (): string => {
  return getRandomPastDate(7); // Within last week
};

/**
 * Generate a date for "created at" scenarios (further past)
 */
export const getCreationDate = (): string => {
  return getRandomPastDate(90); // Within last 3 months
};

/**
 * Generate a date for "joined at" scenarios (distant past)
 */
export const getJoinDate = (): string => {
  return getRandomPastDate(365); // Within last year
};

/**
 * Generate a date for scheduled future events
 */
export const getScheduledDate = (): string => {
  return getRandomFutureDate(30); // Within next month
};