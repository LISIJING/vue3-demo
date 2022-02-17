'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var shapFlags;
(function (shapFlags) {
    shapFlags[shapFlags["ELEMENT"] = 1] = "ELEMENT";
    shapFlags[shapFlags["STATEFUL_COMPONENT"] = 2] = "STATEFUL_COMPONENT";
    shapFlags[shapFlags["TEXT_CHILDREN"] = 4] = "TEXT_CHILDREN";
    shapFlags[shapFlags["ARRAY_CHILDREN"] = 8] = "ARRAY_CHILDREN";
})(shapFlags || (shapFlags = {}));

var publicPropertiesMap = {
    $el: function (i) { return i.vnode.el; },
};
var publicInstanceProxyHandlers = {
    get: function (_a, key) {
        var instance = _a._;
        var setupState = instance.setupState;
        if (key in setupState) {
            return setupState[key];
        }
        var publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    },
};

function createComponentInstance(vnode) {
    var component = {
        vnode: vnode,
        type: vnode.type,
    };
    return component;
}
function setupComponent(instance) {
    // initProps()
    // initSlots();
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    var Component = instance.type;
    instance.proxy = new Proxy({ _: instance }, publicInstanceProxyHandlers);
    var setup = Component.setup;
    if (setup) {
        var setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    var Component = instance.type;
    // if (Component.render) {
    instance.render = Component.render;
    // }
}

function render(vnode, container) {
    patch(vnode, container);
}
function patch(vnode, container) {
    //判断是不是element类型
    var shapFlag = vnode.shapFlag;
    if (shapFlag & shapFlags.ELEMENT) {
        processElement(vnode, container);
    }
    else if (shapFlag & shapFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container);
    }
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(initialVNode, container) {
    var instance = createComponentInstance(initialVNode);
    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container);
}
function setupRenderEffect(instance, initialVNode, container) {
    var proxy = instance.proxy;
    var subTree = instance.render.call(proxy);
    patch(subTree, container);
    initialVNode.el = subTree.el;
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    var el = (vnode.el = document.createElement(vnode.type));
    var children = vnode.children, shapFlag = vnode.shapFlag;
    if (shapFlag & shapFlags.TEXT_CHILDREN) {
        el.textContent = children;
    }
    else if (shapFlag & shapFlags.ARRAY_CHILDREN) {
        mountChildren(vnode, el);
    }
    var props = vnode.props;
    for (var key in props) {
        var val = props[key];
        el.setAttribute(key, val);
    }
    container.append(el);
}
function mountChildren(vnode, container) {
    vnode.children.forEach(function (child) {
        patch(child, container);
    });
}

function createVNode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children,
        shapFlag: getShapFlag(type),
        el: null,
    };
    if (typeof children === 'string') {
        vnode.shapFlag |= shapFlags.TEXT_CHILDREN;
    }
    else if (Array.isArray(children)) {
        vnode.shapFlag |= shapFlags.ARRAY_CHILDREN;
    }
    return vnode;
}
function getShapFlag(type) {
    return typeof type === 'string'
        ? shapFlags.ELEMENT
        : shapFlags.STATEFUL_COMPONENT;
}

function createApp(rootComponent) {
    return {
        mount: function (rootContainer) {
            var vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        },
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

exports.createApp = createApp;
exports.h = h;
