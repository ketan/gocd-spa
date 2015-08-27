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



define(['lib/validate', 'lodash'], function (validate, _) {
  validate.validators.duplicates = function (value, options, key, attributes) {
    if (_.isEmpty(value)) {
      return;
    }
    var occurences = _.countBy(options.list);
    if (occurences[value] > 1) {
      return "is a duplicate";
    }
  };

  return validate;
});
