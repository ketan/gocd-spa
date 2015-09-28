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


define(['mithril', 'lodash', 'jquery', '../helpers/form_helper', '../helpers/tooltips', '../models/materials'], function (m, _, $, f, tt, Materials) {

  var MaterialViews = {
    base: {
      controller: function (args) {
        this.material              = args.material;
        this.onRemove              = args.onRemove;
        this.selectedMaterialIndex = args.selectedMaterialIndex;
      },

      view: function (ctrl, args, children) {
        var destinationField, filterField;

        if (ctrl.material.destination) {
          destinationField = (
            m.component(f.inputWithLabel, {attrName:"destination", 
                              label:"Destination", 
                              model:ctrl.material, 
                              tooltip:{
                                          content: tt.material.destination,
                                          direction: 'bottom',
                                          size: 'small'
                                        }})
          );
        }

        if (ctrl.material.filter) {
          // TODO: make this an 'intelligent' text component that maps to an array.
          filterField = (
            m.component(f.inputWithLabel, {attrName:"ignore", 
                              label:"Ignore", 
                              model:ctrl.material.filter()})
          );
        }

        return (
          {tag: "div", attrs: {class:"material-definition"}, children: [
            m.component(f.removeButton, {onclick:ctrl.onRemove}), 
            m.component(f.row, {}, [
              m.component(f.inputWithLabel, {attrName:"name", 
                                model:ctrl.material, 
                                tooltip:{
                                          content: tt.material.name,
                                          direction: 'bottom',
                                          size: 'small'
                                        }}), 
              destinationField, 
              m.component(f.checkBox, {model:ctrl.material, 
                          attrName:"autoUpdate", 
                          end:true})
            ]), 
            children, 

            m.component(f.row, {}, [
              filterField
            ])
          ]}
        );
      }
    },

    svn: {
      view: function (controller, args) {
        var material = args.material;
        return (
          m.component(MaterialViews.base, {material:material, onRemove:args.onRemove, 
                              selectedMaterialIndex:args.selectedMaterialIndex}, [
            m.component(f.row, {}, [
              m.component(f.inputWithLabel, {attrName:"url", 
                                type:"url", 
                                model:material}), 
              m.component(f.inputWithLabel, {attrName:"username", 
                                model:material}), 
              m.component(f.inputWithLabel, {attrName:"password", 
                                type:"password", 
                                model:material}), 
              m.component(f.checkBox, {type:"checkbox", 
                          model:material, 
                          attrName:"checkExternals", 
                          end:true})
            ])
          ])
        );
      }
    },
    git: {
      view: function (controller, args) {
        var material = args.material;
        return (
          m.component(MaterialViews.base, {material:material, onRemove:args.onRemove, 
                              selectedMaterialIndex:args.selectedMaterialIndex}, [
            m.component(f.row, {}, [
              m.component(f.inputWithLabel, {attrName:"url", 
                                type:"url", 
                                model:material}), 
              m.component(f.inputWithLabel, {attrName:"branch", 
                                model:material, 
                                end:true})
            ])
          ])
        );
      }
    },

    hg: {
      view: function (controller, args) {
        var material = args.material;
        return (
          m.component(MaterialViews.base, {material:material, onRemove:args.onRemove, 
                              selectedMaterialIndex:args.selectedMaterialIndex}, [
            m.component(f.row, {}, [
              m.component(f.inputWithLabel, {attrName:"url", 
                                type:"url", 
                                model:material}), 
              m.component(f.inputWithLabel, {attrName:"branch", 
                                model:material, 
                                end:true})
            ])
          ])
        );
      }
    },

    p4: {
      view: function (controller, args) {
        var material = args.material;
        return (
          m.component(MaterialViews.base, {material:material, onRemove:args.onRemove, 
                              selectedMaterialIndex:args.selectedMaterialIndex}, [
            m.component(f.row, {}, [
              m.component(f.inputWithLabel, {attrName:"port", 
                                model:material, 
                                onchange:m.withAttr('value', material.port)}), 
              m.component(f.inputWithLabel, {attrName:"username", 
                                model:material}), 
              m.component(f.inputWithLabel, {attrName:"password", 
                                type:"password", 
                                model:material}), 
              m.component(f.checkBox, {name:"material[use_tickets]", 
                          type:"checkbox", 
                          end:true, 
                          model:material, 
                          attrName:"useTickets"})
            ]), 

            m.component(f.row, {}, [
              m.component(f.inputWithLabel, {attrName:"view", 
                                model:material, 
                                end:true})
            ])
          ])
        );
      }
    },

    tfs: {
      view: function (controller, args) {
        var material = args.material;
        return (
          m.component(MaterialViews.base, {material:material, onRemove:args.onRemove, 
                              selectedMaterialIndex:args.selectedMaterialIndex}, [
            m.component(f.row, {}, [
              m.component(f.inputWithLabel, {attrName:"url", 
                                type:"url", 
                                model:material}), 
              m.component(f.inputWithLabel, {attrName:"domain", 
                                model:material}), 
              m.component(f.inputWithLabel, {attrName:"username", 
                                model:material}), 
              m.component(f.inputWithLabel, {attrName:"password", 
                                type:"password", 
                                model:material, 
                                end:true})
            ]), 

            m.component(f.row, {}, [
              m.component(f.inputWithLabel, {attrName:"projectPath", 
                                model:material, 
                                end:true})
            ])
          ])
        );
      }
    }
  };

  var MaterialTypeSelector = {
    controller: function (args) {
      this.materials      = args.materials;
      this.createMaterial = args.createMaterial;
      this.selected       = m.prop('git');
    },

    view: function (ctrl) {
      return (
        m.component(f.row, {className:"material-selector"}, [
          m.component(f.column, {size:3}, [
            {tag: "label", attrs: {class:"inline"}, children: ["Add material of type", 
              m.component(f.select, {
                value:ctrl.selected, 
                class:"inline", 
                items:_.transform(Materials.Types, function(result, value, key){
                  result[key] = value.description;
                })}
                )
            ]}
          ]), 
          m.component(f.column, {size:2, end:true, class:"add-material"}, [
            {tag: "a", attrs: {href:"javascript:void(0)", onclick:ctrl.createMaterial.bind(ctrl, ctrl.selected)}, children: ["Add"]}
          ])
        ])
      );
    }
  };

  var MaterialsConfigWidget = {
    controller: function (args) {
      this.materials = args.materials;

      this.selectedMaterialIndex = args.selectedMaterialIndex;

      this.removeMaterial = function (material) {
        var previousMaterial = this.materials.previousMaterial(material);
        this.materials.removeMaterial(material);

        var firstMaterial = this.materials.firstMaterial();
        this.selectedMaterialIndex(this.materials.indexOfMaterial(previousMaterial || firstMaterial));
      };

      this.createMaterial = function (type) {
        var newMaterial = this.materials.createMaterial({type: type()});
        this.selectedMaterialIndex(this.materials.indexOfMaterial(newMaterial));
      };

      this.selectedMaterialIndex(0);
    },

    view: function (ctrl) {
      return (
        {tag: "div", attrs: {}, children: [
          m.component(f.accordion, {class:"materials-definition", 
                       accordionTitles:ctrl.materials.collectMaterialProperty('name'), 
                       accordionKeys:ctrl.materials.collectMaterialProperty('uuid'), 
                       selectedIndex:ctrl.selectedMaterialIndex}, [
            ctrl.materials.mapMaterials(function (material) {
              var materialView = MaterialViews[material.type()];
              return (m.component(materialView, {
                material:              material,
                selectedMaterialIndex: ctrl.selectedMaterialIndex,
                onRemove:              ctrl.removeMaterial.bind(ctrl, material),
                key:                   material.uuid()
              }));
            })
          ]), 
          m.component(MaterialTypeSelector, {materials:ctrl.materials, createMaterial:ctrl.createMaterial.bind(ctrl)})
        ]}
      );
    }
  };

  return MaterialsConfigWidget;
});
