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
      const svgInfo = data[0];
      const route = svgInfo?.route;
      if (route && typeof route === "object") {
        // If route is an object, pick the 'light' theme if available
        return route.light || route.dark || null;
      } else if (typeof route === "string") {
        return route;
      }
    }
    return null;
  } catch {
    return null;
  }
}
