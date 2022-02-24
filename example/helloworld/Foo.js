import { h, renderSlots } from '../../lib/mini-vue.esm.js';

export const Foo = {
  setup(props, { emit }) {
    // // console.log(props);
    // props.count++;
    // // console.log(props);
    // const emitAdd = () => {
    //   // console.log('emit add');
    //   emit('add', 1, 2);
    //   emit('add-foo');
    // };
    // return { emitAdd };
  },
  render() {
    // const btn = h('button', { onClick: this.emitAdd }, 'emitAdd');
    // const foo = h('div', {}, 'foo: ' + this.count);
    const foo = h('p', {}, 'foo');
    console.log(this.$slots);
    const age = 18;
    //slot渲染到指定位置,具名插槽
    //作用域插槽
    return h('div', {}, [
      renderSlots(this.$slots, 'header', { age }),
      foo,
      renderSlots(this.$slots, 'footer'),
    ]);
  },
};
