import { isObject } from '../shared/index';
import { shapFlags } from '../shared/shapFlags';
import { createComponentInstance, setupComponent } from './component';
import { Fragment, Text } from './vnode';

export function render(vnode, container) {
  patch(vnode, container);
}

function patch(vnode, container) {
  //判断是不是element类型
  const { shapFlag, type } = vnode;

  // Fragmant
  switch (type) {
    case Fragment:
      processFragment(vnode, container);
      break;
    case Text:
      processText(vnode, container);
      break;
    default:
      if (shapFlag & shapFlags.ELEMENT) {
        processElement(vnode, container);
      } else if (shapFlag & shapFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container);
      }
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

  const isOn = (key) => /^on[A-Z]/.test(key);
  for (const key in props) {
    const val = props[key];
    if (isOn(key)) {
      const event = key.slice(2).toLowerCase();
      el.addEventListener(event, val);
    } else {
      el.setAttribute(key, val);
    }
  }
  container.append(el);
}

function mountChildren(vnode, container) {
  vnode.children.forEach((child) => {
    patch(child, container);
  });
}
function processFragment(vnode: any, container: any) {
  mountChildren(vnode, container);
}
function processText(vnode: any, container: any) {
  const { children } = vnode;
  const textNode = (vnode.el = document.createTextNode(children));
  container.append(textNode);
}
