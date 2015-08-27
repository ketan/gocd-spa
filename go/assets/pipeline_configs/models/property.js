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
  var Property = function (data) {
    this.name  = m.prop(data.name);
    this.src   = m.prop(data.src);
    this.xpath = m.prop(data.xpath);
  };

  Property.fromJSON = function (data) {
    if (_.isEmpty(data)) {
      return null;
    } else if (data instanceof Array) {
      return _.map(data, Property.fromJSON);
    } else {
      return new Property(_.pick(data, ['name', 'src', 'xpath']));
    }
  };

  return Property;
});
