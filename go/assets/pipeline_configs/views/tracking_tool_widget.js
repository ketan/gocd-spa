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


define(['mithril', 'lodash', '../helpers/form_helper', '../helpers/tooltips', '../models/tracking_tool'], function (m, _, f, tt, TrackingTool) {

  var TrackingToolViews = {
    none: function () {
    },

    mingle: function (trackingTool) {
      return (
        {tag: "div", attrs: {}, children: [
          m.component(f.row, {}, [
            m.component(f.inputWithLabel, {model:trackingTool(), 
                              attrName:"baseUrl", 
                              label:"Base URL", 
                              type:"url", 
                              tooltip:{
                                          content: m.component(tt.trackingTool.mingle.baseUrl, {callback:trackingTool().baseUrl}),
                                          direction: 'bottom',
                                          size: 'medium'
                                        }, 
                              size:8})
          ]), 

          m.component(f.row, {}, [
            m.component(f.inputWithLabel, {model:trackingTool(), 
                              attrName:"projectIdentifier", 
                              tooltip:{
                                          content: m.component(tt.trackingTool.mingle.projectIdentifier, {callback:trackingTool().projectIdentifier}),
                                          direction: 'bottom',
                                          size: 'medium'
                                        }, 
                              size:8})
          ]), 

          m.component(f.row, {}, [
            m.component(f.inputWithLabel, {model:trackingTool(), 
                              attrName:"groupingConditions", 
                              tooltip:{
                                          content: m.component(tt.trackingTool.mingle.groupingConditions, {callback:trackingTool().groupingConditions}),
                                          direction: 'bottom',
                                          size: 'medium'
                                        }, 
                              size:8})
          ])
        ]}
      );
    },

    generic: function (trackingTool) {

      var useTrackingToolRegex = function () {
        debugger;
      };
      return (
        {tag: "div", attrs: {}, children: [
          m.component(f.row, {}, [
            m.component(f.inputWithLabel, {model:trackingTool(), 
                              attrName:"regex", 
                              label:"Regular expression", 
                              tooltip:{
                                          content: m.component(tt.trackingTool.generic.regex, {callback:trackingTool().regex}),
                                          direction: 'bottom',
                                          size: 'large'
                                        }, 
                              size:8})
          ]), 
          m.component(f.row, {}, [
            m.component(f.inputWithLabel, {model:trackingTool(), 
                              attrName:"urlPattern", 
                              label:"URL Pattern", 
                              type:"url", 
                              tooltip:{
                                          content: m.component(tt.trackingTool.generic.urlPattern, {callback:trackingTool().urlPattern}),
                                          direction: 'bottom',
                                          size: 'large'
                                        }, 
                              size:8})
          ])
        ]}
      );
    }
  };

  var TrackingToolWidget = {
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

      var trackingTools = _.merge({none: {type: undefined, description: "None"}}, TrackingTool.Types);

      return (
        m.component(f.accordion, {accordionTitles:[
                        (
                          {tag: "span", attrs: {}, children: ["Tracking Tool", m.component(f.tooltip, {tooltip:{content: tt.trackingTool.main}})]}
                        )
                     ], 
                     accordionKeys:['tracking-tool'], 
                     selectedIndex:-1}, [
          {tag: "div", attrs: {}, children: [
            m.component(f.row, {}, [
              m.component(f.column, {size:4, end:true}, [
                _.map(trackingTools, function (value, key) {
                  return (
                    {tag: "span", attrs: {}, children: [
                    {tag: "input", attrs: {type:"radio", 
                           name:"tracking-tool-button-group", 
                           id:'tracking-tool-' + key, 
                           checked:isChecked(key), 
                           onclick:ctrl.setTrackingTool.bind(ctrl, ctrl.possibleTrackingTools[key])}}, 
                    {tag: "label", attrs: {for:'tracking-tool-' + key}, children: [" ", value.description]}
                  ]}
                  );
                })
              ])
            ]), 

            m.component(f.row, {class:'tracking-tool tracking-tool-' + (ctrl.trackingTool() ? ctrl.trackingTool().type() : 'none')}, [
              m.component(f.column, {size:6, end:true}, [
                TrackingToolViews[ctrl.trackingTool() ? ctrl.trackingTool().type() : 'none'](ctrl.trackingTool)
              ])
            ])
          ]}
        ])
      );
    }
  };

  return TrackingToolWidget;
});
