<template>
  <v-container grid-list-xs>
    <v-snackbar
      v-model="snackbar"
      timeout="2000"
      :color="snackbarColor"
    >
      {{ snackbarText }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-dialog
      transition="dialog-top-transition"
      v-model="displayVizList"
      width="960px"
    >
      <v-system-bar
        window
        color="primary"
        dark
        height="40px"
      >
        <b>Available Vizualizations</b>
        <v-spacer></v-spacer>
        <v-icon @click.native="displayVizList = false" style="cursor: pointer">mdi-close</v-icon>
      </v-system-bar>
      <v-progress-linear
        :indeterminate="loadingViz"
        :active="loadingViz"
        color="secondary"
      />
      <v-card>
        <v-card-text>
          <template v-if="availableViz.length > 0">
            <v-list
              shaped
              dense
            >
              <v-list-item-group
                color="primary"
              >
              <v-list-item
                v-for="(value, i) in this.availableViz"
                :key="i"
                @click="addVizualization(value.id)"
              >
                <v-list-item-content>
                  <v-list-item-title>
                    <v-icon>mdi-menu-right</v-icon>
                    <label style="font-size: 13px; cursor: pointer;">
                      {{value.name}}
                    </label>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              </v-list-item-group>
            </v-list>
          </template>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col cols="4">
            <v-text-field
              label="Dashboard Title*"
              outlined
              dense
              v-model="title"
            />
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="7">
            <v-btn color="tertiary" small @click="listViz">
              <v-icon left color="primary">mdi-plus</v-icon> Add Visualization
            </v-btn>
            &nbsp;
            <v-btn color="tertiary" small @click="save" :disabled="!canSave">
              <v-icon left color="primary">mdi-content-save-check</v-icon> Save
            </v-btn>
            &nbsp;
            <v-btn color="tertiary" small @click="$router.push({name: 'home'})">
              <v-icon left color="primary">mdi-home</v-icon> Home
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <template v-if="visualizations.length === 0">
          <center>
            Your dashboard is blank. Click Add Visualization button to add dashboard items
          </center>
        </template>
        <grid-layout
          :layout.sync="visualizations"
          :col-num="14"
          :row-height="30"
          :is-draggable="true"
          :is-resizable="true"
          :responsive="false"
          :restoreOnDrag="true"
          :vertical-compact="false"
          :prevent-collision="false"
          :use-css-transforms="true"
        >
          <grid-item
            v-for="viz in visualizations"
            :static="viz.static"
            :x="viz.x"
            :y="viz.y"
            :w="viz.w"
            :h="viz.h"
            :i="viz.i"
            :key="viz.i"
            @resize="resizeEvent"
            @resized="resizedEvent"
          >
            <span class="text">
              <VisualizationViewer
                :id="viz.id"
                :rerender="viz.w/viz.h"
                :height="viz.hPx"
              />
            </span>
          </grid-item>
        </grid-layout>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { GridLayout, GridItem } from 'vue-grid-layout'
import VisualizationViewer from '@/components/VisualizationViewer.vue'
export default {
  data () {
    return {
      visualizations: [],
      displayVizList: false,
      loadingViz: false,
      availableViz: [],
      title: '',
      dashboardId: '',
      snackbarText: '',
      snackbarColor: 'primary',
      snackbar: false
    }
  },
  computed: {
    canSave () {
      if (this.visualizations.length > 0 && this.title) {
        return true
      }
      return false
    }
  },
  methods: {
    resizeEvent: function (i, newH, newW, newHPx, newWPx) {
      const viz = this.visualizations.find((viz) => {
        return viz.i === i
      })
      viz.hPx = newHPx - 60
    },
    resizedEvent (i, newH, newW, newHPx, newWPx) {
      const viz = this.visualizations.find((viz) => {
        return viz.i === i
      })
      viz.hPx = newHPx - 60
    },
    listViz () {
      this.loadingViz = true
      this.displayVizList = true
      this.getViz().then(() => {
        this.loadingViz = false
      })
    },
    getViz (url) {
      return new Promise((resolve, reject) => {
        this.availableViz = []
        if (!url) {
          url = '/fhir/Basic?_profile=http://ihris.org/fhir/StructureDefinition/ihris-data-visualization'
        }
        fetch(url).then((response) => {
          response.json()
            .then((data) => {
              for (const entry of data.entry) {
                const name = entry.resource.extension.find((ext) => {
                  return ext.url === 'http://ihris.org/fhir/StructureDefinition/ihris-basic-name'
                })
                if (name) {
                  this.availableViz.push({
                    id: entry.resource.id,
                    name: name.valueString
                  })
                }
              }
              const next = data.link.find((link) => {
                return link.relation === 'next'
              })
              if (next) {
                this.getViz(next.url).then(() => {
                  return resolve()
                }).catch((err) => {
                  return reject(err)
                })
              } else {
                return resolve()
              }
            })
        })
      })
    },
    addVizualization (id) {
      let maxY = 0
      for (const viz of this.visualizations) {
        if (viz.y > maxY) {
          maxY = viz.y
        }
      }
      if (maxY) {
        maxY += 2
      }
      this.visualizations.push({
        id: id,
        x: 0,
        y: maxY,
        w: 6,
        h: 12,
        hPx: 400,
        i: this.visualizations.length,
        static: false
      })
    },
    save () {
      const dashboard = {
        resourceType: 'Basic',
        meta: {
          profile: ['http://ihris.org/fhir/StructureDefinition/ihris-dashboard']
        },
        code: {
          coding: [
            {
              code: 'visualization',
              system: 'http://ihris.org/fhir/CodeSystem/ihris-resource-codesystem'
            }
          ]
        },
        extension: [{
          url: 'http://ihris.org/fhir/StructureDefinition/ihris-basic-name',
          valueString: this.title
        }]
      }
      for (const viz of this.visualizations) {
        dashboard.extension.push({
          url: 'http://ihris.org/fhir/StructureDefinition/ihris-dashboard-visualization',
          extension: [{
            url: 'vizID',
            valueString: viz.id
          }, {
            url: 'horizontal',
            valueDecimal: viz.x
          }, {
            url: 'vertical',
            valueDecimal: viz.y
          }, {
            url: 'width',
            valueDecimal: viz.w
          }, {
            url: 'height',
            valueDecimal: viz.h
          }, {
            url: 'heightPx',
            valueDecimal: viz.hPx
          }, {
            url: 'itemID',
            valueInteger: viz.i
          }, {
            url: 'static',
            valueBoolean: viz.static
          }]
        })
      }
      let method = 'POST'
      if (this.dashboardId) {
        method = 'PUT'
        dashboard.id = this.dashboardId
      } else {
        this.dashboardId = ''
      }
      fetch('/fhir/Basic/' + this.dashboardId, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dashboard)
      })
        .then((response) => {
          if (response.status !== 200 && response.status !== 201) {
            this.snackbar = true
            this.snackbarText = 'Failed to save Dashboard!'
            this.snackbarColor = 'error'
            return
          }
          response.json().then((data) => {
            this.snackbar = true
            this.snackbarText = 'Dashboard saved successfully!'
            this.snackbarColor = 'primary'
            this.dashboardId = data.id
          })
        })
        .catch((error) => {
          this.snackbar = true
          this.snackbarText = 'Failed to save Dashboard!'
          this.snackbarColor = 'error'
          console.error('Error:', error)
        })
    }
  },
  created () {
    this.dashboardId = this.$route.params.id
  },
  components: {
    VisualizationViewer,
    GridLayout,
    GridItem
  }
}
</script>
