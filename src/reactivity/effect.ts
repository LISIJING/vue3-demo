import { extend } from '../shared';

let shouldTrack;
let activeEffect;

class ReactiveEffact {
  private _fn: any;
  public scheduler: any;
  deps: any = [];
  active = true; //如果调用了stop，则active会被设置为false
  onStop?: () => void;
  constructor(fn, scheduler?) {
    this._fn = fn;
    this.scheduler = scheduler;
  }
  run() {
    //调用过stop之后，不会再收集依赖，只是执行fn
    if (!this.active) {
      return this._fn();
    }
    activeEffect = this;
    shouldTrack = true;
    let result = this._fn();
    shouldTrack = false;
    return result;
  }
  stop() {
    if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      // active 是为了做性能优化，如果频繁调用stop的话，第一次调用完了以后，不需要再调用，所以用一个active标记一下
      this.active = false;
      shouldTrack = false;
    }
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep) => {
    dep.delete(effect);
  });
  effect.deps.length = 0;
}

const targetMap = new WeakMap();
export function track(target, key) {
  if (!isTracking()) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  if (dep.has(activeEffect)) return;
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
}

function isTracking() {
  return shouldTrack && activeEffect !== undefined;
}

export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let deps = depsMap.get(key);
  for (let effect of deps) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}

export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffact(fn, options.scheduler);
  //将options的属性合并到_effect上
  extend(_effect, options);
  _effect.run();
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

export function stop(runner) {
  runner.effect.stop();
}
