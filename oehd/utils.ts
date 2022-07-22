export function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function formatBytes(
  bytes: number,
  precision: number,
  factor: number = 1
): string {
  let displayBytes: number;
  let unit: string;

  const adjustedBytes = bytes * factor;

  if (adjustedBytes < 1000) {
    displayBytes = adjustedBytes;
    unit = "B";
  } else if (adjustedBytes < 1000000) {
    displayBytes = adjustedBytes / 1000;
    unit = "Kb";
  } else if (adjustedBytes < 1000000000) {
    displayBytes = adjustedBytes / 1000000;
    unit = "Mb";
  } else {
    displayBytes = adjustedBytes / 1000000000;
    unit = "Gb";
  }

  return (
    parseFloat(
      displayBytes.toPrecision(displayBytes > 0 ? precision + 1 : precision)
    ) +
    " " +
    unit
  );
}
