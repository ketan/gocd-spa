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


define(['mithril', '../helpers/form_helper', '../models/pipeline', './parameters_config_widget',
    './tracking_tool_widget', './environment_variable_config_widget', './stages_config_widget', './pipeline_flow_widget'],
  function (m, f, Pipeline, ParametersConfigWidget, TrackingToolSelectorWidget, EnvironmentVariablesConfigWidget,
            StagesConfigWidget, PipelineFlowWidget) {


    var PipelineConfigWidget = function (url) {
      return {
        controller: function () {
          var self              = this;
          this.currentSelection = m.prop();

          Pipeline.get(url).then(function (data) {
            self.pipeline   = Pipeline.fromJSON(data);
            window.pipeline = self.pipeline;
            self.currentSelection(self.pipeline.stages().firstStage());
          });
        },

        view: function (ctrl) {
          var pipeline = ctrl.pipeline;
          return (
            {tag: "form", attrs: {}, children: [
              {tag: "h4", attrs: {}, children: ["Pipeline Details for ", pipeline.name()]}, 

              m.component(f.row, {}, [
                m.component(f.column, {end:true, size:12}, [
                  {tag: "fieldset", attrs: {}, children: [
                    m.component(f.inputWithLabel, {
                      size:4, 
                      attrName:"labelTemplate", 
                      fieldName:"pipeline[label_template]", 
                      end:true, 
                      model:pipeline}), 

                    m.component(f.inputWithLabel, {
                      size:4, 
                      attrName:"timer", 
                      fieldName:"pipeline[timer]", 
                      end:true, 
                      model:pipeline}), 

                    m.component(f.checkBox, {
                      model:pipeline, 
                      attrName:"locked", 
                      fieldName:"pipeline[locked]"}
                      )
                  ]}
                ])
              ]), 

              m.component(f.row, {}, [
                m.component(f.column, {end:true, size:12}, [
                  m.component(TrackingToolSelectorWidget, {trackingTool:pipeline.trackingTool})
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
          );
        }
      };
    };

    return PipelineConfigWidget;
  });

