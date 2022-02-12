export const extend = Object.assign;
export function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}
export function hasChanged(val, newValue) {
  return !Object.is(val, newValue);
}
