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


define(['mithril', 'lodash', './form_helper'], function (m, _, f) {

  var UseThis = {
    view: function (ctrl, args) {
      return ({tag: "a", attrs: {title:"Use this", onclick:_.wrap(args.toShow, args.callback)}, children: [args.toShow]});
    }
  };

  var ExampleTable = {
    view: function (ctrl, args) {
      return (
        {tag: "table", attrs: {}, children: [
          {tag: "caption", attrs: {}, children: [args.tableTitle || 'Some Examples']}, 
          {tag: "tbody", attrs: {}, children: [
          _.map(args.examples, function (value, key) {

            var toShow = args.callback ? (m.component(UseThis, {callback:args.callback, toShow:key})) : key;

            return (
              {tag: "tr", attrs: {}, children: [
                {tag: "td", attrs: {width:args.firstColumnWidth}, children: [{tag: "code", attrs: {}, children: [toShow]}]}, 
                {tag: "td", attrs: {}, children: [value]}
              ]}
            );
          })
          ]}
        ]}
      );
    }
  };

  var pipelineLabelTemplate = {
    view: function (ctrl, args) {
      return (
        {tag: "div", attrs: {}, children: [
          {tag: "p", attrs: {}, children: [
            "Pipeline label templates provide a means to label a pipeline or artefacts using a counter, or material" + ' ' +
            "revision" + ' ' +
            "(or both)."
          ]}, 

          {tag: "p", attrs: {}, children: [
            "An example of a label template is", ' ', 
            {tag: "code", attrs: {}, children: [m.component(UseThis, {callback:args.callback, toShow:"15.1-${COUNT}"})]}, ' ', "or ", ' ', 
            {tag: "code", attrs: {}, children: [m.component(UseThis, {callback:args.callback, toShow:"15.1-${COUNT}-${svn}"})]}, ' ', "or ", ' ', 
            {tag: "code", attrs: {}, children: [m.component(UseThis, {callback:args.callback, toShow:"15.1-${COUNT}-${git[:7]}"})]}, "."
          ]}, 

          m.component(ExampleTable, {tableTitle:"Allowed substitutions", 
                        firstColumnWidth:"260px", 
                        examples:{
                      '${COUNT}': 'The pipeline counter (starts at 1).',
                      '${<material-name>}': 'The revision of the material named "material-name". The "material-name" can be the name of an SCM material, or a pipeline material.',
                      '${<material-name>[:<length>]}': 'The first "length" characters of revision of the material named "material-name".',
                      '#{<parameter-name>}': 'Substitute the value of the parameter named "parameter-name".'
                    }})

        ]}
      );
    }
  };

  var pipelineEnablePipelineLocking = (
    {tag: "div", attrs: {}, children: [
      {tag: "p", attrs: {}, children: [
        "If checked, only a single instance of the pipeline can be run at a time and the lock" + ' ' +
        "will release only if the" + ' ' +
        "entire pipeline completes successfully."
      ]}, 

      {tag: "p", attrs: {}, children: [
        "This is particularly useful in deployment scenarios, where you may want" + ' ' +
        "to ensure that multiple pipeline instances are not deploying simultaneously."
      ]}
    ]}
  );


  var trackingToolGenericRegex = {
    view: function (ctrl, args) {
      return (
        {tag: "div", attrs: {}, children: [
          {tag: "p", attrs: {}, children: [
            "Any mention of issue or story numbers in commit messages will be parsed using this regular expression."
          ]}, 

          m.component(ExampleTable, {callback:args.callback, 
                        firstColumnWidth:"150px", 
                        examples:{
                          '##(\\d+)': (
                            {tag: "span", attrs: {}, children: [
                              "Will extract the issue \"1748\" from the message", 
                              {tag: "br", attrs: {}}, 
                              {tag: "code", attrs: {}, children: ["Improve message on login failure (fixes ", {tag: "a", attrs: {}, children: ["#1748"]}, ")."]}
                            ]}
                          ),
                          '(JIRA-\\d+)': (
                            {tag: "span", attrs: {}, children: [
                              "Will extract the issue \"JIRA-1748\" from the message", 
                              {tag: "br", attrs: {}}, 
                              {tag: "code", attrs: {}, children: ["[", {tag: "a", attrs: {}, children: ["JIRA-1748"]}, "] Improve message on login failure."]}
                            ]}
                          )
                        }})
        ]}
      );
    }
  };


  var trackingToolGenericUrlPattern = {
    view: function (ctrl, args) {
      return (
        {tag: "div", attrs: {}, children: [
          {tag: "p", attrs: {}, children: [
            "The URL to your tracking tool. This must contain the string ", {tag: "code", attrs: {}, children: ['${ID}']}, " which will be replaced" + ' ' +
            "with" + ' ' +
            "the number" + ' ' +
            "identified using the pattern."
          ]}, 

          m.component(ExampleTable, {callback:args.callback, 
                        examples:{
                          'https://github.com/gocd/gocd/issues/${ID}': 'GitHub Issues',
                          'https://bugzilla.example.com/bugs/bug.php?id=${ID}': 'Bugzilla Issue',
                          'https://jira.example.com/jira/browse/${ID}': 'Jira Issue'
                        }})
        ]}
      );
    }
  };

  var trackingToolMingleBaseUrl = {
    view: function (ctrl, args) {
      return (
        {tag: "div", attrs: {}, children: [
          {tag: "p", attrs: {}, children: [
            "Base URI to the Mingle installation (do not include the project name/identifier)"
          ]}, 

          m.component(ExampleTable, {callback:args.callback, 
                        examples:{
                          'https://widgets.example.com/mingle': 'Mingle on your premises',
                          'https://example.mingle.thoughtworks.com': 'Hosted mingle'
                        }})
        ]}
      );
    }
  };

  var trackingToolMingleProjectIdentifier = {
    view: function (ctrl, args) {
      return (
        {tag: "div", attrs: {}, children: [
          {tag: "p", attrs: {}, children: [
            "The identifier of your mingle project. This can be found under the project's 'Project admin' tab in the" + ' ' +
            "section titled 'Basic Information'."
          ]}
        ]}
      );
    }
  };

  var trackingToolMingleGroupingConditions = {
    view: function (ctrl, args) {
      return (
        {tag: "div", attrs: {}, children: [
          {tag: "p", attrs: {}, children: [
            "A MQL string that determines the 'passing criteria' for cards displayed."
          ]}, 

          m.component(ExampleTable, {callback:args.callback, 
                        examples:{
                          "status > 'In Dev'": "Only list cards that are past 'In Dev'"
                        }})
        ]}
      );

    }
  };


  var environmentVariables = (
    {tag: "div", attrs: {}, children: [
      {tag: "p", attrs: {}, children: [
        "Environment variables defined here are set when executing your tasks." + ' ' +
        "Use secure environment variables, to ensure that the environment variable are never displayed in plain text on" + ' ' +
        "the console log or when editing configuration."
      ]}, 

      {tag: "p", attrs: {}, children: [
        "Go also supports Secure Environment Variables the values of these variables are never displayed anywhere" + ' ' +
        "once they are setup. We also make a best attempt to clear out any occurrences of the secure environment" + ' ' +
        "variables values from the console logs."
      ]}, 

      {tag: "a", attrs: {href:"http://www.go.cd/documentation/user/current/faq/dev_use_current_revision_in_build.html"}, children: [
        "Read more..."
      ]}

    ]}
  );

  var materialDestination = (
    {tag: "div", attrs: {}, children: [
      {tag: "p", attrs: {}, children: ["The destination directory where the contents of this repository will be checked out."]}
    ]}
  );

  var materialName = (
    {tag: "div", attrs: {}, children: [
      {tag: "p", attrs: {}, children: [
        "(Optional)" + ' ' +
        "The name of the material. If omitted, the default material name is the URL." + ' ' +
        "You can override this by setting the material name explicitly."]}
    ]}
  );

  var pipelineTimerSpec          = {
    view: function (ctrl, args) {
      return (
        {tag: "div", attrs: {class:"cron-tooltip"}, children: [
          {tag: "p", attrs: {}, children: [
            "A cron expression is a string comprised of 6 or 7 fields separated by white space." + ' ' +
            "Fields can contain any of the allowed values, along with various combinations of the allowed special" + ' ' +
            "characters for that field. The fields are as follows:"
          ]}, 

          {tag: "p", attrs: {}, children: [
            {tag: "code", attrs: {}, children: ["seconds minutes hours day_of_month month day_of_week [year(optional)]"]}
          ]}, 

          m.component(f.row, {}, [
            m.component(f.column, {size:4}, [
              {tag: "table", attrs: {}, children: [
                {tag: "thead", attrs: {}, children: [
                {tag: "tr", attrs: {}, children: [
                  {tag: "th", attrs: {}, children: ["Field"]}, 
                  {tag: "th", attrs: {}, children: ["Value"]}
                ]}
                ]}, 
                {tag: "tbody", attrs: {}, children: [
                {tag: "tr", attrs: {}, children: [
                  {tag: "td", attrs: {}, children: ["seconds"]}, 
                  {tag: "td", attrs: {}, children: [
                    {tag: "code", attrs: {}, children: ["0-59"]}
                  ]}
                ]}, 
                {tag: "tr", attrs: {}, children: [
                  {tag: "td", attrs: {}, children: ["minutes"]}, 
                  {tag: "td", attrs: {}, children: [
                    {tag: "code", attrs: {}, children: ["0-59"]}
                  ]}
                ]}, 
                {tag: "tr", attrs: {}, children: [
                  {tag: "td", attrs: {}, children: ["hours"]}, 
                  {tag: "td", attrs: {}, children: [
                    {tag: "code", attrs: {}, children: ["0-23"]}
                  ]}
                ]}, 
                {tag: "tr", attrs: {}, children: [
                  {tag: "td", attrs: {}, children: ["day of month"]}, 
                  {tag: "td", attrs: {}, children: [
                    {tag: "code", attrs: {}, children: ["0-31"]}
                  ]}
                ]}, 
                {tag: "tr", attrs: {}, children: [
                  {tag: "td", attrs: {}, children: ["month"]}, 
                  {tag: "td", attrs: {}, children: [
                    {tag: "code", attrs: {}, children: ["1-12"]}, ' ', "OR", ' ', {tag: "code", attrs: {}, children: ["jan-dec"]}
                  ]}
                ]}, 
                {tag: "tr", attrs: {}, children: [
                  {tag: "td", attrs: {}, children: ["day of week"]}, 
                  {tag: "td", attrs: {}, children: [
                    {tag: "code", attrs: {}, children: ["1-7"]}, ' ', "OR", ' ', {tag: "code", attrs: {}, children: ["sun-sat"]}
                  ]}
                ]}, 
                {tag: "tr", attrs: {}, children: [
                  {tag: "td", attrs: {}, children: ["year"]}, 
                  {tag: "td", attrs: {}, children: [
                    {tag: "code", attrs: {}, children: ["1970-2099"]}
                  ]}
                ]}
                ]}
              ]}
            ]), 
            m.component(f.column, {size:8, end:true, class:"cron-field-explanation"}, [
              {tag: "p", attrs: {}, children: [
                "A field may be an asterix (", {tag: "code", attrs: {}, children: ["*"]}, "), which stands for \"all possible values\"."
              ]}, 

              {tag: "p", attrs: {}, children: [
                "Ranges of numbers are allowed. Ranges are two numbers separated with a hyphen. For example,", 
                {tag: "code", attrs: {}, children: ["8-11"]}, " for an \"hours\" entry specifies execution at hours 8, 9, 10 and 11."
              ]}, 

              {tag: "p", attrs: {}, children: ["Lists are allowed. A list is a set of numbers (or ranges) separated by commas. Examples:", 
                {tag: "code", attrs: {}, children: ["1,2,5,9"]}, ", ", {tag: "code", attrs: {}, children: ["0-4,8-12"]}
              ]}, 

              {tag: "p", attrs: {}, children: [
                "Step values can be used together with ranges. For example, ", {tag: "code", attrs: {}, children: ["10-22/4"]}, " can be used in the" + ' ' +
                "hours field to specify command execution every at the hours 10, 14, 18, 22."
              ]}
            ])
          ]), 


          m.component(ExampleTable, {callback:args.callback, 
                        examples:{
                    '0 0 */4 * * *': 'Run every 4th hour',
                    '0 0 1 * * *': 'Run at 1:00 AM everyday',
                    '0 43 2 * * sat': 'Run at 2:43 AM every saturday'
                  }})


        ]}
      );
    }
  };
  var pipelineTimerOnlyOnChanges = (
    {tag: "div", attrs: {}, children: [
      {tag: "p", attrs: {}, children: [
        "Run only if the pipeline hasn't previously run with the latest material(s)." + ' ' +
        "This option is typically useful when automatic pipeline scheduling is turned off."
      ]}
    ]}
  );

  var trackingToolMain = (
    {tag: "div", attrs: {}, children: [
      {tag: "p", attrs: {}, children: [
        "Can be used to specify links to an issue tracker. Go will construct a link based on the commit message" + ' ' +
        "that you" + ' ' +
        "can use to take you to your tracking tool (Mingle card, JIRA issue, Trac issue etc)."
      ]}
    ]}
  );

  var stageFetchMaterials        = (
    {tag: "div", attrs: {}, children: [
      {tag: "p", attrs: {}, children: ["Perform material updates or checkouts."]}
    ]}
  );
  var stageNeverCleanArtifacts   = (
    {tag: "div", attrs: {}, children: [
      {tag: "p", attrs: {}, children: ["Never cleanup artifacts for this stage, if purging artifacts is configured at the" + ' ' +
        "Server Level."]}
    ]}
  );
  var stageCleanWorkingDirectory = (
    {tag: "div", attrs: {}, children: [
      {tag: "p", attrs: {}, children: ["Remove all files and directories before running this stage."]}
    ]}
  );
  var pipelineParametersMain     = (
    {tag: "div", attrs: {}, children: [
      {tag: "p", attrs: {}, children: [
        "Parameters help reduce repetition within your configurations and combined with templates allow you" + ' ' +
        "to setup" + ' ' +
        "complex configurations.", ' '
      ]}, 
      {tag: "a", attrs: {
        href:"http://www.go.cd/documentation/user/current/configuration/admin_use_parameters_in_configuration.html"}, children: [
        "Read more..."
      ]}
    ]}
  );

  var jobResources = (
    {tag: "div", attrs: {}, children: [
      {tag: "p", attrs: {}, children: [
        "Jobs tagged with these resources will only run on agents that satisfy these resources."
      ]}
    ]}
  );
  return {
    pipeline: {
      labelTemplate:         pipelineLabelTemplate,
      enablePipelineLocking: pipelineEnablePipelineLocking,
      timer:                 {
        spec:          pipelineTimerSpec,
        onlyOnChanges: pipelineTimerOnlyOnChanges
      },
      parameters:            {
        main: pipelineParametersMain
      }
    },

    environmentVariables: environmentVariables,

    trackingTool: {
      main:   trackingToolMain,
      mingle: {
        baseUrl:            trackingToolMingleBaseUrl,
        projectIdentifier:  trackingToolMingleProjectIdentifier,
        groupingConditions: trackingToolMingleGroupingConditions
      },

      generic: {
        regex:      trackingToolGenericRegex,
        urlPattern: trackingToolGenericUrlPattern
      }
    },

    material: {
      name:        materialName,
      destination: materialDestination
    },

    stage: {
      fetchMaterials:        stageFetchMaterials,
      neverCleanArtifacts:   stageNeverCleanArtifacts,
      cleanWorkingDirectory: stageCleanWorkingDirectory
    },

    job: {
      resources: jobResources
    }
  };
});
