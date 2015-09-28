/*
 * Copyright 2015 ThoughtWorks, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


define(['mithril', 'string-plus', '../models/model_mixins', 'foundation.dropdown'], function (m, s, Mixin) {

  var deleteKeyAndReturnValue = function (object, key, defaultValue) {
    var value = object[key];
    delete object[key];
    return value || defaultValue;
  };

  var coerceToMprop = function (param, defaultValue) {
    return typeof param === 'function' ? param : m.prop(typeof param === 'undefined' ? defaultValue : param);
  };

  var compactClasses = function (args) {
    var initialClasses = [].slice.call(arguments, 1);
    return _([initialClasses, args.class, args.className]).flatten().compact().join(' ');
  };

  var foundationReflow = function (component) {
    return function (elem, isInitialized) {
      $(document).foundation(component, 'reflow');
    };
  };

  var f = {
    row: {
      view: function (ctrl, args, children) {
        var classes = _.compact(['row', deleteKeyAndReturnValue(args, 'class'), deleteKeyAndReturnValue(args, 'className')]);

        if (deleteKeyAndReturnValue(args, 'collapse')) {
          classes.push('collapse');
        }

        return (
          {tag: "div", attrs: Object.assign({class:classes.join(' ')},  args), children: [
            children
          ]}
        );
      }
    },

    column: {
      view: function (ctrl, args, children) {
        return (
          {tag: "div", attrs: {class:compactClasses(args, 'columns', "small-" + (args.size || 6), args.end ? 'end' : null)}, children: [
            children
          ]}
        );
      }
    },

    label: {
      view: function (ctrl, args, children) {
        var labelOpts = _({
          'for': args.for
        }).omit(_.isUndefined).omit(_.isNull).value();

        if (!args.size) {
          args.size = 3;
        }

        return (
          m.component(f.column, Object.assign({},  args), [
            {tag: "label", attrs: Object.assign({},  labelOpts,{class:"right inline"}), children: [children]}
          ])
        );
      }
    },

    input: {
      view: function (ctrl, args) {
        var model       = deleteKeyAndReturnValue(args, 'model'),
            attrName    = deleteKeyAndReturnValue(args, 'attrName'),
            type        = deleteKeyAndReturnValue(args, 'type', 'text'),
            placeHolder = deleteKeyAndReturnValue(args, 'placeHolder', ''),
            onchange    = deleteKeyAndReturnValue(args, 'onchange', _.noop),
            modelType   = deleteKeyAndReturnValue(args, 'modelType', (model.constructor ? model.constructor.modelType : null));

        if (!args.size) {
          args.size = 3;
        }

        var propertyError;

        if (model.validate) {
          var errors = model.validate();
          if (errors.errors(attrName)) {
            propertyError = ({tag: "small", attrs: {class:"error"}, children: [errors.errorsForDisplay(attrName)]});
          }
        }


        var onInput = function (e) {
          m.withAttr('value', model[attrName])(e);
          onchange();
        };

        return (
          m.component(f.column, Object.assign({},  args), [
            {tag: "label", attrs: {className:propertyError ? 'error' : ''}, children: [
              {tag: "input", attrs: {
                "data-prop-name":attrName, 
                "data-model-type":modelType, 
                value:model[attrName](), 
                type:type, 
                placeholder:placeHolder, 
                oninput:onInput}}
            ]}, 
            propertyError
          ])
        );
      }
    },

    inputWithLabel: {
      view: function (ctrl, args) {
        var model       = deleteKeyAndReturnValue(args, 'model'),
            attrName    = deleteKeyAndReturnValue(args, 'attrName'),
            type        = deleteKeyAndReturnValue(args, 'type', 'text'),
            placeHolder = deleteKeyAndReturnValue(args, 'placeHolder', ''),
            labelText   = deleteKeyAndReturnValue(args, 'label'),
            onchange    = deleteKeyAndReturnValue(args, 'onchange', _.noop),
            tooltip     = deleteKeyAndReturnValue(args, 'tooltip'),
            modelType   = deleteKeyAndReturnValue(args, 'modelType', (model.constructor ? model.constructor.modelType : null));

        if (!args.size) {
          args.size = 3;
        }

        var propertyError;
        if (model.validate) {
          var errors = model.validate();
          if (errors.errors(attrName)) {
            propertyError = ({tag: "small", attrs: {class:"error"}, children: [errors.errorsForDisplay(attrName)]});
          }
        }

        var onInput = function (e) {
          m.withAttr('value', model[attrName])(e);
          onchange();
        };

        return (
          m.component(f.column, Object.assign({},  args,{class:propertyError ? 'error' : null}), [
            {tag: "label", attrs: {className:_.compact([propertyError ? 'error' : null, tooltip ? 'has-tooltip' : null]).join(' ')}, children: [
              labelText || s.humanize(attrName)
            ]}, 

            m.component(f.tooltip, {tooltip:tooltip, model:model, attrName:attrName}), 

            {tag: "input", attrs: {
              "data-prop-name":attrName, 
              "data-model-type":modelType, 
              value:model[attrName](), 
              type:type, 
              placeholder:placeHolder, 
              oninput:onInput}}, 
            propertyError
          ])
        );
      }
    },

    checkBox: {
      view: function (ctrl, args) {
        var model     = deleteKeyAndReturnValue(args, 'model'),
            attrName  = deleteKeyAndReturnValue(args, 'attrName'),
            labelText = deleteKeyAndReturnValue(args, 'label'),
            disabled  = deleteKeyAndReturnValue(args, 'disabled'),
            tooltip   = deleteKeyAndReturnValue(args, 'tooltip'),
            id        = s.uuid(),
            modelType = deleteKeyAndReturnValue(args, 'modelType', (model.constructor ? model.constructor.modelType : null));

        if (!args.size) {
          args.size = 3;
        }

        return (
          m.component(f.column, Object.assign({},  args), [
            {tag: "div", attrs: {class:"switch tiny round inline"}, children: [
              {tag: "input", attrs: {type:"checkbox", 
                     "data-prop-name":attrName, 
                     "data-model-type":modelType, 
                     id:id, 
                     disabled:disabled, 
                     checked:model[attrName](), 
                     onchange:m.withAttr('checked', model[attrName])}}, 
              {tag: "label", attrs: {for:id}}
            ]}, 

            {tag: "label", attrs: {class:_.compact(['inline', tooltip ? 'has-tooltip' : null]).join(' '), for:id}, children: [
              labelText || s.humanize(attrName)
            ]}, 

            m.component(f.tooltip, {tooltip:tooltip, model:model, attrName:attrName})
          ])
        );
      }
    },

    tabs: {
      controller: function (args) {
        this.selectedIndex = coerceToMprop(args.selectedIndex || 0);
      },

      view: function (ctrl, args, children) {
        var componentClass = compactClasses(args);

        var prefixedClass = function (suffix) {
          if (!s.isBlank(componentClass)) {
            return componentClass + '-' + suffix;
          }
        };

        var classNameForTab = function (tabIndex) {
          return ctrl.selectedIndex() === tabIndex ? 'active' : '';
        };

        var tabs = (
          {tag: "ul", attrs: {class:_.compact(['tabs', args.isVertical ? 'vertical': undefined]).join(' ')}, children: [
            _.map(args.tabTitles, function (tabTitle, tabIndex) {

              var tabTitleElem;

              if (s.isBlank(tabTitle)) {
                tabTitleElem = ({tag: "a", attrs: {href:"javascript:void(0)"}, children: [m.trust('&nbsp;')]});
              }
              else if (_.isString(tabTitle)) {
                tabTitleElem = ({tag: "a", attrs: {href:"javascript:void(0)"}, children: [tabTitle]});
              } else {
                tabTitleElem = tabTitle;
              }

              return (
                {tag: "li", attrs: {
                  class:_.compact(['tab-title', classNameForTab(tabIndex), prefixedClass('tab-title')]).join(' '), 
                  onclick:ctrl.selectedIndex.bind(ctrl, tabIndex), 
                  key:args.tabKeys[tabIndex]}, children: [
                  tabTitleElem
                ]}
              );
            })
          ]}
        );

        var tabsContent = (
          {tag: "div", attrs: {
            class:_.compact(['tabs-content', 'tabs-content-container', prefixedClass('tabs-content-container')]).join(' ')}, children: [
            _.map(_.flatten(children), function (child, tabIndex) {
              return (
                {tag: "div", attrs: {
                  class:_.compact(['content', classNameForTab(tabIndex), prefixedClass('tab-content')]).join(' ')}, children: [
                  child
                ]}
              );
            })
          ]}
        );

        var tabContainer = (
          {tag: "div", attrs: {class:_.compact(['tab-container', prefixedClass('tab-container')]).join(' ')}, children: [
            tabs, 
            tabsContent
          ]}
        );

        if (args.isVertical) {
          return (
            m.component(f.row, {class:componentClass}, [
              m.component(f.column, {size:12, end:true}, [
                tabContainer
              ])
            ])
          );
        } else {
          return (
            {tag: "div", attrs: {class:componentClass}, children: [
              tabContainer
            ]}
          );
        }
      }
    },

    select: {
      controller: function (args) {
        this.value = coerceToMprop(args.value, '');
      },

      view: function (ctrl, args) {
        return (
          {tag: "select", attrs: {value:ctrl.value(), 
                  onchange:m.withAttr('value', ctrl.value), 
                  class:s.defaultToIfBlank(args.selectClass, '')}, children: [
            _.map(s.defaultToIfBlank(args.items, {}), function (text, value) {
              return (
                {tag: "option", attrs: {value:value, selected:value === ctrl.value()}, children: [text]}
              );
            })
          ]}
        );
      }
    },

    accordion: {
      controller: function (args) {
        this.selectedIndex = Mixin.TogglingGetterSetter(coerceToMprop(args.selectedIndex || 0));
      },

      view: function (ctrl, args, children) {
        var maybeActiveClass = function (index) {
          return ctrl.selectedIndex() === index ? 'active' : '';
        };

        return (
          {tag: "dl", attrs: {class:compactClasses(args, 'accordion')}, children: [
            _.map(_.flatten(children), function (child, index) {
              return (
                {tag: "dd", attrs: {class:_.compact(['accordion-navigation', maybeActiveClass(index)]).join(' '), 
                    key:args.accordionKeys[index]}, children: [
                  {tag: "a", attrs: {href:"javascript:void(0)", 
                     onclick:ctrl.selectedIndex.bind(ctrl, index)}, children: [
                    args.accordionTitles[index]
                  ]}, 

                  {tag: "div", attrs: {class:_.compact(['content', maybeActiveClass(index)]).join(' ')}, children: [
                    child
                  ]}
                ]}
              );
            })
          ]}
        );
      }
    },

    removeButton: {
      view: function (ctrl, args, children) {
        return (
          {tag: "a", attrs: {href:"javascript:void(0)", 
             class:compactClasses(args, 'remove'), 
             onclick:args.onclick}, children: [children]}
        );
      }
    },

    tooltip: {
      view: function (ctrl, args, children) {
        if (!args.tooltip && _.isEmpty(children)) {
          return {tag: "noscript", attrs: {}};
        }

        var direction = deleteKeyAndReturnValue(args.tooltip, 'direction', 'bottom'),
            size      = deleteKeyAndReturnValue(args.tooltip, 'size', 'medium'),
            content   = deleteKeyAndReturnValue(args.tooltip, 'content', children),
            tooltipId = 'help-tooltip-';

        if (args.model && args.model.uuid) {
          tooltipId += (args.model.uuid() + '-' + args.attrName);
        } else {
          tooltipId += s.uuid();
        }

        return (
          {tag: "span", attrs: {class:"tooltip-wrapper", config:foundationReflow('dropdown')}, children: [
            {tag: "a", attrs: {href:"javascript:void(0)", 
               "data-dropdown":tooltipId, 
               "data-options":'is_hover: true; hover_timeout: 400; align: ' + direction, 
               class:"tooltip-question-mark"}}, 
            {tag: "div", attrs: {id:tooltipId, "data-dropdown-content":true,
                 class:_.compact(['f-dropdown', 'content', 'tooltip-content', size]).join(' ')}, children: [
              content
            ]}
          ]}
        );
      }
    }
  };

  return f;
});
