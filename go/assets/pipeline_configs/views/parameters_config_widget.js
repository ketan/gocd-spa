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


define(['mithril', 'string-plus', '../helpers/form_helper'], function (m, _, f) {
  var ParametersConfigWidget = {
    controller: function (args) {
      this.parameters = args.parameters;

      this.add = function () {
        this.parameters.createParameter();
      };

      this.remove = function (parameter) {
        this.parameters.removeParameter(parameter);
        this.paramChanged();
      };

      this.lastParameter = function () {
        return this.parameters.lastParameter();
      };

      this.paramChanged = function () {
        if (!this.lastParameter() || !this.lastParameter().isBlank()) {
          this.add();
        }
      };

      this.paramChanged();
    },

    view: function (ctrl) {
      var removeLink = function (parameter) {
        if (parameter !== ctrl.lastParameter()) {
          return ({tag: "a", attrs: {
              href:"javascript:void(0)", 
              class:"remove", 
              onclick:ctrl.remove.bind(ctrl, parameter)}}
          );
        }
      };

      return (
        {tag: "fieldset", attrs: {class:"parameters"}, children: [
          {tag: "legend", attrs: {}, children: ["Parameters"]}, 
          ctrl.parameters.mapParameters(function (parameter) {
            return (
              m.component(f.row, {class:"parameter", "data-parameter-name":parameter.name(), key:parameter.uuid()}, [
                m.component(f.input, {
                  model:parameter, 
                  attrName:"name", 
                  onchange:ctrl.paramChanged.bind(ctrl), 
                  size:4}), 

                m.component(f.input, {
                  model:parameter, 
                  attrName:"value", 
                  onchange:ctrl.paramChanged.bind(ctrl), 
                  size:4}), 

                m.component(f.column, {size:3, end:true}, [
                  removeLink(parameter)
                ])
              ])
            );
          })
        ]}
      );
    }
  };

  return ParametersConfigWidget;
});
