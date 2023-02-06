<template>
  <v-container fluid>
    <v-dialog
      persistent
      transition="dialog-top-transition"
      v-model="showValuesSelector"
      width="560px"
    >
      <v-system-bar
        window
        color="primary"
        dark
        height="40px"
      >
        <b>Values For {{activeDimension.data.display}}</b>
        <v-spacer></v-spacer>
        <v-icon @click.native="showValuesSelector = false" style="cursor: pointer">mdi-close</v-icon>
      </v-system-bar>
      <v-card class="overflow-auto">
        <v-card-actions>
          <v-radio-group
            row
            v-model="activeDimension.filterCondition"
          >
            <v-radio
              label="Include"
              value="include"
            ></v-radio>
            <v-radio
              label="Exclude"
              value="exclude"
            ></v-radio>
          </v-radio-group>
          <v-spacer></v-spacer>
          <v-btn color="secondary" small @click="applyFilters">Apply</v-btn>
        </v-card-actions>
        <v-card-text>
          <template
            v-for="(filter, dimensionIndex) in filters"
          >
            <template v-if="filter.name === activeDimension.data.name">
              <v-chip
                v-for="(value, valueIndex) in filter.values"
                :key="value.name"
                class="ma-2"
                color="green"
                outlined
                close
                @click:close="removeFilter(dimensionIndex, valueIndex)"
              >
                {{ value.name }}
              </v-chip>
            </template>
          </template>
          <v-data-table
            hide-default-header
            :items-per-page="27"
            :headers="[{ value: 'name' }]"
            :items="activeDimension.dimValues"
            :loading="activeDimension.loading"
            dense
            item-key="name"
            show-select
            v-model="activeDimension.selectedValues"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
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
          <v-spacer></v-spacer>
          <v-col cols="auto" v-if="editingDash">
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
              <v-icon left color="primary">mdi-plus</v-icon> Insert Visualization
            </v-btn>
            &nbsp;
            <v-btn color="tertiary" small @click="$router.push({name: 'vizBuilder'})">
              <v-icon left color="primary">mdi-plus</v-icon> Create Visualization
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <v-row>
          <v-col cols="auto">
            <v-text-field
              label="Dashboard Title*"
              outlined
              v-model="title"
              v-if="editingDash"
            />
            <template v-else>
              <v-chip
                color="secondary"
                outlined
                label
                large
              >
              {{ title }}
              </v-chip>
            </template>
          </v-col>
          <v-col cols="auto">
            <v-autocomplete
              v-model="activeDimension.data"
              :items="dimensions"
              item-text="display"
              item-value="name"
              return-object
              filled
              clearable
              label="Filter By"
              @change="activateDimension"
            ></v-autocomplete>
          </v-col>
          <v-col v-if="!editingDash" cols="auto">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="mx-2"
                  fab
                  color="tertiary"
                  small
                  v-bind="attrs"
                  v-on="on"
                  @click="editingDash = true"
                >
                  <v-icon color="primary">mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span>Edit this dashboard</span>
            </v-tooltip>
          </v-col>
          <v-col v-else cols="auto">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="mx-2"
                  fab
                  color="white"
                  small
                  v-bind="attrs"
                  v-on="on"
                  @click="cancelEditing"
                >
                  <v-icon color="error">mdi-close-thick</v-icon>
                </v-btn>
              </template>
              <span>Cancel Editing</span>
            </v-tooltip>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto">
            <v-row>
              <v-col cols="auto">
                <v-autocomplete
                  v-model="dashboardId"
                  :items="dashboards"
                  item-text="name"
                  item-value="id"
                  filled
                  label="Other Dashboards"
                  @change="$router.push({
                    name: 'dashBuilder',
                    params: { edit: false, id: dashboardId }
                  })"
                ></v-autocomplete>
              </v-col>
              <v-col cols="auto" v-if="dashboardId">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="mx-2"
                      fab
                      dark
                      color="indigo"
                      small
                      v-bind="attrs"
                      v-on="on"
                      @click="$router.push({ name: 'dashBuilder', params: { edit: true } })"
                    >
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </template>
                  <span>Add New Dashboard</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <template v-for="(filter, dimensionIndex) in filters">
          <v-chip
            v-for="(value, valueIndex) in filter.values"
            :key="value.name"
            class="ma-2"
            color="green"
            outlined
            close
            @click:close="removeFilter(dimensionIndex, valueIndex)"
          >
          {{ filter.display }}: {{ value.name }}
          </v-chip>
        </template>
        <template v-if="loadingVizs">
          <v-progress-linear :indeterminate="true"></v-progress-linear>
        </template>
        <template v-else-if="visualizations.length === 0">
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
          :is-draggable="draggable"
          :is-resizable="resizable"
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
              :softRerenderViz="viz.rerender"
              :hardRerenderViz="hardRerenderViz"
              :vizHeight="viz.hPx"
              :editingViz="false"
              :externalFilters="filters"
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
import { generalMixin } from '@/mixins/generalMixin'
export default {
  mixins: [generalMixin],
  props: {
    edit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loadingVizs: false,
      editingDash: false,
      visualizations: [],
      dimensions: [],
      displayVizList: false,
      loadingViz: false,
      availableViz: [],
      hardRerenderViz: 0,
      title: '',
      dashboardId: '',
      move_resize_dialog: false,
      chart_layout: {},
      showValuesSelector: false,
      filters: [],
      activeDimension: {
        dimValues: [],
        selectedValues: [],
        filterCondition: 'include',
        data: {},
        loading: false
      }
    }
  },
  watch: {
    activeDimension: {
      handler () {
        if (!this.activeDimension.data.name) {
          return
        }
        const index = this.filters.findIndex((filter) => {
          return filter.name === this.activeDimension.data.name
        })
        const filter = {
          name: this.activeDimension.data.name,
          display: this.activeDimension.data.display,
          values: this.activeDimension.selectedValues,
          type: this.activeDimension.data.type,
          filterCondition: this.activeDimension.filterCondition
        }
        if (this.activeDimension.selectedValues.length === 0) {
          if (index > -1) {
            this.filters.splice(index, 1)
          }
        } else if (index === -1) {
          this.$set(this.filters, this.filters.length, filter)
        } else {
          this.$set(this.filters, index, filter)
        }
      },
      deep: true
    }
  },
  computed: {
    canSave () {
      if (this.visualizations.length > 0 && this.title) {
        return true
      }
      return false
    },
    draggable () {
      if (this.editingDash) {
        return true
      }
      return false
    },
    resizable () {
      if (this.editingDash) {
        return true
      }
      return false
    }
  },
  methods: {
    cancelEditing () {
      if (this.dashboardId) {
        this.editingDash = false
      } else {
        this.$router.push({ name: 'home' })
      }
    },
    applyFilters () {
      this.showValuesSelector = false
      this.reloadAllViz()
      this.activeDimension.data = {}
    },
    removeFilter (dimensionIndex, valueIndex) {
      this.filters[dimensionIndex].values.splice(valueIndex, 1)
      if (this.filters[dimensionIndex].values.length === 0) {
        this.filters.splice(dimensionIndex, 1)
      } else {
        this.$set(this.filters, dimensionIndex, this.filters[dimensionIndex])
      }
      this.reloadAllViz()
    },
    reloadAllViz () {
      this.hardRerenderViz++
    },
    activateDimension (val) {
      this.showValuesSelector = true
      this.activeDimension.loading = true
      this.activeDimension.dimValues = []
      this.activeDimension.selectedValues = []
      this.activeDimension.filterCondition = 'include'
      const filter = this.filters.find((filter) => {
        return filter.name === this.activeDimension.data.name
      })
      if (filter) {
        this.activeDimension.filterCondition = filter.filterCondition
        this.activeDimension.selectedValues = JSON.parse(JSON.stringify(filter.values))
      }
      const url = `/es/populateFilter/${val.dataset.name}/${val.name}?dataType=${val.type}`
      fetch(url, {
        method: 'GET'
      }).then((response) => {
        response
          .json()
          .then((data) => {
            this.activeDimension.loading = false
            for (const bucket of data) {
              this.activeDimension.dimValues.push({
                name: bucket.key.value
              })
            }
          })
      })
    },
    popDimensions (dims) {
      for (const dim of dims.data) {
        const exists = this.dimensions.find((popDim) => {
          return popDim.name === dim.name
        })
        if (!exists) {
          dim.dataset = dims.dataset
          this.dimensions.push(dim)
        }
      }
    },
    getDashboard () {
      this.loadingVizs = true
      this.visualizations = []
      fetch('/fhir/Basic/' + this.dashboardId).then((response) => {
        response.json()
          .then((data) => {
            this.loadingVizs = false
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
    this.editingDash = this.edit
    this.dashboardId = this.$route.params.id
    if (this.dashboardId) {
      this.getDashboard()
    }
    this.listDashboard()
  },
  components: {
    VisualizationBuilder,
    GridLayout,
    GridItem
  }
}
</script>
