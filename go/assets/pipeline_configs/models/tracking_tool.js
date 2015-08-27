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

  var TrackingTool = function (type) {
    this.type = m.prop(type);
  };

  TrackingTool.Generic = function (data) {
    TrackingTool.call(this, "generic");
    this.urlPattern = m.prop(data.urlPattern);
    this.regex      = m.prop(data.regex);
  };

  TrackingTool.Generic.fromJSON = function (data) {
    return new TrackingTool.Generic({
      urlPattern: data.url_pattern,
      regex:      data.regex
    });
  };

  TrackingTool.Mingle = function (data) {
    TrackingTool.call(this, "mingle");
    this.baseUrl            = m.prop(data.baseUrl);
    this.projectIdentifier  = m.prop(data.projectIdentifier);
    this.groupingConditions = m.prop(data.groupingConditions);
  };

  TrackingTool.Mingle.fromJSON = function (data) {
    return new TrackingTool.Mingle({
      baseUrl:            data.base_url,
      projectIdentifier:  data.project_identifier,
      groupingConditions: data.grouping_conditions
    });
  };

  TrackingTool.Types = {
    generic: {type: TrackingTool.Generic, description: "Generic"},
    mingle:  {type: TrackingTool.Mingle, description: "Mingle"}
  };

  TrackingTool.create = function (type) {
    return new TrackingTool.Types[type].type({});
  };

  TrackingTool.fromJSON = function (data) {
    if (_.isEmpty(data)) {
      return null;
    } else {
      return TrackingTool.Types[data.type].type.fromJSON(data.attributes || {});
    }
  };
  return TrackingTool;
});
