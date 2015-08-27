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


define(['mithril', 'lodash', '../helpers/form_helper', '../models/tracking_tool'], function (m, _, f, TrackingTool) {

  var TrackingToolViews = {
    none: function () {
    },

    mingle: function (trackingTool) {
      return (
        {tag: "div", attrs: {}, children: [
          m.component(f.row, {}, [
            m.component(f.inputWithLabel, {
              label:"Base URL", 
              attrName:"baseUrl", 
              fieldName:"mingle[base_url]", 
              type:"url", 
              size:8, 
              model:trackingTool()})
          ]), 
          m.component(f.row, {}, [

            m.component(f.inputWithLabel, {
              attrName:"projectIdentifier", 
              fieldName:"mingle[project_identifier]", 
              size:8, 
              model:trackingTool()})
          ]), 
          m.component(f.row, {}, [

            m.component(f.inputWithLabel, {
              attrName:"groupingConditions", 
              fieldName:"mingle[grouping_conditions]", 
              size:8, 
              model:trackingTool()})
          ])
        ]}
      );
    },

    generic: function (trackingTool) {
      return (
        {tag: "div", attrs: {}, children: [
          m.component(f.row, {}, [
            m.component(f.inputWithLabel, {
              label:"URL Pattern", 
              attrName:"urlPattern", 
              type:"url", 
              fieldName:"generic[url_pattern]", 
              size:8, 
              model:trackingTool()})
          ]), 

          m.component(f.row, {}, [
            m.component(f.inputWithLabel, {
              attrName:"regex", 
              fieldName:"generic[regex]", 
              size:8, 
              model:trackingTool()})
          ])
        ]}
      );
    }
  };

  var TrackingToolSelectorWidget = {
    controller: function (args) {
      this.trackingTool          = args.trackingTool;
      this.possibleTrackingTools = {
        none:    null,
        mingle:  (this.trackingTool() && this.trackingTool().type() === 'mingle') ? this.trackingTool() : TrackingTool.create('mingle'),
        generic: (this.trackingTool() && this.trackingTool().type() === 'generic') ? this.trackingTool() : TrackingTool.create('generic')
      };

      this.setTrackingTool = function (newTool) {
        this.trackingTool(newTool);
      };
    },

    view: function (ctrl, args, children) {
      var isChecked = function (type) {
        if (!type) {
          return !ctrl.trackingTool();
        }

        return ctrl.trackingTool() && ctrl.trackingTool().type() === type;
      };

      return (
        {tag: "fieldset", attrs: {}, children: [
          {tag: "legend", attrs: {}, children: ["Project Management"]}, 

          m.component(f.row, {}, [
              {tag: "input", attrs: {type:"radio", 
                     name:"tracking-tool-button-group", 
                     checked:isChecked(), 
                     id:"tracking-tool-none", 
                     onclick:ctrl.setTrackingTool.bind(ctrl, null)}}, 
              {tag: "label", attrs: {size:4, for:"tracking-tool-none"}, children: ["None"]}, 

            _.map(TrackingTool.Types, function (value, key) {
              return (
                {tag: "span", attrs: {}, children: [
                  {tag: "input", attrs: {type:"radio", 
                         name:"tracking-tool-button-group", 
                         id:`tracking-tool-${key}`, 
                         checked:isChecked(key), 
                         onclick:ctrl.setTrackingTool.bind(ctrl, ctrl.possibleTrackingTools[key])}}, 
                  {tag: "label", attrs: {for:`tracking-tool-${key}`}, children: [" ", value.description]}
                ]}
              );
            })
          ]), 

          m.component(f.row, {class:'tracking-tool tracking-tool' + (ctrl.trackingTool() ? ctrl.trackingTool().type() : 'none')}, [
            TrackingToolViews[ctrl.trackingTool() ? ctrl.trackingTool().type() : 'none'](ctrl.trackingTool)
          ])
        ]}
      );
    }
  };

  return TrackingToolSelectorWidget;
});
