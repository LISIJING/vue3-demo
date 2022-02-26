import { h, provide, inject } from '../../lib/mini-vue.esm.js';

const Provider = {
  name: 'Provider',
  setup() {
    provide('foo', 'fooVal');
    provide('bar', 'barVal');
  },
  render() {
    return h('div', {}, [h('p', {}, 'Provider'), h(Provider2)]);
  },
};

//Provider2组件实例对象会有一个provides对象，是一个包含foo属性，值是foo2的对象，并且该对象的原型指向Provider组件实例的provides
const Provider2 = {
  name: 'ProviderTwo',
  setup() {
    provide('foo', 'foo2');
    const foo = inject('foo'); //取父级的fooVal
    return { foo };
  },
  render() {
    return h('div', {}, [
      h('p', {}, `ProviderTwo foo:${this.foo}`),
      h(Consumer),
    ]);
  },
};

//Consumer组件实例对象会有一个provides对象，是父级的provides
const Consumer = {
  name: 'Consumer',
  setup() {
    const foo = inject('foo');
    const bar = inject('bar');
    const baz = inject('baz', () => 'bazDefault');
    return { foo, bar, baz };
  },
  render() {
    return h('div', {}, `Consumer: - ${this.foo} - ${this.bar} - ${this.baz}`);
  },
};

export default {
  name: 'App',
  setup() {},
  render() {
    return h('div', {}, [h('p', {}, 'apiInject'), h(Provider)]);
  },
};
