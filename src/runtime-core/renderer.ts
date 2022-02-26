import { isObject } from '../shared/index';
import { shapFlags } from '../shared/shapFlags';
import { createComponentInstance, setupComponent } from './component';
import { Fragment, Text } from './vnode';

export function render(vnode, container, parentComponent) {
  patch(vnode, container, parentComponent);
}

function patch(vnode, container, parentComponent) {
  //判断是不是element类型
  const { shapFlag, type } = vnode;

  // Fragmant
  switch (type) {
    case Fragment:
      processFragment(vnode, container, parentComponent);
      break;
    case Text:
      processText(vnode, container);
      break;
    default:
      if (shapFlag & shapFlags.ELEMENT) {
        processElement(vnode, container, parentComponent);
      } else if (shapFlag & shapFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container, parentComponent);
      }
  }
}
function processComponent(vnode: any, container: any, parentComponent) {
  mountComponent(vnode, container, parentComponent);
}
function mountComponent(initialVNode, container, parentComponent) {
  const instance = createComponentInstance(initialVNode, parentComponent);
  setupComponent(instance);

  setupRenderEffect(instance, initialVNode, container);
}
function setupRenderEffect(instance, initialVNode, container) {
  const { proxy } = instance;
  const subTree = instance.render.call(proxy);
  patch(subTree, container, instance);
  initialVNode.el = subTree.el;
}
function processElement(vnode: any, container: any, parentComponent) {
  mountElement(vnode, container, parentComponent);
}
function mountElement(vnode: any, container: any, parentComponent) {
  const el = (vnode.el = document.createElement(vnode.type));

  const { children, shapFlag } = vnode;
  if (shapFlag & shapFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if (shapFlag & shapFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el, parentComponent);
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

function mountChildren(vnode, container, parentComponent) {
  vnode.children.forEach((child) => {
    patch(child, container, parentComponent);
  });
}
function processFragment(vnode: any, container: any, parentComponent) {
  mountChildren(vnode, container, parentComponent);
}
function processText(vnode: any, container: any) {
  const { children } = vnode;
  const textNode = (vnode.el = document.createTextNode(children));
  container.append(textNode);
}
