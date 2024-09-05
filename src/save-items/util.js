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

/**
 * Returns the item url specified by the event (if any).
 * @param {object} event - The event from API gateway
 * @returns {string|null}
 */
export const getItemUrl = (event) => {
  try {
    return JSON.parse(event.body).url;
  } catch {
    console.log(`Failed to parse event body: ${JSON.stringify(event?.body)}`);
    return null;
  }
};

/**
 * Returns a new response object in the format expected by API Gateway
 * @param {number} statusCode - The http status code of the response
 * @param {any} content - The content to send back
 */
export const response = (statusCode, content) => ({
  statusCode,
  body: JSON.stringify(content),
});
