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


define(['mithril', 'lodash', '../helpers/form_helper', '../models/tasks'], function (m, _, f, Tasks) {

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
                fieldName:"task[target]", 
                model:task}
                ), 

              m.component(f.inputWithLabel, {
                attrName:"buildFile", 
                fieldName:"task[build_file]", 
                model:task}
                ), 

              m.component(f.inputWithLabel, {
                attrName:"workingDir", 
                fieldName:"task[working_dir]", 
                model:task, 
                end:true}
                )
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
                fieldName:"task[target]", 
                model:task}), 

              m.component(f.inputWithLabel, {
                attrName:"workingDir", 
                fieldName:"task[working_dir]", 
                model:task}), 

              m.component(f.inputWithLabel, {
                attrName:"buildFile", 
                fieldName:"task[build_file]", 
                model:task, 
                end:true})
            ]), 

            m.component(f.row, {}, [
              m.component(f.inputWithLabel, {
                attrName:"nantHome", 
                fieldName:"task[nant_home]", 
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
                fieldName:"task[command]", 
                model:task}), 

              m.component(f.inputWithLabel, {
                attrName:"args", 
                fieldName:"task[args]", 
                model:task}), 

              m.component(f.inputWithLabel, {
                attrName:"workingDir", 
                fieldName:"task[working_dir]", 
                model:task, 
                end:true}
                )
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
                fieldName:"task[target]", 
                model:task}
                ), 

              m.component(f.inputWithLabel, {
                attrName:"buildFile", 
                fieldName:"task[build_file]", 
                model:task}
                ), 

              m.component(f.inputWithLabel, {
                attrName:"workingDir", 
                fieldName:"task[working_dir]", 
                model:task, 
                end:true}
                )
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
                fieldName:"task[pipeline]", 
                model:task}), 

              m.component(f.inputWithLabel, {
                attrName:"stage", 
                fieldName:"task[stage]", 
                model:task}), 

              m.component(f.inputWithLabel, {
                attrName:"job", 
                fieldName:"task[job]", 
                model:task, 
                end:true}
                )
            ]), 

            m.component(f.row, {}, [
              m.component(f.inputWithLabel, {
                attrName:"type", 
                fieldName:"task[source][type]", 
                model:task.src()}), 

              m.component(f.inputWithLabel, {
                attrName:"location", 
                fieldName:"task[source][location]", 
                model:task.src(), 
                end:true})
            ])
          ])
        );
      }
    }
  };

  var TaskTypeSelector = {
    controller: function (args) {
      this.tasks    = args.tasks;
      this.selected = m.prop('exec');
      this.addTask  = function (type) {
        this.tasks.createTask({type: type()});
      };
    },

    view: function (ctrl) {
      return (
        {tag: "row", attrs: {className:"task-selector"}, children: [
          m.component(f.column, {size:3}, [
            {tag: "label", attrs: {class:"inline"}, children: ["Add task of type", 
              {tag: "select", attrs: {onchange:m.withAttr('value', ctrl.selected), class:"inline"}, children: [
                _.map(Tasks.Types, function (value, key) {
                  return ({tag: "option", attrs: {value:key, selected:ctrl.selected() === key}, children: [value.description]});
                })
              ]}
            ]}
          ]), 
          m.component(f.column, {size:2, end:true, class:"add-task"}, [
            {tag: "a", attrs: {href:"javascript:void(0)", onclick:ctrl.addTask.bind(ctrl, ctrl.selected)}, children: ["Add"]}
          ])
        ]}
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
            return (m.component(taskView, {task: task}));
          }), 
          m.component(TaskTypeSelector, {tasks:tasks})
        ]}
      );
    }
  };

  return TasksConfigWidget;
});
