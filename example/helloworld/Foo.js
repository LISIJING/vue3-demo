import { h } from '../../lib/mini-vue.esm.js';

export const Foo = {
  setup(props) {
    console.log(props);
    props.count++;
    console.log(props);
    return {};
  },
  render() {
    return h('div', {}, 'foo: ' + this.count);
  },
};
