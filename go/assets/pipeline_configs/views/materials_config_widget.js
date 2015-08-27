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


define(['mithril', 'lodash', '../helpers/form_helper', '../models/materials'], function (m, _, f, Materials) {

  var MaterialViews = {
    base: {
      view: function (ctrl, args, children) {
        var material = args.material;

        var destinationField = null;

        if (material.dest) {
          destinationField = (
            m.component(f.inputWithLabel, {
              attrName:"dest", 
              label:"Destination", 
              fieldName:"material[dest]", 
              model:material, 
              onchange:m.withAttr('value', material.dest)})
          );
        }

        return (
          {tag: "fieldset", attrs: {className:'material material-type-' + material.type()}, children: [
            {tag: "legend", attrs: {}, children: [material.name()]}, 
            m.component(f.row, {}, [
              m.component(f.inputWithLabel, {
                attrName:"name", 
                fieldName:"material[name]", 
                model:material}), 

              destinationField, 

              m.component(f.checkBox, {
                model:material, 
                attrName:"autoUpdate", 
                fieldName:"material[type]", 
                end:true}
                )
            ]), 

            children
          ]}
        );
      }
    },

    svn: {
      view: function (controller, args) {
        var material = args.material;
        return (
          m.component(MaterialViews.base, {material:material}, [
            m.component(f.row, {}, [
              m.component(f.inputWithLabel, {
                attrName:"url", 
                fieldName:"material[url]", 
                type:"url", 
                model:material, 
                onchange:m.withAttr('value', material.url)}), 
              m.component(f.inputWithLabel, {
                attrName:"username", 
                fieldName:"material[username]", 
                model:material, 
                onchange:m.withAttr('value', material.username)}), 
              m.component(f.inputWithLabel, {
                attrName:"password", 
                type:"password", 
                fieldName:"material[password]", 
                model:material, 
                onchange:m.withAttr('value', material.password)}), 
              m.component(f.checkBox, {
                fieldName:"material[check_externals]", 
                type:"checkbox", 
                model:material, 
                attrName:"checkExternals", 
                end:true}
                )
            ])
          ])
        );
      }
    },
    git: {
      view: function (controller, args) {
        var material = args.material;
        return (
          m.component(MaterialViews.base, {material:material}, [
            m.component(f.row, {}, [
              m.component(f.inputWithLabel, {
                attrName:"url", 
                fieldName:"material[url]", 
                type:"url", 
                model:material, 
                onchange:m.withAttr('value', material.url)}), 
              m.component(f.inputWithLabel, {
                attrName:"branch", 
                fieldName:"material[branch]", 
                model:material, 
                end:true, 
                onchange:m.withAttr('value', material.branch)})
            ])
          ])
        );
      }
    },

    hg: {
      view: function (controller, args) {
        var material = args.material;
        return (
          m.component(MaterialViews.base, {material:material}, [
            m.component(f.row, {}, [
              m.component(f.inputWithLabel, {
                attrName:"url", 
                fieldName:"material[url]", 
                type:"url", 
                model:material, 
                onchange:m.withAttr('value', material.url)}), 
              m.component(f.inputWithLabel, {
                attrName:"branch", 
                fieldName:"material[branch]", 
                model:material, 
                end:true, 
                onchange:m.withAttr('value', material.branch)})
            ])
          ])
        );
      }
    },

    p4: {
      view: function (controller, args) {
        var material = args.material;
        return (
          m.component(MaterialViews.base, {material:material}, [
            m.component(f.row, {}, [
              m.component(f.inputWithLabel, {
                attrName:"port", 
                fieldName:"material[port]", 
                model:material, 
                onchange:m.withAttr('value', material.port)}), 
              m.component(f.inputWithLabel, {
                attrName:"username", 
                fieldName:"material[username]", 
                model:material, 
                onchange:m.withAttr('value', material.username)}), 
              m.component(f.inputWithLabel, {
                attrName:"password", 
                type:"password", 
                fieldName:"material[password]", 
                model:material, 
                onchange:m.withAttr('value', material.password)}), 
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
                fieldName:"material[view]", 
                model:material, 
                end:true, 
                onchange:m.withAttr('value', material.view)})
            ])
          ])
        );
      }
    },

    tfs: {
      view: function (controller, args) {
        var material = args.material;
        return (
          m.component(MaterialViews.base, {material:material}, [
            m.component(f.row, {}, [
              m.component(f.inputWithLabel, {
                attrName:"url", 
                fieldName:"material[url]", 
                type:"url", 
                model:material, 
                onchange:m.withAttr('value', material.url)}), 

              m.component(f.inputWithLabel, {
                attrName:"domain", 
                fieldName:"material[domain]", 
                model:material, 
                onchange:m.withAttr('value', material.domain)}), 

              m.component(f.inputWithLabel, {
                attrName:"username", 
                fieldName:"material[username]", 
                model:material, 
                onchange:m.withAttr('value', material.username)}), 
              m.component(f.inputWithLabel, {
                attrName:"password", 
                type:"password", 
                fieldName:"material[password]", 
                model:material, 
                end:true, 
                onchange:m.withAttr('value', material.password)})
            ]), 

            m.component(f.row, {}, [
              m.component(f.inputWithLabel, {
                attrName:"projectPath", 
                fieldName:"material[project_path]", 
                model:material, 
                end:true, 
                onchange:m.withAttr('value', material.projectPath)})
            ])
          ])
        );
      }
    }
  };

  var MaterialTypeSelector = {
    controller: function (args) {
      this.materials   = args.materials;
      this.selected    = m.prop('git');
      this.addMaterial = function (type) {
        var newMaterial = this.materials.createMaterial({type: type()});
      };
    },

    view: function (ctrl) {
      return (
        {tag: "div", attrs: {className:"material-selector"}, children: [
          {tag: "select", attrs: {onchange:m.withAttr('value', ctrl.selected)}, children: [
            _.map(Materials.Types, function (value, key) {
              return ({tag: "option", attrs: {value:key, selected:ctrl.selected() === key}, children: [value.description]});
            })
          ]}, 
          {tag: "a", attrs: {href:"javascript:void(0)", onclick:ctrl.addMaterial.bind(ctrl, ctrl.selected)}, children: ["Add Material"]}
        ]}
      );
    }
  };

  var MaterialsConfigWidget = {
    view: function (ctrl, args) {
      var materials = args.materials;
      return (

        {tag: "div", attrs: {}, children: [
          materials.mapMaterials(function (material) {
            var materialView = MaterialViews[material.type()];
            return (m.component(materialView, {material: material}));
          }), 
          m.component(MaterialTypeSelector, {materials:materials})
        ]}
      );
    }
  };

  return MaterialsConfigWidget;
});
