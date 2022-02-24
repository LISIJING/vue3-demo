import { shapFlags } from '../shared/shapFlags';

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
function getShapFlag(type: any) {
  return typeof type === 'string'
    ? shapFlags.ELEMENT
    : shapFlags.STATEFUL_COMPONENT;
}
