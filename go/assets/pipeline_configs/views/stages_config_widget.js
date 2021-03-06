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


define(['mithril', 'lodash', 'string-plus', '../helpers/form_helper', '../helpers/tooltips', './materials_config_widget', './environment_variables_config_widget',
  './jobs_config_widget'], function (m, _, s, f, tt, MaterialsConfigWidget, EnvironmentVariablesConfigWidget, JobsConfigWidget) {

  var StageConfigDefinitionWidget = {
    controller: function (args) {
      this.stage            = args.stage;
      this.currentSelection = args.currentSelection;
      this.selectedJobIndex = m.prop(0);
      this.onRemove         = args.onRemove;
    },

    view: function (ctrl, args, children) {
      var className = function (selection) {
        return _.compact(['stage-definition', (ctrl.currentSelection() !== selection) ? 'hide' : null]).join(' ');
      };

      return (
        {tag: "div", attrs: {className:className(ctrl.stage), "data-stage-name":ctrl.stage.name()}, children: [
          m.component(f.removeButton, {onclick:ctrl.onRemove}
            ), 
          m.component(f.row, {}, [
            m.component(f.inputWithLabel, {attrName:"name", 
                              model:ctrl.stage}), 
            m.component(f.checkBox, {model:ctrl.stage, 
                        attrName:"fetchMaterials", 
                        tooltip:{
                                  content: tt.stage.fetchMaterials,
                                  direction: 'bottom',
                                  size: 'small'
                                }}), 
            m.component(f.checkBox, {model:ctrl.stage, 
                        attrName:"neverCleanArtifacts", 
                        tooltip:{
                                  content: tt.stage.neverCleanArtifacts,
                                  direction: 'bottom',
                                  size: 'small'
                                }}), 
            m.component(f.checkBox, {model:ctrl.stage, 
                        attrName:"cleanWorkingDirectory", 
                        tooltip:{
                                  content: tt.stage.cleanWorkingDirectory,
                                  direction: 'bottom',
                                  size: 'small'
                                }, 
                        end:true})
          ]), 

          m.component(f.row, {}, [
            m.component(f.column, {size:12, end:true}, [
              m.component(EnvironmentVariablesConfigWidget, {variables:ctrl.stage.environmentVariables()})
            ])
          ]), 

          m.component(f.row, {}, [
            m.component(f.column, {size:12, end:true}, [
              m.component(JobsConfigWidget, {jobs:ctrl.stage.jobs(), selectedJobIndex:ctrl.selectedJobIndex})
            ])
          ])
        ]}
      );
    }
  };

  var MaterialConfigWrapper = {
    controller: function (args) {
      this.materials             = args.materials;
      this.currentSelection      = args.currentSelection;
      this.selectedMaterialIndex = m.prop(0);
    },

    view: function (ctrl, args, children) {
      var className = function (selection) {
        return _.compact(['material-definitions', (ctrl.currentSelection() !== selection) ? 'hide' : null]).join(' ');
      };

      return (
        {tag: "div", attrs: {className:className(ctrl.materials)}, children: [
          m.component(MaterialsConfigWidget, {materials:ctrl.materials, selectedMaterialIndex:ctrl.selectedMaterialIndex})
        ]}
      );
    }
  };

  var StagesConfigWidget = {
    controller: function (args) {
      this.stages           = args.stages;
      this.materials        = args.materials;
      this.currentSelection = args.currentSelection;

      this.removeStage = function (stage) {
        var previousStage = this.stages.previousStage(stage);
        this.stages.removeStage(stage);
        var firstStage    = this.stages.firstStage();

        this.currentSelection(previousStage || firstStage || this.stages.createStage());
      };
    },

    view: function (ctrl) {
      return (
        {tag: "div", attrs: {class:"stage-and-material-definitions"}, children: [
          m.component(MaterialConfigWrapper, {materials:ctrl.materials, 
                                 currentSelection:ctrl.currentSelection, 
                                 key:"material-config-wrappper"}), 
          ctrl.stages.mapStages(function (stage) {
            return (
              m.component(StageConfigDefinitionWidget, {key:stage.uuid(), 
                                           stage:stage, 
                                           currentSelection:ctrl.currentSelection, 
                                           onRemove:ctrl.removeStage.bind(ctrl, stage)})
            );
          })
        ]}
      );
    }
  };

  return StagesConfigWidget;
});
