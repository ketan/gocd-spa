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


define(['mithril', 'lodash', '../helpers/form_helper', './environment_variables_config_widget', './tasks_config_widget', './artifacts_config_widget', './properties_config_widget', './tabs_config_widget'], function (m, _, f, EnvironmentVariablesConfigWidget, TasksConfigWidget, ArtifactsConfigWidget, PropertiesConfigWidget, TabsConfigWidget) {

  var JobConfigWidget = {
    controller: function (args) {
      this.uuid        = f.uuid();
      this.job         = args.job;
      this.onRemove    = args.onRemove;
      this.selectedJob = args.selectedJob;

      this.artifactsTabId = 'job-artifacts-' + this.uuid;
    },

    view: function (ctrl, args) {
      return (
        {tag: "dd", attrs: {class:"accordion-navigation job-definition"}, children: [
          {tag: "a", attrs: {href:'#panel-' + ctrl.uuid}, children: [
            ctrl.job.name(), 
            {tag: "a", attrs: {
              href:"javascript:void(0)", 
              class:"remove", 
              onclick:ctrl.onRemove
              }}
          ]}, 

          {tag: "div", attrs: {id:'panel-' + ctrl.uuid, class:'content ' + ((ctrl.selectedJob() == ctrl.job) ? 'active' : '')}, children: [
            m.component(f.row, {}, [
              m.component(f.column, {size:12}, [
                m.component(f.inputWithLabel, {
                  attrName:"name", 
                  model:ctrl.job}), 

                m.component(f.inputWithLabel, {
                  attrName:"resources", 
                  model:ctrl.job, 
                  end:true})
              ])
            ]), 

            m.component(f.row, {}, [
              m.component(f.column, {size:12, end:true}, [
                m.component(EnvironmentVariablesConfigWidget, {variables:ctrl.job.environmentVariables()})
              ])
            ]), 

            m.component(f.row, {}, [
              m.component(f.column, {size:12, end:true}, [
                m.component(TasksConfigWidget, {tasks:ctrl.job.tasks()})
              ])
            ]), 

            m.component(f.row, {}, [
              m.component(f.column, {size:12}, [
                m.component(f.tabs, {tabTitles:['Artifacts', 'Tabs', 'Properties']}, [
                  m.component(ArtifactsConfigWidget, {artifacts:ctrl.job.artifacts()}), 
                  m.component(TabsConfigWidget, {tabs:ctrl.job.tabs()}), 
                  m.component(PropertiesConfigWidget, {properties:ctrl.job.properties()})
                ])
              ])
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

        window.setTimeout(function () {
          $(document).foundation('accordion', 'reflow');
          $(document).foundation('tab', 'reflow');
        }, 30);
      };

      this.selectJob(this.jobs.firstJob() || this.jobs.createJob());
    },

    view: function (ctrl) {
      return (
        {tag: "div", attrs: {}, children: [
          {tag: "dl", attrs: {class:"accordion", "data-accordion":true}, children: [
            ctrl.jobs.mapJobs(function (job) {
              return (
                m.component(JobConfigWidget, {job:job, 
                                 selectedJob:ctrl.selectedJob, 
                                 onRemove:ctrl.removeJob.bind(ctrl, job), 
                                 key:job.uuid()})
              );
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
