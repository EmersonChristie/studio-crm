/**
 * Creates a formatted dimensions string from width, height, and optional depth
 * @param height Height in inches
 * @param width Width in inches
 * @param depth Depth in inches (optional)
 * @returns Formatted dimensions string (e.g., "24.0 × 36.0 in" or "24.0 × 36.0 × 2.0 in")
 */
export function createDimensionsString(
  height?: number,
  width?: number,
  depth?: number
): string | undefined {
  if (!height && !width) return undefined;

  const dimensions = [height, width]
    .filter(Boolean)
    .map((dim) => dim?.toFixed(1))
    .join(' × ');

  if (depth) {
    return `${dimensions} × ${depth.toFixed(1)} in`;
  }

  return `${dimensions} in`;
}

/**
 * Parses a dimensions string into separate height, width, and depth values
 * @param dimensionsString A dimensions string (e.g., "24.0 × 36.0 × 2.0 in")
 * @returns Object with height, width, and depth properties
 */
export function parseDimensionsString(dimensionsString?: string | null): {
  height?: number;
  width?: number;
  depth?: number;
} {
  if (!dimensionsString) return {};

  // Remove unit and split by the multiplication symbol
  const dimensions = dimensionsString
    .replace(/ in$/, '')
    .split('×')
    .map((d) => d.trim());

  // Parse each dimension
  const [height, width, depth] = dimensions.map((d) => parseFloat(d));

  return {
    height: isNaN(height) ? undefined : height,
    width: isNaN(width) ? undefined : width,
    depth: isNaN(depth) ? undefined : depth
  };
}
