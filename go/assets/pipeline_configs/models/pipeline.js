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


define(['mithril', 'lodash', './constraints', './model_mixins', './environment_variables', './parameters', './materials', './tracking_tool', './stages'], function (m, _, constraints, Mixins, EnvironmentVariables, Parameters, Materials, TrackingTool, Stages) {
  var Pipeline = function (data) {
    Mixins.Validator.call(this);
    this.name                 = m.prop(data.name);
    this.locked               = m.prop(data.locked);
    this.templateName         = m.prop(data.templateName);
    this.labelTemplate        = m.prop(data.labelTemplate);
    this.timer                = m.prop(data.timer);
    this.environmentVariables = m.prop(data.environmentVariables || new EnvironmentVariables());
    this.parameters           = m.prop(data.parameters || new Parameters());
    this.materials            = m.prop(data.materials || new Materials());
    this.trackingTool         = m.prop(data.trackingTool);
    this.stages               = m.prop(data.stages);

    this.constraints = _.constant(Pipeline.Constraints);
  };

  Pipeline.Constraints = {
    labelTemplate: constraints.label,
    name:          constraints.name
  };

  Pipeline.get = function (url) {
    return m.request({method: 'GET', url: url});
  };

  Pipeline.fromJSON = function (data) {
    return new Pipeline({
      name:                 data.name,
      locked:               data.locked,
      templateName:         data.template_name,
      labelTemplate:        data.label_template,
      timer:                data.timer,
      trackingTool:         TrackingTool.fromJSON(data.tracking_tool),
      environmentVariables: EnvironmentVariables.fromJSON(data.environment_variables),
      parameters:           Parameters.fromJSON(data.params),
      materials:            Materials.fromJSON(data.materials),
      stages:               Stages.fromJSON(data.stages)
    });
  };

  return Pipeline;
});
