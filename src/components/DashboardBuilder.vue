<template>
  <v-container fluid>
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
            <v-btn color="tertiary" small @click="$router.push({name: 'home'})">
              <v-icon left color="primary">mdi-home</v-icon> Home
            </v-btn>
            &nbsp;
            <v-btn color="tertiary" small @click="reload">
              <v-icon left color="primary">mdi-reload</v-icon> Reload
            </v-btn>
            &nbsp;
            <v-btn color="tertiary" small @click="save" :disabled="!canSave">
              <v-icon left color="primary">mdi-content-save-check</v-icon> Save
            </v-btn>
            &nbsp;
            <v-btn color="tertiary" small @click="listViz">
              <v-icon left color="primary">mdi-plus</v-icon> Add Visualization
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <v-autocomplete
          :items="dimensions"
          item-text="display"
          item-value="name"
          return-object
          dense
          filled
          label="Filter By"
        ></v-autocomplete>
        <template v-if="visualizations.length === 0">
          <center>
            Your dashboard is blank. Click Add Visualization button to add dashboard items
          </center>
        </template>
        <v-bottom-sheet inset v-model="move_resize_dialog" width="300">
          <v-card>
            <v-row>
              <v-col>
                <v-responsive
                  max-width="400"
                  class="mx-auto mb-4"
                >
                  <v-text-field
                    v-model="chart_layout.x"
                    type="number"
                    label="Horizontal"
                    min="-100"
                    max="100"
                  ></v-text-field>
                </v-responsive>
              </v-col>
              <v-col>
                <v-responsive
                  max-width="400"
                >
                  <v-text-field
                    v-model="chart_layout.y"
                    type="number"
                    label="Vertical"
                    min="-100"
                    max="100"
                  ></v-text-field>
                </v-responsive>
              </v-col>
              </v-row>
              <v-row>
              <v-col>
                <v-responsive
                  max-width="400"
                  class="mx-auto mb-4"
                >
                  <v-text-field
                    v-model="chart_layout.w"
                    type="number"
                    label="Width"
                    min="-100"
                    max="100"
                  ></v-text-field>
                </v-responsive>
              </v-col>
              <v-col>
                <v-responsive
                  max-width="400"
                >
                  <v-text-field
                    v-model="chart_layout.h"
                    type="number"
                    label="Height"
                    min="-100"
                    max="100"
                  ></v-text-field>
                </v-responsive>
              </v-col>
            </v-row>
          </v-card>
        </v-bottom-sheet>
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
          <v-card :height="viz.hPx+37">
            <v-menu
              offset-y
              origin="center center"
              transition="scale-transition"
              rounded="b-xl"
              :close-on-content-click="false"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  dark
                  color="primary"
                  small
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>mdi-dots-horizontal</v-icon>
                </v-btn>
              </template>
              <v-list rounded dense>
                <v-list-item link @click="removeViz(viz.i)">
                  <v-list-item-icon>
                    <v-icon small>mdi-minus</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Remove Visualization</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item link @click="$router.push({path: '/vizBuilder/' + viz.id})">
                  <v-list-item-icon>
                    <v-icon small>mdi-pencil</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Edit</v-list-item-title>
                </v-list-item>
                <v-list-item link @click="move_resize(viz)">
                  <v-list-item-icon>
                    <v-icon small>mdi-cursor-move</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Move/Resize</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <VisualizationBuilder
              :id="viz.id"
              :rerenderViz="viz.rerender"
              :vizHeight="viz.hPx"
              :editingViz="false"
              @dimensions="popDimensions"
            />
          </v-card>
          </grid-item>
        </grid-layout>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { GridLayout, GridItem } from 'vue-grid-layout'
import VisualizationBuilder from '@/components/VisualizationBuilder.vue'
export default {
  data () {
    return {
      visualizations: [],
      dimensions: [],
      displayVizList: false,
      loadingViz: false,
      availableViz: [],
      title: '',
      dashboardId: '',
      rerenderViz: 0,
      move_resize_dialog: false,
      chart_layout: {}
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
    popDimensions (dims) {
      for (const dim of dims) {
        const exists = this.dimensions.find((popDim) => {
          return popDim.name === dim.name
        })
        if (!exists) {
          this.dimensions.push(dim)
        }
      }
    },
    getDashboard () {
      this.visualizations = []
      fetch('/fhir/Basic/' + this.dashboardId).then((response) => {
        response.json()
          .then((data) => {
            for (const extension of data.extension) {
              if (extension.url === 'http://ihris.org/fhir/StructureDefinition/ihris-basic-name') {
                this.title = extension.valueString
              }
              if (extension.url === 'http://ihris.org/fhir/StructureDefinition/ihris-dashboard-visualization') {
                const id = extension.extension.find((ext) => {
                  return ext.url === 'vizID'
                }).valueString
                const x = extension.extension.find((ext) => {
                  return ext.url === 'horizontal'
                }).valueDecimal
                const y = extension.extension.find((ext) => {
                  return ext.url === 'vertical'
                }).valueDecimal
                const w = extension.extension.find((ext) => {
                  return ext.url === 'width'
                }).valueDecimal
                const h = extension.extension.find((ext) => {
                  return ext.url === 'height'
                }).valueDecimal
                const hPx = extension.extension.find((ext) => {
                  return ext.url === 'heightPx'
                }).valueDecimal
                const i = extension.extension.find((ext) => {
                  return ext.url === 'itemID'
                }).valueInteger
                const stat = extension.extension.find((ext) => {
                  return ext.url === 'static'
                }).valueBoolean
                this.visualizations.push({
                  id,
                  x,
                  y,
                  w,
                  h,
                  hPx,
                  i,
                  static: stat
                })
              }
            }
          })
      })
    },
    resizeEvent: function (i, newH, newW, newHPx, newWPx) {
      const viz = this.visualizations.find((viz) => {
        return viz.i === i
      })
      viz.hPx = newHPx - 36
      viz.rerender++
    },
    resizedEvent (i, newH, newW, newHPx, newWPx) {
      const viz = this.visualizations.find((viz) => {
        return viz.i === i
      })
      viz.hPx = newHPx - 36
      viz.rerender++
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
        h: 11.2,
        hPx: 400,
        i: this.visualizations.length,
        static: false,
        rerender: 0
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
            this.$store.state.snackbar.enabled = true
            this.$store.state.snackbar.text = 'Failed to save Dashboard!'
            this.$store.state.snackbar.color = 'error'
            return
          }
          response.json().then((data) => {
            this.$store.state.snackbar.enabled = true
            this.$store.state.snackbar.text = 'Dashboard saved successfully!'
            this.$store.state.snackbar.color = 'primary'
            this.dashboardId = data.id
          })
        })
        .catch((error) => {
          this.$store.state.snackbar.enabled = true
          this.$store.state.snackbar.text = 'Failed to save Dashboard!'
          this.$store.state.snackbar.color = 'error'
          console.error('Error:', error)
        })
    },
    removeViz (i) {
      const index = this.visualizations.findIndex((viz) => {
        return viz.i === i
      })
      if (index > -1) {
        this.visualizations.splice(index, 1)
      }
    },
    reload () {
      if (this.dashboardId) {
        this.getDashboard()
      } else {
        this.visualizations = []
      }
    },
    move_resize (viz) {
      this.chart_layout = viz
      this.move_resize_dialog = true
    }
  },
  created () {
    this.dashboardId = this.$route.params.id
    if (this.dashboardId) {
      this.getDashboard()
    }
  },
  components: {
    VisualizationBuilder,
    GridLayout,
    GridItem
  }
}
</script>
