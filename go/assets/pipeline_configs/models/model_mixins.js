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


define(['lodash', 'validate-plus', 'string'], function (_, validate, s) {

  var Mixins = {};

  Mixins.HasMany = function (options) {
    var factory               = options.factory;
    var associationName       = options.as;
    var associationNamePlural = options.as + 's';
    var collection            = m.prop(options.collection || []);

    this['add' + associationName] = function (instance) {
      collection().push(instance);
    };

    this['create' + associationName] = function (options) {
      var instance = factory(options || {});
      instance.parent(this);

      this['add' + associationName](instance);
      return instance;
    };

    this['remove' + associationName] = function (variable) {
      _.remove(collection(), variable);
    };

    this['first' + associationName] = function () {
      return _.first(collection());
    };

    this['previous' + associationName] = function (thing) {
      return collection()[_.indexOf(collection(), thing) - 1];
    };

    this['last' + associationName] = function () {
      return _.last(collection());
    };

    this['map' + associationNamePlural] = function (cb, thisArg) {
      return _.map(collection(), cb, thisArg);
    };

    this['collect' + associationName + 'Property'] = function (propName) {
      return this['map' + associationNamePlural](function (child) {
        return child[propName]();
      });
    };
  };

  Mixins.fromJSONCollection = function (options) {
    var parentType     = options.parentType;
    var childType      = options.childType;
    var addChildMethod = options.via;

    parentType.fromJSON = function (data) {
      var parentInstance = new parentType();
      if (!_.isEmpty(data)) {
        var assignParent = function (childInstance) {
          childInstance.parent(parentInstance);
          return childInstance;
        };
        _.map(data, _.flow(childType.fromJSON, assignParent, parentInstance[addChildMethod]));
      }
      return parentInstance;
    };
  };

  Mixins.UniqueInCollection = function (options) {
    var uniqueOn = options.uniqueOn;
    var type     = options.type;
    var parent   = this.parent = m.prop();

    this.constraints = function () {
      var validations       = {};
      validations[uniqueOn] = {
        duplicates: function () {
          return {
            list: parent()['collect' + type + 'Property'](uniqueOn)
          };
        }
      };
      return validations;
    };
  };

  Mixins.Validator = function () {
    var errors = null;

    this.validate = function (constraints, shouldMerge) {
      constraints = _.merge({}, constraints || this.constraints(), shouldMerge ? this.constraints() : {});

      var asPlainObject = JSON.parse(JSON.stringify(this));
      errors            = validate(asPlainObject, constraints);
    };

    this.errors = function (optionalAttribute) {
      if (_.isEmpty(errors)) {
        return;
      }

      if (optionalAttribute) {
        return errors[optionalAttribute];
      }

      return errors;
    };

    this.errorForDisplay = function (optionalAttribute) {
      return _.map(this.errors(optionalAttribute) || [], function (error) {
        return error + ".";
      }).join(" ");
    };
  };

  return Mixins;
})
;
