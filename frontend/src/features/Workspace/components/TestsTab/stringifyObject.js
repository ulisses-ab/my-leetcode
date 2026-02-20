export function stringifyObject(obj, options = {}) {
  const {
    indent = 2,
    level = 0,
    isRoot = true,
  } = options;

  const pad = " ".repeat(level * indent);

  const formatValue = (value, lvl) => {
    if (value === null) return "null";
    if (typeof value === "string") return `"${value}"`;
    if (typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }

    if (Array.isArray(value)) {
      return `[${value.map(v => formatValue(v, lvl)).join(", ")}]`;
    }

    if (typeof value === "object") {
      const inner = Object.entries(value)
        .map(([k, v]) => {
          const nextPad = " ".repeat((lvl + 1) * indent);
          return `${nextPad}${k}: ${formatValue(v, lvl + 1)}`;
        })
        .join("\n");

      return `\n${inner}`;
    }

    return String(value);
  };

  if (obj === null || typeof obj !== "object") {
    return formatValue(obj, level);
  }

  if (Array.isArray(obj)) {
    return formatValue(obj, level);
  }

  const lines = Object.entries(obj).map(([key, value]) => {
    return `${pad}${key}: ${formatValue(value, level)}`;
  });

  return isRoot ? lines.join("\n") : `{\n${lines.join("\n")}\n${pad}}`;
}
