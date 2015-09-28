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
  var ArtifactsConfigWidget = {
    controller: function (args) {
      this.artifacts = args.artifacts;

      this.add = function () {
        this.artifacts.createArtifact();
      };

      this.remove = function (artifact) {
        this.artifacts.removeArtifact(artifact);
        this.artifactChanged();
      };

      this.lastArtifact = function () {
        return this.artifacts.lastArtifact();
      };

      this.artifactChanged = function () {
        if (!this.lastArtifact() || !this.lastArtifact().isBlank()) {
          this.add();
        }
      };

      this.artifactChanged();
    },

    view: function (ctrl) {
      var removeLink = function (artifact) {
        if (artifact !== ctrl.lastArtifact()) {
          return (
            m.component(f.removeButton, {onclick:ctrl.remove.bind(ctrl, artifact)})
          );
        }
      };

      return (
        {tag: "div", attrs: {class:"job-artifacts"}, children: [
          ctrl.artifacts.mapArtifacts(function (artifact) {
            return (
              m.component(f.row, {class:"artifact", "data-artifact-source":artifact.source(), key:artifact.uuid()}, [
                m.component(f.input, {model:artifact, 
                         attrName:"source", 
                         onchange:ctrl.artifactChanged.bind(ctrl), 
                         size:3}), 
                m.component(f.input, {model:artifact, 
                         attrName:"destination", 
                         onchange:ctrl.artifactChanged.bind(ctrl), 
                         size:3}), 
                m.component(f.column, {size:2}, [
                  m.component(f.select, {value:ctrl.selected, 
                            class:"inline", 
                            items:{
                      build: 'build',
                      test: 'test'
                    }})
                ]), 
                m.component(f.column, {size:1, end:true}, [
                  removeLink(artifact)
                ])
              ])
            );
          })
        ]}
      );
    }
  };
  return ArtifactsConfigWidget;

});
