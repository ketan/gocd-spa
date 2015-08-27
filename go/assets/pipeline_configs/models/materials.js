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

  var Materials = function (data) {
    Mixins.Validator.call(this);
    Mixins.HasMany.call(this, {factory: Materials.create, as: 'Material', collection: data});
  };

  Materials.create = function (data) {
    return new Materials.Types[data.type].type({});
  };

  Materials.Material = function (type, data) {
    Mixins.Validator.call(this);
    Mixins.UniqueInCollection.call(this, {uniqueOn: 'name', type: 'Material'});

    this.type       = m.prop(type);
    this.name       = m.prop(data.name || '');
    this.autoUpdate = m.prop(data.autoUpdate);
  };

  Mixins.fromJSONCollection({
    parentType: Materials,
    childType:  Materials.Material,
    via:        'addMaterial'
  });

  Materials.Material.SVN = function (data) {
    Materials.Material.call(this, "svn", data);
    this.dest           = m.prop(data.dest || '');
    this.url            = m.prop(data.url || '');
    this.username       = m.prop(data.username || '');
    this.password       = m.prop(data.password || '');
    this.checkExternals = m.prop(data.checkExternals);
  };

  Materials.Material.SVN.fromJSON = function (data) {
    return new Materials.Material.SVN({
      url:            data.url,
      username:       data.username,
      password:       data.password,
      checkExternals: data.check_externals,
      dest:           data.dest,
      name:           data.name,
      autoUpdate:     data.auto_update
    });
  };

  Materials.Material.Git = function (data) {
    Materials.Material.call(this, "git", data);
    this.dest   = m.prop(data.dest || '');
    this.url    = m.prop(data.url || '');
    this.branch = m.prop(data.branch || '');
  };

  Materials.Material.Git.fromJSON = function (data) {
    return new Materials.Material.Git({
      url:        data.url,
      branch:     data.branch,
      dest:       data.dest,
      name:       data.name,
      autoUpdate: data.auto_update
    });
  };

  Materials.Material.Mercurial = function (data) {
    Materials.Material.call(this, "hg", data);
    this.dest   = m.prop(data.dest || '');
    this.url    = m.prop(data.url || '');
    this.branch = m.prop(data.branch || '');
  };

  Materials.Material.Mercurial.fromJSON = function (data) {
    return new Materials.Material.Mercurial({
      url:        data.url,
      branch:     data.branch,
      dest:       data.dest,
      name:       data.name,
      autoUpdate: data.auto_update
    });
  };

  Materials.Material.Perforce = function (data) {
    Materials.Material.call(this, "p4", data);
    this.dest       = m.prop(data.dest || '');
    this.port       = m.prop(data.port || '');
    this.username   = m.prop(data.username || '');
    this.password   = m.prop(data.password || '');
    this.view       = m.prop(data.view || '');
    this.useTickets = m.prop(data.useTickets);
  };

  Materials.Material.Perforce.fromJSON = function (data) {
    return new Materials.Material.Perforce({
      port:       data.port,
      username:   data.username,
      password:   data.password,
      useTickets: data.use_tickets,
      dest:       data.dest,
      view:       data.view,
      autoUpdate: data.auto_update,
      name:       data.name
    });
  };

  Materials.Material.TFS = function (data) {
    Materials.Material.call(this, "tfs", data);
    this.dest        = m.prop(data.dest || '');
    this.url         = m.prop(data.url || '');
    this.domain      = m.prop(data.domain || '');
    this.username    = m.prop(data.username || '');
    this.password    = m.prop(data.password) || '';
    this.projectPath = m.prop(data.projectPath || '');
  };

  Materials.Material.TFS.fromJSON = function (data) {
    return new Materials.Material.TFS({
      url:         data.url,
      domain:      data.domain,
      username:    data.username,
      password:    data.password,
      dest:        data.dest,
      projectPath: data.project_path,
      autoUpdate:  data.auto_update,
      name:        data.name
    });
  };

  Materials.Types = {
    git: {type: Materials.Material.Git, description: "Git"},
    svn: {type: Materials.Material.SVN, description: "SVN"},
    hg:  {type: Materials.Material.Mercurial, description: "Mercurial"},
    p4:  {type: Materials.Material.Perforce, description: "Perforce"},
    tfs: {type: Materials.Material.TFS, description: "Team Foundation Server"}
  };

  Materials.Material.fromJSON = function (data) {
    return Materials.Types[data.type].type.fromJSON(data.attributes || {});
  };

  return Materials;
});
