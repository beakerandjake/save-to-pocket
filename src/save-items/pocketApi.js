const POCKET_URL = "https://getpocket.com/v3/add";

/**
 * Adds the specified url to the pocket account defined by the access_token.
 * @param {string} url - The url of the item to save
 * @param {string} consumerKey - The consumer key of this application
 * @param {string} accessToken - The access token of the user
 * @returns {any} See response details: https://getpocket.com/developer/docs/v3/add
 */
export const add = async (url, consumerKey, accessToken) => {
  if (!url) {
    throw new Error("url is required");
  }
  if (!consumerKey) {
    throw new Error("consumerKey is required");
  }
  if (!accessToken) {
    throw new Error("accessToken is required.");
  }

  const response = await fetch(POCKET_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "X-Accept": "application/json",
    },
    body: JSON.stringify({
      url: encodeURI(url),
      consumer_key: consumerKey,
      access_token: accessToken,
    }),
  });

  if (!response.ok) {
    const errorMessage = response.headers.get("x-error");
    throw new Error(
      `Failed to save: Status ${response.status} - ${errorMessage}`,
    );
  }

  return response.json();
};
