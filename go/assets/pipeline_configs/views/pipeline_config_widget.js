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


define(['mithril', 'string-plus', '../helpers/form_helper', '../helpers/tooltips', '../models/pipeline', '../models/tasks', './parameters_config_widget',
    './tracking_tool_widget', './environment_variables_config_widget', './pipeline_flow_widget'],
  function (m, s, f, tt, Pipeline, Tasks, ParametersConfigWidget, TrackingToolWidget, EnvironmentVariablesConfigWidget,
            PipelineFlowWidget) {

    var PipelineConfigWidget = function (url, callback) {
      return {
        controller: function () {
          this.currentSelection = m.prop();
          var self              = this;

          Pipeline.get(url).then(function (data) {
            self.pipeline   = Pipeline.fromJSON(data);
            window.pipeline = self.pipeline;
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
                      m.component(f.inputWithLabel, {model:pipeline, 
                                        attrName:"labelTemplate", 
                                        tooltip:{
                                          content: m.component(tt.pipeline.labelTemplate, {callback:pipeline.labelTemplate}),
                                          direction: 'bottom',
                                          size: 'large'
                                        }, 
                                        size:4})
                    ]), 

                    m.component(f.row, {}, [
                      m.component(f.checkBox, {model:pipeline, 
                                  attrName:"enablePipelineLocking", 
                                  tooltip:{
                                          content: tt.pipeline.enablePipelineLocking,
                                          direction: 'bottom'
                                        }, 
                                  end:true})
                    ]), 

                    m.component(f.row, {}, [
                      m.component(f.inputWithLabel, {model:pipeline.timer(), 
                                        attrName:"spec", 
                                        label:"Cron timer specification", 
                                        tooltip:{
                                          content: m.component(tt.pipeline.timer.spec, {callback:pipeline.timer().spec}),
                                          direction: 'bottom',
                                          size: 'large'
                                        }, 
                                        size:4, 
                                        end:true})
                    ]), 
                    m.component(f.row, {}, [
                      m.component(f.checkBox, {model:pipeline.timer(), 
                                  attrName:"onlyOnChanges", 
                                  label:"Run only on new material", 
                                  disabled:s.isBlank(pipeline.timer().spec()), 
                                  tooltip:{
                                          content: tt.pipeline.timer.onlyOnChanges,
                                          direction: 'bottom'
                                        }, 
                                  size:4, 
                                  end:true})
                    ]), 

                    m.component(f.row, {}, [
                      m.component(f.column, {end:true, size:12}, [
                        m.component(TrackingToolWidget, {trackingTool:pipeline.trackingTool}), 
                        m.component(ParametersConfigWidget, {parameters:pipeline.parameters()}), 
                        m.component(EnvironmentVariablesConfigWidget, {variables:pipeline.environmentVariables()}), 
                        m.component(PipelineFlowWidget, {stages:pipeline.stages(), 
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

    return PipelineConfigWidget;
  });

