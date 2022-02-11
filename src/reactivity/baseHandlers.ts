import { track, trigger } from './effect';

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);

function createGetter(readonly = false) {
  return function get(target, key) {
    let res = Reflect.get(target, key);
    if (!readonly) {
      //依赖收集
      track(target, key);
    }
    return res;
  };
}

function createSetter() {
  return function set(target, key, value) {
    let res = Reflect.set(target, key, value);
    //触发依赖
    trigger(target, key);
    return res;
  };
}

export const mutableHandler = {
  get,
  set,
};

export const readonlyHandler = {
  get: readonlyGet,
  set(target, key, value) {
    console.warn(`${key} can't to be set beacase the ${target} is readonly`);
    return true;
  },
};
