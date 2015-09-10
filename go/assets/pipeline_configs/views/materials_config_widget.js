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


define(['mithril', 'lodash', 'jquery', '../helpers/form_helper', '../models/materials', 'foundation.accordion'], function (m, _, $, f, Materials) {

  var MaterialViews = {
    base: {
      controller: function (args) {
        this.uuid             = f.uuid();
        this.material         = args.material;
        this.onRemove         = args.onRemove;
        this.selectedMaterial = args.selectedMaterial;
      },

      view: function (ctrl, args, children) {
        var destinationField, filterField;

        if (ctrl.material.destination) {
          destinationField = (
            m.component(f.inputWithLabel, {
              attrName:"destination", 
              label:"Destination", 
              model:ctrl.material})
          );
        }

        if (ctrl.material.filter) {
          // TODO: make this an 'intelligent' text component that maps to an array.
          filterField = (
            m.component(f.inputWithLabel, {
              attrName:"ignore", 
              label:"Ignore", 
              model:ctrl.material.filter()})
          );
        }

        return (
          {tag: "dd", attrs: {class:"accordion-navigation"}, children: [
            {tag: "a", attrs: {href:'#panel-' + ctrl.uuid}, children: [
              ctrl.material.name(), 
              {tag: "a", attrs: {
                href:"javascript:void(0)", 
                class:"remove", 
                onclick:ctrl.onRemove
                }}
            ]}, 

            {tag: "div", attrs: {id:'panel-' + ctrl.uuid, 
                 class:'content ' + ((ctrl.selectedMaterial() === ctrl.material) ? 'active' : '')}, children: [
              m.component(f.row, {}, [
                {tag: "div", attrs: {class:"material-definition", "data-key":ctrl.material.name()}, children: [
                  m.component(f.inputWithLabel, {
                    attrName:"name", 
                    model:ctrl.material}), 

                  destinationField, 

                  m.component(f.checkBox, {
                    model:ctrl.material, 
                    attrName:"autoUpdate", 
                    end:true})
                ]}
              ]), 
              children, 

              m.component(f.row, {}, [
                filterField
              ])
            ]}
          ]}
        );
      }
    },

    svn: {
      view: function (controller, args) {
        var material = args.material;
        return (
          m.component(MaterialViews.base, {material:material, onRemove:args.onRemove, selectedMaterial:args.selectedMaterial}, [
            m.component(f.row, {}, [
              m.component(f.inputWithLabel, {
                attrName:"url", 
                type:"url", 
                model:material}), 
              m.component(f.inputWithLabel, {
                attrName:"username", 
                model:material}), 
              m.component(f.inputWithLabel, {
                attrName:"password", 
                type:"password", 
                model:material}), 
              m.component(f.checkBox, {
                type:"checkbox", 
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
          m.component(MaterialViews.base, {material:material, onRemove:args.onRemove, selectedMaterial:args.selectedMaterial}, [
            m.component(f.row, {}, [
              m.component(f.inputWithLabel, {
                attrName:"url", 
                type:"url", 
                model:material}), 
              m.component(f.inputWithLabel, {
                attrName:"branch", 
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
          m.component(MaterialViews.base, {material:material, onRemove:args.onRemove, selectedMaterial:args.selectedMaterial}, [
            m.component(f.row, {}, [
              m.component(f.inputWithLabel, {
                attrName:"url", 
                type:"url", 
                model:material}), 
              m.component(f.inputWithLabel, {
                attrName:"branch", 
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
          m.component(MaterialViews.base, {material:material, onRemove:args.onRemove, selectedMaterial:args.selectedMaterial}, [
            m.component(f.row, {}, [
              m.component(f.inputWithLabel, {
                attrName:"port", 
                model:material, 
                onchange:m.withAttr('value', material.port)}), 
              m.component(f.inputWithLabel, {
                attrName:"username", 
                model:material}), 
              m.component(f.inputWithLabel, {
                attrName:"password", 
                type:"password", 
                model:material}), 
              m.component(f.checkBox, {
                name:"material[use_tickets]", 
                type:"checkbox", 
                end:true, 
                model:material, 
                attrName:"useTickets"})
            ]), 

            m.component(f.row, {}, [
              m.component(f.inputWithLabel, {
                attrName:"view", 
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
          m.component(MaterialViews.base, {material:material, onRemove:args.onRemove, selectedMaterial:args.selectedMaterial}, [
            m.component(f.row, {}, [
              m.component(f.inputWithLabel, {
                attrName:"url", 
                type:"url", 
                model:material}), 

              m.component(f.inputWithLabel, {
                attrName:"domain", 
                model:material}), 

              m.component(f.inputWithLabel, {
                attrName:"username", 
                model:material}), 
              m.component(f.inputWithLabel, {
                attrName:"password", 
                type:"password", 
                model:material, 
                end:true})
            ]), 

            m.component(f.row, {}, [
              m.component(f.inputWithLabel, {
                attrName:"projectPath", 
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
      this.materials        = args.materials;
      this.selectedMaterial = m.prop();

      this.removeMaterial = function (material) {
        var previousMaterial = this.materials.previousMaterial(material);
        var firstMaterial    = this.materials.firstMaterial();
        this.selectMaterial(previousMaterial || firstMaterial);
        this.materials.removeMaterial(material);
      };

      this.createMaterial = function (type) {
        var newMaterial = this.materials.createMaterial({type: type()});
        this.selectMaterial(newMaterial);
      };

      this.selectMaterial = function (material) {
        this.selectedMaterial(material);
        window.setTimeout(function () {
          $(document).foundation('accordion', 'reflow');
        }, 30);
      };

      this.selectMaterial(this.materials.firstMaterial());
    },

    view: function (ctrl, args) {
      return (
        {tag: "div", attrs: {}, children: [
          {tag: "dl", attrs: {class:"accordion", "data-accordion":true}, children: [
            ctrl.materials.mapMaterials(function (material) {
              var materialView = MaterialViews[material.type()];
              return (m.component(materialView, {
                material:         material,
                selectedMaterial: ctrl.selectedMaterial,
                onRemove:         ctrl.removeMaterial.bind(ctrl, material),
                key:              material.uuid()
              }));
            })
          ]}, 
          m.component(MaterialTypeSelector, {materials:ctrl.materials, createMaterial:ctrl.createMaterial.bind(ctrl)})
        ]}
      );
    }
  };

  return MaterialsConfigWidget;
});
