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


define(['mithril', 'lodash', '../helpers/form_helper', './environment_variable_config_widget', './tasks_config_widget'], function (m, _, f, EnvironmentVariablesConfigWidget, TasksConfigWidget) {

  var JobConfigWidget = {
    controller: function () {
      this.uuid = f.uuid();
    },

    view: function (ctrl, args) {
      var job      = args.job;
      var onRemove = args.onRemove;

      return (
        {tag: "dd", attrs: {class:"accordion-navigation"}, children: [
          {tag: "a", attrs: {href:`#panel-${ctrl.uuid}`}, children: [job.name()]}, 

          {tag: "div", attrs: {id:`panel-${ctrl.uuid}`, class:"content active"}, children: [
            m.component(f.row, {}, [
              {tag: "div", attrs: {class:"job-definition", "data-key":job.name()}, children: [

                {tag: "a", attrs: {
                  href:"javascript:void(0)", 
                  class:"remove", 
                  onclick:onRemove
                  }}, 


                m.component(f.row, {}, [
                  m.component(f.inputWithLabel, {
                    attrName:"name", 
                    fieldName:"job[name]", 
                    model:job}
                    ), 

                  m.component(f.inputWithLabel, {
                    attrName:"resources", 
                    fieldName:"job[resources]", 
                    model:job, 
                    end:true}
                    )
                ]), 

                m.component(f.row, {}, [
                  m.component(f.column, {size:12, end:true}, [
                    m.component(EnvironmentVariablesConfigWidget, {variables:job.environmentVariables()})
                  ])
                ]), 

                m.component(f.row, {}, [
                  m.component(f.column, {size:12, end:true}, [
                    m.component(TasksConfigWidget, {tasks:job.tasks()})
                  ])
                ])
              ]}
            ])
          ]}
        ]}
      );
    }
  };

  var JobsConfigWidget = {
    controller: function (args) {
      this.jobs        = args.jobs;
      this.selectedJob = args.selectedJob;

      this.appendJob = function () {
        this.selectJob(this.jobs.createJob());
      };

      this.removeJob = function (job) {
        var previousJob = this.jobs.previousJob(job);
        var firstJob    = this.jobs.firstJob();
        this.selectJob(previousJob || firstJob);
        this.jobs.removeJob(job);
      };

      this.selectJob = function (job) {
        this.selectedJob(job);
        $(document).foundation('accordion', 'reflow');
      };

      this.selectJob(this.jobs.firstJob() || this.jobs.createJob());
    },

    view: function (ctrl) {
      return (
        {tag: "div", attrs: {}, children: [

          {tag: "dl", attrs: {class:"accordion", "data-accordion":true}, children: [
            ctrl.jobs.mapJobs(function (job) {
              return (m.component(JobConfigWidget, {job:job, onRemove:ctrl.removeJob.bind(ctrl, job)}));
            })
          ]}, 
          m.component(f.row, {}, [
            m.component(f.column, {size:2, end:true}, [
              {tag: "div", attrs: {class:"add-job"}, children: [
                {tag: "a", attrs: {
                  href:"javascript:void(0)", 
                  onclick:ctrl.appendJob.bind(ctrl), 
                  class:"add-job"}, children: ["Add Job"]}
              ]}
            ])
          ])
        ]}
      );
    }
  };

  return JobsConfigWidget;
});
