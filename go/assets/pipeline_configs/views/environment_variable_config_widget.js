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


define(['mithril', 'lodash', '../helpers/form_helper'], function (m, _, f) {
  var EnvironmentVariableWidget = {
    controller: function (args) {
      this.variables = args.variables;

      this.add = function () {
        this.variables.createVariable();
      };

      this.remove = function (variable) {
        this.variables.removeVariable(variable);
        this.variableChanged();
      };

      this.lastVariable = function () {
        return this.variables.lastVariable();
      };

      this.variableChanged = function () {
        if (!this.lastVariable() || !this.lastVariable().isBlank()) {
          this.add();
        }
      };

      this.variableChanged();
    },

    view: function (ctrl) {
      var removeLink = function (variable) {
        if (variable !== ctrl.lastVariable()) {
          return ({tag: "a", attrs: {
              href:"javascript:void(0)", 
              class:"remove", 
              onclick:ctrl.remove.bind(ctrl, variable)}
              }
          );
        }
      };

      return (
        {tag: "fieldset", attrs: {class:"environment-variables"}, children: [
          {tag: "legend", attrs: {}, children: ["Environment Variables"]}, 
          ctrl.variables.mapVariables(function (variable) {
            return (
              m.component(f.row, {class:"environment-variable"}, [
                m.component(f.column, {size:4}, [
                  m.component(f.row, {collapse:true}, [
                    m.component(f.column, {size:2, class:"prefix-container"}, [
                      {tag: "span", attrs: {class:"prefix"}}
                    ]), 

                    m.component(f.column, {end:true, size:10}, [
                      m.component(f.input, {
                        size:12, 
                        attrName:"name", 
                        fieldName:"environment-variable[name]", 
                        model:variable, 
                        onchange:ctrl.variableChanged.bind(ctrl)})
                    ])
                  ])
                ]), 

                m.component(f.input, {
                  size:4, 
                  attrName:"value", 
                  fieldName:"environment-variable[value]", 
                  model:variable, 
                  onchange:ctrl.variableChanged.bind(ctrl), 
                  type:variable.secure() ? 'password' : 'text'}
                  ), 
                m.component(f.column, {size:1, end:true}, [
                  removeLink(variable)
                ])
              ])
            );
          })
        ]}
      );
    }
  };
  return EnvironmentVariableWidget;
});
