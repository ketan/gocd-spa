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


define(['mithril', 'lodash', 'string', './model_mixins'], function (m, _, s, Mixins) {

  var Tasks = function (data) {
    Mixins.Validator.call(this);
    Mixins.HasMany.call(this, {factory: Tasks.create, as: 'Task', collection: data});
  };

  Tasks.create = function (data) {
    return new Tasks.Types[data.type].type({});
  };

  Tasks.Task = function (type, data) {
    this.type   = m.prop(type);
    this.parent = m.prop();
  };

  Mixins.fromJSONCollection({
    parentType: Tasks,
    childType:  Tasks.Task,
    via:        'addTask'
  });

  Tasks.Task.Ant = function (data) {
    Tasks.Task.call(this, "ant");
    this.target     = m.prop(data.target || "");
    this.workingDir = m.prop(data.workingDir || "");
    this.buildFile  = m.prop(data.buildFile || "");
  };

  Tasks.Task.Ant.fromJSON = function (data) {
    return new Tasks.Task.Ant({
      target:     data.target,
      workingDir: data.working_dir,
      buildFile:  data.build_file
    });
  };

  Tasks.Task.NAnt = function (data) {
    Tasks.Task.call(this, "nant");
    this.target     = m.prop(data.target || "");
    this.workingDir = m.prop(data.workingDir || "");
    this.buildFile  = m.prop(data.buildFile || "");
    this.nantHome   = m.prop(data.nantHome || "");
  };

  Tasks.Task.NAnt.fromJSON = function (data) {
    return new Tasks.Task.NAnt({
      target:     data.target,
      workingDir: data.working_dir,
      buildFile:  data.build_file,
      nantHome:   data.nant_home
    });
  };

  Tasks.Task.Exec = function (data) {
    Tasks.Task.call(this, "exec");
    this.command    = m.prop(data.command || "");
    this.args       = m.prop(data.args || "");
    this.workingDir = m.prop(data.workingDir || "");
  };

  Tasks.Task.Exec.fromJSON = function (data) {
    return new Tasks.Task.Exec({
      command:    data.command,
      args:       data.args,
      workingDir: data.working_dir
    });
  };

  Tasks.Task.Rake = function (data) {
    Tasks.Task.call(this, "rake");
    this.target     = m.prop(data.target || "");
    this.workingDir = m.prop(data.workingDir || "");
    this.buildFile  = m.prop(data.buildFile || "");
  };

  Tasks.Task.Rake.fromJSON = function (data) {
    return new Tasks.Task.Rake({
      target:     data.target,
      workingDir: data.working_dir,
      buildFile:  data.build_file
    });
  };

  Tasks.Task.FetchArtifact = function (data) {
    Tasks.Task.call(this, "fetchartifact");
    this.pipeline = m.prop(data.pipeline || "");
    this.stage    = m.prop(data.stage) || "";
    this.job      = m.prop(data.job || "");
    this.src      = m.prop(data.src || new Tasks.Task.FetchArtifact.Src({}));
  };

  Tasks.Task.FetchArtifact.Src = function (data) {
    this.type     = m.prop(data.type);
    this.location = m.prop(data.location);
  };

  Tasks.Task.FetchArtifact.fromJSON = function (data) {
    var src = new Tasks.Task.FetchArtifact.Src(_.pick(data.src, ['type', 'location']));

    return new Tasks.Task.FetchArtifact({
      pipeline: data.pipeline,
      stage:    data.stage,
      job:      data.job,
      src:      src
    });
  };

  Tasks.Types = {
    ant:           {type: Tasks.Task.Ant, description: "Ant"},
    exec:          {type: Tasks.Task.Exec, description: "Exec"},
    nant:          {type: Tasks.Task.NAnt, description: "NAnt"},
    rake:          {type: Tasks.Task.Rake, description: "Rake"},
    fetchartifact: {type: Tasks.Task.FetchArtifact, description: "Fetch Artifact"}
  };

  Tasks.Task.fromJSON = function (data) {
    return Tasks.Types[data.type].type.fromJSON(data.attributes || {});
  };

  return Tasks;
});
