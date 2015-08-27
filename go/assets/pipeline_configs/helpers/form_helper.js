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


define(['mithril', 'string'], function (m, s) {

  var deleteKeyAndReturnValue = function (object, key, defaultValue) {
    var value = object[key];
    delete object[key];
    return value || defaultValue;
  };

  var f = {
    uuid: function guid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }

      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    },

    row: {
      view: function (ctrl, args, children) {
        var classes = _.compact(['row', args['class'], args.className]);

        if (args.collapse) {
          classes.push('collapse');
        }

        return (
          {tag: "div", attrs: {class:classes.join(' ')}, children: [
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

    text: {
      view: function (ctrl, args, children) {

        if (!args.size) {
          args.size = 3;
        }

        return (
          m.component(f.column, Object.assign({},  args), [
            {tag: "span", attrs: {}, children: [children]}
          ])
        );
      }
    },

    input: {
      view: function (ctrl, args, children) {
        var model       = deleteKeyAndReturnValue(args, 'model'),
            attrName    = deleteKeyAndReturnValue(args, 'attrName'),
            fieldName   = deleteKeyAndReturnValue(args, 'fieldName'),
            type        = deleteKeyAndReturnValue(args, 'type', 'text'),
            placeHolder = deleteKeyAndReturnValue(args, 'placeHolder', ''),
            onchange    = deleteKeyAndReturnValue(args, 'onchange', _.noop);

        if (!args.size) {
          args.size = 3;
        }

        var propertyError;

        if (model.validate) {
          model.validate();
          var errors = model.errorForDisplay(attrName);
          if (errors) {
            propertyError = ({tag: "small", attrs: {class:"error"}, children: [errors]});
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
                name:fieldName, 
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
            fieldName   = deleteKeyAndReturnValue(args, 'fieldName'),
            type        = deleteKeyAndReturnValue(args, 'type', 'text'),
            placeHolder = deleteKeyAndReturnValue(args, 'placeHolder', ''),
            labelText   = deleteKeyAndReturnValue(args, 'label'),
            onchange    = deleteKeyAndReturnValue(args, 'onchange', _.noop);

        if (!args.size) {
          args.size = 3;
        }

        var propertyError;

        if (model.validate) {
          model.validate();
          var errors = model.errorForDisplay(attrName);
          if (errors) {
            propertyError = ({tag: "small", attrs: {class:"error"}, children: [errors]});
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
                name:fieldName, 
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
      view: function (ctrl, args, children) {
        var model     = deleteKeyAndReturnValue(args, 'model'),
            attrName  = deleteKeyAndReturnValue(args, 'attrName'),
            fieldName = deleteKeyAndReturnValue(args, 'fieldName'),
            labelText = deleteKeyAndReturnValue(args, 'label'),
            id        = f.uuid();

        if (!args.size) {
          args.size = 3;
        }

        labelText = labelText || s.humanize(attrName);

        return (
          m.component(f.column, Object.assign({},  args), [
            {tag: "div", attrs: {class:"switch tiny round inline"}, children: [
              {tag: "input", attrs: {type:"checkbox", 
                     name:fieldName, 
                     id:id, 
                     checked:model[attrName](), 
                     onchange:m.withAttr('checked', model[attrName])}}, 
              {tag: "label", attrs: {for:id}}
            ]}, 
            {tag: "label", attrs: {class:"inline", for:id}, children: [labelText]}
          ])
        );
      }
    }
  };
  return f;
});
