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


define(['mithril', '../helpers/form_helper'], function (m, f) {
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
              onclick:ctrl.remove.bind(ctrl, parameter)}
              }
          );
        }
      };

      return (
        {tag: "fieldset", attrs: {}, children: [
          {tag: "legend", attrs: {}, children: ["Parameters"]}, 
          ctrl.parameters.mapParameters(function (parameter) {
            return (
              m.component(f.row, {}, [
                m.component(f.input, {
                  attrName:"name", 
                  size:4, 
                  fieldName:"parameter[name]", 
                  model:parameter, 
                  onchange:ctrl.paramChanged.bind(ctrl)}), 

                m.component(f.input, {
                  attrName:"value", 
                  size:4, 
                  fieldName:"parameter[value]", 
                  model:parameter, 
                  onchange:ctrl.paramChanged.bind(ctrl)}), 

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
