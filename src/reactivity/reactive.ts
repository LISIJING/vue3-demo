import { track, trigger } from './effect';

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
}

import {
  mutableHandler,
  readonlyHandler,
  shallowReadonlyHandler,
} from './baseHandlers';

export function reactive(target) {
  return createReactiveObject(target, mutableHandler);
}

export function readonly(target) {
  return createReactiveObject(target, readonlyHandler);
}
export function shallowReadonly(target) {
  return createReactiveObject(target, shallowReadonlyHandler);
}

function createReactiveObject(target, baseHandlers) {
  return new Proxy(target, baseHandlers);
}

export function isReactive(value) {
  //如果value是proxy的话，调用任何key值都会触发get操作，所以可以在get方法里获取到
  //如果value不是proxy的话，就获取不到key值，则直接返回布尔值
  return !!value[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY];
}

//检测一个对象是不是通过reactive或者readonly代理的
export function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
