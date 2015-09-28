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


define(['mithril', 'lodash', 'jquery', 'dragula', '../helpers/form_helper', './stages_config_widget'], function (m, _, $, dragula, f, StagesConfigWidget) {
  var StagesWidget = {
    controller: function (args) {
      this.stages           = args.stages;
      this.materials        = args.materials;
      this.currentSelection = args.currentSelection;

      this.appendStage = function () {
        this.currentSelection(this.stages.createStage());
      };
    },

    view: function (ctrl, args) {
      var appendStage = (
        {tag: "li", attrs: {class:"add-stage", onclick:ctrl.appendStage.bind(ctrl)}}
      );

      var className = function (selection, additionalClasses) {
        return _(['pipeline-flow-box', additionalClasses, (ctrl.currentSelection() === selection) ? 'active' : null]).flatten().compact().value().join(' ');
      };

      var dragDropConfig = function (elem, isInitialized) {
        if (isInitialized) {
          return;
        }

        var drake = dragula([elem], {
          revertOnSpill:   true,
          mirrorContainer: elem
        });

        drake.on('drop', function () {
          m.startComputation();
          try {
            var reorderedStages = _.map($(elem).find('.stage:not(.gu-mirror)'), function (eachStageElem) {
              return ctrl.stages.stageAtIndex($(eachStageElem).attr('data-stage-index'));
            });
            ctrl.stages.setStages(reorderedStages);
          } finally {
            m.endComputation();
          }
        });
      };

      return (
        m.component(f.accordion, {accordionTitles:['Stages'], 
                     accordionKeys:['stages']}, [
          {tag: "div", attrs: {}, children: [
            {tag: "div", attrs: {class:"pipeline-flow-boxes"}, children: [
              {tag: "div", attrs: {class:className(ctrl.materials, 'materials'), 
                   onclick:ctrl.currentSelection.bind(ctrl, ctrl.materials)}, children: [
                {tag: "div", attrs: {className:"label"}, children: ["Materials"]}, 
                {tag: "div", attrs: {class:"bottom-triangle-outer"}, children: [
                  {tag: "div", attrs: {class:"bottom-triangle-inner"}}
                ]}
              ]}, 

              ctrl.stages.mapStages(function (stage, stageIndex) {
                return (
                  {tag: "div", attrs: {class:className(stage, 'stage'), 
                       "data-stage-index":stageIndex, 
                       onclick:ctrl.currentSelection.bind(ctrl, stage), 
                       key:stage.uuid()}, children: [
                    {tag: "div", attrs: {className:"label"}, children: [stage.name()]}, 
                    {tag: "div", attrs: {class:"bottom-triangle-outer"}, children: [
                      {tag: "div", attrs: {class:"bottom-triangle-inner"}}
                    ]}
                  ]}
                );
              }), 

              appendStage
            ]}, 

            m.component(StagesConfigWidget, {stages:pipeline.stages(), 
                                materials:pipeline.materials(), 
                                currentSelection:ctrl.currentSelection})

          ]}
        ])
      );
    }

  };

  return StagesWidget;
});
