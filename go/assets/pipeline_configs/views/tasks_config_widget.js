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


define(['mithril', 'lodash', 'jquery', 'angular', '../helpers/form_helper', '../models/tasks', '../models/pluggable_tasks', 'js-routes'], function (m, _, $, angular, f, Tasks, PluggableTasks, Routes) {

  var TaskViews = {
    base: {
      view: function (controller, args, children) {
        var task = args.task;
        return (
          {tag: "fieldset", attrs: {className:'task task-type-' + task.type()}, children: [
            {tag: "legend", attrs: {class:"task-type"}, children: [task.type()]}, 
            children
          ]}
        );
      }
    },

    ant:  {
      view: function (controller, args) {
        var task = args.task;
        return (
          m.component(TaskViews.base, {task:task}, [
            m.component(f.row, {}, [
              m.component(f.inputWithLabel, {
                attrName:"target", 
                model:task}), 

              m.component(f.inputWithLabel, {
                attrName:"buildFile", 
                model:task}), 

              m.component(f.inputWithLabel, {
                attrName:"workingDir", 
                model:task, 
                end:true})
            ])
          ])
        );
      }
    },
    nant: {
      view: function (controller, args) {
        var task = args.task;
        return (
          m.component(TaskViews.base, {task:task}, [
            m.component(f.row, {}, [
              m.component(f.inputWithLabel, {
                attrName:"target", 
                model:task}), 

              m.component(f.inputWithLabel, {
                attrName:"workingDir", 
                model:task}), 

              m.component(f.inputWithLabel, {
                attrName:"buildFile", 
                model:task, 
                end:true})
            ]), 

            m.component(f.row, {}, [
              m.component(f.inputWithLabel, {
                attrName:"nantHome", 
                model:task, 
                end:true})
            ])

          ])
        );
      }
    },

    exec: {
      view: function (controller, args) {
        var task = args.task;
        return (
          m.component(TaskViews.base, {task:task}, [
            m.component(f.row, {}, [
              m.component(f.inputWithLabel, {
                attrName:"command", 
                model:task}), 

              m.component(f.inputWithLabel, {
                attrName:"args", 
                model:task}), 

              m.component(f.inputWithLabel, {
                attrName:"workingDir", 
                model:task, 
                end:true})
            ])
          ])
        );
      }
    },

    rake: {
      view: function (controller, args) {
        var task = args.task;
        return (
          m.component(TaskViews.base, {task:task}, [
            m.component(f.row, {}, [
              m.component(f.inputWithLabel, {
                attrName:"target", 
                model:task}), 

              m.component(f.inputWithLabel, {
                attrName:"buildFile", 
                model:task}), 

              m.component(f.inputWithLabel, {
                attrName:"workingDir", 
                model:task, 
                end:true})
            ])
          ])
        );
      }
    },

    fetchartifact: {
      view: function (controller, args) {
        var task = args.task;
        return (
          m.component(TaskViews.base, {task:task}, [
            m.component(f.row, {}, [
              m.component(f.inputWithLabel, {
                attrName:"pipeline", 
                model:task}), 

              m.component(f.inputWithLabel, {
                attrName:"stage", 
                model:task}), 

              m.component(f.inputWithLabel, {
                attrName:"job", 
                model:task, 
                end:true})
            ]), 

            m.component(f.row, {}, [
              m.component(f.inputWithLabel, {
                attrName:"type", 
                model:task.source()}), 

              m.component(f.inputWithLabel, {
                attrName:"location", 
                model:task.source(), 
                end:true})
            ])
          ])
        );
      }
    },

    plugin: {
      controller: function (args) {
        this.task              = args.task;
        this.templateHTML      = PluggableTasks.Types[this.task.pluginId()].templateHTML;
        this.defaultTaskConfig = PluggableTasks.Types[this.task.pluginId()].configuration;
        this.uuid              = f.uuid();
        this.ngControllerName  = 'controller-' + this.uuid;
        this.appName           = 'app-' + this.uuid;
        this.ngModule          = angular.module(this.appName, []);

        this.hasBootstrapped = false;

        var ctrl = this;

        this.ngController = angular.module(this.appName).controller(this.ngControllerName, ['$scope', '$http', function ($scope, $http) {
          $scope.addError = function (field) {
            this.GOINPUTNAME[field.name] = {
              $error: {
                server: field.errors.join()
              }
            };
          };

          $scope.clearErrors = function () {
            this.GOINPUTNAME               = {};
            this.pluggableTaskGenericError = null;
          };

          $scope.clearErrors();

          _.map(ctrl.defaultTaskConfig, function (config) {
            var value = ctrl.task.configuration().valueFor(config.name);

            if (!value) {
              value = config.value;
            }

            $scope[config.name] = value;

            $scope.$watch(config.name, _.debounce(function (newValue, oldValue) {
              ctrl.task.configuration().setConfiguration(config.name, newValue);
              var req = {
                url:     Routes.apiInternalPluggableTaskValidationPath({plugin_id: ctrl.task.pluginId()}),
                method:  'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-CSRF-Token': document.querySelector('meta[name=csrf-token]').getAttribute('content')
                },
                data:    JSON.stringify(ctrl.task.configuration())
              };

              $http(req).then(
                $scope.clearErrors.bind($scope),
                function (response) {
                  if (response.status === 422) {
                    _.each(response.data, $scope.addError, $scope);
                  } else if (response.status === 520) {
                    $scope.pluggableTaskGenericError = response.data.error;
                  } else {
                    console.log('Something went wrong, we do not know what!');
                  }
                });
            }, 100));
          });
        }]);
      },

      view: function (ctrl, args) {
        window.setTimeout(function () {
          var pluginTaskElem            = $('#' + ctrl.uuid);
          var pluginTaskTemplateElement = $('#template-' + ctrl.uuid);
          if (!ctrl.hasBootstrapped) {
            angular.bootstrap(pluginTaskTemplateElement.get(0), [ctrl.appName]);
            ctrl.hasBootstrapped = true;
          }
          pluginTaskElem.show();
        }, 25);

        return (
          {tag: "div", attrs: {id:ctrl.uuid, style:"display:none"}, children: [
            m.component(TaskViews.base, {task:ctrl.task}, [
              {tag: "div", attrs: {id:'template-' + ctrl.uuid, "ng-controller":ctrl.ngControllerName}, children: [
                {tag: "div", attrs: {class:"alert-box alert", "ng-show":"pluggableTaskGenericError"}, children: ['{{pluggableTaskGenericError}}']}, 
                m.trust(ctrl.templateHTML)
              ]}
            ])
          ]}
        );
      }
    }
  };

  var TaskTypeSelector = {
    controller: function (args) {
      this.tasks    = args.tasks;
      this.selected = m.prop('exec');
      this.addTask  = function (type) {

        if (Tasks.isBuiltInTaskType(type())) {
          this.tasks.createTask({type: type()});
        } else {
          var pluggableTaskDescriptor = PluggableTasks.Types[type()];
          this.tasks.createTask({
            type:     type(),
            pluginId: type(),
            version:  pluggableTaskDescriptor.version
          });
        }
      };
    },

    view: function (ctrl) {

      var items = _.transform(_.merge({}, Tasks.Types, PluggableTasks.Types), function (result, value, key) {
        result[key] = value.description;
      });

      return (
        m.component(f.row, {className:"task-selector"}, [
          m.component(f.column, {size:3}, [
            {tag: "label", attrs: {class:"inline"}, children: ["Add task of type", 
              m.component(f.select, {
                value:ctrl.selected, 
                class:"inline", 
                items:items})
            ]}
          ]), 
          m.component(f.column, {size:2, end:true, class:"add-task"}, [
            {tag: "a", attrs: {href:"javascript:void(0)", onclick:ctrl.addTask.bind(ctrl, ctrl.selected)}, children: ["Add"]}
          ])
        ])
      );
    }
  };

  var TasksConfigWidget = {
    view: function (ctrl, args) {
      var tasks = args.tasks;
      return (
        {tag: "div", attrs: {className:"tasks"}, children: [
          tasks.mapTasks(function (task) {
            var taskView = TaskViews[task.type()];
            return (m.component(taskView, {task: task, key: task.uuid()}));
          }), 
          m.component(TaskTypeSelector, {tasks:tasks})
        ]}
      );
    }
  };

  return TasksConfigWidget;
});
