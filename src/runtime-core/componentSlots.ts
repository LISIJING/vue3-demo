import { shapFlags } from '../shared/shapFlags';

export function initSlots(instance, children) {
  const { vnode } = instance;
  if (vnode.shapFlag & shapFlags.SLOT_CHILDREN) {
    normalizeObjectSlots(children, instance.slots);
  }
}

function normalizeObjectSlots(children, slots) {
  for (const key in children) {
    const value = children[key];
    slots[key] = (props) => normalizeValue(value(props));
  }
}

function normalizeValue(value) {
  return Array.isArray(value) ? value : [value];
}
