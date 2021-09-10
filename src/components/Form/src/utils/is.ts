export function isFunction(val: unknown): val is Function {
  return typeof val === "function"
}

export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`
}
export function isObject(val: any): val is Record<any, any> {
  return val !== null && is(val, "Object")
}

export function isBoolean(val: unknown): val is boolean {
  return is(val, "Boolean")
}

export function isNull(val: unknown): val is null {
  return val === null
}

export function isNumber(val: unknown): val is number {
  return is(val, "Number")
}

export function isPromise<T = any>(val: unknown): val is Promise<T> {
  return is(val, "Promise") && isObject(val) && isFunction(val.then) && isFunction(val.catch)
}

export function isEmpty<T = unknown>(val: T): val is T {
  if (isArray(val) || isString(val)) {
    return val.length === 0
  }

  if (val instanceof Map || val instanceof Set) {
    return val.size === 0
  }

  if (isObject(val)) {
    return Object.keys(val).length === 0
  }

  return false
}

export function isString(val: unknown): val is string {
  return is(val, "String")
}

export function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val)
}
