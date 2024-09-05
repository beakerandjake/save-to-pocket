/**
 * Returns a memoized version of the function.
 * Subsequent calls of the memoized function will return the memoized result.
 * @param {function} fn - The function to memoize
 */
export const memoize = (fn) => {
  let result = null;
  return async () => {
    if (result === null) {
      result = await fn();
    }
    return result;
  };
};
