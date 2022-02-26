import { getCurrentInstance } from './component';

//必须在setup函数中使用，因为要获取组件实例
export function provide(key, value) {
  //存
  const instance: any = getCurrentInstance();
  if (instance) {
    let { provides } = instance;
    const parentProvides = instance.parent.provides;
    //init
    if (provides === parentProvides) {
      provides = instance.provides = Object.create(parentProvides);
    }

    provides[key] = value;
  }
}

export function inject(key, defaultValue) {
  //取
  const instance: any = getCurrentInstance();
  if (instance) {
    const parentProvides = instance.parent.provides;
    if (key in parentProvides) {
      return parentProvides[key];
    } else if (defaultValue) {
      if (typeof defaultValue === 'function') {
        return defaultValue();
      }
      return defaultValue;
    }
  }
}
