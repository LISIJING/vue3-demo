import { isObject } from '../shared/index';
import { shapFlags } from '../shared/shapFlags';
import { createComponentInstance, setupComponent } from './component';

export function render(vnode, container) {
  patch(vnode, container);
}

function patch(vnode, container) {
  //判断是不是element类型
  const { shapFlag } = vnode;
  if (shapFlag & shapFlags.ELEMENT) {
    processElement(vnode, container);
  } else if (shapFlag & shapFlags.STATEFUL_COMPONENT) {
    processComponent(vnode, container);
  }
}
function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container);
}
function mountComponent(initialVNode, container) {
  const instance = createComponentInstance(initialVNode);
  setupComponent(instance);

  setupRenderEffect(instance, initialVNode, container);
}
function setupRenderEffect(instance, initialVNode, container) {
  const { proxy } = instance;
  const subTree = instance.render.call(proxy);
  patch(subTree, container);
  initialVNode.el = subTree.el;
}
function processElement(vnode: any, container: any) {
  mountElement(vnode, container);
}
function mountElement(vnode: any, container: any) {
  const el = (vnode.el = document.createElement(vnode.type));

  const { children, shapFlag } = vnode;
  if (shapFlag & shapFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if (shapFlag & shapFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el);
  }
  const { props } = vnode;
  for (const key in props) {
    const val = props[key];
    el.setAttribute(key, val);
  }
  container.append(el);
}

function mountChildren(vnode, container) {
  vnode.children.forEach((child) => {
    patch(child, container);
  });
}
