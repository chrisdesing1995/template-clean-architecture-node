const MAX_DEPTH = 5;

function normalizeForLog(value: unknown, seen: WeakSet<object>, depth: number): unknown {
  if (value === undefined) {
    return '[undefined]';
  }

  if (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value;
  }

  if (typeof value === 'bigint') {
    return value.toString();
  }

  if (typeof value === 'function') {
    return `[Function ${value.name || 'anonymous'}]`;
  }

  if (typeof value === 'symbol') {
    return value.toString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
  }

  if (depth >= MAX_DEPTH) {
    return '[MaxDepthReached]';
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeForLog(item, seen, depth + 1));
  }

  if (typeof value === 'object') {
    const objectValue = value as Record<string, unknown>;

    if (seen.has(objectValue)) {
      return '[Circular]';
    }

    seen.add(objectValue);

    return Object.fromEntries(
      Object.entries(objectValue).map(([key, nestedValue]) => [
        key,
        normalizeForLog(nestedValue, seen, depth + 1),
      ]),
    );
  }

  return Object.prototype.toString.call(value);
}

export function safeSerialize(value: unknown): string {
  try {
    const normalizedValue = normalizeForLog(value, new WeakSet<object>(), 0);

    return JSON.stringify(normalizedValue);
  } catch {
    return '"[Unserializable]"';
  }
}
