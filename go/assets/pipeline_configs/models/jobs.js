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


define(['mithril', 'lodash', './model_mixins', './environment_variables', './tasks', './artifact', './tab', './property'], function (m, _, Mixins, EnvironmentVariables, Tasks, Artifact, Tab, Property) {

  var Jobs = function (data) {
    Mixins.Validator.call(this);
    Mixins.HasMany.call(this, {factory: Jobs.Job.create, as: 'Job', collection: data});
  };

  Jobs.Job = function (data) {
    Mixins.Validator.call(this);
    Mixins.UniqueInCollection.call(this, {uniqueOn: 'name', type: 'Job'});

    this.name                 = m.prop(data.name || null);
    this.runOnAllAgents       = m.prop(data.runOnAllAgents);
    this.runInstanceCount     = m.prop(data.runInstanceCount);
    this.timeout              = m.prop(data.timeout);
    this.environmentVariables = m.prop(data.environmentVariables || new EnvironmentVariables());
    this.resources            = m.prop(data.resources);
    this.tasks                = m.prop(data.tasks || new Tasks());
    this.artifacts            = m.prop(data.artifacts);
    this.tabs                 = m.prop(data.tabs);
    this.properties           = m.prop(data.properties);
  };

  Jobs.Job.create = function (data) {
    return new Jobs.Job(data);
  };

  Mixins.fromJSONCollection({
    parentType: Jobs,
    childType:  Jobs.Job,
    via:        'addJob'
  });

  Jobs.Job.fromJSON = function (data) {
    return new Jobs.Job({
      name:                 data.name,
      runOnAllAgents:       data.run_on_all_agents,
      runInstanceCount:     data.run_instance_count,
      timeout:              data.timeout,
      resources:            data.resources,
      environmentVariables: EnvironmentVariables.fromJSON(data.environment_variables),
      tasks:                Tasks.fromJSON(data.tasks),
      artifacts:            Artifact.fromJSON(data.artifacts),
      tabs:                 Tab.fromJSON(data.tabs),
      properties:           Property.fromJSON(data.properties)
    });
  };

  return Jobs;
});
