
/**
 * Fetches the SVG URL for a given icon name from the SVGL API.
 * @param {string} iconName - The name of the icon to search for.
 * @returns {Promise<string | null>} - The SVG URL if found, otherwise null.
 */
export async function getIconSvgUrl(iconName: string): Promise<string | null> {
  const baseUrl = "https://api.svgl.app";
  const searchUrl = `${baseUrl}?search=${encodeURIComponent(iconName)}`;

  try {
    const response = await fetch(searchUrl);
    if (!response.ok) return null;
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      const match = data.find((item) => item.title.toLowerCase() === iconName.toLowerCase());
      console.log("Matching icon:", match);
      if (match) {
        if (typeof match.route === "string") {
          return match.route;
        } else if (
          typeof match.route === "object" &&
          match.route !== null &&
          typeof match.route.light === "string"
        ) {
          return match.route.light;
        }
      }
    }
    return null;
  } catch {
    return null;
  }
}
