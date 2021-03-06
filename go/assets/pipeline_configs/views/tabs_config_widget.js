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


define(['mithril', '../helpers/form_helper'], function (m, f) {
  var TabsConfigWidget = {
    controller: function (args) {
      this.tabs = args.tabs;

      this.add = function () {
        this.tabs.createTab();
      };

      this.remove = function (tab) {
        this.tabs.removeTab(tab);
        this.tabChanged();
      };

      this.lastTab = function () {
        return this.tabs.lastTab();
      };

      this.tabChanged = function () {
        if (!this.lastTab() || !this.lastTab().isBlank()) {
          this.add();
        }
      };

      this.tabChanged();
    },

    view: function (ctrl) {
      var removeLink = function (tab) {
        if (tab !== ctrl.lastTab()) {
          return (
            m.component(f.removeButton, {onclick:ctrl.remove.bind(ctrl, tab)})
          );
        }
      };

      return (
        {tag: "div", attrs: {class:"job-tabs"}, children: [
          ctrl.tabs.mapTabs(function (tab) {
            return (
              m.component(f.row, {class:"tab", "data-tab-name":tab.name(), key:tab.uuid()}, [
                m.component(f.input, {model:tab, 
                         attrName:"name", 
                         onchange:ctrl.tabChanged.bind(ctrl), 
                         size:4}), 
                m.component(f.input, {model:tab, 
                         attrName:"path", 
                         onchange:ctrl.tabChanged.bind(ctrl), 
                         size:4}), 
                m.component(f.column, {size:3, end:true}, [
                  removeLink(tab)
                ])
              ])
            );
          })
        ]}
      );
    }
  };

  return TabsConfigWidget;
});
