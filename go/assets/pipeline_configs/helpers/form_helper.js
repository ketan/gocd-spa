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


define(['mithril', 'string-plus'], function (m, s) {

  var deleteKeyAndReturnValue = function (object, key, defaultValue) {
    var value = object[key];
    delete object[key];
    return value || defaultValue;
  };

  var coerceToMprop = function (param, defaultValue) {
    return typeof param === 'function' ? param : m.prop(typeof param === 'undefined' ? defaultValue : param);
  };

  var f = {
    uuid: s.uuid,

    row: {
      view: function (ctrl, args, children) {
        var classes = _.compact(['row', deleteKeyAndReturnValue(args, 'class'), deleteKeyAndReturnValue(args, 'className')]);

        if (args.collapse) {
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
        var classes = _.compact(['columns', args['class'], args.className]);
        classes.push("small-" + (args.size || 6));

        if (args.end) {
          classes.push('end');
        }

        return (
          {tag: "div", attrs: {class:classes.join(' ')}, children: [
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

        labelText = labelText || s.humanize(attrName);

        return (
          m.component(f.column, Object.assign({},  args), [
            {tag: "label", attrs: {className:propertyError ? 'error' : ''}, children: [
              labelText, 
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

    checkBox: {
      view: function (ctrl, args) {
        var model     = deleteKeyAndReturnValue(args, 'model'),
            attrName  = deleteKeyAndReturnValue(args, 'attrName'),
            labelText = deleteKeyAndReturnValue(args, 'label'),
            disabled  = deleteKeyAndReturnValue(args, 'disabled'),
            id        = f.uuid(),
            modelType = deleteKeyAndReturnValue(args, 'modelType', (model.constructor ? model.constructor.modelType : null));

        if (!args.size) {
          args.size = 3;
        }


        labelText = labelText || s.humanize(attrName);

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
            {tag: "label", attrs: {class:"inline", for:id}, children: [labelText]}
          ])
        );
      }
    },

    tabs: {
      controller: function (args) {
        this.tabTitles        = m.prop(args.tabTitles);
        this.selectedTabIndex = m.prop(args.selectedTabIndex || 0);

        this.selectTabWithIndex = function (index, e) {
          this.selectedTabIndex(index);
          e.preventDefault();
        };
      },

      view: function (ctrl, args, children) {
        var classNameForTab = function (tabIndex) {
          return ctrl.selectedTabIndex() === tabIndex ? 'active' : '';
        };

        return (
          {tag: "div", attrs: {}, children: [
            {tag: "ul", attrs: {class:"tabs", "data-tab":true}, children: [
              _.map(ctrl.tabTitles(), function (tabTitle, tabIndex) {
                return (
                  {tag: "li", attrs: {
                    class:'tab-title ' + classNameForTab(tabIndex), 
                    onclick:ctrl.selectTabWithIndex.bind(ctrl, tabIndex)}, children: [
                    {tag: "a", attrs: {href:"javascript:void(0)"}, children: [tabTitle]}
                  ]}
                );
              })
            ]}, 
            {tag: "div", attrs: {class:"tabs-content"}, children: [
              _.map(children, function (child, tabIndex) {
                return (
                  {tag: "div", attrs: {class:'content ' + classNameForTab(tabIndex)}, children: [
                    child
                  ]}
                );
              })
            ]}
          ]}
        );
      }
    },

    select: {
      controller: function (args) {
        this.value = coerceToMprop(args.value, '');
        this.items = s.defaultToIfBlank(args.items, {});
      },

      view: function (ctrl, args) {
        return (
          {tag: "select", attrs: {value:ctrl.value(), 
                  onchange:m.withAttr('value', ctrl.value), 
                  class:s.defaultToIfBlank(args.selectClass, '')}, children: [
            _.map(ctrl.items, function (text, value) {
              return (
                {tag: "option", attrs: {value:value, selected:value === ctrl.value()}, children: [text]}
              );
            })
          ]}
        );
      }
    }
  };
  return f;
});
