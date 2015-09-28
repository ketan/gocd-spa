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


define(['mithril', 'lodash', '../helpers/form_helper', '../helpers/tooltips', './environment_variables_config_widget', './tasks_config_widget', './artifacts_config_widget', './properties_config_widget', './tabs_config_widget'], function (m, _, f, tt, EnvironmentVariablesConfigWidget, TasksConfigWidget, ArtifactsConfigWidget, PropertiesConfigWidget, TabsConfigWidget) {

  var JobsConfigWidget = {
    controller: function (args) {
      this.jobs             = args.jobs;
      this.selectedJobIndex = args.selectedJobIndex;

      this.appendJob = function () {
        var newJob = this.jobs.createJob();
        this.selectedJobIndex(this.jobs.indexOfJob(newJob));
      };

      this.removeJob = function (job) {
        var previousJob = this.jobs.previousJob(job);
        this.jobs.removeJob(job);

        var firstJob = this.jobs.firstJob() || this.jobs.createJob();
        this.selectedJobIndex(this.jobs.indexOfJob(previousJob || firstJob));
      };

      this.selectedJobIndex(this.jobs.indexOfJob(this.jobs.firstJob() || this.jobs.createJob()));
    },

    view: function (ctrl) {
      return (
        {tag: "div", attrs: {}, children: [
          m.component(f.tabs, {class:"job-definitions", 
                  tabTitles:ctrl.jobs.collectJobProperty('name'), 
                  tabKeys:ctrl.jobs.collectJobProperty('uuid'), 
                  isVertical:true, 
                  selectedIndex:ctrl.selectedJobIndex}, [
            ctrl.jobs.mapJobs(function (job) {
              return (
                m.component(f.row, {class:"job-definition"}, [
                  m.component(f.column, {size:9}, [
                    m.component(f.removeButton, {onclick:ctrl.removeJob.bind(ctrl, job), class:"remove-job"}), 
                    m.component(f.row, {}, [
                      m.component(f.inputWithLabel, {
                        attrName:"name", 
                        model:job}), 

                      m.component(f.inputWithLabel, {
                        attrName:"resources", 
                        model:job, 
                        tooltip:{
                          content: tt.job.resources,
                          direction: 'bottom',
                          size: 'small'
                        }, 
                        end:true})
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
                    ]), 

                    m.component(f.row, {}, [
                      m.component(f.column, {size:12}, [
                        m.component(f.tabs, {tabTitles:['Artifacts', 'Tabs', 'Properties'], 
                                tabKeys:['artifacts', 'tabs', 'properties']}, [
                          m.component(ArtifactsConfigWidget, {artifacts:job.artifacts()}), 
                          m.component(TabsConfigWidget, {tabs:job.tabs()}), 
                          m.component(PropertiesConfigWidget, {properties:job.properties()})
                        ])
                      ])
                    ])

                  ])
                ])
              );
            })
          ]), 
          m.component(f.row, {}, [
            m.component(f.column, {size:2, end:true}, [
              {tag: "div", attrs: {class:"add-job"}, children: [
                {tag: "a", attrs: {href:"javascript:void(0)", 
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
