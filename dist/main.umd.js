(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue')) :
  typeof define === 'function' && define.amd ? define(['exports', 'vue'], factory) :
  (global = global || self, factory((global.mailery = global.mailery || {}, global.mailery.rbac = {}), global.Vue));
}(this, (function (exports, vue) { 'use strict';

  vue = vue && vue.hasOwnProperty('default') ? vue['default'] : vue;

  /*!
   * LiquorTree v0.2.70
   * (c) 2019 amsik
   * Released under the MIT License.
   */

  var NodeContent = {
    name: 'node-content',
    props: ['node'],
    render: function render (h) {
      var this$1 = this;

      var node = this.node;
      var vm = this.node.tree.vm;

      if (node.isEditing) {
        var nodeText = node.text;

        this.$nextTick(function (_) {
          this$1.$refs.editCtrl.focus();
        });

        return h('input', {
          domProps: {
            value: node.text,
            type: 'text'
          },
          class: 'tree-input',
          on: {
            input: function input (e) {
              nodeText = e.target.value;
            },
            blur: function blur () {
              node.stopEditing(nodeText);
            },
            keyup: function keyup (e) {
              if (e.keyCode === 13) {
                node.stopEditing(nodeText);
              }
            },
            mouseup: function mouseup (e) {
              e.stopPropagation();
            }
          },
          ref: 'editCtrl'
        })
      }

      if (vm.$scopedSlots.default) {
        return vm.$scopedSlots.default({ node: this.node })
      }

      return h('span', {
        domProps: {
          innerHTML: node.text
        }
      })
    }
  };

  function normalizeComponent(compiledTemplate, injectStyle, defaultExport, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, isShadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof isShadowMode === 'function') {
          createInjectorSSR = createInjector;
          createInjector = isShadowMode;
          isShadowMode = false;
      }
      // Vue.extend constructor export interop
      var options = typeof defaultExport === 'function' ? defaultExport.options : defaultExport;
      // render functions
      if (compiledTemplate && compiledTemplate.render) {
          options.render = compiledTemplate.render;
          options.staticRenderFns = compiledTemplate.staticRenderFns;
          options._compiled = true;
          // functional template
          if (isFunctionalTemplate) {
              options.functional = true;
          }
      }
      // scopedId
      if (scopeId) {
          options._scopeId = scopeId;
      }
      var hook;
      if (moduleIdentifier) {
          // server build
          hook = function (context) {
              // 2.3 injection
              context =
                  context || // cached call
                      (this.$vnode && this.$vnode.ssrContext) || // stateful
                      (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
              // 2.2 with runInNewContext: true
              if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                  context = __VUE_SSR_CONTEXT__;
              }
              // inject component styles
              if (injectStyle) {
                  injectStyle.call(this, createInjectorSSR(context));
              }
              // register component module identifier for async chunk inference
              if (context && context._registeredComponents) {
                  context._registeredComponents.add(moduleIdentifier);
              }
          };
          // used by ssr in case component is cached and beforeCreate
          // never gets called
          options._ssrRegister = hook;
      }
      else if (injectStyle) {
          hook = isShadowMode
              ? function () {
                  injectStyle.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
              }
              : function (context) {
                  injectStyle.call(this, createInjector(context));
              };
      }
      if (hook) {
          if (options.functional) {
              // register for functional component in vue file
              var originalRender = options.render;
              options.render = function renderWithStyleInjection(h, context) {
                  hook.call(context);
                  return originalRender(h, context);
              };
          }
          else {
              // inject component registration as beforeCreate hook
              var existing = options.beforeCreate;
              options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
          }
      }
      return defaultExport;
  }

  /* script */
  var __vue_script__ = NodeContent;
  // For security concerns, we use only base name in production mode. See https://github.com/vuejs/rollup-plugin-vue/issues/258
  NodeContent.__file = "NodeContent.vue";

  /* template */

    /* style */
    var __vue_inject_styles__ = undefined;
    /* scoped */
    var __vue_scope_id__ = undefined;
    /* module identifier */
    var __vue_module_identifier__ = undefined;
    /* functional template */
    var __vue_is_functional_template__ = undefined;
    /* style inject */
    
    /* style inject SSR */
    

    
    var NodeContent$1 = normalizeComponent(
      {},
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      undefined,
      undefined
    );

  //

  var TreeNode = {
    name: 'Node',
    inject: ['tree'],
    props: ['node', 'options'],

    components: {
      NodeContent: NodeContent$1
    },

    watch: {
      node: function node() {
        this.node.vm = this;
      }
    },

    data: function data() {
      this.node.vm = this;

      return {
        loading: false
      }
    },

    computed: {
      padding: function padding() {
        return this.node.depth * (this.options.paddingLeft ? this.options.paddingLeft : this.options.nodeIndent) + 'px'
      },

      nodeClass: function nodeClass() {
        var state = this.node.states;
        var hasChildren = this.hasChildren();
        var classes = {
          'has-child': hasChildren,
          'expanded': hasChildren && state.expanded,
          'selected': state.selected,
          'disabled': state.disabled,
          'matched': state.matched,
          'dragging': state.dragging,
          'loading': this.loading,
          'draggable': state.draggable
        };

        if (this.options.checkbox) {
          classes['checked'] = state.checked;
          classes['indeterminate'] = state.indeterminate;
        }

        return classes
      },

      visibleChildren: function visibleChildren() {
        return this.node.children.filter(function(child) {
          return child && child.visible()
        })
      }
    },

    methods: {
      onNodeFocus: function onNodeFocus() {
        this.tree.activeElement = this.node;
      },

      focus: function focus() {
        this.$refs.anchor.focus();
        this.node.select();
      },

      check: function check() {
        if (this.node.checked()) {
          this.node.uncheck();
        } else {
          this.node.check();
        }
      },

      select: function select(ref) {
        if ( ref === void 0 ) { ref = evnt; }
        var ctrlKey = ref.ctrlKey;

        var opts = this.options;
        var tree = this.tree;
        var node = this.node;

        tree.$emit('node:clicked', node);

        if (opts.editing && node.isEditing) {
          return
        }

        if (opts.editing && node.editable()) {
          return this.startEditing()
        }

        if (opts.checkbox && opts.checkOnSelect) {
          if (!opts.parentSelect && this.hasChildren()) {
            return this.toggleExpand()
          }

          return this.check(ctrlKey)
        }

        // 'parentSelect' behaviour.
        // For nodes which has a children list we have to expand/collapse
        if (!opts.parentSelect && this.hasChildren()) {
          this.toggleExpand();
        }

        if (opts.multiple) {
          if (!node.selected()) {
            node.select(ctrlKey);
          } else {
            if (ctrlKey) {
              node.unselect();
            } else {
              if (this.tree.selectedNodes.length != 1) {
                tree.unselectAll();
                node.select();
              }
            }
          }
        } else {
          if (node.selected() && ctrlKey) {
            node.unselect();
          } else {
            node.select();
          }
        }
      },

      toggleExpand: function toggleExpand() {
        if (this.hasChildren()) {
          this.node.toggleExpand();
        }
      },

      hasChildren: function hasChildren() {
        return this.node.hasChildren()
      },

      startEditing: function startEditing() {
        if (this.tree._editingNode) {
          this.tree._editingNode.stopEditing();
        }

        this.node.startEditing();
      },

      stopEditing: function stopEditing() {
        this.node.stopEditing();
      },

      handleMouseDown: function handleMouseDown(event) {
        if (!this.options.dnd) {
          return
        }

        this.tree.vm.startDragging(this.node, event);
      }
    }
  };

  var isOldIE = typeof navigator !== 'undefined' &&
      /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  function createInjector(context) {
      return function (id, style) { return addStyle(id, style); };
  }
  var HEAD = document.head || document.getElementsByTagName('head')[0];
  var styles = {};
  function addStyle(id, css) {
      var group = isOldIE ? css.media || 'default' : id;
      var style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
      if (!style.ids.has(id)) {
          style.ids.add(id);
          var code = css.source;
          if (css.map) {
              // https://developer.chrome.com/devtools/docs/javascript-debugging
              // this makes source maps inside style tags work properly in Chrome
              code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
              // http://stackoverflow.com/a/26603875
              code +=
                  '\n/*# sourceMappingURL=data:application/json;base64,' +
                      btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                      ' */';
          }
          if (!style.element) {
              style.element = document.createElement('style');
              style.element.type = 'text/css';
              if (css.media)
                  { style.element.setAttribute('media', css.media); }
              HEAD.appendChild(style.element);
          }
          if ('styleSheet' in style.element) {
              style.styles.push(code);
              style.element.styleSheet.cssText = style.styles
                  .filter(Boolean)
                  .join('\n');
          }
          else {
              var index = style.ids.size - 1;
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index])
                  { style.element.removeChild(nodes[index]); }
              if (nodes.length)
                  { style.element.insertBefore(textNode, nodes[index]); }
              else
                  { style.element.appendChild(textNode); }
          }
      }
  }

  /* script */
  var __vue_script__$1 = TreeNode;
  // For security concerns, we use only base name in production mode. See https://github.com/vuejs/rollup-plugin-vue/issues/258
  TreeNode.__file = "TreeNode.vue";

  /* template */
  var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('li',{staticClass:"tree-node",class:_vm.nodeClass,attrs:{"data-id":_vm.node.id},on:{"mousedown":function($event){$event.stopPropagation();return _vm.handleMouseDown($event)}}},[_c('div',{staticClass:"tree-content",style:([_vm.options.direction == 'ltr' ? {'padding-left': _vm.padding} : {'padding-right': _vm.padding}]),on:{"click":function($event){$event.stopPropagation();return _vm.select($event)}}},[_c('i',{staticClass:"tree-arrow",class:[{'expanded': _vm.node.states.expanded, 'has-child': _vm.node.children.length || _vm.node.isBatch}, _vm.options.direction],on:{"click":function($event){$event.stopPropagation();return _vm.toggleExpand($event)}}}),_vm._v(" "),(_vm.options.checkbox)?_c('i',{staticClass:"tree-checkbox",class:{'checked': _vm.node.states.checked, 'indeterminate': _vm.node.states.indeterminate},on:{"click":function($event){$event.stopPropagation();return _vm.check($event)}}}):_vm._e(),_vm._v(" "),_c('span',{ref:"anchor",staticClass:"tree-anchor",attrs:{"tabindex":"-1"},on:{"focus":_vm.onNodeFocus,"dblclick":function($event){return _vm.tree.$emit('node:dblclick', _vm.node)}}},[_c('node-content',{attrs:{"node":_vm.node}})],1)]),_vm._v(" "),_c('transition',{attrs:{"name":"l-fade"}},[(_vm.hasChildren() && _vm.node.states.expanded)?_c('ul',{staticClass:"tree-children"},_vm._l((_vm.visibleChildren),function(child){return _c('node',{key:child.id,attrs:{"node":child,"options":_vm.options}})}),1):_vm._e()])],1)};
  var __vue_staticRenderFns__ = [];

    /* style */
    var __vue_inject_styles__$1 = function (inject) {
      if (!inject) { return }
      inject("data-v-20094490_0", { source: ".tree-node{white-space:nowrap;display:flex;flex-direction:column;position:relative;box-sizing:border-box}.tree-content{display:flex;align-items:center;padding:3px;cursor:pointer;width:100%;box-sizing:border-box}.tree-node:not(.selected)>.tree-content:hover{background:#f6f8fb}.tree-node.selected>.tree-content{background-color:#e7eef7}.tree-node.disabled>.tree-content:hover{background:inherit}.tree-arrow{flex-shrink:0;height:30px;cursor:pointer;margin-left:30px;width:0}.tree-arrow.has-child{margin-left:0;width:30px;position:relative}.tree-arrow.has-child:after{border:1.5px solid #494646;position:absolute;border-left:0;border-top:0;left:9px;top:50%;height:9px;width:9px;transform:rotate(-45deg) translateY(-50%) translateX(0);transition:transform .25s;transform-origin:center}.tree-arrow.has-child.rtl:after{border:1.5px solid #494646;position:absolute;border-right:0;border-bottom:0;right:0;top:50%;height:9px;width:9px;transform:rotate(-45deg) translateY(-50%) translateX(0);transition:transform .25s;transform-origin:center}.tree-arrow.expanded.has-child:after{transform:rotate(45deg) translateY(-50%) translateX(-5px)}.tree-checkbox{flex-shrink:0;position:relative;width:30px;height:30px;box-sizing:border-box;border:1px solid #dadada;border-radius:2px;background:#fff;transition:border-color .25s,background-color .25s}.tree-arrow:after,.tree-checkbox:after{position:absolute;display:block;content:\"\"}.tree-checkbox.checked,.tree-checkbox.indeterminate{background-color:#3a99fc;border-color:#218eff}.tree-checkbox.checked:after{box-sizing:content-box;border:1.5px solid #fff;border-left:0;border-top:0;left:9px;top:3px;height:15px;width:8px;transform:rotate(45deg) scaleY(0);transition:transform .25s;transform-origin:center}.tree-checkbox.checked:after{transform:rotate(45deg) scaleY(1)}.tree-checkbox.indeterminate:after{background-color:#fff;top:50%;left:20%;right:20%;height:2px}.tree-anchor{flex-grow:2;outline:0;display:flex;text-decoration:none;color:#343434;vertical-align:top;margin-left:3px;line-height:24px;padding:3px 6px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.tree-node.selected>.tree-content>.tree-anchor{outline:0}.tree-node.disabled>.tree-content>.tree-anchor{color:#989191;background:#fff;opacity:.6;cursor:default;outline:0}.tree-input{display:block;width:100%;height:24px;line-height:24px;outline:0;border:1px solid #3498db;padding:0 4px}.l-fade-enter-active,.l-fade-leave-active{transition:opacity .3s,transform .3s;transform:translateX(0)}.l-fade-enter,.l-fade-leave-to{opacity:0;transform:translateX(-2em)}.tree--small .tree-anchor{line-height:19px}.tree--small .tree-checkbox{width:23px;height:23px}.tree--small .tree-arrow{height:23px}.tree--small .tree-checkbox.checked:after{left:7px;top:3px;height:11px;width:5px}.tree-node.has-child.loading>.tree-content>.tree-arrow,.tree-node.has-child.loading>.tree-content>.tree-arrow:after{border-radius:50%;width:15px;height:15px;border:0}.tree-node.has-child.loading>.tree-content>.tree-arrow{font-size:3px;position:relative;border-top:1.1em solid rgba(45,45,45,.2);border-right:1.1em solid rgba(45,45,45,.2);border-bottom:1.1em solid rgba(45,45,45,.2);border-left:1.1em solid #2d2d2d;-webkit-transform:translateZ(0);-ms-transform:translateZ(0);transform:translateZ(0);left:5px;-webkit-animation:loading 1.1s infinite linear;animation:loading 1.1s infinite linear;margin-right:8px}@-webkit-keyframes loading{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes loading{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}", map: undefined, media: undefined });

    };
    /* scoped */
    var __vue_scope_id__$1 = undefined;
    /* module identifier */
    var __vue_module_identifier__$1 = undefined;
    /* functional template */
    var __vue_is_functional_template__$1 = false;
    /* style inject SSR */
    

    
    var TreeNode$1 = normalizeComponent(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__$1,
      __vue_script__$1,
      __vue_scope_id__$1,
      __vue_is_functional_template__$1,
      __vue_module_identifier__$1,
      createInjector,
      undefined
    );

  //
  //
  //
  //
  //
  //

  var script = {
    name: 'DragNode',
    props: ['target'],
    computed: {
      style: function style() {
        if (undefined === this.target.top) {
          return 'display: none'
        }

        return ("top: " + (this.target.top) + "px; left: " + (this.target.left) + "px")
      }
    }
  };

  /* script */
  var __vue_script__$2 = script;
  // For security concerns, we use only base name in production mode. See https://github.com/vuejs/rollup-plugin-vue/issues/258
  script.__file = "DraggableNode.vue";

  /* template */
  var __vue_render__$1 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"tree-dragnode",style:(_vm.style)},[_vm._v("\n  "+_vm._s(_vm.target.node.text)+"\n")])};
  var __vue_staticRenderFns__$1 = [];

    /* style */
    var __vue_inject_styles__$2 = function (inject) {
      if (!inject) { return }
      inject("data-v-7a41ac3e_0", { source: ".tree-dragnode{padding:10px;border:1px solid #e7eef7;position:fixed;border-radius:8px;background:#fff;transform:translate(-50%,-110%);z-index:10}", map: undefined, media: undefined });

    };
    /* scoped */
    var __vue_scope_id__$2 = undefined;
    /* module identifier */
    var __vue_module_identifier__$2 = undefined;
    /* functional template */
    var __vue_is_functional_template__$2 = false;
    /* style inject SSR */
    

    
    var DraggableNode = normalizeComponent(
      { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
      __vue_inject_styles__$2,
      __vue_script__$2,
      __vue_scope_id__$2,
      __vue_is_functional_template__$2,
      __vue_module_identifier__$2,
      createInjector,
      undefined
    );

  function recurseDown (obj, fn) {
    var res;

    if (Array.isArray(obj)) {
      return obj.map(function (node) { return recurseDown(node, fn); })
    }

    res = fn(obj);

    // Recurse children
    if (res !== false && obj.children && obj.children.length) {
      res = recurseDown(obj.children, fn);
    }

    return res
  }

  function striptags (value) {
    // ssr fix
    if (!!document === false) {
      return value
    }

    if (!striptags.__element) {
      striptags.__element = document.createElement('div');
    }

    striptags.__element.innerHTML = value;
    return striptags.__element.innerText
  }

  function finder (criteria) {
    return function (node) {
      return Object.keys(criteria).every(function (key) {
        if (key === 'text' || key === 'id') {
          var c = criteria[key];
          var val = node[key];

          // remove html tags
          val = striptags(val);

          if (isRegExp(c)) {
            return c.test(val)
          } else {
            return c === val
          }
        }

        var states = criteria[key];

        // it is possible to pass 'states' or 'state'
        if (key === 'state') {
          key = 'states';
        }

        return Object.keys(states).every(function (s) { return node[key][s] === states[s]; })
      })
    }
  }

  function isRegExp (val) {
    return val instanceof RegExp
  }

  function getAllChildren (source) {
    var result = [];

    source.forEach(function collect (node) {
      result.push(node);

      if (node.children) {
        node.children.forEach(collect);
      }
    });

    return result
  }

  function find (source, criteria, deep) {
    if ( deep === void 0 ) { deep = true; }

    if (!source || !source.length || !criteria) {
      return null
    }

    if (deep) {
      source = getAllChildren(source);
    }

    // find by index
    if (typeof criteria === 'number') {
      return source[criteria] || null
    }

    if (typeof criteria === 'string' || criteria instanceof RegExp) {
      criteria = {
        text: criteria
      };
    }

    if (typeof criteria !== 'function') {
      criteria = finder(criteria);
    }

    var result = source.filter(criteria);

    if (result.length) {
      return result
    }

    return null
  }

  // it is not genuine GUIDs

  function s4 () {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }

  function uuidV4 () {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4()
  }

  function nodeIterator (context, method) {
    var arguments$1 = arguments;

    var args = [], len = arguments.length - 2;
    while ( len-- > 0 ) { args[ len ] = arguments$1[ len + 2 ]; }

    context.forEach(function (node) { return node[method].apply(node, args); });
  }

  var Selection = /*@__PURE__*/(function (Array) {
    function Selection (tree, items) {
      var ref;

      if ( items === void 0 ) { items = []; }
      /*eslint semi: 0 */
      Array.call(this);

      this.tree = tree;
      (ref = this).push.apply(ref, items);
    }

    if ( Array ) { Selection.__proto__ = Array; }
    Selection.prototype = Object.create( Array && Array.prototype );
    Selection.prototype.constructor = Selection;

    Selection.prototype.remove = function remove () {
      nodeIterator(this, 'remove');
      return this
    };

    Selection.prototype.expand = function expand () {
      nodeIterator(this, 'expand');
      return this
    };

    Selection.prototype.collapse = function collapse () {
      nodeIterator(this, 'collapse');
      return this
    };

    Selection.prototype.select = function select (extendList) {
      nodeIterator(this, 'select', extendList);
      return this
    };

    Selection.prototype.unselect = function unselect () {
      nodeIterator(this, 'unselect');
      return this
    };

    Selection.prototype.check = function check () {
      if (this.tree.options.checkbox) {
        nodeIterator(this, 'check');
      }

      return this
    };

    Selection.prototype.uncheck = function uncheck () {
      if (this.tree.options.checkbox) {
        nodeIterator(this, 'uncheck');
      }

      return this
    };

    Selection.prototype.disable = function disable () {
      nodeIterator(this, 'disable');
      return this
    };

    Selection.prototype.enable = function enable () {
      nodeIterator(this, 'enable');
      return this
    };

    return Selection;
  }(Array));

  var Node = function Node (tree, item) {
    if (!item) {
      throw new Error('Node can not be empty')
    }

    this.id = item.id || uuidV4();
    this.states = item.state || {};

    this.showChildren = true;
    this.children = item.children || [];
    this.parent = item.parent || null;

    this.isBatch = item.isBatch || false;
    this.isEditing = false;

    this.data = Object.assign({}, item.data || {}, {
      text: item.text
    });

    if (!tree) {
      throw new Error('Node must have a Tree context!')
    }

    this.tree = tree;
  };

  var prototypeAccessors = { key: { configurable: true },depth: { configurable: true },text: { configurable: true } };

  Node.prototype.$emit = function $emit (evnt) {
      var arguments$1 = arguments;

      var ref;

      var args = [], len = arguments.length - 1;
      while ( len-- > 0 ) { args[ len ] = arguments$1[ len + 1 ]; }
    (ref = this.tree).$emit.apply(ref, [ ("node:" + evnt), this ].concat( args ));
  };

  Node.prototype.getPath = function getPath () {
    if (!this.parent) {
      return [this]
    }

    var path = [this];
    var el = this;

    while ((el = el.parent) !== null) {
      path.push(el);
    }

    return path
  };

  prototypeAccessors.key.get = function () {
    return this.id + this.text
  };

  prototypeAccessors.depth.get = function () {
    var depth = 0;
    var parent = this.parent;

    if (!parent || this.showChildren === false) {
      return depth
    }

    do {
      depth++;
    } while (parent = parent.parent)

    return depth
  };

  prototypeAccessors.text.get = function () {
    return this.data.text
  };

  prototypeAccessors.text.set = function (text) {
    var oldText = this.text;

    if (oldText !== text) {
      this.data.text = text;
      this.$emit('text:changed', text, oldText);
    }
  };

  Node.prototype.setData = function setData (data) {
    this.data = Object.assign({}, this.data, data);

    this.$emit('data:changed', this.data);

    return this.data
  };

  Node.prototype.state = function state (name, value) {
    if (undefined === value) {
      return this.states[name]
    }

    // TODO: check if it for example `selectable` state it should unselect node

    this.states[name] = value;

    return this
  };

  Node.prototype.recurseUp = function recurseUp (fn, node) {
      if ( node === void 0 ) { node = this; }

    if (!node.parent) {
      return
    }

    if (fn(node.parent) !== false) {
      return this.recurseUp(fn, node.parent)
    }
  };

  Node.prototype.recurseDown = function recurseDown$1 (fn, ignoreThis) {
    if (ignoreThis !== true) {
      fn(this);
    }

    if (this.hasChildren()) {
      recurseDown(this.children, fn);
    }
  };

  Node.prototype.refreshIndeterminateState = function refreshIndeterminateState () {
    if (!this.tree.options.autoCheckChildren) {
      return this
    }

    this.state('indeterminate', false);

    if (this.hasChildren()) {
      var childrenCount = this.children.length;
      var checked = 0;
      var indeterminate = 0;
      var disabled = 0;

      this.children.forEach(function (child) {
        if (child.checked()) {
          checked++;
        }

        if (child.disabled()) {
          disabled++;
        }

        if (child.indeterminate()) {
          indeterminate++;
        }
      });

      if (checked > 0 && checked === childrenCount - disabled) {
        if (!this.checked()) {
          this.state('checked', true);
          this.tree.check(this);

          this.$emit('checked');
        }
      } else {
        if (this.checked()) {
          this.state('checked', false);
          this.tree.uncheck(this);

          this.$emit('unchecked');
        }

        this.state(
          'indeterminate',
          indeterminate > 0 || (checked > 0 && checked < childrenCount)
        );
      }
    }

    if (this.parent) {
      this.parent.refreshIndeterminateState();
    }
  };

  Node.prototype.indeterminate = function indeterminate () {
    return this.state('indeterminate')
  };

  Node.prototype.editable = function editable () {
    return !this.state('disabled') && this.state('editable')
  };

  Node.prototype.selectable = function selectable () {
    return !this.state('disabled') && this.state('selectable')
  };

  Node.prototype.selected = function selected () {
    return this.state('selected')
  };

  Node.prototype.select = function select (extendList) {
    if (!this.selectable() || this.selected()) {
      return this
    }

    this.tree.select(this, extendList);

    this.state('selected', true);
    this.$emit('selected');

    return this
  };

  Node.prototype.unselect = function unselect () {
    if (!this.selectable() || !this.selected()) {
      return this
    }

    this.tree.unselect(this);

    this.state('selected', false);
    this.$emit('unselected');

    return this
  };

  Node.prototype.checked = function checked () {
    return this.state('checked')
  };

  Node.prototype.check = function check () {
      var this$1 = this;

    if (this.checked() || this.disabled()) {
      return this
    }

    if (this.indeterminate()) {
      return this.uncheck()
    }

    var checkDisabledChildren = this.tree.options.checkDisabledChildren;
    var targetNode = this;

    if (this.tree.options.autoCheckChildren) {
      this.recurseDown(function (node) {
        node.state('indeterminate', false);

        if (node.disabled() && !checkDisabledChildren) {
          return
        }

        if (!node.checked()) {
          this$1.tree.check(node);

          node.state('checked', true);
          node.$emit('checked', node.id === targetNode.id ? undefined : targetNode);
        }
      });

      if (this.parent) {
        this.parent.refreshIndeterminateState();
      }
    } else {
      this.tree.check(this);

      this.state('checked', true);
      this.$emit('checked');
    }

    return this
  };

  Node.prototype.uncheck = function uncheck () {
      var this$1 = this;

    if (!this.indeterminate() && !this.checked() || this.disabled()) {
      return this
    }

    var targetNode = this;

    if (this.tree.options.autoCheckChildren) {
      this.recurseDown(function (node) {
        node.state('indeterminate', false);

        if (node.checked()) {
          this$1.tree.uncheck(node);

          node.state('checked', false);
          node.$emit('unchecked', node.id === targetNode.id ? undefined : targetNode);
        }
      });

      if (this.parent) {
        this.parent.refreshIndeterminateState();
      }
    } else {
      this.tree.uncheck(this);

      this.state('checked', false);
      this.$emit('unchecked');
    }

    return this
  };

  Node.prototype.show = function show () {
    if (this.visible()) {
      return this
    }

    this.state('visible', true);
    this.$emit('shown');

    return this
  };

  Node.prototype.hide = function hide () {
    if (this.hidden()) {
      return this
    }

    this.state('visible', false);
    this.$emit('hidden');

    return this
  };

  Node.prototype.visible = function visible () {
    return this.state('visible')
  };

  Node.prototype.hidden = function hidden () {
    return !this.state('visible')
  };

  Node.prototype.enable = function enable () {
    if (this.enabled()) {
      return this
    }

    if (this.tree.options.autoDisableChildren) {
      this.recurseDown(function (node) {
        if (node.disabled()) {
          node.state('disabled', false);
          node.$emit('enabled');
        }
      });
    } else {
      this.state('disabled', false);
      this.$emit('enabled');
    }

    return this
  };

  Node.prototype.enabled = function enabled () {
    return !this.state('disabled')
  };

  Node.prototype.disable = function disable () {
    if (this.disabled()) {
      return this
    }

    if (this.tree.options.autoDisableChildren) {
      this.recurseDown(function (node) {
        if (node.enabled()) {
          node.state('disabled', true);
          node.$emit('disabled');
        }
      });
    } else {
      this.state('disabled', true);
      this.$emit('disabled');
    }

    return this
  };

  Node.prototype.disabled = function disabled () {
    return this.state('disabled')
  };

  Node.prototype.expandTop = function expandTop (ignoreEvent) {
      var this$1 = this;

    this.recurseUp(function (parent) {
      parent.state('expanded', true);

      if (ignoreEvent !== true) {
        this$1.$emit('expanded', parent);
      }
    });
  };

  Node.prototype.expand = function expand () {
      var this$1 = this;

    if (!this.canExpand()) {
      return this
    }

    if (this.isBatch) {
      this.tree.loadChildren(this).then(function (_) {
        this$1.state('expanded', true);
        this$1.$emit('expanded');
      });
    } else {
      this.state('expanded', true);
      this.$emit('expanded');
    }

    return this
  };

  Node.prototype.canExpand = function canExpand () {
    if (this.disabled() || !this.hasChildren()) {
      return false
    }

    return this.collapsed() &&
      (!this.tree.autoDisableChildren || this.disabled())
  };

  Node.prototype.canCollapse = function canCollapse () {
    if (this.disabled() || !this.hasChildren()) {
      return false
    }

    return this.expanded() &&
      (!this.tree.autoDisableChildren || this.disabled())
  };

  Node.prototype.expanded = function expanded () {
    return this.state('expanded')
  };

  Node.prototype.collapse = function collapse () {
    if (!this.canCollapse()) {
      return this
    }

    this.state('expanded', false);
    this.$emit('collapsed');

    return this
  };

  Node.prototype.collapsed = function collapsed () {
    return !this.state('expanded')
  };

  Node.prototype.toggleExpand = function toggleExpand () {
    return this._toggleOpenedState()
  };

  Node.prototype.toggleCollapse = function toggleCollapse () {
    return this._toggleOpenedState()
  };

  Node.prototype._toggleOpenedState = function _toggleOpenedState () {
    if (this.canCollapse()) {
      return this.collapse()
    } else if (this.canExpand()) {
      return this.expand()
    }
  };

  Node.prototype.isDropable = function isDropable () {
    return this.enabled() && this.state('dropable')
  };

  Node.prototype.isDraggable = function isDraggable () {
    return this.enabled() && this.state('draggable') && !this.isEditing
  };

  Node.prototype.startDragging = function startDragging () {
    if (!this.isDraggable() || this.state('dragging')) {
      return false
    }

    // root element
    if (this.isRoot() && this.tree.model.length === 1) {
      return false
    }

    if (this.tree.options.store) {
      this.tree.__silence = true;
    }

    this.select();
    this.state('dragging', true);
    this.$emit('dragging:start');

    this.tree.__silence = false;

    return true
  };

  Node.prototype.finishDragging = function finishDragging (destination, destinationPosition) {
    if (!destination.isDropable() && destinationPosition === 'drag-on') {
      return
    }

    var tree = this.tree;
    var clone = this.clone();
    var parent = this.parent;

    clone.id = this.id;
    tree.__silence = true;

    this.remove();

    if (destinationPosition === 'drag-on') {
      tree.append(destination, clone);
    } else if (destinationPosition === 'drag-below') {
      tree.after(destination, clone);
    } else if (destinationPosition === 'drag-above') {
      tree.before(destination, clone);
    }

    destination.refreshIndeterminateState();

    parent && parent.refreshIndeterminateState();
    tree.__silence = false;

    clone.state('dragging', false);
    this.state('dragging', false);
    // need to call emit on the clone, because we need to have node.parent filled in the event listener
    clone.$emit('dragging:finish', destination, destinationPosition);

    if (clone.state('selected')) {
      tree.selectedNodes.remove(this);
      tree.selectedNodes.add(clone);

      tree.vm.$set(this.state, 'selected', false);
      tree.vm.$set(clone.state, 'selected', true);
    }

    if (this.tree.options.store) {
      this.tree.vm.$emit('LIQUOR_NOISE');
    }
  };

  Node.prototype.startEditing = function startEditing () {
    if (this.disabled()) {
      return false
    }

    if (!this.isEditing) {
      this.tree._editingNode = this;
      this.tree.activeElement = this;
      this.isEditing = true;
      this.$emit('editing:start');
    }
  };

  Node.prototype.stopEditing = function stopEditing (newText) {
    if (!this.isEditing) {
      return
    }

    this.isEditing = false;
    this.tree._editingNode = null;
    this.tree.activeElement = null;

    var prevText = this.text;

    if (newText && newText !== false && this.text !== newText) {
      this.text = newText;
    }

    this.$emit('editing:stop', prevText);
  };

  Node.prototype.index = function index (verbose) {
    return this.tree.index(this, verbose)
  };

  Node.prototype.first = function first () {
    if (!this.hasChildren()) {
      return null
    }

    return this.children[0]
  };

  Node.prototype.last = function last () {
    if (!this.hasChildren()) {
      return null
    }

    return this.children[this.children.length - 1]
  };

  Node.prototype.next = function next () {
    return this.tree.nextNode(this)
  };

  Node.prototype.prev = function prev () {
    return this.tree.prevNode(this)
  };

  Node.prototype.insertAt = function insertAt (node, index) {
      var this$1 = this;
      if ( index === void 0 ) { index = this.children.length; }

    if (!node) {
      return
    }

    node = this.tree.objectToNode(node);

    if (Array.isArray(node)) {
      node
        .reverse()
        .map(function (n) { return this$1.insertAt(n, index); });

      return new Selection(this.tree, [].concat( node ))
    }

    node.parent = this;

    this.children.splice(
      index, 0, node
    );

    if (node.disabled() && node.hasChildren()) {
      node.recurseDown(function (child) {
        child.state('disabled', true);
      });
    }

    if (!this.isBatch) {
      this.$emit('added', node);
    }

    return node
  };

  Node.prototype.addChild = function addChild (node) {
    return this.insertAt(node)
  };

  Node.prototype.append = function append (node) {
    return this.addChild(node)
  };

  Node.prototype.prepend = function prepend (node) {
    return this.insertAt(node, 0)
  };

  Node.prototype.before = function before (node) {
    return this.tree.before(this, node)
  };

  Node.prototype.after = function after (node) {
    return this.tree.after(this, node)
  };

  Node.prototype.empty = function empty () {
    var node;

    while (node = this.children.pop()) {
      node.remove();
    }

    return this
  };

  Node.prototype.remove = function remove () {
    return this.tree.removeNode(this)
  };

  Node.prototype.removeChild = function removeChild (criteria) {
    var node = this.find(criteria);

    if (node) {
      return this.tree.removeNode(node)
    }

    return null
  };

  Node.prototype.find = function find$1 (criteria, deep) {
    if (this.tree.isNode(criteria)) {
      return criteria
    }

    return find(this.children, criteria, deep)
  };

  Node.prototype.focus = function focus () {
    if (this.vm) {
      this.vm.focus();
    }
  };

  Node.prototype.hasChildren = function hasChildren () {
    return this.showChildren && this.isBatch || this.children.length > 0
  };

  /**
  * Sometimes it's no need to have a parent. It possible to have more than 1 parent
  */
  Node.prototype.isRoot = function isRoot () {
    return this.parent === null
  };

  Node.prototype.clone = function clone () {
    return this.tree.objectToNode(this.toJSON())
  };

  Node.prototype.toJSON = function toJSON () {
      var this$1 = this;

    return {
      text: this.text,
      data: this.data,
      state: this.states,
      children: this.children.map(function (node) { return this$1.tree.objectToNode(node).toJSON(); })
    }
  };

  Object.defineProperties( Node.prototype, prototypeAccessors );

  /**
  * Default Node's states
  */
  var nodeStates = {
    selected: false,
    selectable: true,
    checked: false,
    expanded: false,
    disabled: false,
    visible: true,
    indeterminate: false,
    matched: false,
    editable: true,
    dragging: false,
    draggable: true,
    dropable: true
  };

  function merge (state) {
    if ( state === void 0 ) { state = {}; }

    return Object.assign({}, nodeStates, state)
  }

  function objectToNode (tree, obj) {
    var node = null;

    if (obj instanceof Node) {
      return obj
    }

    if (typeof obj === 'string') {
      node = new Node(tree, {
        text: obj,
        state: merge(),
        id: uuidV4()
      });
    } else if (Array.isArray(obj)) {
      return obj.map(function (o) { return objectToNode(tree, o); })
    } else {
      node = new Node(tree, obj);
      node.states = merge(node.states);

      if (!node.id) {
        node.id = uuidV4();
      }

      if (node.children.length) {
        node.children = node.children.map(function (child) {
          child = objectToNode(tree, child);
          child.parent = node;

          return child
        });
      }
    }

    return node
  }

  var List = /*@__PURE__*/(function (Array) {
    function List () {
      Array.apply(this, arguments);
    }

    if ( Array ) { List.__proto__ = Array; }
    List.prototype = Object.create( Array && Array.prototype );
    List.prototype.constructor = List;

    List.prototype.empty = function empty () {
      this.splice(0, this.length);

      return this
    };

    List.prototype.has = function has (item) {
      return this.includes(item)
    };

    List.prototype.add = function add () {
      var arguments$1 = arguments;

      var ref;

      var items = [], len = arguments.length;
      while ( len-- ) { items[ len ] = arguments$1[ len ]; }
      (ref = this).push.apply(ref, items);

      return this
    };

    List.prototype.remove = function remove (item) {
      var index = this.indexOf(item);

      if (index === -1) {
        return this
      }

      this.splice(index, 1);

      return this
    };

    List.prototype.removeAll = function removeAll (item) {
      while (this.includes(item)) {
        this.remove(item);
      }

      return this
    };

    List.prototype.top = function top () {
      return this[this.length - 1]
    };

    return List;
  }(Array));

  /**
    Every Node has certain format:
    {
      id,           // Unique Node id. By default it generates using uuidV4
      text,         // Node text
      children,     // List of children. Each children has the same format
      parent,       // Parent Node or null. The tree is able to have more than 1 root node
      state,        // States of Node. Ex.: selected, checked and so on
      data          // Any types of data. It is similar to `storage`.
                    // Ex.: data: {myAwesomeProperty: 10}. To get this property you need: Node.data('myAwesomeProperty')
    }
  */

  var defaultPropertyNames = {
    id: 'id',
    text: 'text',
    children: 'children',
    state: 'state',
    data: 'data',
    isBatch: 'isBatch'
  };

  function convertNames (obj, names) {
    return {
      id: obj[names.id],
      text: obj[names.text],
      children: obj[names.children],
      state: obj[names.state],
      data: obj[names.data],
      isBatch: obj[names.isBatch]
    }
  }

  var TreeParser = {
    parse: function parse (data, tree, options) {
      if ( options === void 0 ) { options = {}; }

      if (typeof data === 'string') {
        data = JSON.parse(data);
      }

      if (!Array.isArray(data)) {
        data = [data];
      }

      var p = Object.assign(
        {},
        defaultPropertyNames,
        options
      );

      var preparedItems = data.map(function converter (item) {
        var convertedItem = convertNames(item, p);

        // Possible to receive 1 child like a simple object. It must be converted to an array
        // We do not have checks on the correctness of the format. A developer should pass correct format
        if (convertedItem.children && !Array.isArray(convertedItem.children)) {
          convertedItem.children = [convertedItem.children];
        }

        if (convertedItem.children) {
          convertedItem.children = convertedItem.children.map(converter);
        }

        return convertedItem
      });

      return preparedItems.map(function (item) { return objectToNode(tree, item); })
    }
  };

  /*eslint no-undef: 0 */

  function request (url) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.addEventListener('load', function (_) {
        try {
          var response = JSON.parse(xhr.response);

          resolve(response);
        } catch (e) {
          reject(e);
        }    });

      xhr.send(null);
    })
  }

  function get (url) {
    return request(url)
  }

  function createTemplate (template) {
    return function (source) {
      var re = /{([^}]+)}/;
      var m;
      var result = template;

      while (m = re.exec(result)) {
        result = result.replace(m[0], source[m[1]]);
      }

      return result
    }
  }

  function orderAsc (node0, node1) {
    if (node0.text < node1.text) {
      return -1
    }

    if (node0.text > node1.text) {
      return 1
    }

    return 0
  }

  function orderDesc (node0, node1) {
    if (node0.text < node1.text) {
      return 1
    }

    if (node0.text > node1.text) {
      return -1
    }

    return 0
  }

  function getCompareFunction (order) {
    switch (order.toLowerCase()) {
      case 'asc': return orderAsc
      case 'desc': return orderDesc
    }
  }

  function sort (source, compareFunction) {
    if (typeof compareFunction === 'string') {
      compareFunction = getCompareFunction(compareFunction);
    }

    if (Array.isArray(source) && typeof compareFunction === 'function') {
      source.sort(compareFunction);
    }
  }

  function fetchDelay (ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    })
  }

  var Tree = function Tree (vm) {
    var this$1 = this;

    this.vm = vm;
    this.options = vm.opts;

    this.activeElement = null;

    // We have to convert 'fetchData' to function. It must return Promise always
    var fetchData = this.options.fetchData;

    if (typeof fetchData === 'string') {
      this.options.fetchData = (function (template) {
        var urlTemplate = createTemplate(template);

        return function (node) {
          return get(urlTemplate(node)).catch(this$1.options.onFetchError)
        }
      })(fetchData);
    }
  };

  Tree.prototype.$on = function $on (name) {
      var arguments$1 = arguments;

      var ref;

      var args = [], len = arguments.length - 1;
      while ( len-- > 0 ) { args[ len ] = arguments$1[ len + 1 ]; }
    (ref = this.vm).$on.apply(ref, [ name ].concat( args ));
  };

  Tree.prototype.$once = function $once (name) {
      var arguments$1 = arguments;

      var ref;

      var args = [], len = arguments.length - 1;
      while ( len-- > 0 ) { args[ len ] = arguments$1[ len + 1 ]; }
    (ref = this.vm).$once.apply(ref, [ name ].concat( args ));
  };

  Tree.prototype.$off = function $off (name) {
      var arguments$1 = arguments;

      var ref;

      var args = [], len = arguments.length - 1;
      while ( len-- > 0 ) { args[ len ] = arguments$1[ len + 1 ]; }
    (ref = this.vm).$off.apply(ref, [ name ].concat( args ));
  };

  Tree.prototype.$emit = function $emit (name) {
      var arguments$1 = arguments;

      var ref;

      var args = [], len = arguments.length - 1;
      while ( len-- > 0 ) { args[ len ] = arguments$1[ len + 1 ]; }
    if (this.__silence) {
      return
    }

    (ref = this.vm).$emit.apply(ref, [ name ].concat( args ));

    if (this.options.store) {
      this.vm.$emit('LIQUOR_NOISE');
    }
  };

  Tree.prototype._sort = function _sort (source, compareFn, deep) {
    if (deep !== false) {
      this.recurseDown(source, function (node) {
        if (node.hasChildren()) {
          sort(node.children, compareFn);
        }
      });
    }

    sort(source, compareFn);
  };

  Tree.prototype.sortTree = function sortTree (compareFn, deep) {
    this._sort(this.model, compareFn, deep);
  };

  Tree.prototype.sort = function sort$$1 (query, compareFn, deep) {
      var this$1 = this;

    var targetNode = this.find(query, true);

    if (!targetNode || !compareFn) {
      return
    }

    targetNode.forEach(function (node) {
      this$1._sort(node.children, compareFn, deep);
    });
  };

  Tree.prototype.clearFilter = function clearFilter () {
    this.recurseDown(function (node) {
      node.state('matched', false);
      node.state('visible', true);
      node.state('expanded', node.__expanded);

      node.__expanded = undefined;
      node.showChildren = true;
    });

    this.vm.matches.length = 0;
    this.vm.$emit('tree:filtered', [], '');
  };

  Tree.prototype.filter = function filter (query) {
    if (!query) {
      return this.clearFilter()
    }

    var matches = [];
    var predicate = this.options.filter.matcher;
    var ref = this.options.filter;
      var showChildren = ref.showChildren;
      var plainList = ref.plainList;

    // collect nodes
    this.recurseDown(function (node) {
      if (predicate(query, node)) {
        matches.push(node);
      }

      node.showChildren = true;

      // save prev `expanded` state
      if (undefined === node.__expanded) {
        node.__expanded = node.state('expanded');
      }

      node.state('visible', false);
      node.state('matched', false);
      node.state('expanded', true);
    });

    matches.reverse().forEach(function (node) {
      node.state('matched', true);
      node.state('visible', true);

      node.showChildren = !plainList;

      if (node.hasChildren()) {
        node.recurseDown(function (n) {
          n.state('visible', !!showChildren);
        }, true);
      }

      node.recurseUp(function (parent) {
        parent.state('visible', true);
        parent.state('expanded', true);
      });

      if (node.hasChildren()) {
        node.state('expanded', false);
      }
    });

    this.vm.matches = matches;

    this.vm.$emit('tree:filtered', matches, query);

    return matches
  };

  Tree.prototype.selected = function selected () {
    return new (Function.prototype.bind.apply( Selection, [ null ].concat( [this], this.selectedNodes) ))
  };

  Tree.prototype.checked = function checked () {
    if (!this.options.checkbox) {
      return null
    }

    return new (Function.prototype.bind.apply( Selection, [ null ].concat( [this], this.checkedNodes) ))
  };

  Tree.prototype.loadChildren = function loadChildren (node) {
      var this$1 = this;

    if (!node) {
      return
    }

    this.$emit('tree:data:fetch', node);

    if (this.options.minFetchDelay > 0 && node.vm) {
      node.vm.loading = true;
    }

    var result = this.fetch(node)
      .then(function (children) {
        node.append(children);
        node.isBatch = false;

        if (this$1.options.autoCheckChildren) {
          if (node.checked()) {
            node.recurseDown(function (child) {
              child.state('checked', true);
            });
          }

          node.refreshIndeterminateState();
        }

        this$1.$emit('tree:data:received', node);
      });

    return Promise.all([
      fetchDelay(this.options.minFetchDelay),
      result
    ]).then(function (_) {
      if (node.vm) {
        node.vm.loading = false;
      }

      return result
    })
  };

  Tree.prototype.fetch = function fetch (node, parseData) {
      var this$1 = this;

    var result = this.options.fetchData(node);

    if (!result.then) {
      result = get(result)
        .catch(this.options.onFetchError);
    }

    if (parseData === false) {
      return result
    }

    return result
      .then(function (data) {
        try {
          return this$1.parse(data, this$1.options.modelParse)
        } catch (e) {
          throw new Error(e)
        }
      })
      .catch(this.options.onFetchError)
  };

  Tree.prototype.fetchInitData = function fetchInitData () {
    // simulate root node
    var node = {
      id: 'root',
      name: 'root'
    };

    return this.fetch(node, false)
  };

  Tree.prototype.setModel = function setModel (data) {
      var this$1 = this;

    return new Promise(function (resolve) {
      this$1.model = this$1.parse(data, this$1.options.modelParse);

      /* eslint-disable */
      requestAnimationFrame(function (_) {
        this$1.vm.model = this$1.model;
        resolve();
      });
      /* eslint-enable */

      /**
      * VueJS transform properties to reactives when constructor is running
      * And we lose List object (extended from Array)
      */
      this$1.selectedNodes = new List();
      this$1.checkedNodes = new List();

      recurseDown(this$1.model, function (node) {
        node.tree = this$1;

        if (node.selected()) {
          this$1.selectedNodes.add(node);
        }

        if (node.checked()) {
          this$1.checkedNodes.add(node);

          if (node.parent) {
            node.parent.refreshIndeterminateState();
          }
        }

        if (this$1.options.autoDisableChildren && node.disabled()) {
          node.recurseDown(function (child) {
            child.state('disabled', true);
          });
        }
      });

      if (!this$1.options.multiple && this$1.selectedNodes.length) {
        var top = this$1.selectedNodes.top();

        this$1.selectedNodes.forEach(function (node) {
          if (top !== node) {
            node.state('selected', false);
          }
        });

        this$1.selectedNodes
          .empty()
          .add(top);
      }

      // Nodes can't be selected on init. By it's possible to select through API
      if (this$1.options.checkOnSelect && this$1.options.checkbox) {
        this$1.unselectAll();
      }
    })
  };

  Tree.prototype.recurseDown = function recurseDown$1 (node, fn) {
    if (!fn && node) {
      fn = node;
      node = this.model;
    }

    return recurseDown(node, fn)
  };

  Tree.prototype.select = function select (node, extendList) {
    var treeNode = this.getNode(node);

    if (!treeNode) {
      return false
    }

    if (this.options.multiple && extendList) {
      this.selectedNodes.add(treeNode);
    } else {
      this.unselectAll();
      this.selectedNodes
        .empty()
        .add(treeNode);
    }

    return true
  };

  Tree.prototype.selectAll = function selectAll () {
      var this$1 = this;

    if (!this.options.multiple) {
      return false
    }

    this.selectedNodes.empty();

    this.recurseDown(function (node) {
      this$1.selectedNodes.add(
        node.select(true)
      );
    });

    return true
  };

  Tree.prototype.unselect = function unselect (node) {
    var treeNode = this.getNode(node);

    if (!treeNode) {
      return false
    }

    this.selectedNodes.remove(treeNode);

    return true
  };

  Tree.prototype.unselectAll = function unselectAll () {
    var node;

    while (node = this.selectedNodes.pop()) {
      node.unselect();
    }

    return true
  };

  Tree.prototype.check = function check (node) {
    this.checkedNodes.add(node);
  };

  Tree.prototype.uncheck = function uncheck (node) {
    this.checkedNodes.remove(node);
  };

  Tree.prototype.checkAll = function checkAll () {
    this.recurseDown(function (node) {
      if (node.depth === 0) {
        if (node.indeterminate()) {
          node.state('indeterminate', false);
        }

        node.check();
      }
    });
  };

  Tree.prototype.uncheckAll = function uncheckAll () {
    var node;

    while (node = this.checkedNodes.pop()) {
      node.uncheck();
    }

    return true
  };

  Tree.prototype.expand = function expand (node) {
    if (node.expanded()) {
      return false
    }

    node.expand();

    return true
  };

  Tree.prototype.collapse = function collapse (node) {
    if (node.collapsed()) {
      return false
    }

    node.collapse();

    return true
  };

  Tree.prototype.toggleExpand = function toggleExpand (node) {
    if (!node.hasChildren()) {
      return false
    }

    node.toggleExpand();

    return true
  };

  Tree.prototype.toggleCollapse = function toggleCollapse (node) {
    if (!node.hasChildren()) {
      return false
    }

    node.toggleCollapse();

    return true
  };

  Tree.prototype.expandAll = function expandAll () {
    this.recurseDown(function (node) {
      if (node.hasChildren() && node.collapsed()) {
        node.expand();
      }
    });
  };

  Tree.prototype.collapseAll = function collapseAll () {
    this.recurseDown(function (node) {
      if (node.hasChildren() && node.expanded()) {
        node.collapse();
      }
    });
  };

  Tree.prototype.index = function index (node, verbose) {
    var target = node.parent;

    if (target) {
      target = target.children;
    } else {
      target = this.model;
    }

    var index = target.indexOf(node);

    if (verbose) {
      return {
        index: index,
        target: target,
        node: target[index]
      }
    }

    return index
  };

  Tree.prototype.nextNode = function nextNode (node) {
    var ref = this.index(node, true);
      var target = ref.target;
      var index = ref.index;

    return target[index + 1] || null
  };

  Tree.prototype.nextVisibleNode = function nextVisibleNode (node) {
    if (node.hasChildren() && node.expanded()) {
      return node.first()
    }

    var nextNode = this.nextNode(node);

    if (!nextNode && node.parent) {
      return node.parent.next()
    }

    return nextNode
  };

  Tree.prototype.prevNode = function prevNode (node) {
    var ref = this.index(node, true);
      var target = ref.target;
      var index = ref.index;

    return target[index - 1] || null
  };

  Tree.prototype.prevVisibleNode = function prevVisibleNode (node) {
    var prevNode = this.prevNode(node);

    if (!prevNode) {
      return node.parent
    }

    if (prevNode.hasChildren() && prevNode.expanded()) {
      return prevNode.last()
    }

    return prevNode
  };

  Tree.prototype.addToModel = function addToModel (node, index) {
      var this$1 = this;
      if ( index === void 0 ) { index = this.model.length; }

    node = this.objectToNode(node);

    this.model.splice(index, 0, node);
    this.recurseDown(node, function (n) {
      n.tree = this$1;
    });

    this.$emit('node:added', node);

    return node
  };

  Tree.prototype.append = function append (criteria, node) {
    var targetNode = this.find(criteria);

    if (targetNode) {
      return targetNode.append(node)
    }

    return false
  };

  Tree.prototype.prepend = function prepend (criteria, node) {
    var targetNode = this.find(criteria);

    if (targetNode) {
      return targetNode.prepend(node)
    }

    return false
  };

  Tree.prototype.before = function before (targetNode, sourceNode) {
    targetNode = this.find(targetNode);

    var position = this.index(targetNode, true);
    var node = this.objectToNode(sourceNode);

    if (!~position.index) {
      return false
    }

    position.target.splice(
      position.index,
      0,
      node
    );

    node.parent = targetNode.parent;
    this.$emit('node:added', node);

    return node
  };

  Tree.prototype.after = function after (targetNode, sourceNode) {
    targetNode = this.find(targetNode);

    var position = this.index(targetNode, true);
    var node = this.objectToNode(sourceNode);

    if (!~position.index) {
      return false
    }

    position.target.splice(
      position.index + 1,
      0,
      node
    );

    node.parent = targetNode.parent;
    this.$emit('node:added', node);

    return node
  };

  Tree.prototype.addNode = function addNode (node) {
    var index = this.model.length;

    node = objectToNode(node);

    this.model.splice(index, 0, node);
    this.$emit('node:added', node);

    return node
  };

  Tree.prototype.remove = function remove (criteria, multiple) {
    return this.removeNode(
      this.find(criteria, multiple)
    )
  };

  Tree.prototype.removeNode = function removeNode (node) {
    if (node instanceof Selection) {
      return node.remove()
    }

    if (!node) {
      return false
    }

    if (!node.parent) {
      if (~this.model.indexOf(node)) {
        this.model.splice(
          this.model.indexOf(node),
          1
        );
      }
    } else {
      var children = node.parent.children;

      if (~children.indexOf(node)) {
        children.splice(
          children.indexOf(node),
          1
        );
      }
    }

    if (node.parent) {
      if (node.parent.indeterminate() && !node.parent.hasChildren()) {
        node.parent.state('indeterminate', false);
      }
    }

    if (this.activeElement !== null) {
      if (node.id === this.activeElement.id) {
        this.activeElement = null;
      }
    }

    node.parent = null;

    this.$emit('node:removed', node);

    this.selectedNodes.remove(node);
    this.checkedNodes.remove(node);

    var matches = this.vm.matches;

    if (matches && matches.length) {
      if (matches.includes(node)) {
        matches.splice(
          matches.indexOf(node),
          1
        );
      }
    }

    return node
  };

  Tree.prototype.isNode = function isNode (node) {
    return node instanceof Node
  };

  Tree.prototype.find = function find$1 (criteria, multiple) {
    if (this.isNode(criteria)) {
      return criteria
    }

    var result = find(this.model, criteria);

    if (!result || !result.length) {
      return new Selection(this, [])
    }

    if (multiple === true) {
      return new Selection(this, result)
    }

    return new Selection(this, [result[0]])
  };

  Tree.prototype.updateData = function updateData (criteria, callback) {
    var nodes = this.find(criteria);

    nodes.forEach(function (node) { return node.setData(callback(node)); });

    return nodes
  };

  Tree.prototype.getNodeById = function getNodeById (id) {
    var targetNode = null;

    recurseDown(this.model, function (node) {
      if ('' + node.id === id) {
        targetNode = node;
        return false
      }
    });

    return targetNode
  };

  Tree.prototype.getNode = function getNode (node) {
    if (this.isNode(node)) {
      return node
    }

    return null
  };

  Tree.prototype.objectToNode = function objectToNode$1 (obj) {
    return objectToNode(this, obj)
  };

  Tree.prototype.parse = function parse (data, options) {
    if (!options) {
      options = this.options.propertyNames;
    }

    try {
      return TreeParser.parse(data, this, options)
    } catch (e) {
      return []
    }
  };

  var keyCodes = {
    'ARROW_LEFT': 37,
    'ARROW_TOP': 38,
    'ARROW_RIGHT': 39,
    'ARROW_BOTTOM': 40,
    'SPACE': 32,
    'DELETE': 46,
    'ENTER': 13,
    'ESC': 27
  };

  var codesArr = [37, 38, 39, 40, 32];

  function focusUp (tree, node) {
    var prevNode = tree.prevVisibleNode(node);

    if (!prevNode) {
      return
    }

    if (prevNode.disabled()) {
      return focusUp(tree, prevNode)
    }

    prevNode.focus();
  }

  function focusdDown (tree, node) {
    var nextNode = tree.nextVisibleNode(node);

    if (!nextNode) {
      return
    }

    if (nextNode.disabled()) {
      return focusdDown(tree, nextNode)
    }

    nextNode.focus();
  }

  function checkNode (tree, node) {
    if (!tree.options.checkbox) {
      return
    }

    if (node.checked()) {
      node.uncheck();
    } else {
      node.check();
    }
  }

  function leftArrow (tree, node) {
    if (node.expanded()) {
      node.collapse();
    } else {
      var parent = node.parent;

      if (parent) {
        parent.focus();
      }
    }
  }

  function rightArrow (tree, node) {
    if (node.collapsed()) {
      node.expand();
    } else {
      var first = node.first();

      if (first) {
        first.focus();
      }
    }
  }

  function deleteNode (tree, node) {
    var deletion = tree.options.deletion;

    if (deletion) {
      if (typeof deletion === 'function') {
        if (deletion(node) === true) {
          node.remove();
        }
      } else if (deletion === true) {
        node.remove();
      }
    }
  }

  function initKeyboardNavigation (tree) {
    var vm = tree.vm;
    var $el = vm.$el;

    $el.addEventListener('keydown', function (e) {
      var code = e.keyCode;
      var node = tree.activeElement;

      if (!tree.isNode(node)) {
        return
      }

      if (node.isEditing) {
        switch (code) {
          case keyCodes.ESC: return node.stopEditing(false)
        }
      } else {
        if (codesArr.includes(code)) {
          e.preventDefault();
          e.stopPropagation();
        }

        switch (code) {
          case keyCodes.ARROW_LEFT: return leftArrow(tree, node)
          case keyCodes.ARROW_RIGHT: return rightArrow(tree, node)
          case keyCodes.ARROW_TOP: return focusUp(tree, node)
          case keyCodes.ARROW_BOTTOM: return focusdDown(tree, node)
          case keyCodes.SPACE:
          case keyCodes.ENTER: return checkNode(tree, node)
          case keyCodes.DELETE: return deleteNode(tree, node)
        }
      }
    }, true);
  }

  function assert (truth, message) {
    if (truth === false) {
      throw new Error(message)
    }
  }

  function initEvents (vm) {
    var ref = vm.opts;
    var multiple = ref.multiple;
    var checkbox = ref.checkbox;
    var tree = vm.tree;

    var emitter = function (obj) {
      var selected = vm.selected();

      if (!checkbox) {
        vm.$emit('input', multiple ? selected : (selected[0] || null));
      } else {
        vm.$emit('input', {
          selected: multiple ? selected : (selected[0] || null),
          checked: vm.checked()
        });
      }
    };

    emitter();

    tree.$on('node:selected', emitter);
    tree.$on('node:unselected', emitter);

    if (checkbox) {
      tree.$on('node:checked', emitter);
      tree.$on('node:unchecked', emitter);
    }

    tree.$on('node:added', function (targetNode, newNode) {
      var node = newNode || targetNode;

      if (checkbox) {
        if (node.state('checked') && !tree.checkedNodes.has(node)) {
          tree.checkedNodes.add(node);
        }

        node.refreshIndeterminateState();
      }

      if (node.state('selected') && !tree.selectedNodes.has(node)) {
        tree.select(node);
      }

      emitter();
    });
  }

  var TreeMixin = {
    mounted: function mounted () {
      var this$1 = this;

      var tree = new Tree(this);
      var dataProvider;

      this.tree = tree;
      this._provided.tree = tree;

      if (!this.data && this.opts.fetchData) {
        // Get initial data if we don't have a data directly
        // In this case we call 'fetcher' with node.id == 'root' && node.name == 'root'
        dataProvider = tree.fetchInitData();
      } else if (this.data && this.data.then) {
        // Yeah... nice check!
        dataProvider = this.data;
        this.loading = true;
      } else {
        dataProvider = Promise.resolve(this.data);
      }

      dataProvider.then(function (data) {
        if (!data) {
          data = [];
        }

        if (this$1.opts.store) {
          this$1.connectStore(this$1.opts.store);
        } else {
          this$1.tree.setModel(data);
        }

        if (this$1.loading) {
          this$1.loading = false;
        }

        this$1.$emit('tree:mounted', this$1);

        initEvents(this$1);
      });

      if (this.opts.keyboardNavigation !== false) {
        initKeyboardNavigation(tree);
      }
    },

    methods: {
      connectStore: function connectStore (store) {
        var this$1 = this;

        var Store = store.store;
        var mutations = store.mutations;
        var getter = store.getter;
        var dispatcher = store.dispatcher;

        assert(typeof getter === 'function', '`getter` must be a function');
        assert(typeof dispatcher === 'function', '`dispatcher` must be a function');

        if (undefined !== mutations) {
          assert(Array.isArray(mutations), '`mutations` must be an array');
        }

        Store.subscribe(function (action, state) {
          if (!mutations) {
            this$1.tree.setModel(getter());
          } else if (mutations.includes(action.type)) {
            this$1.tree.setModel(getter());
          }
        });

        this.tree.setModel(getter());

        this.$on('LIQUOR_NOISE', function () {
          this$1.$nextTick(function (_) {
            dispatcher(this$1.toJSON());
          });
        });
      },

      recurseDown: function recurseDown (fn) {
        this.tree.recurseDown(fn);
      },

      selected: function selected () {
        return this.tree.selected()
      },

      checked: function checked () {
        return this.tree.checked()
      },

      append: function append (criteria, node) {
        // append to model
        if (!node) {
          return this.tree.addToModel(criteria, this.tree.model.length)
        }

        return this.tree.append(criteria, node)
      },

      prepend: function prepend (criteria, node) {
        if (!node) {
          return this.tree.addToModel(criteria, 0)
        }

        return this.tree.prepend(criteria, node)
      },

      addChild: function addChild (criteria, node) {
        return this.append(criteria, node)
      },

      remove: function remove (criteria, multiple) {
        return this.tree.remove(criteria, multiple)
      },

      before: function before (criteria, node) {
        if (!node) {
          return this.prepend(criteria)
        }

        return this.tree.before(criteria, node)
      },

      after: function after (criteria, node) {
        if (!node) {
          return this.append(criteria)
        }

        return this.tree.after(criteria, node)
      },

      find: function find (criteria, multiple) {
        return this.tree.find(criteria, multiple)
      },

      findAll: function findAll (criteria) {
        return this.tree.find(criteria, true)
      },

      expandAll: function expandAll () {
        return this.tree.expandAll()
      },

      updateData: function updateData (criteria, callback) {
        return this.tree.updateData(criteria, callback)
      },

      collapseAll: function collapseAll () {
        return this.tree.collapseAll()
      },

      sortTree: function sortTree (compareFn, deep) {
        return this.tree.sortTree(compareFn, deep)
      },

      sort: function sort () {
        var arguments$1 = arguments;

        var ref;

        var args = [], len = arguments.length;
        while ( len-- ) { args[ len ] = arguments$1[ len ]; }
        return (ref = this.tree).sort.apply(ref, args)
      },

      setModel: function setModel (data) {
        return this.tree.setModel(data)
      },

      getRootNode: function getRootNode () {
        return this.tree.model.length === 1
          ? this.tree.model[0]
          : this.tree.model
      },

      toJSON: function toJSON () {
        return JSON.parse(
          JSON.stringify(this.model)
        )
      }
    }

  /*eslint semi: 0 */
  /* https://github.com/vuejs/rollup-plugin-vue/issues/169 */
  };

  var DropPosition = {
    ABOVE: 'drag-above',
    BELOW: 'drag-below',
    ON: 'drag-on'
  };

  function isMovingStarted (event, start) {
    return Math.abs(event.clientX - start[0]) > 5 || Math.abs(event.clientY - start[1]) > 5
  }

  function composedPath (event) {
    var el = event.target;
    var path = [];

    while (el) {
      path.push(el);

      if (el.tagName === 'HTML') {
        path.push(document);
        path.push(window);

        return path
      }

      el = el.parentElement;
    }

    return path
  }

  function getPath (event) {
    if (event.path) {
      return event.path
    }

    if (event.composedPath) {
      return event.composedPath()
    }

    return composedPath(event)
  }

  function getSelectedNode (event) {
    var className;
    var i = 0;

    var path = getPath(event);

    for (; i < path.length; i++) {
      className = path[i].className || '';

      if (/tree-node/.test(className)) {
        return path[i]
      }
    }

    return null
  }

  function getDropDestination (e) {
    var selectedNode = getSelectedNode(e);

    if (!selectedNode) {
      return null
    }

    return selectedNode
  }

  function updateHelperClasses (target, classes) {
    if (!target) {
      return
    }

    var className = target.className;

    if (!classes) {
      for (var i in DropPosition) {
        className = className.replace(DropPosition[i], '');
      }

      className.replace('dragging', '');
    } else if (!new RegExp(classes).test(className)) {
      className += ' ' + classes;
    }

    target.className = className.replace(/\s+/g, ' ');
  }

  function getDropPosition (e, element) {
    var coords = element.getBoundingClientRect();
    var nodeSection = coords.height / 3;

    var dropPosition = DropPosition.ON;

    if (coords.top + nodeSection >= e.clientY) {
      dropPosition = DropPosition.ABOVE;
    } else if (coords.top + nodeSection * 2 <= e.clientY) {
      (
        dropPosition = DropPosition.BELOW
      );
    }

    return dropPosition
  }

  function callDndCb (args, opts, method) {
    if (!opts || !opts[method] || typeof opts[method] !== 'function') {
      return
    }

    return opts[method].apply(opts, args) !== false
  }

  function clearDropClasses (parent) {
    for (var key in DropPosition) {
      var el = parent.querySelectorAll(("." + (DropPosition[key])));

      for (var i = 0; i < el.length; i++) {
        updateHelperClasses(el[i]);
      }
    }
  }

  var TreeDnd = {
    methods: {
      onDragStart: function onDragStart (e) {
        e.preventDefault();
      },

      startDragging: function startDragging (node, event) {
        if (!node.isDraggable() || callDndCb([node], this.tree.options.dnd, 'onDragStart') === false) {
          return
        }

        this.$$startDragPosition = [event.clientX, event.clientY];
        this.$$possibleDragNode = node;

        this.initDragListeners();
      },

      initDragListeners: function initDragListeners () {
        var this$1 = this;

        var dropPosition;

        var removeListeners = function () {
          window.removeEventListener('mouseup', onMouseUp, true);
          window.removeEventListener('mousemove', onMouseMove, true);
        };

        var onMouseUp = function (e) {
          if (!this$1.$$startDragPosition) {
            e.stopPropagation();
          }

          if (this$1.draggableNode) {
            this$1.draggableNode.node.state('dragging', false);
          }

          if (this$1.$$dropDestination && this$1.tree.isNode(this$1.$$dropDestination) && this$1.$$dropDestination.vm) {
            updateHelperClasses(this$1.$$dropDestination.vm.$el, null);

            var cbResult = callDndCb(
              [this$1.draggableNode.node, this$1.$$dropDestination, dropPosition],
              this$1.tree.options.dnd,
              'onDragFinish'
            );

            if (cbResult !== false && !(!this$1.$$dropDestination.isDropable() && dropPosition === DropPosition.ON || !dropPosition)) {
              this$1.draggableNode.node.finishDragging(this$1.$$dropDestination, dropPosition);
              this$1.draggableNode.node.parent = this$1.$$dropDestination;
            }

            this$1.$$dropDestination = null;
          }

          this$1.$$possibleDragNode = null;
          this$1.$set(this$1, 'draggableNode', null);

          removeListeners();
        };

        var onMouseMove = function (e) {
          if (this$1.$$startDragPosition && !isMovingStarted(e, this$1.$$startDragPosition)) {
            return
          } else {
            this$1.$$startDragPosition = null;
          }

          if (this$1.$$possibleDragNode) {
            if (this$1.$$possibleDragNode.startDragging() === false) {
              removeListeners();
              this$1.$$possibleDragNode = null;

              return
            }

            this$1.$set(this$1, 'draggableNode', { node: this$1.$$possibleDragNode, left: 0, top: 0 });
            this$1.$$possibleDragNode = null;
          }

          this$1.draggableNode.left = e.clientX;
          this$1.draggableNode.top = e.clientY;

          var dropDestination = getDropDestination(e);

          clearDropClasses(this$1.$el);

          if (dropDestination) {
            var dropDestinationId = dropDestination.getAttribute('data-id');

            if (this$1.draggableNode.node.id === dropDestinationId) {
              return
            }

            if (!this$1.$$dropDestination || this$1.$$dropDestination.id !== dropDestinationId) {
              this$1.$$dropDestination = this$1.tree.getNodeById(dropDestinationId);
            }

            if (this$1.$$dropDestination && this$1.draggableNode.node) {
              var path = this$1.$$dropDestination.getPath();

              if (path.includes(this$1.draggableNode.node)) {
                this$1.$$dropDestination = null;
                return
              }
            }

            dropPosition = getDropPosition(e, dropDestination);

            var cbResult = callDndCb(
              [this$1.draggableNode.node, this$1.$$dropDestination, dropPosition],
              this$1.tree.options.dnd,
              'onDragOn'
            );

            var isDropable = this$1.$$dropDestination.isDropable() && cbResult !== false;

            if (!isDropable && dropPosition === DropPosition.ON) {
              dropPosition = null;
            }

            updateHelperClasses(dropDestination, dropPosition);
          }
        };

        window.addEventListener('mouseup', onMouseUp, true);
        window.addEventListener('mousemove', onMouseMove, true);
      }
    }
  };

  //

  var defaults = {
    direction: 'ltr',
    multiple: true,
    checkbox: false,
    checkOnSelect: false,
    autoCheckChildren: true,
    autoDisableChildren: true,
    checkDisabledChildren: true,
    parentSelect: false,
    keyboardNavigation: true,
    nodeIndent: 24,
    minFetchDelay: 0,
    fetchData: null,
    propertyNames: null,
    deletion: false,
    dnd: false,
    editing: false,
    onFetchError: function(err) { throw err }
  };

  var filterDefaults = {
    emptyText: 'Nothing found!',
    matcher: function matcher(query, node) {
      var isMatched = new RegExp(query, 'i').test(node.text);

      if (isMatched) {
        if (node.parent && new RegExp(query, 'i').test(node.parent.text)) {
          return false
        }
      }

      return isMatched
    },
    plainList: false,
    showChildren: true
  };

  var script$1 = {
    name: 'Tree',
    components: {
      TreeNode: TreeNode$1,
      DraggableNode: DraggableNode
    },

    mixins: [TreeMixin, TreeDnd],

    provide: function (_) { return ({
      tree: null
    }); },

    props: {
      data: {},

      options: {
        type: Object,
        default: function (_) { return ({}); }
      },

      filter: String,

      tag: {
        type: String,
        default: 'div'
      }
    },

    watch: {
      filter: function filter (term) {
        this.tree.filter(term);
      }
    },

    computed: {
      visibleModel: function visibleModel() {
        return this.model.filter(function(node) {
          return node && node.visible()
        }) 
      },

      visibleMatches: function visibleMatches() {
        return this.matches.filter(function(node) {
          return node && node.visible()
        })
      }
    },

    data: function data () {
      // we should not mutating a prop directly...
      // that's why we have to create a new object
      // TODO: add method for changing options
      var opts = Object.assign({}, defaults, this.options);

      opts.filter = Object.assign(
        {},
        filterDefaults,
        opts.filter
      );

      return {
        model: [],
        tree: null,
        loading: false,
        opts: opts,
        matches: [],
        draggableNode: null
      }
    }
  };

  /* script */
  var __vue_script__$3 = script$1;
  // For security concerns, we use only base name in production mode. See https://github.com/vuejs/rollup-plugin-vue/issues/258
  script$1.__file = "TreeRoot.vue";

  /* template */
  var __vue_render__$2 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c(_vm.tag,{tag:"component",class:{'tree': true, 'tree-loading': this.loading, 'tree--draggable' : !!this.draggableNode},attrs:{"role":"tree"}},[(_vm.filter && _vm.matches.length == 0)?[_c('div',{staticClass:"tree-filter-empty",domProps:{"innerHTML":_vm._s(_vm.opts.filter.emptyText)}})]:[_c('ul',{staticClass:"tree-root",on:{"dragstart":_vm.onDragStart}},[(_vm.opts.filter.plainList && _vm.matches.length > 0)?_vm._l((_vm.visibleMatches),function(node){return _c('TreeNode',{key:node.id,attrs:{"node":node,"options":_vm.opts}})}):_vm._l((_vm.visibleModel),function(node){return _c('TreeNode',{key:node.id,attrs:{"node":node,"options":_vm.opts}})})],2)],_vm._v(" "),(_vm.draggableNode)?_c('DraggableNode',{attrs:{"target":_vm.draggableNode}}):_vm._e()],2)};
  var __vue_staticRenderFns__$2 = [];

    /* style */
    var __vue_inject_styles__$3 = function (inject) {
      if (!inject) { return }
      inject("data-v-6db2091d_0", { source: ".tree{overflow:auto}.tree-children,.tree-root{list-style:none;padding:0}.tree>.tree-filter-empty,.tree>.tree-root{padding:3px;box-sizing:border-box}.tree.tree--draggable .tree-node:not(.selected)>.tree-content:hover{background:0 0}.drag-above,.drag-below,.drag-on{position:relative;z-index:1}.drag-on>.tree-content{background:#fafcff;outline:1px solid #7baff2}.drag-above>.tree-content::before,.drag-below>.tree-content::after{display:block;content:'';position:absolute;height:8px;left:0;right:0;z-index:2;box-sizing:border-box;background-color:#3367d6;border:3px solid #3367d6;background-clip:padding-box;border-bottom-color:transparent;border-top-color:transparent;border-radius:0}.drag-above>.tree-content::before{top:0;transform:translateY(-50%)}.drag-below>.tree-content::after{bottom:0;transform:translateY(50%)}", map: undefined, media: undefined });

    };
    /* scoped */
    var __vue_scope_id__$3 = undefined;
    /* module identifier */
    var __vue_module_identifier__$3 = undefined;
    /* functional template */
    var __vue_is_functional_template__$3 = false;
    /* style inject SSR */
    

    
    var TreeRoot = normalizeComponent(
      { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
      __vue_inject_styles__$3,
      __vue_script__$3,
      __vue_scope_id__$3,
      __vue_is_functional_template__$3,
      __vue_module_identifier__$3,
      createInjector,
      undefined
    );

  var install = function (Vue) {
    Vue.component(TreeRoot.name, TreeRoot);
  };

  TreeRoot.install = install;

  if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(TreeRoot);
  }

  //

  var script$2 = {
    name: 'ui-dual-treeview',
    props: {
      fetchUnassignedUrl: 'String',
      fetchAssignedUrl: 'String',
      postAssignUrl: 'String',
      postUnassignUrl: 'String'
    },
    components: { LiquorTree: TreeRoot },
    data: function () {
      return {
        options: {
          checkbox: true,
          checkOnSelect: true
        },
        treeFilterUnassigned: '',
        treeFilterAssigned: '',
        unassignedChecked: 0,
        assignedChecked: 0
      };
    },
    methods: {
      buttonCssClasses: function buttonCssClasses(counter) {
        return {
          'btn': 'btn',
          'disabled': counter === 0,
          'btn-secondary': counter === 0,
          'btn-primary': counter > 0
        }
      },
      handleUnassignedChecked: function handleUnassignedChecked(node) {
        node.states.checked ? this.unassignedChecked++ : this.unassignedChecked--;
      },
      handleAssignedChecked: function handleAssignedChecked(node) {
        node.states.checked ? this.assignedChecked++ : this.assignedChecked--;
      },
      handleAssignClick: function handleAssignClick() {
        postData(this.postAssignUrl, getSelectedData(this.$refs.unassignedTree))
          .then(function (response) { return response.json(); })
          .then(function (response) {
            window.location.reload();
          });
      },
      handleUnassignClick: function handleUnassignClick() {
        postData(this.postUnassignUrl, getSelectedData(this.$refs.assignedTree))
          .then(function (response) { return response.json(); })
          .then(function (response) {
            window.location.reload();
          });
      }
    }
  };

  var getSelectedData = function (tree) {
    return tree
      .findAll({ state: { checked: true } })
      .filter(function (item) { return !!item.data.type; })
      .map(function (item) {
        return {
          id: item.data.id,
          type: item.data.type
        }
      });
  };

  var postData = function (url, data) {
    if ( url === void 0 ) url = '';
    if ( data === void 0 ) data = {};

    return fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
  };

  function normalizeComponent$1(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof shadowMode !== 'boolean') {
          createInjectorSSR = createInjector;
          createInjector = shadowMode;
          shadowMode = false;
      }
      // Vue.extend constructor export interop.
      var options = typeof script === 'function' ? script.options : script;
      // render functions
      if (template && template.render) {
          options.render = template.render;
          options.staticRenderFns = template.staticRenderFns;
          options._compiled = true;
          // functional template
          if (isFunctionalTemplate) {
              options.functional = true;
          }
      }
      // scopedId
      if (scopeId) {
          options._scopeId = scopeId;
      }
      var hook;
      if (moduleIdentifier) {
          // server build
          hook = function (context) {
              // 2.3 injection
              context =
                  context || // cached call
                      (this.$vnode && this.$vnode.ssrContext) || // stateful
                      (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
              // 2.2 with runInNewContext: true
              if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                  context = __VUE_SSR_CONTEXT__;
              }
              // inject component styles
              if (style) {
                  style.call(this, createInjectorSSR(context));
              }
              // register component module identifier for async chunk inference
              if (context && context._registeredComponents) {
                  context._registeredComponents.add(moduleIdentifier);
              }
          };
          // used by ssr in case component is cached and beforeCreate
          // never gets called
          options._ssrRegister = hook;
      }
      else if (style) {
          hook = shadowMode
              ? function (context) {
                  style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
              }
              : function (context) {
                  style.call(this, createInjector(context));
              };
      }
      if (hook) {
          if (options.functional) {
              // register for functional component in vue file
              var originalRender = options.render;
              options.render = function renderWithStyleInjection(h, context) {
                  hook.call(context);
                  return originalRender(h, context);
              };
          }
          else {
              // inject component registration as beforeCreate hook
              var existing = options.beforeCreate;
              options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
          }
      }
      return script;
  }

  var isOldIE$1 = typeof navigator !== 'undefined' &&
      /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  function createInjector$1(context) {
      return function (id, style) { return addStyle$1(id, style); };
  }
  var HEAD$1;
  var styles$1 = {};
  function addStyle$1(id, css) {
      var group = isOldIE$1 ? css.media || 'default' : id;
      var style = styles$1[group] || (styles$1[group] = { ids: new Set(), styles: [] });
      if (!style.ids.has(id)) {
          style.ids.add(id);
          var code = css.source;
          if (css.map) {
              // https://developer.chrome.com/devtools/docs/javascript-debugging
              // this makes source maps inside style tags work properly in Chrome
              code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
              // http://stackoverflow.com/a/26603875
              code +=
                  '\n/*# sourceMappingURL=data:application/json;base64,' +
                      btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                      ' */';
          }
          if (!style.element) {
              style.element = document.createElement('style');
              style.element.type = 'text/css';
              if (css.media)
                  { style.element.setAttribute('media', css.media); }
              if (HEAD$1 === undefined) {
                  HEAD$1 = document.head || document.getElementsByTagName('head')[0];
              }
              HEAD$1.appendChild(style.element);
          }
          if ('styleSheet' in style.element) {
              style.styles.push(code);
              style.element.styleSheet.cssText = style.styles
                  .filter(Boolean)
                  .join('\n');
          }
          else {
              var index = style.ids.size - 1;
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index])
                  { style.element.removeChild(nodes[index]); }
              if (nodes.length)
                  { style.element.insertBefore(textNode, nodes[index]); }
              else
                  { style.element.appendChild(textNode); }
          }
      }
  }

  /* script */
  var __vue_script__$4 = script$2;

  /* template */
  var __vue_render__$3 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "row" }, [
      _c("div", { staticClass: "col-5" }, [
        _c("div", { staticClass: "border" }, [
          _c("div", { staticClass: "m-2" }, [
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.treeFilterUnassigned,
                  expression: "treeFilterUnassigned"
                }
              ],
              staticClass: "form-control",
              attrs: { type: "text", placeholder: "Type to filter..." },
              domProps: { value: _vm.treeFilterUnassigned },
              on: {
                input: function($event) {
                  if ($event.target.composing) {
                    return
                  }
                  _vm.treeFilterUnassigned = $event.target.value;
                }
              }
            })
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "border-bottom mb-2" }),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "treeview-wrapper m-2" },
            [
              _c("tree", {
                ref: "unassignedTree",
                staticClass: "tree--small",
                attrs: {
                  options: {
                    checkbox: true,
                    checkOnSelect: true,
                    fetchData: _vm.fetchUnassignedUrl
                  },
                  filter: _vm.treeFilterUnassigned
                },
                on: {
                  "node:checked": _vm.handleUnassignedChecked,
                  "node:unchecked": _vm.handleUnassignedChecked
                }
              })
            ],
            1
          )
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "col-2 col-2 mt-auto mb-auto text-center" }, [
        _c(
          "button",
          {
            class: _vm.buttonCssClasses(_vm.unassignedChecked),
            on: { click: _vm.handleAssignClick }
          },
          [_vm._t("assign-button-content")],
          2
        ),
        _vm._v(" "),
        _c("div", { staticClass: "mb-3" }),
        _vm._v(" "),
        _c(
          "button",
          {
            class: _vm.buttonCssClasses(_vm.assignedChecked),
            on: { click: _vm.handleUnassignClick }
          },
          [_vm._t("unassign-button-content")],
          2
        )
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "col-5" }, [
        _c("div", { staticClass: "border" }, [
          _c("div", { staticClass: "m-2" }, [
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.treeFilterAssigned,
                  expression: "treeFilterAssigned"
                }
              ],
              staticClass: "form-control",
              attrs: { type: "text", placeholder: "Type to filter..." },
              domProps: { value: _vm.treeFilterAssigned },
              on: {
                input: function($event) {
                  if ($event.target.composing) {
                    return
                  }
                  _vm.treeFilterAssigned = $event.target.value;
                }
              }
            })
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "border-bottom mb-2" }),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "treeview-wrapper m-2" },
            [
              _c("tree", {
                ref: "assignedTree",
                staticClass: "tree--small",
                attrs: {
                  options: {
                    checkbox: true,
                    checkOnSelect: true,
                    fetchData: _vm.fetchAssignedUrl
                  },
                  filter: _vm.treeFilterAssigned
                },
                on: {
                  "node:checked": _vm.handleAssignedChecked,
                  "node:unchecked": _vm.handleAssignedChecked
                }
              })
            ],
            1
          )
        ])
      ])
    ])
  };
  var __vue_staticRenderFns__$3 = [];
  __vue_render__$3._withStripped = true;

    /* style */
    var __vue_inject_styles__$4 = function (inject) {
      if (!inject) { return }
      inject("data-v-ec2e4ab0_0", { source: "\n.treeview-wrapper[data-v-ec2e4ab0] {\n  height: 300px;\n  overflow-y: scroll;\n}\n", map: {"version":3,"sources":["/home/filsh/www/mailery/node_modules/@maileryio/mailery-rbac-assets/src/components/DualTreeview.vue"],"names":[],"mappings":";AAuIA;EACA,aAAA;EACA,kBAAA;AACA","file":"DualTreeview.vue","sourcesContent":["<template>\n  <div class=\"row\">\n    <div class=\"col-5\">\n      <div class=\"border\">\n        <div class=\"m-2\">\n          <input class=\"form-control\" type=\"text\" placeholder=\"Type to filter...\" v-model=\"treeFilterUnassigned\">\n        </div>\n        <div class=\"border-bottom mb-2\"></div>\n        <div class=\"treeview-wrapper m-2\">\n          <tree\n            ref=\"unassignedTree\"\n            class=\"tree--small\"\n            :options=\"{ checkbox: true, checkOnSelect: true, fetchData: fetchUnassignedUrl }\"\n            :filter=\"treeFilterUnassigned\"\n            @node:checked=\"handleUnassignedChecked\"\n            @node:unchecked=\"handleUnassignedChecked\" />\n          </div>\n        </div>\n    </div>\n\n    <div class=\"col-2 col-2 mt-auto mb-auto text-center\">\n      <button v-bind:class=\"buttonCssClasses(unassignedChecked)\" v-on:click=\"handleAssignClick\">\n        <slot name=\"assign-button-content\"></slot>\n      </button>\n      <div class=\"mb-3\"></div>\n      <button v-bind:class=\"buttonCssClasses(assignedChecked)\" v-on:click=\"handleUnassignClick\">\n        <slot name=\"unassign-button-content\"></slot>\n      </button>\n    </div>\n\n    <div class=\"col-5\">\n      <div class=\"border\">\n        <div class=\"m-2\">\n          <input class=\"form-control\" type=\"text\" placeholder=\"Type to filter...\" v-model=\"treeFilterAssigned\">\n        </div>\n        <div class=\"border-bottom mb-2\"></div>\n        <div class=\"treeview-wrapper m-2\">\n          <tree\n            ref=\"assignedTree\"\n            class=\"tree--small\"\n            :options=\"{ checkbox: true, checkOnSelect: true, fetchData: fetchAssignedUrl }\"\n            :filter=\"treeFilterAssigned\"\n            @node:checked=\"handleAssignedChecked\"\n            @node:unchecked=\"handleAssignedChecked\" />\n          </div>\n        </div>\n    </div>\n  </div>\n</template>\n\n<script>\n  import LiquorTree from 'liquor-tree';\n\n  export default {\n    name: 'ui-dual-treeview',\n    props: {\n      fetchUnassignedUrl: 'String',\n      fetchAssignedUrl: 'String',\n      postAssignUrl: 'String',\n      postUnassignUrl: 'String'\n    },\n    components: { LiquorTree },\n    data: function () {\n      return {\n        options: {\n          checkbox: true,\n          checkOnSelect: true\n        },\n        treeFilterUnassigned: '',\n        treeFilterAssigned: '',\n        unassignedChecked: 0,\n        assignedChecked: 0\n      };\n    },\n    methods: {\n      buttonCssClasses(counter) {\n        return {\n          'btn': 'btn',\n          'disabled': counter === 0,\n          'btn-secondary': counter === 0,\n          'btn-primary': counter > 0\n        }\n      },\n      handleUnassignedChecked(node) {\n        node.states.checked ? this.unassignedChecked++ : this.unassignedChecked--;\n      },\n      handleAssignedChecked(node) {\n        node.states.checked ? this.assignedChecked++ : this.assignedChecked--;\n      },\n      handleAssignClick() {\n        postData(this.postAssignUrl, getSelectedData(this.$refs.unassignedTree))\n          .then(response => response.json())\n          .then(response => {\n            window.location.reload();\n          });\n      },\n      handleUnassignClick() {\n        postData(this.postUnassignUrl, getSelectedData(this.$refs.assignedTree))\n          .then(response => response.json())\n          .then(response => {\n            window.location.reload();\n          });\n      }\n    }\n  };\n\n  const getSelectedData = (tree) => {\n    return tree\n      .findAll({ state: { checked: true } })\n      .filter(item => !!item.data.type)\n      .map(item => {\n        return {\n          id: item.data.id,\n          type: item.data.type\n        }\n      });\n  };\n\n  const postData = (url = '', data = {}) => {\n    return fetch(url, {\n      method: 'POST',\n      mode: 'cors',\n      cache: 'no-cache',\n      credentials: 'same-origin',\n      headers: {\n        'Content-Type': 'application/json'\n      },\n      redirect: 'follow',\n      referrerPolicy: 'no-referrer',\n      body: JSON.stringify(data)\n    });\n  };\n</script>\n\n<style scoped>\n  .treeview-wrapper {\n    height: 300px;\n    overflow-y: scroll;\n  }\n</style>\n"]}, media: undefined });

    };
    /* scoped */
    var __vue_scope_id__$4 = "data-v-ec2e4ab0";
    /* module identifier */
    var __vue_module_identifier__$4 = undefined;
    /* functional template */
    var __vue_is_functional_template__$4 = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var __vue_component__ = normalizeComponent$1(
      { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
      __vue_inject_styles__$4,
      __vue_script__$4,
      __vue_scope_id__$4,
      __vue_is_functional_template__$4,
      __vue_module_identifier__$4,
      false,
      createInjector$1,
      undefined,
      undefined
    );

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  // 7.1.4 ToInteger
  var ceil = Math.ceil;
  var floor = Math.floor;
  var _toInteger = function (it) {
    return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
  };

  // 7.2.1 RequireObjectCoercible(argument)
  var _defined = function (it) {
    if (it == undefined) { throw TypeError("Can't call method on  " + it); }
    return it;
  };

  // true  -> String#at
  // false -> String#codePointAt
  var _stringAt = function (TO_STRING) {
    return function (that, pos) {
      var s = String(_defined(that));
      var i = _toInteger(pos);
      var l = s.length;
      var a, b;
      if (i < 0 || i >= l) { return TO_STRING ? '' : undefined; }
      a = s.charCodeAt(i);
      return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
        ? TO_STRING ? s.charAt(i) : a
        : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
    };
  };

  var _library = true;

  var _global = createCommonjsModule(function (module) {
  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global = module.exports = typeof window != 'undefined' && window.Math == Math
    ? window : typeof self != 'undefined' && self.Math == Math ? self
    // eslint-disable-next-line no-new-func
    : Function('return this')();
  if (typeof __g == 'number') { __g = global; } // eslint-disable-line no-undef
  });

  var _core = createCommonjsModule(function (module) {
  var core = module.exports = { version: '2.6.11' };
  if (typeof __e == 'number') { __e = core; } // eslint-disable-line no-undef
  });
  var _core_1 = _core.version;

  var _aFunction = function (it) {
    if (typeof it != 'function') { throw TypeError(it + ' is not a function!'); }
    return it;
  };

  // optional / simple context binding

  var _ctx = function (fn, that, length) {
    _aFunction(fn);
    if (that === undefined) { return fn; }
    switch (length) {
      case 1: return function (a) {
        return fn.call(that, a);
      };
      case 2: return function (a, b) {
        return fn.call(that, a, b);
      };
      case 3: return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
    }
    return function (/* ...args */) {
      return fn.apply(that, arguments);
    };
  };

  var _isObject = function (it) {
    return typeof it === 'object' ? it !== null : typeof it === 'function';
  };

  var _anObject = function (it) {
    if (!_isObject(it)) { throw TypeError(it + ' is not an object!'); }
    return it;
  };

  var _fails = function (exec) {
    try {
      return !!exec();
    } catch (e) {
      return true;
    }
  };

  // Thank's IE8 for his funny defineProperty
  var _descriptors = !_fails(function () {
    return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
  });

  var document$1 = _global.document;
  // typeof document.createElement is 'object' in old IE
  var is = _isObject(document$1) && _isObject(document$1.createElement);
  var _domCreate = function (it) {
    return is ? document$1.createElement(it) : {};
  };

  var _ie8DomDefine = !_descriptors && !_fails(function () {
    return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
  });

  // 7.1.1 ToPrimitive(input [, PreferredType])

  // instead of the ES6 spec version, we didn't implement @@toPrimitive case
  // and the second argument - flag - preferred type is a string
  var _toPrimitive = function (it, S) {
    if (!_isObject(it)) { return it; }
    var fn, val;
    if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) { return val; }
    if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) { return val; }
    if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) { return val; }
    throw TypeError("Can't convert object to primitive value");
  };

  var dP = Object.defineProperty;

  var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
    _anObject(O);
    P = _toPrimitive(P, true);
    _anObject(Attributes);
    if (_ie8DomDefine) { try {
      return dP(O, P, Attributes);
    } catch (e) { /* empty */ } }
    if ('get' in Attributes || 'set' in Attributes) { throw TypeError('Accessors not supported!'); }
    if ('value' in Attributes) { O[P] = Attributes.value; }
    return O;
  };

  var _objectDp = {
  	f: f
  };

  var _propertyDesc = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };

  var _hide = _descriptors ? function (object, key, value) {
    return _objectDp.f(object, key, _propertyDesc(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };

  var hasOwnProperty = {}.hasOwnProperty;
  var _has = function (it, key) {
    return hasOwnProperty.call(it, key);
  };

  var PROTOTYPE = 'prototype';

  var $export = function (type, name, source) {
    var IS_FORCED = type & $export.F;
    var IS_GLOBAL = type & $export.G;
    var IS_STATIC = type & $export.S;
    var IS_PROTO = type & $export.P;
    var IS_BIND = type & $export.B;
    var IS_WRAP = type & $export.W;
    var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
    var expProto = exports[PROTOTYPE];
    var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] : (_global[name] || {})[PROTOTYPE];
    var key, own, out;
    if (IS_GLOBAL) { source = name; }
    for (key in source) {
      // contains in native
      own = !IS_FORCED && target && target[key] !== undefined;
      if (own && _has(exports, key)) { continue; }
      // export native or passed
      out = own ? target[key] : source[key];
      // prevent global pollution for namespaces
      exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
      // bind timers to global for call from export context
      : IS_BIND && own ? _ctx(out, _global)
      // wrap global constructors for prevent change them in library
      : IS_WRAP && target[key] == out ? (function (C) {
        var F = function (a, b, c) {
          if (this instanceof C) {
            switch (arguments.length) {
              case 0: return new C();
              case 1: return new C(a);
              case 2: return new C(a, b);
            } return new C(a, b, c);
          } return C.apply(this, arguments);
        };
        F[PROTOTYPE] = C[PROTOTYPE];
        return F;
      // make static versions for prototype methods
      })(out) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
      // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
      if (IS_PROTO) {
        (exports.virtual || (exports.virtual = {}))[key] = out;
        // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
        if (type & $export.R && expProto && !expProto[key]) { _hide(expProto, key, out); }
      }
    }
  };
  // type bitmap
  $export.F = 1;   // forced
  $export.G = 2;   // global
  $export.S = 4;   // static
  $export.P = 8;   // proto
  $export.B = 16;  // bind
  $export.W = 32;  // wrap
  $export.U = 64;  // safe
  $export.R = 128; // real proto method for `library`
  var _export = $export;

  var _redefine = _hide;

  var _iterators = {};

  var toString = {}.toString;

  var _cof = function (it) {
    return toString.call(it).slice(8, -1);
  };

  // fallback for non-array-like ES3 and non-enumerable old V8 strings

  // eslint-disable-next-line no-prototype-builtins
  var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
    return _cof(it) == 'String' ? it.split('') : Object(it);
  };

  // to indexed object, toObject with fallback for non-array-like ES3 strings


  var _toIobject = function (it) {
    return _iobject(_defined(it));
  };

  // 7.1.15 ToLength

  var min = Math.min;
  var _toLength = function (it) {
    return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
  };

  var max = Math.max;
  var min$1 = Math.min;
  var _toAbsoluteIndex = function (index, length) {
    index = _toInteger(index);
    return index < 0 ? max(index + length, 0) : min$1(index, length);
  };

  // false -> Array#indexOf
  // true  -> Array#includes



  var _arrayIncludes = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = _toIobject($this);
      var length = _toLength(O.length);
      var index = _toAbsoluteIndex(fromIndex, length);
      var value;
      // Array#includes uses SameValueZero equality algorithm
      // eslint-disable-next-line no-self-compare
      if (IS_INCLUDES && el != el) { while (length > index) {
        value = O[index++];
        // eslint-disable-next-line no-self-compare
        if (value != value) { return true; }
      // Array#indexOf ignores holes, Array#includes - not
      } } else { for (;length > index; index++) { if (IS_INCLUDES || index in O) {
        if (O[index] === el) { return IS_INCLUDES || index || 0; }
      } } } return !IS_INCLUDES && -1;
    };
  };

  var _shared = createCommonjsModule(function (module) {
  var SHARED = '__core-js_shared__';
  var store = _global[SHARED] || (_global[SHARED] = {});

  (module.exports = function (key, value) {
    return store[key] || (store[key] = value !== undefined ? value : {});
  })('versions', []).push({
    version: _core.version,
    mode:  'pure' ,
    copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
  });
  });

  var id = 0;
  var px = Math.random();
  var _uid = function (key) {
    return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
  };

  var shared = _shared('keys');

  var _sharedKey = function (key) {
    return shared[key] || (shared[key] = _uid(key));
  };

  var arrayIndexOf = _arrayIncludes(false);
  var IE_PROTO = _sharedKey('IE_PROTO');

  var _objectKeysInternal = function (object, names) {
    var O = _toIobject(object);
    var i = 0;
    var result = [];
    var key;
    for (key in O) { if (key != IE_PROTO) { _has(O, key) && result.push(key); } }
    // Don't enum bug & hidden keys
    while (names.length > i) { if (_has(O, key = names[i++])) {
      ~arrayIndexOf(result, key) || result.push(key);
    } }
    return result;
  };

  // IE 8- don't enum bug keys
  var _enumBugKeys = (
    'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
  ).split(',');

  // 19.1.2.14 / 15.2.3.14 Object.keys(O)



  var _objectKeys = Object.keys || function keys(O) {
    return _objectKeysInternal(O, _enumBugKeys);
  };

  var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
    _anObject(O);
    var keys = _objectKeys(Properties);
    var length = keys.length;
    var i = 0;
    var P;
    while (length > i) { _objectDp.f(O, P = keys[i++], Properties[P]); }
    return O;
  };

  var document$2 = _global.document;
  var _html = document$2 && document$2.documentElement;

  // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])



  var IE_PROTO$1 = _sharedKey('IE_PROTO');
  var Empty = function () { /* empty */ };
  var PROTOTYPE$1 = 'prototype';

  // Create object with fake `null` prototype: use iframe Object with cleared prototype
  var createDict = function () {
    // Thrash, waste and sodomy: IE GC bug
    var iframe = _domCreate('iframe');
    var i = _enumBugKeys.length;
    var lt = '<';
    var gt = '>';
    var iframeDocument;
    iframe.style.display = 'none';
    _html.appendChild(iframe);
    iframe.src = 'javascript:'; // eslint-disable-line no-script-url
    // createDict = iframe.contentWindow.Object;
    // html.removeChild(iframe);
    iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
    iframeDocument.close();
    createDict = iframeDocument.F;
    while (i--) { delete createDict[PROTOTYPE$1][_enumBugKeys[i]]; }
    return createDict();
  };

  var _objectCreate = Object.create || function create(O, Properties) {
    var result;
    if (O !== null) {
      Empty[PROTOTYPE$1] = _anObject(O);
      result = new Empty();
      Empty[PROTOTYPE$1] = null;
      // add "__proto__" for Object.getPrototypeOf polyfill
      result[IE_PROTO$1] = O;
    } else { result = createDict(); }
    return Properties === undefined ? result : _objectDps(result, Properties);
  };

  var _wks = createCommonjsModule(function (module) {
  var store = _shared('wks');

  var Symbol = _global.Symbol;
  var USE_SYMBOL = typeof Symbol == 'function';

  var $exports = module.exports = function (name) {
    return store[name] || (store[name] =
      USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
  };

  $exports.store = store;
  });

  var def = _objectDp.f;

  var TAG = _wks('toStringTag');

  var _setToStringTag = function (it, tag, stat) {
    if (it && !_has(it = stat ? it : it.prototype, TAG)) { def(it, TAG, { configurable: true, value: tag }); }
  };

  var IteratorPrototype = {};

  // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
  _hide(IteratorPrototype, _wks('iterator'), function () { return this; });

  var _iterCreate = function (Constructor, NAME, next) {
    Constructor.prototype = _objectCreate(IteratorPrototype, { next: _propertyDesc(1, next) });
    _setToStringTag(Constructor, NAME + ' Iterator');
  };

  // 7.1.13 ToObject(argument)

  var _toObject = function (it) {
    return Object(_defined(it));
  };

  // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)


  var IE_PROTO$2 = _sharedKey('IE_PROTO');
  var ObjectProto = Object.prototype;

  var _objectGpo = Object.getPrototypeOf || function (O) {
    O = _toObject(O);
    if (_has(O, IE_PROTO$2)) { return O[IE_PROTO$2]; }
    if (typeof O.constructor == 'function' && O instanceof O.constructor) {
      return O.constructor.prototype;
    } return O instanceof Object ? ObjectProto : null;
  };

  var ITERATOR = _wks('iterator');
  var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
  var FF_ITERATOR = '@@iterator';
  var KEYS = 'keys';
  var VALUES = 'values';

  var returnThis = function () { return this; };

  var _iterDefine = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
    _iterCreate(Constructor, NAME, next);
    var getMethod = function (kind) {
      if (!BUGGY && kind in proto) { return proto[kind]; }
      switch (kind) {
        case KEYS: return function keys() { return new Constructor(this, kind); };
        case VALUES: return function values() { return new Constructor(this, kind); };
      } return function entries() { return new Constructor(this, kind); };
    };
    var TAG = NAME + ' Iterator';
    var DEF_VALUES = DEFAULT == VALUES;
    var VALUES_BUG = false;
    var proto = Base.prototype;
    var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
    var $default = $native || getMethod(DEFAULT);
    var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
    var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
    var methods, key, IteratorPrototype;
    // Fix native
    if ($anyNative) {
      IteratorPrototype = _objectGpo($anyNative.call(new Base()));
      if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
        // Set @@toStringTag to native iterators
        _setToStringTag(IteratorPrototype, TAG, true);
      }
    }
    // fix Array#{values, @@iterator}.name in V8 / FF
    if (DEF_VALUES && $native && $native.name !== VALUES) {
      VALUES_BUG = true;
      $default = function values() { return $native.call(this); };
    }
    // Define iterator
    if (( FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
      _hide(proto, ITERATOR, $default);
    }
    // Plug for library
    _iterators[NAME] = $default;
    _iterators[TAG] = returnThis;
    if (DEFAULT) {
      methods = {
        values: DEF_VALUES ? $default : getMethod(VALUES),
        keys: IS_SET ? $default : getMethod(KEYS),
        entries: $entries
      };
      if (FORCED) { for (key in methods) {
        if (!(key in proto)) { _redefine(proto, key, methods[key]); }
      } } else { _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods); }
    }
    return methods;
  };

  var $at = _stringAt(true);

  // 21.1.3.27 String.prototype[@@iterator]()
  _iterDefine(String, 'String', function (iterated) {
    this._t = String(iterated); // target
    this._i = 0;                // next index
  // 21.1.5.2.1 %StringIteratorPrototype%.next()
  }, function () {
    var O = this._t;
    var index = this._i;
    var point;
    if (index >= O.length) { return { value: undefined, done: true }; }
    point = $at(O, index);
    this._i += point.length;
    return { value: point, done: false };
  });

  var _iterStep = function (done, value) {
    return { value: value, done: !!done };
  };

  // 22.1.3.4 Array.prototype.entries()
  // 22.1.3.13 Array.prototype.keys()
  // 22.1.3.29 Array.prototype.values()
  // 22.1.3.30 Array.prototype[@@iterator]()
  var es6_array_iterator = _iterDefine(Array, 'Array', function (iterated, kind) {
    this._t = _toIobject(iterated); // target
    this._i = 0;                   // next index
    this._k = kind;                // kind
  // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
  }, function () {
    var O = this._t;
    var kind = this._k;
    var index = this._i++;
    if (!O || index >= O.length) {
      this._t = undefined;
      return _iterStep(1);
    }
    if (kind == 'keys') { return _iterStep(0, index); }
    if (kind == 'values') { return _iterStep(0, O[index]); }
    return _iterStep(0, [index, O[index]]);
  }, 'values');

  // argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
  _iterators.Arguments = _iterators.Array;

  var TO_STRING_TAG = _wks('toStringTag');

  var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
    'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
    'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
    'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
    'TextTrackList,TouchList').split(',');

  for (var i = 0; i < DOMIterables.length; i++) {
    var NAME = DOMIterables[i];
    var Collection = _global[NAME];
    var proto = Collection && Collection.prototype;
    if (proto && !proto[TO_STRING_TAG]) { _hide(proto, TO_STRING_TAG, NAME); }
    _iterators[NAME] = _iterators.Array;
  }

  // getting tag from 19.1.3.6 Object.prototype.toString()

  var TAG$1 = _wks('toStringTag');
  // ES3 wrong here
  var ARG = _cof(function () { return arguments; }()) == 'Arguments';

  // fallback for IE11 Script Access Denied error
  var tryGet = function (it, key) {
    try {
      return it[key];
    } catch (e) { /* empty */ }
  };

  var _classof = function (it) {
    var O, T, B;
    return it === undefined ? 'Undefined' : it === null ? 'Null'
      // @@toStringTag case
      : typeof (T = tryGet(O = Object(it), TAG$1)) == 'string' ? T
      // builtinTag case
      : ARG ? _cof(O)
      // ES3 arguments fallback
      : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
  };

  var _anInstance = function (it, Constructor, name, forbiddenField) {
    if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
      throw TypeError(name + ': incorrect invocation!');
    } return it;
  };

  // call something on iterator step with safe closing on error

  var _iterCall = function (iterator, fn, value, entries) {
    try {
      return entries ? fn(_anObject(value)[0], value[1]) : fn(value);
    // 7.4.6 IteratorClose(iterator, completion)
    } catch (e) {
      var ret = iterator['return'];
      if (ret !== undefined) { _anObject(ret.call(iterator)); }
      throw e;
    }
  };

  // check on default Array iterator

  var ITERATOR$1 = _wks('iterator');
  var ArrayProto = Array.prototype;

  var _isArrayIter = function (it) {
    return it !== undefined && (_iterators.Array === it || ArrayProto[ITERATOR$1] === it);
  };

  var ITERATOR$2 = _wks('iterator');

  var core_getIteratorMethod = _core.getIteratorMethod = function (it) {
    if (it != undefined) { return it[ITERATOR$2]
      || it['@@iterator']
      || _iterators[_classof(it)]; }
  };

  var _forOf = createCommonjsModule(function (module) {
  var BREAK = {};
  var RETURN = {};
  var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
    var iterFn = ITERATOR ? function () { return iterable; } : core_getIteratorMethod(iterable);
    var f = _ctx(fn, that, entries ? 2 : 1);
    var index = 0;
    var length, step, iterator, result;
    if (typeof iterFn != 'function') { throw TypeError(iterable + ' is not iterable!'); }
    // fast case for arrays with default iterator
    if (_isArrayIter(iterFn)) { for (length = _toLength(iterable.length); length > index; index++) {
      result = entries ? f(_anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
      if (result === BREAK || result === RETURN) { return result; }
    } } else { for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
      result = _iterCall(iterator, f, step.value, entries);
      if (result === BREAK || result === RETURN) { return result; }
    } }
  };
  exports.BREAK = BREAK;
  exports.RETURN = RETURN;
  });

  // 7.3.20 SpeciesConstructor(O, defaultConstructor)


  var SPECIES = _wks('species');
  var _speciesConstructor = function (O, D) {
    var C = _anObject(O).constructor;
    var S;
    return C === undefined || (S = _anObject(C)[SPECIES]) == undefined ? D : _aFunction(S);
  };

  // fast apply, http://jsperf.lnkit.com/fast-apply/5
  var _invoke = function (fn, args, that) {
    var un = that === undefined;
    switch (args.length) {
      case 0: return un ? fn()
                        : fn.call(that);
      case 1: return un ? fn(args[0])
                        : fn.call(that, args[0]);
      case 2: return un ? fn(args[0], args[1])
                        : fn.call(that, args[0], args[1]);
      case 3: return un ? fn(args[0], args[1], args[2])
                        : fn.call(that, args[0], args[1], args[2]);
      case 4: return un ? fn(args[0], args[1], args[2], args[3])
                        : fn.call(that, args[0], args[1], args[2], args[3]);
    } return fn.apply(that, args);
  };

  var process = _global.process;
  var setTask = _global.setImmediate;
  var clearTask = _global.clearImmediate;
  var MessageChannel = _global.MessageChannel;
  var Dispatch = _global.Dispatch;
  var counter = 0;
  var queue = {};
  var ONREADYSTATECHANGE = 'onreadystatechange';
  var defer, channel, port;
  var run = function () {
    var id = +this;
    // eslint-disable-next-line no-prototype-builtins
    if (queue.hasOwnProperty(id)) {
      var fn = queue[id];
      delete queue[id];
      fn();
    }
  };
  var listener = function (event) {
    run.call(event.data);
  };
  // Node.js 0.9+ & IE10+ has setImmediate, otherwise:
  if (!setTask || !clearTask) {
    setTask = function setImmediate(fn) {
      var arguments$1 = arguments;

      var args = [];
      var i = 1;
      while (arguments.length > i) { args.push(arguments$1[i++]); }
      queue[++counter] = function () {
        // eslint-disable-next-line no-new-func
        _invoke(typeof fn == 'function' ? fn : Function(fn), args);
      };
      defer(counter);
      return counter;
    };
    clearTask = function clearImmediate(id) {
      delete queue[id];
    };
    // Node.js 0.8-
    if (_cof(process) == 'process') {
      defer = function (id) {
        process.nextTick(_ctx(run, id, 1));
      };
    // Sphere (JS game engine) Dispatch API
    } else if (Dispatch && Dispatch.now) {
      defer = function (id) {
        Dispatch.now(_ctx(run, id, 1));
      };
    // Browsers with MessageChannel, includes WebWorkers
    } else if (MessageChannel) {
      channel = new MessageChannel();
      port = channel.port2;
      channel.port1.onmessage = listener;
      defer = _ctx(port.postMessage, port, 1);
    // Browsers with postMessage, skip WebWorkers
    // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
    } else if (_global.addEventListener && typeof postMessage == 'function' && !_global.importScripts) {
      defer = function (id) {
        _global.postMessage(id + '', '*');
      };
      _global.addEventListener('message', listener, false);
    // IE8-
    } else if (ONREADYSTATECHANGE in _domCreate('script')) {
      defer = function (id) {
        _html.appendChild(_domCreate('script'))[ONREADYSTATECHANGE] = function () {
          _html.removeChild(this);
          run.call(id);
        };
      };
    // Rest old browsers
    } else {
      defer = function (id) {
        setTimeout(_ctx(run, id, 1), 0);
      };
    }
  }
  var _task = {
    set: setTask,
    clear: clearTask
  };

  var macrotask = _task.set;
  var Observer = _global.MutationObserver || _global.WebKitMutationObserver;
  var process$1 = _global.process;
  var Promise$1 = _global.Promise;
  var isNode = _cof(process$1) == 'process';

  var _microtask = function () {
    var head, last, notify;

    var flush = function () {
      var parent, fn;
      if (isNode && (parent = process$1.domain)) { parent.exit(); }
      while (head) {
        fn = head.fn;
        head = head.next;
        try {
          fn();
        } catch (e) {
          if (head) { notify(); }
          else { last = undefined; }
          throw e;
        }
      } last = undefined;
      if (parent) { parent.enter(); }
    };

    // Node.js
    if (isNode) {
      notify = function () {
        process$1.nextTick(flush);
      };
    // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
    } else if (Observer && !(_global.navigator && _global.navigator.standalone)) {
      var toggle = true;
      var node = document.createTextNode('');
      new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
      notify = function () {
        node.data = toggle = !toggle;
      };
    // environments with maybe non-completely correct, but existent Promise
    } else if (Promise$1 && Promise$1.resolve) {
      // Promise.resolve without an argument throws an error in LG WebOS 2
      var promise = Promise$1.resolve(undefined);
      notify = function () {
        promise.then(flush);
      };
    // for other environments - macrotask based on:
    // - setImmediate
    // - MessageChannel
    // - window.postMessag
    // - onreadystatechange
    // - setTimeout
    } else {
      notify = function () {
        // strange IE + webpack dev server bug - use .call(global)
        macrotask.call(_global, flush);
      };
    }

    return function (fn) {
      var task = { fn: fn, next: undefined };
      if (last) { last.next = task; }
      if (!head) {
        head = task;
        notify();
      } last = task;
    };
  };

  // 25.4.1.5 NewPromiseCapability(C)


  function PromiseCapability(C) {
    var resolve, reject;
    this.promise = new C(function ($$resolve, $$reject) {
      if (resolve !== undefined || reject !== undefined) { throw TypeError('Bad Promise constructor'); }
      resolve = $$resolve;
      reject = $$reject;
    });
    this.resolve = _aFunction(resolve);
    this.reject = _aFunction(reject);
  }

  var f$1 = function (C) {
    return new PromiseCapability(C);
  };

  var _newPromiseCapability = {
  	f: f$1
  };

  var _perform = function (exec) {
    try {
      return { e: false, v: exec() };
    } catch (e) {
      return { e: true, v: e };
    }
  };

  var navigator$1 = _global.navigator;

  var _userAgent = navigator$1 && navigator$1.userAgent || '';

  var _promiseResolve = function (C, x) {
    _anObject(C);
    if (_isObject(x) && x.constructor === C) { return x; }
    var promiseCapability = _newPromiseCapability.f(C);
    var resolve = promiseCapability.resolve;
    resolve(x);
    return promiseCapability.promise;
  };

  var _redefineAll = function (target, src, safe) {
    for (var key in src) {
      if (safe && target[key]) { target[key] = src[key]; }
      else { _hide(target, key, src[key]); }
    } return target;
  };

  var SPECIES$1 = _wks('species');

  var _setSpecies = function (KEY) {
    var C = typeof _core[KEY] == 'function' ? _core[KEY] : _global[KEY];
    if (_descriptors && C && !C[SPECIES$1]) { _objectDp.f(C, SPECIES$1, {
      configurable: true,
      get: function () { return this; }
    }); }
  };

  var ITERATOR$3 = _wks('iterator');
  var SAFE_CLOSING = false;

  try {
    var riter = [7][ITERATOR$3]();
    riter['return'] = function () { SAFE_CLOSING = true; };
    // eslint-disable-next-line no-throw-literal
    Array.from(riter, function () { throw 2; });
  } catch (e) { /* empty */ }

  var _iterDetect = function (exec, skipClosing) {
    if (!skipClosing && !SAFE_CLOSING) { return false; }
    var safe = false;
    try {
      var arr = [7];
      var iter = arr[ITERATOR$3]();
      iter.next = function () { return { done: safe = true }; };
      arr[ITERATOR$3] = function () { return iter; };
      exec(arr);
    } catch (e) { /* empty */ }
    return safe;
  };

  var task = _task.set;
  var microtask = _microtask();




  var PROMISE = 'Promise';
  var TypeError$1 = _global.TypeError;
  var process$2 = _global.process;
  var versions = process$2 && process$2.versions;
  var v8 = versions && versions.v8 || '';
  var $Promise = _global[PROMISE];
  var isNode$1 = _classof(process$2) == 'process';
  var empty = function () { /* empty */ };
  var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
  var newPromiseCapability = newGenericPromiseCapability = _newPromiseCapability.f;

  var USE_NATIVE = !!function () {
    try {
      // correct subclassing with @@species support
      var promise = $Promise.resolve(1);
      var FakePromise = (promise.constructor = {})[_wks('species')] = function (exec) {
        exec(empty, empty);
      };
      // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
      return (isNode$1 || typeof PromiseRejectionEvent == 'function')
        && promise.then(empty) instanceof FakePromise
        // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
        // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
        // we can't detect it synchronously, so just check versions
        && v8.indexOf('6.6') !== 0
        && _userAgent.indexOf('Chrome/66') === -1;
    } catch (e) { /* empty */ }
  }();

  // helpers
  var isThenable = function (it) {
    var then;
    return _isObject(it) && typeof (then = it.then) == 'function' ? then : false;
  };
  var notify = function (promise, isReject) {
    if (promise._n) { return; }
    promise._n = true;
    var chain = promise._c;
    microtask(function () {
      var value = promise._v;
      var ok = promise._s == 1;
      var i = 0;
      var run = function (reaction) {
        var handler = ok ? reaction.ok : reaction.fail;
        var resolve = reaction.resolve;
        var reject = reaction.reject;
        var domain = reaction.domain;
        var result, then, exited;
        try {
          if (handler) {
            if (!ok) {
              if (promise._h == 2) { onHandleUnhandled(promise); }
              promise._h = 1;
            }
            if (handler === true) { result = value; }
            else {
              if (domain) { domain.enter(); }
              result = handler(value); // may throw
              if (domain) {
                domain.exit();
                exited = true;
              }
            }
            if (result === reaction.promise) {
              reject(TypeError$1('Promise-chain cycle'));
            } else if (then = isThenable(result)) {
              then.call(result, resolve, reject);
            } else { resolve(result); }
          } else { reject(value); }
        } catch (e) {
          if (domain && !exited) { domain.exit(); }
          reject(e);
        }
      };
      while (chain.length > i) { run(chain[i++]); } // variable length - can't use forEach
      promise._c = [];
      promise._n = false;
      if (isReject && !promise._h) { onUnhandled(promise); }
    });
  };
  var onUnhandled = function (promise) {
    task.call(_global, function () {
      var value = promise._v;
      var unhandled = isUnhandled(promise);
      var result, handler, console;
      if (unhandled) {
        result = _perform(function () {
          if (isNode$1) {
            process$2.emit('unhandledRejection', value, promise);
          } else if (handler = _global.onunhandledrejection) {
            handler({ promise: promise, reason: value });
          } else if ((console = _global.console) && console.error) {
            console.error('Unhandled promise rejection', value);
          }
        });
        // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
        promise._h = isNode$1 || isUnhandled(promise) ? 2 : 1;
      } promise._a = undefined;
      if (unhandled && result.e) { throw result.v; }
    });
  };
  var isUnhandled = function (promise) {
    return promise._h !== 1 && (promise._a || promise._c).length === 0;
  };
  var onHandleUnhandled = function (promise) {
    task.call(_global, function () {
      var handler;
      if (isNode$1) {
        process$2.emit('rejectionHandled', promise);
      } else if (handler = _global.onrejectionhandled) {
        handler({ promise: promise, reason: promise._v });
      }
    });
  };
  var $reject = function (value) {
    var promise = this;
    if (promise._d) { return; }
    promise._d = true;
    promise = promise._w || promise; // unwrap
    promise._v = value;
    promise._s = 2;
    if (!promise._a) { promise._a = promise._c.slice(); }
    notify(promise, true);
  };
  var $resolve = function (value) {
    var promise = this;
    var then;
    if (promise._d) { return; }
    promise._d = true;
    promise = promise._w || promise; // unwrap
    try {
      if (promise === value) { throw TypeError$1("Promise can't be resolved itself"); }
      if (then = isThenable(value)) {
        microtask(function () {
          var wrapper = { _w: promise, _d: false }; // wrap
          try {
            then.call(value, _ctx($resolve, wrapper, 1), _ctx($reject, wrapper, 1));
          } catch (e) {
            $reject.call(wrapper, e);
          }
        });
      } else {
        promise._v = value;
        promise._s = 1;
        notify(promise, false);
      }
    } catch (e) {
      $reject.call({ _w: promise, _d: false }, e); // wrap
    }
  };

  // constructor polyfill
  if (!USE_NATIVE) {
    // 25.4.3.1 Promise(executor)
    $Promise = function Promise(executor) {
      _anInstance(this, $Promise, PROMISE, '_h');
      _aFunction(executor);
      Internal.call(this);
      try {
        executor(_ctx($resolve, this, 1), _ctx($reject, this, 1));
      } catch (err) {
        $reject.call(this, err);
      }
    };
    // eslint-disable-next-line no-unused-vars
    Internal = function Promise(executor) {
      this._c = [];             // <- awaiting reactions
      this._a = undefined;      // <- checked in isUnhandled reactions
      this._s = 0;              // <- state
      this._d = false;          // <- done
      this._v = undefined;      // <- value
      this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
      this._n = false;          // <- notify
    };
    Internal.prototype = _redefineAll($Promise.prototype, {
      // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
      then: function then(onFulfilled, onRejected) {
        var reaction = newPromiseCapability(_speciesConstructor(this, $Promise));
        reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
        reaction.fail = typeof onRejected == 'function' && onRejected;
        reaction.domain = isNode$1 ? process$2.domain : undefined;
        this._c.push(reaction);
        if (this._a) { this._a.push(reaction); }
        if (this._s) { notify(this, false); }
        return reaction.promise;
      },
      // 25.4.5.1 Promise.prototype.catch(onRejected)
      'catch': function (onRejected) {
        return this.then(undefined, onRejected);
      }
    });
    OwnPromiseCapability = function () {
      var promise = new Internal();
      this.promise = promise;
      this.resolve = _ctx($resolve, promise, 1);
      this.reject = _ctx($reject, promise, 1);
    };
    _newPromiseCapability.f = newPromiseCapability = function (C) {
      return C === $Promise || C === Wrapper
        ? new OwnPromiseCapability(C)
        : newGenericPromiseCapability(C);
    };
  }

  _export(_export.G + _export.W + _export.F * !USE_NATIVE, { Promise: $Promise });
  _setToStringTag($Promise, PROMISE);
  _setSpecies(PROMISE);
  Wrapper = _core[PROMISE];

  // statics
  _export(_export.S + _export.F * !USE_NATIVE, PROMISE, {
    // 25.4.4.5 Promise.reject(r)
    reject: function reject(r) {
      var capability = newPromiseCapability(this);
      var $$reject = capability.reject;
      $$reject(r);
      return capability.promise;
    }
  });
  _export(_export.S + _export.F * (_library ), PROMISE, {
    // 25.4.4.6 Promise.resolve(x)
    resolve: function resolve(x) {
      return _promiseResolve( this === Wrapper ? $Promise : this, x);
    }
  });
  _export(_export.S + _export.F * !(USE_NATIVE && _iterDetect(function (iter) {
    $Promise.all(iter)['catch'](empty);
  })), PROMISE, {
    // 25.4.4.1 Promise.all(iterable)
    all: function all(iterable) {
      var C = this;
      var capability = newPromiseCapability(C);
      var resolve = capability.resolve;
      var reject = capability.reject;
      var result = _perform(function () {
        var values = [];
        var index = 0;
        var remaining = 1;
        _forOf(iterable, false, function (promise) {
          var $index = index++;
          var alreadyCalled = false;
          values.push(undefined);
          remaining++;
          C.resolve(promise).then(function (value) {
            if (alreadyCalled) { return; }
            alreadyCalled = true;
            values[$index] = value;
            --remaining || resolve(values);
          }, reject);
        });
        --remaining || resolve(values);
      });
      if (result.e) { reject(result.v); }
      return capability.promise;
    },
    // 25.4.4.4 Promise.race(iterable)
    race: function race(iterable) {
      var C = this;
      var capability = newPromiseCapability(C);
      var reject = capability.reject;
      var result = _perform(function () {
        _forOf(iterable, false, function (promise) {
          C.resolve(promise).then(capability.resolve, reject);
        });
      });
      if (result.e) { reject(result.v); }
      return capability.promise;
    }
  });

  _export(_export.P + _export.R, 'Promise', { 'finally': function (onFinally) {
    var C = _speciesConstructor(this, _core.Promise || _global.Promise);
    var isFunction = typeof onFinally == 'function';
    return this.then(
      isFunction ? function (x) {
        return _promiseResolve(C, onFinally()).then(function () { return x; });
      } : onFinally,
      isFunction ? function (e) {
        return _promiseResolve(C, onFinally()).then(function () { throw e; });
      } : onFinally
    );
  } });

  // https://github.com/tc39/proposal-promise-try




  _export(_export.S, 'Promise', { 'try': function (callbackfn) {
    var promiseCapability = _newPromiseCapability.f(this);
    var result = _perform(callbackfn);
    (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
    return promiseCapability.promise;
  } });

  var promise = _core.Promise;

  var promise$1 = createCommonjsModule(function (module) {
  module.exports = { "default": promise, __esModule: true };
  });

  unwrapExports(promise$1);

  // 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
  _export(_export.S + _export.F * !_descriptors, 'Object', { defineProperty: _objectDp.f });

  var $Object = _core.Object;
  var defineProperty = function defineProperty(it, key, desc) {
    return $Object.defineProperty(it, key, desc);
  };

  var defineProperty$1 = createCommonjsModule(function (module) {
  module.exports = { "default": defineProperty, __esModule: true };
  });

  unwrapExports(defineProperty$1);

  var defineProperty$2 = createCommonjsModule(function (module, exports) {

  exports.__esModule = true;



  var _defineProperty2 = _interopRequireDefault(defineProperty$1);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  exports.default = function (obj, key, value) {
    if (key in obj) {
      (0, _defineProperty2.default)(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  };
  });

  unwrapExports(defineProperty$2);

  var f$2 = Object.getOwnPropertySymbols;

  var _objectGops = {
  	f: f$2
  };

  var f$3 = {}.propertyIsEnumerable;

  var _objectPie = {
  	f: f$3
  };

  // 19.1.2.1 Object.assign(target, source, ...)






  var $assign = Object.assign;

  // should work with symbols and should have deterministic property order (V8 bug)
  var _objectAssign = !$assign || _fails(function () {
    var A = {};
    var B = {};
    // eslint-disable-next-line no-undef
    var S = Symbol();
    var K = 'abcdefghijklmnopqrst';
    A[S] = 7;
    K.split('').forEach(function (k) { B[k] = k; });
    return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
  }) ? function assign(target, source) {
    var arguments$1 = arguments;
   // eslint-disable-line no-unused-vars
    var T = _toObject(target);
    var aLen = arguments.length;
    var index = 1;
    var getSymbols = _objectGops.f;
    var isEnum = _objectPie.f;
    while (aLen > index) {
      var S = _iobject(arguments$1[index++]);
      var keys = getSymbols ? _objectKeys(S).concat(getSymbols(S)) : _objectKeys(S);
      var length = keys.length;
      var j = 0;
      var key;
      while (length > j) {
        key = keys[j++];
        if (!_descriptors || isEnum.call(S, key)) { T[key] = S[key]; }
      }
    } return T;
  } : $assign;

  // 19.1.3.1 Object.assign(target, source)


  _export(_export.S + _export.F, 'Object', { assign: _objectAssign });

  var assign = _core.Object.assign;

  var assign$1 = createCommonjsModule(function (module) {
  module.exports = { "default": assign, __esModule: true };
  });

  unwrapExports(assign$1);

  var vueTypeahead_common = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });



  var _promise2 = _interopRequireDefault(promise$1);



  var _defineProperty3 = _interopRequireDefault(defineProperty$2);



  var _assign2 = _interopRequireDefault(assign$1);



  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  exports.default = {
    data: function data() {
      return {
        items: [],
        query: '',
        current: -1,
        loading: false,
        selectFirst: false,
        queryParamName: 'q'
      };
    },


    computed: {
      hasItems: function hasItems() {
        return this.items.length > 0;
      },
      isEmpty: function isEmpty() {
        return !this.query;
      },
      isDirty: function isDirty() {
        return !!this.query;
      }
    },

    methods: {
      update: function update() {
        var _this = this;

        this.cancel();

        if (!this.query) {
          return this.reset();
        }

        if (this.minChars && this.query.length < this.minChars) {
          return;
        }

        this.loading = true;

        this.fetch().then(function (response) {
          if (response && _this.query) {
            var data = response.data;
            data = _this.prepareResponseData ? _this.prepareResponseData(data) : data;
            _this.items = _this.limit ? data.slice(0, _this.limit) : data;
            _this.current = -1;
            _this.loading = false;

            if (_this.selectFirst) {
              _this.down();
            }
          }
        });
      },
      fetch: function fetch() {
        var _this2 = this;

        if (!this.$http) {
          return vue.util.warn('You need to provide a HTTP client', this);
        }

        if (!this.src) {
          return vue.util.warn('You need to set the `src` property', this);
        }

        var src = this.queryParamName ? this.src : this.src + this.query;

        var params = this.queryParamName ? (0, _assign2.default)((0, _defineProperty3.default)({}, this.queryParamName, this.query), this.data) : this.data;

        var cancel = new _promise2.default(function (resolve) {
          return _this2.cancel = resolve;
        });
        var request = this.$http.get(src, { params: params });

        return _promise2.default.race([cancel, request]);
      },
      cancel: function cancel() {},
      reset: function reset() {
        this.items = [];
        this.query = '';
        this.loading = false;
      },
      setActive: function setActive(index) {
        this.current = index;
      },
      activeClass: function activeClass(index) {
        return {
          active: this.current === index
        };
      },
      hit: function hit() {
        if (this.current !== -1) {
          this.onHit(this.items[this.current]);
        }
      },
      up: function up() {
        if (this.current > 0) {
          this.current--;
        } else if (this.current === -1) {
          this.current = this.items.length - 1;
        } else {
          this.current = -1;
        }
      },
      down: function down() {
        if (this.current < this.items.length - 1) {
          this.current++;
        } else {
          this.current = -1;
        }
      },
      onHit: function onHit() {
        vue.util.warn('You need to implement the `onHit` method', this);
      }
    }
  };
  });

  var VueTypeahead = unwrapExports(vueTypeahead_common);

  //

  var script$3 = {
    extends: VueTypeahead, // vue@1.0.22+
    // mixins: [VueTypeahead], // vue@1.0.21-

    data: function data () {
      return {
        // The source url
        // (required)
        src: '...',

        // The data that would be sent by request
        // (optional)
        data: {},

        // Limit the number of items which is shown at the list
        // (optional)
        limit: 5,

        // The minimum character length needed before triggering
        // (optional)
        minChars: 3,

        // Highlight the first item in the list
        // (optional)
        selectFirst: false,

        // Override the default value (`q`) of query parameter name
        // Use a falsy value for RESTful query
        // (optional)
        queryParamName: 'search'
      }
    },

    methods: {
      // The callback function which is triggered when the user hits on an item
      // (required)
      onHit: function onHit (item) {
        // alert(item)
      },

      // The callback function which is triggered when the response data are received
      // (optional)
      prepareResponseData: function prepareResponseData (data) {
        // data = ...
        return data
      }
    }
  };

  /* script */
  var __vue_script__$5 = script$3;

  /* template */
  var __vue_render__$4 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      [
        _vm.loading
          ? _c("i", { staticClass: "fa fa-spinner fa-spin" })
          : [
              _c("i", {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value: _vm.isEmpty,
                    expression: "isEmpty"
                  }
                ],
                staticClass: "fa fa-search"
              }),
              _vm._v(" "),
              _c("i", {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value: _vm.isDirty,
                    expression: "isDirty"
                  }
                ],
                staticClass: "fa fa-times",
                on: { click: _vm.reset }
              })
            ],
        _vm._v(" "),
        _c("input", {
          directives: [
            {
              name: "model",
              rawName: "v-model",
              value: _vm.query,
              expression: "query"
            }
          ],
          attrs: { type: "text", placeholder: "...", autocomplete: "off" },
          domProps: { value: _vm.query },
          on: {
            keydown: [
              function($event) {
                if (
                  !$event.type.indexOf("key") &&
                  _vm._k($event.keyCode, "down", 40, $event.key, [
                    "Down",
                    "ArrowDown"
                  ])
                ) {
                  return null
                }
                return _vm.down($event)
              },
              function($event) {
                if (
                  !$event.type.indexOf("key") &&
                  _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])
                ) {
                  return null
                }
                return _vm.up($event)
              },
              function($event) {
                if (
                  !$event.type.indexOf("key") &&
                  _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")
                ) {
                  return null
                }
                return _vm.hit($event)
              },
              function($event) {
                if (
                  !$event.type.indexOf("key") &&
                  _vm._k($event.keyCode, "esc", 27, $event.key, ["Esc", "Escape"])
                ) {
                  return null
                }
                return _vm.reset($event)
              }
            ],
            blur: _vm.reset,
            input: [
              function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.query = $event.target.value;
              },
              _vm.update
            ]
          }
        }),
        _vm._v(" "),
        _c(
          "ul",
          {
            directives: [
              {
                name: "show",
                rawName: "v-show",
                value: _vm.hasItems,
                expression: "hasItems"
              }
            ]
          },
          _vm._l(_vm.items, function(item, $item) {
            return _c(
              "li",
              {
                class: _vm.activeClass($item),
                on: {
                  mousedown: _vm.hit,
                  mousemove: function($event) {
                    return _vm.setActive($item)
                  }
                }
              },
              [_c("span", { domProps: { textContent: _vm._s(item.name) } })]
            )
          }),
          0
        )
      ],
      2
    )
  };
  var __vue_staticRenderFns__$4 = [];
  __vue_render__$4._withStripped = true;

    /* style */
    var __vue_inject_styles__$5 = undefined;
    /* scoped */
    var __vue_scope_id__$5 = undefined;
    /* module identifier */
    var __vue_module_identifier__$5 = undefined;
    /* functional template */
    var __vue_is_functional_template__$5 = false;
    /* style inject */
    
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var __vue_component__$1 = normalizeComponent$1(
      { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
      __vue_inject_styles__$5,
      __vue_script__$5,
      __vue_scope_id__$5,
      __vue_is_functional_template__$5,
      __vue_module_identifier__$5,
      false,
      undefined,
      undefined,
      undefined
    );

  var plugin = {
    install: install$1,
    DualTreeview: __vue_component__,
    Typeahead: __vue_component__$1
  };

  (function (plugin) {
    if (typeof window !== 'undefined' && window.Vue) {
      Vue.use(plugin);
    }
  })(plugin);

  function install$1(Vue, options) {
    Vue.component(__vue_component__.name, __vue_component__);
    Vue.component(__vue_component__$1.name, __vue_component__$1);
  }

  exports.default = plugin;
  exports.install = install$1;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=main.umd.js.map
