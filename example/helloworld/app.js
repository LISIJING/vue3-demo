import { h, createTextVNode } from '../../lib/mini-vue.esm.js';
import { Foo } from './Foo.js';
window.self = null;
export const App = {
  render() {
    window.self = this;
    const app = h('div', {}, 'app');
    const foo = h(
      Foo,
      {},
      {
        header: ({ age }) => [
          h('p', {}, 'header ' + age),
          createTextVNode('你好'),
        ],
        footer: () => h('p', {}, 'header'),
      },
    );
    return h('div', {}, [app, foo]);
    // return h(
    //   'div',
    //   {
    //     id: 'root',
    //     class: ['red', 'hard'],
    //     onClick() {
    //       console.log('click');
    //     },
    //     onMouseDown() {
    //       console.log('onMouseDown');
    //     },
    //   },
    //   [
    //     h('div', {}, 'hi: ' + this.msg),
    //     h(Foo, {
    //       count: 1,
    //       onAdd(a, b) {
    //         console.log('on add', a, b);
    //       },
    //       onAddFoo() {
    //         console.log('onAddFoo');
    //       },
    //     }),
    //   ],
    // 'hi ' + this.msg,
    //  [
    //   h('p', { class: 'red' }, 'hi'),
    //   h('p', { class: 'blue' }, 'mini-vue'),
    // ]
    // );
  },
  setup() {
    return {
      msg: 'mini-vue',
    };
  },
};
