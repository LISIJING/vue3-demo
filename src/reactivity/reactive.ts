import { track, trigger } from './effect';

import { mutableHandler, readonlyHandler } from './baseHandlers';

export function reactive(target) {
  return createReactiveObject(target, mutableHandler);
}

export function readonly(target) {
  return createReactiveObject(target, readonlyHandler);
}

function createReactiveObject(target, baseHandlers) {
  return new Proxy(target, baseHandlers);
}
