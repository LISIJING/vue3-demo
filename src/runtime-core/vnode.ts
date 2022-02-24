import { shapFlags } from '../shared/shapFlags';

export const Fragment = Symbol('Fragment');
export const Text = Symbol('Text');

export function createVNode(type, props?, children?) {
  const vnode = {
    type,
    props,
    children,
    shapFlag: getShapFlag(type),
    el: null,
  };
  if (typeof children === 'string') {
    vnode.shapFlag |= shapFlags.TEXT_CHILDREN;
  } else if (Array.isArray(children)) {
    vnode.shapFlag |= shapFlags.ARRAY_CHILDREN;
  }

  if (vnode.shapFlag & shapFlags.STATEFUL_COMPONENT) {
    if (typeof children === 'object') {
      vnode.shapFlag |= shapFlags.SLOT_CHILDREN;
    }
  }
  return vnode;
}

export function createTextVNode(text) {
  return createVNode(Text, {}, text);
}

function getShapFlag(type: any) {
  return typeof type === 'string'
    ? shapFlags.ELEMENT
    : shapFlags.STATEFUL_COMPONENT;
}
