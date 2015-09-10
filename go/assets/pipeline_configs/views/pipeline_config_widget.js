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


define(['mithril', 'string-plus', '../helpers/form_helper', '../models/pipeline', '../models/tasks', './parameters_config_widget',
    './tracking_tool_widget', './environment_variables_config_widget', './stages_config_widget', './pipeline_flow_widget'],
  function (m, s, f, Pipeline, Tasks, ParametersConfigWidget, TrackingToolWidget, EnvironmentVariablesConfigWidget,
            StagesConfigWidget, PipelineFlowWidget) {

    var PipelineConfigWidget = function (url, callback) {
      return {
        controller: function () {
          var self              = this;
          this.currentSelection = m.prop();

          Pipeline.get(url).then(function (data) {
            self.pipeline = Pipeline.fromJSON(data);
            self.currentSelection(self.pipeline.stages().firstStage());
            if (callback) {
              callback(self);
            }
          });
        },

        view: function (ctrl) {
          var pipeline = ctrl.pipeline;
          return (
            {tag: "form", attrs: {class:"pipeline"}, children: [
              m.component(f.row, {}, [
                m.component(f.column, {}, [
                  {tag: "h3", attrs: {class:"heading"}, children: ["Pipeline Details for ", pipeline.name()]}
                ])
              ]), 
              m.component(f.row, {}, [
                m.component(f.column, {end:true, size:12}, [
                  {tag: "fieldset", attrs: {}, children: [
                    m.component(f.row, {}, [
                      m.component(f.inputWithLabel, {
                        model:pipeline, 
                        attrName:"labelTemplate", 
                        size:4}), 

                      m.component(f.checkBox, {
                        model:pipeline, 
                        attrName:"locked", 
                        end:true})
                    ]), 

                    m.component(f.row, {}, [
                      m.component(f.column, {size:"12"}, [
                        m.component(PipelineConfigWidget.TimerWidget, {timer:pipeline.timer()})
                      ])
                    ]), 

                    m.component(f.row, {}, [
                      m.component(f.column, {end:true, size:12}, [
                        m.component(TrackingToolWidget, {trackingTool:pipeline.trackingTool})
                      ])
                    ]), 

                    m.component(f.row, {}, [
                      m.component(f.column, {end:true, size:12}, [
                        m.component(ParametersConfigWidget, {parameters:pipeline.parameters()})
                      ])
                    ]), 

                    m.component(f.row, {}, [
                      m.component(f.column, {end:true, size:12}, [
                        m.component(EnvironmentVariablesConfigWidget, {variables:pipeline.environmentVariables()})
                      ])
                    ]), 

                    m.component(f.row, {}, [
                      m.component(f.column, {end:true, size:12}, [
                        m.component(PipelineFlowWidget, {stages:pipeline.stages(), 
                                            materials:pipeline.materials(), 
                                            currentSelection:ctrl.currentSelection})
                      ])
                    ]), 

                    m.component(f.row, {}, [
                      m.component(f.column, {end:true, size:12}, [
                        m.component(StagesConfigWidget, {stages:pipeline.stages(), 
                                            materials:pipeline.materials(), 
                                            currentSelection:ctrl.currentSelection})
                      ])
                    ])

                  ]}
                ])
              ])
            ]}
          );
        }
      };
    };

    PipelineConfigWidget.TimerWidget = {
      controller: function (args) {
        this.timer = args.timer;
      },

      view: function (ctrl, args) {
        return (
          {tag: "fieldset", attrs: {}, children: [
            {tag: "legend", attrs: {}, children: ["Timer"]}, 
            m.component(f.row, {}, [
              m.component(f.inputWithLabel, {
                model:ctrl.timer, 
                attrName:"spec", 
                label:"Cron timer specification", 
                size:4}), 

              m.component(f.checkBox, {
                model:ctrl.timer, 
                attrName:"onlyOnChanges", 
                label:"Run only on new material", 
                disabled:s.isBlank(ctrl.timer.spec()), 
                size:4, 
                end:true})
            ])
          ]}
        );
      }
    };

    return PipelineConfigWidget;
  });

