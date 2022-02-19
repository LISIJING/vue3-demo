export const extend = Object.assign;
export function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}
export function hasChanged(val, newValue) {
  return !Object.is(val, newValue);
}
export const isOwn = (val, key) =>
  Object.prototype.hasOwnProperty.call(val, key);
export const camelize = (str) => {
  return str.replace(/-(\w)/g, (_, c: string) => {
    return c ? c.toUpperCase() : '';
  });
};
const captialize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
export const toHandlerKey = (str) => (str ? 'on' + captialize(str) : '');
