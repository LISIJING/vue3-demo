import { isOwn } from '../shared/index';

const publicPropertiesMap = {
  $el: (i) => i.vnode.el,
};

export const publicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { setupState, props } = instance;
    console.log(props, key);

    if (isOwn(setupState, key)) {
      return setupState[key];
    } else if (isOwn(props, key)) {
      return props[key];
    }

    const publicGetter = publicPropertiesMap[key];
    if (publicGetter) {
      return publicGetter(instance);
    }
  },
};
