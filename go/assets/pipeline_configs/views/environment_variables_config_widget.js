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


define(['mithril', '../helpers/form_helper', '../helpers/tooltips'], function (m, f, tt) {
  var EnvironmentVariablesConfigWidget = {
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
          return (
            m.component(f.removeButton, {onclick:ctrl.remove.bind(ctrl, variable)})
          );
        }
      };

      return (
        m.component(f.accordion, {accordionTitles:[
                        (
                          {tag: "span", attrs: {}, children: ["EnvironmentVariables", m.component(f.tooltip, {tooltip:{content: tt.environmentVariables}})]}
                        )
                     ], 
                     accordionKeys:['environment-variables'], 
                     selectedIndex:-1, 
                     class:"environment-variables"}, [
          {tag: "div", attrs: {}, children: [
            ctrl.variables.mapVariables(function (variable) {
              return (
                m.component(f.row, {class:"environment-variable", "data-variable-name":variable.name(), key:variable.uuid()}, [
                  m.component(f.column, {size:4}, [
                    m.component(f.row, {collapse:true}, [
                      m.component(f.column, {size:2, class:"prefix-container"}, [
                        {tag: "span", attrs: {class:"prefix"}}
                      ]), 

                      m.component(f.input, {model:variable, 
                               attrName:"name", 
                               onchange:ctrl.variableChanged.bind(ctrl), 
                               size:10, 
                               end:true})
                    ])
                  ]), 
                  m.component(f.input, {model:variable, 
                           attrName:"value", 
                           onchange:ctrl.variableChanged.bind(ctrl), 
                           type:variable.secure() ? 'password' : 'text', 
                           size:4}), 
                  m.component(f.column, {size:1, end:true}, [
                    removeLink(variable)
                  ])
                ])
              );
            })
          ]}
        ])
      );
    }
  };
  return EnvironmentVariablesConfigWidget;
});
