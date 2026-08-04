/**
 * Generates an array of page numbers with ellipsis (...) for pagination controls.
 *
 * @param current - Current active page number
 * @param last - Total number of pages (last page)
 * @returns Array of page numbers and ellipsis (e.g., [1, 2, 3, 4, 5, '...', 10])
 */
export const getPageNumbers = (current: number, last: number): (number | string)[] => {
  if (last <= 0) return [];
  
  if (last <= 7) {
    return Array.from({ length: last }, (_, i) => i + 1);
  }
  
  if (current <= 4) {
    return [1, 2, 3, 4, 5, '...', last];
  }
  
  if (current >= last - 3) {
    return [1, '...', last - 4, last - 3, last - 2, last - 1, last];
  }
  
  return [1, '...', current - 1, current, current + 1, '...', last];
};