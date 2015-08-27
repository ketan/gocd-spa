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


define(['mithril', 'lodash', 'string', './model_mixins', './constraints'], function (m, _, s, Mixins, constraints) {

  var Parameters = function (data) {
    Mixins.Validator.call(this);
    Mixins.HasMany.call(this, {factory: Parameters.Parameter.create, as: 'Parameter', collection: data});
  };

  Parameters.Parameter = function (data) {
    Mixins.Validator.call(this);
    Mixins.UniqueInCollection.call(this, {uniqueOn: 'name', type: 'Parameter'});
    this.name  = m.prop(data.name || null);
    this.value = m.prop(data.value || null);

    this.isBlank = function () {
      return s.isBlank(this.name()) && s.isBlank(this.value());
    };
  };

  Parameters.Parameter.create = function (data) {
    return new Parameters.Parameter(data);
  };

  Mixins.fromJSONCollection({
    parentType: Parameters,
    childType:  Parameters.Parameter,
    via:        'addParameter'
  });

  Parameters.Parameter.Constraints = {
    name: constraints.name
  };

  Parameters.Parameter.fromJSON = function (data) {
    return new Parameters.Parameter(_.pick(data, ['name', 'value']));
  };

  return Parameters;
});
