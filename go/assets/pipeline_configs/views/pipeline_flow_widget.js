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


define(['mithril', 'lodash'], function (m, _) {
  var StagesWidget = {
    controller: function (args) {
      this.stages           = args.stages;
      this.materials        = args.materials;
      this.currentSelection = args.currentSelection;

      this.appendStage = function () {
        this.setSelection(this.stages.createStage());
      };

      this.removeStage = function (stage, evt) {
        evt.stopPropagation();
        var previousStage = this.stages.previousStage(stage);
        var firstStage    = this.stages.firstStage();
        this.setSelection(previousStage || firstStage);
        this.stages.removeStage(stage);
      };

      this.setSelection = function (stageOrMaterials) {
        this.currentSelection(stageOrMaterials);
      };
    },

    view: function (ctrl, args) {
      var appendStage = (
        {tag: "li", attrs: {class:"add-stage", onclick:ctrl.appendStage.bind(ctrl)}}
      );

      var className = function (selection) {
        return ('stage-widget ' + ((ctrl.currentSelection() === selection) ? ' selected-stage' : ''));
      };

      return (
        {tag: "ul", attrs: {class:"stages-widget"}, children: [
          {tag: "li", attrs: {class:className(ctrl.materials), onclick:ctrl.setSelection.bind(ctrl, ctrl.materials)}, children: [
            {tag: "div", attrs: {className:"label"}, children: ["Materials"]}
          ]}, 

          ctrl.stages.mapStages(function (stage) {
            return (
              {tag: "li", attrs: {class:className(stage), onclick:ctrl.setSelection.bind(ctrl, stage), key:stage.uuid()}, children: [
                {tag: "div", attrs: {className:"label"}, children: [stage.name()]}
              ]}
            );
          }), 
          appendStage
        ]}
      );
    }

  };

  return StagesWidget;
});
