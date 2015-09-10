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
  var PropertiesConfigWidget = {
    controller: function (args) {
      this.properties = args.properties;

      this.add = function () {
        this.properties.createProperty();
      };

      this.remove = function (property) {
        this.properties.removeProperty(property);
        this.propertyChanged();
      };

      this.lastProperty = function () {
        return this.properties.lastProperty();
      };

      this.propertyChanged = function () {
        if (!this.lastProperty() || !this.lastProperty().isBlank()) {
          this.add();
        }
      };

      this.propertyChanged();
    },

    view: function (ctrl) {
      var removeLink = function (property) {
        if (property !== ctrl.lastProperty()) {
          return ({tag: "a", attrs: {
              href:"javascript:void(0)", 
              class:"remove", 
              onclick:ctrl.remove.bind(ctrl, property)}}
          );
        }
      };

      return (
        {tag: "fieldset", attrs: {class:"properties"}, children: [
          {tag: "legend", attrs: {}, children: ["Properties"]}, 
          ctrl.properties.mapProperties(function (property) {
            return (
              m.component(f.row, {class:"property", "data-property-source":property.source(), key:property.uuid()}, [
                m.component(f.input, {
                  model:property, 
                  attrName:"name", 
                  onchange:ctrl.propertyChanged.bind(ctrl), 
                  size:3}), 

                m.component(f.input, {
                  model:property, 
                  attrName:"source", 
                  onchange:ctrl.propertyChanged.bind(ctrl), 
                  size:3}), 

                m.component(f.input, {
                  model:property, 
                  attrName:"xpath", 
                  onchange:ctrl.propertyChanged.bind(ctrl), 
                  size:3}), 

                m.component(f.column, {size:1, end:true}, [
                  removeLink(property)
                ])
              ])
            );
          })
        ]}
      );
    }
  };
  return PropertiesConfigWidget;

});
