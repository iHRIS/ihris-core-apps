<template>
  <v-container fluid>
    <v-row v-if="editingViz">
      <v-col cols="3">
        <v-btn color="tertiary" small @click="$router.push({name: 'home'})">
          <v-icon left color="primary">mdi-home</v-icon> Home
        </v-btn>
        &nbsp;
        <v-btn color="tertiary" small @click="save">
          <v-icon left color="primary">mdi-content-save-check</v-icon> Save
        </v-btn>
        &nbsp;
        <v-btn color="tertiary" small @click="confirmDelete = true">
          <v-icon left color="primary">mdi-delete</v-icon>Delete
        </v-btn>
      </v-col>
      <v-col cols="9">
        <h2><center>Data Vizualizer</center></h2>
      </v-col>
    </v-row>
    <v-dialog
      v-model="confirmDelete"
      persistent
      width="330"
    >
      <v-system-bar
        window
        color="primary"
        dark
        height="40px"
      >
        <v-spacer></v-spacer>
        <v-icon @click.native="confirmDelete = false" style="cursor: pointer">
          mdi-close
        </v-icon>
      </v-system-bar>
      <v-card>
        <v-card-title class="text-h5">
          Are you sure you want to delete this visualization?
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="confirmDelete = false"
          >
            No
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="deleteViz"
          >
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      persistent
      transition="dialog-top-transition"
      v-model="showValuesSelector"
      width="960px"
    >
      <v-system-bar
        window
        color="primary"
        dark
        height="40px"
      >
        <b>Values For {{activeDimension.name}}</b>
        <v-spacer></v-spacer>
        <v-icon @click.native="showValuesSelector = false" style="cursor: pointer">mdi-close</v-icon>
      </v-system-bar>
      <v-card>
        <v-card-actions v-if="activeDimension.index > -1">
          <v-radio-group
            row
            v-model="me[activeDimension.location][activeDimension.index].defaultFilter"
          >
            <v-radio
              label="Use All"
              value="all"
            ></v-radio>
            <v-radio
              label="Use Selected Below"
              value="selected"
            ></v-radio>
          </v-radio-group>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="showValuesSelector = false" small>Save</v-btn>
        </v-card-actions>
        <v-card-text v-if="activeDimension.index > -1 && me[activeDimension.location][activeDimension.index].defaultFilter !== 'all'">
          <v-row>
            <v-col cols="6">
              All Values
              <v-card height="638" class="overflow-auto">
                <v-card-text>
                  <v-list
                    shaped
                    dense
                    v-if="me[activeDimension.location][activeDimension.index].defaultFilter !== 'all'"
                  >
                    <v-list-item-group
                      color="primary"
                      v-model="me[activeDimension.location][activeDimension.index].highlightedAllValues"
                    >
                    <v-list-item
                      v-for="(value, i) in me[activeDimension.location][activeDimension.index].allValues"
                      :key="i"
                    >
                      <v-list-item-content>
                        <v-list-item-title>
                          <v-icon>mdi-menu-right</v-icon>
                          <label style="font-size: 13px">
                            {{value}}
                          </label>
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="1" class="fill-height">
              <br>
              <br>
              <br>
              <v-btn
                :disabled="this[activeDimension.location][activeDimension.index].allValues.length === 0"
                text
                icon
                color="primary"
                @click="moveDimensionValue('allValues', 'selectedValues', true)"
              >
                <v-icon>mdi-chevron-double-right</v-icon>
              </v-btn>
              <v-btn
                :disabled="this[activeDimension.location][activeDimension.index].highlightedAllValues < 0"
                text
                icon
                color="primary"
                @click="moveDimensionValue('allValues', 'selectedValues', false)"
              >
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
              <br>
              <br>
              <br>
              <v-divider height="5"></v-divider>
              <br>
              <br>
              <br>
              <v-btn
                :disabled="this[activeDimension.location][activeDimension.index].selectedValues.length === 0"
                text
                icon
                color="primary"
                @click="moveDimensionValue('selectedValues', 'allValues', true)"
              >
                <v-icon>mdi-chevron-double-left</v-icon>
              </v-btn>
              <v-btn
                :disabled="this[activeDimension.location][activeDimension.index].highlightedSelectedValues < 0"
                text
                icon
                color="primary"
                @click="moveDimensionValue('selectedValues', 'allValues', false)"
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="5">
              <v-row>
                <v-col cols="5">
                  Selected Values -
                </v-col>
                <v-col cols="7">
                  <v-radio-group
                    row
                    v-model="me[activeDimension.location][activeDimension.index].filterCondition"
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
                </v-col>
              </v-row>
              <v-card height="638" class="overflow-auto">
                <v-card-text>
                  <v-list
                    shaped
                    dense
                    v-if="me[activeDimension.location][activeDimension.index].defaultFilter !== 'all'"
                  >
                    <v-list-item-group
                      color="primary"
                      v-model="me[activeDimension.location][activeDimension.index].highlightedSelectedValues"
                    >
                    <v-list-item
                      v-for="(value, i) in this[activeDimension.location][activeDimension.index].selectedValues"
                      :key="i"
                    >
                      <v-list-item-content>
                        <v-list-item-title>
                          <v-icon>mdi-menu-right</v-icon>
                          <label style="font-size: 13px">
                            {{value}}
                          </label>
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col cols="4" v-if="editingViz">
        <v-row>
          <v-col cols="6">
            <input type="button" id="hiddenActivator">
            <v-card>
              <v-card-text>
                <v-row>
                  <v-autocomplete
                    :items="datasets"
                    label="Datasets"
                    v-model="dataset"
                    item-value="name"
                    item-text="display"
                    return-object
                    @change="datasetSelected"
                  ></v-autocomplete>
                </v-row>
                <v-row v-if="dimensions.length > 0"><h3>Dimensions</h3></v-row>
                <v-row v-else-if="dataset.id && dimensions.length == 0"><h3>No Dimensions Available</h3></v-row>
                <v-row>
                  <ul>
                    <draggable
                      :list="dimensions"
                      @start="dragStart"
                      @end="dragEnd"
                      :move="dragging"
                      :group="{ name: 'visualization', pull: 'clone', put: false }"
                      animation=650
                    >
                      <li
                        width="600"
                        class="dstfields"
                        style="cursor: move; width: 260px; height: 30px;"
                        v-for="(dimension, i) in dimensions"
                        :key="i"
                      >{{dimension.display}}</li>
                    </draggable>
                  </ul>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card style="height: 100%">
              <v-card-text>
                <v-card shaped>
                  <v-card-title>
                    Filters
                  </v-card-title>
                  <v-card-text>
                    <draggable
                      :list="filters"
                      @start="dragStart"
                      @end="dragEnd"
                      :move="dragging"
                      id="filters"
                      group="visualization"
                      animation=650
                    >
                      <v-chip v-for="(filter, index) in filters" :key="index" color="black" dark small>
                        {{filter.display}}
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
                              small
                              v-bind="attrs"
                              v-on="on"
                              id="filtersActivator"
                            >
                              <v-icon color="white">mdi-dots-horizontal</v-icon>
                            </v-btn>
                          </template>
                          <v-list rounded>
                            <v-list-item link @click="getDimensionValues('filters', index)">
                              <v-list-item-icon>
                                <v-icon>mdi-filter-minus</v-icon>
                              </v-list-item-icon>
                              <v-list-item-title>Filter Values</v-list-item-title>
                            </v-list-item>
                            <v-list-item link @click="removeDimension('filters', index)">
                              <v-list-item-icon>
                                <v-icon>mdi-minus-circle</v-icon>
                              </v-list-item-icon>
                              <v-list-item-title>Remove</v-list-item-title>
                            </v-list-item>
                            <v-list-item link @click="move('filters', 'series', index)" :disabled="series.length > 0">
                              <v-list-item-icon>
                                <v-icon>mdi-cursor-move</v-icon>
                              </v-list-item-icon>
                              <v-list-item-title>Move to series</v-list-item-title>
                            </v-list-item>
                            <v-list-item link @click="move('filters', 'categories', index)" :disabled="categories.length >= maxCategories">
                              <v-list-item-icon>
                                <v-icon>mdi-cursor-move</v-icon>
                              </v-list-item-icon>
                              <v-list-item-title>Move to categories</v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </v-chip>
                      <v-chip v-if="dragArea">Drop Here</v-chip>
                    </draggable>
                  </v-card-text>
                </v-card>
                <v-divider></v-divider>
                <v-card shaped>
                  <v-card-title>
                    Charts
                    <v-btn
                      dark
                      icon
                      color="blue"
                      @click="showChartsList = true"
                    >
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="2">
                        <v-icon x-large color="purple">
                          {{chart.icon}}
                        </v-icon>
                      </v-col>
                      <v-spacer></v-spacer>
                      <v-col cols="9">
                        <b>{{chart.title}}</b>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <h2><v-icon>mdi-cog-outline</v-icon> Settings</h2>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <ChartSettings
              v-if="chart.type && renderSettings"
              :chartType="chart.type"
              :chartSubType="chart.subType"
              @chartSettings="chartSettings"
              :options="option"
            />
            <GeneralSettings
              v-if="renderSettings"
              @generalSettings="generalSettings"
              :option="option"
              :titleValues="option.title"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col :cols="vizWidth">
        <v-row v-if="editingViz && maxCategories > 0">
          <v-col cols="1">Category</v-col>
            &nbsp;
            <v-col cols="10">
            <v-card width="498" height="48" rounded>
              <v-card-text>
                <draggable
                  id="categories"
                  :list="categories"
                  @start="dragStart"
                  @end="dragEnd"
                  :move="dragging"
                  group="visualization"
                  animation=650
                >
                  <v-chip v-for="(cat, index) in categories" :key="index" color="green" dark small>
                    {{cat.display}}
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
                          small
                          v-bind="attrs"
                          v-on="on"
                          id="categoriesActivator"
                        >
                          <v-icon color="white">mdi-dots-horizontal</v-icon>
                        </v-btn>
                      </template>
                      <v-list rounded>
                        <v-list-item link @click="getDimensionValues('categories', index)">
                          <v-list-item-icon>
                            <v-icon>mdi-filter-minus</v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>Filter Values</v-list-item-title>
                        </v-list-item>
                        <v-list-item link @click="removeDimension('categories', index)">
                          <v-list-item-icon>
                            <v-icon>mdi-minus-circle</v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>Remove</v-list-item-title>
                        </v-list-item>
                        <v-list-item link @click="move('categories', 'series', index)" :disabled="series.length > 0">
                          <v-list-item-icon>
                            <v-icon>mdi-cursor-move</v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>Move to series</v-list-item-title>
                        </v-list-item>
                        <v-list-item link @click="move('categories', 'filters', index)">
                          <v-list-item-icon>
                            <v-icon>mdi-cursor-move</v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>Move to filters</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-chip>
                  <v-chip v-if="dragArea & categories.length < maxCategories">Drop Here</v-chip>
                </draggable>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row v-if="editingViz">
          <v-col cols="1">Series</v-col>
            &nbsp;
          <v-col cols="7">
            <v-card width="498" height="48">
              <v-card-text>
                <draggable
                  :list="series"
                  @start="dragStart"
                  @end="dragEnd"
                  :move="dragging"
                  id="series"
                  group="visualization"
                  animation=650
                >
                  <v-chip v-for="(ser, index) in series" :key="index" color="blue" dark small style="cursor: move">
                    {{ser.aggsBy.display}}({{ser.display}})
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
                          small
                          v-bind="attrs"
                          v-on="on"
                          id="seriesActivator"
                        >
                          <v-icon color="white">mdi-dots-horizontal</v-icon>
                        </v-btn>
                      </template>
                      <v-list rounded>
                        <v-list-group
                          prepend-icon="mdi-sigma"
                          no-action
                        >
                          <template v-slot:activator>
                            <v-list-item-content no-action>
                              <v-list-item-title no-action>Aggregations</v-list-item-title>
                            </v-list-item-content>
                          </template>
                          <v-list-item link>
                            <v-list-item-content>
                              <v-list-item-title @click="changeAgg(index, 'value_count')">Count</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item link v-if="ser.type === 'long'">
                            <v-list-item-content>
                              <v-list-item-title @click="changeAgg(index, 'sum')">Sum</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item link v-if="ser.type === 'long'">
                            <v-list-item-content>
                              <v-list-item-title @click="changeAgg(index, 'avg')">Average</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list-group>
                        <v-list-item link @click="getDimensionValues('series', index)">
                          <v-list-item-icon>
                            <v-icon>mdi-filter-minus</v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>Filter Values</v-list-item-title>
                        </v-list-item>
                        <v-list-item link @click="series.splice(index, 1)">
                          <v-list-item-icon>
                            <v-icon>mdi-minus-circle</v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>Remove</v-list-item-title>
                        </v-list-item>
                        <v-list-item link @click="move('series', 'categories', index)" :disabled="categories.length >= maxCategories">
                          <v-list-item-icon>
                            <v-icon>mdi-cursor-move</v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>Move to categories</v-list-item-title>
                        </v-list-item>
                        <v-list-item link @click="move('series', 'filters', index)">
                          <v-list-item-icon>
                            <v-icon>mdi-cursor-move</v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>Move to filters</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-chip>
                  <v-chip v-if="dragArea && series.length < 1">Drop Here</v-chip>
                </draggable>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="1">
            <v-btn
              color="success"
              @click="buildQuery"
              small
              :disabled="!canDisplayChart"
            >
              <v-icon left>mdi-sitemap</v-icon>
              Visualize
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card v-if="displayChart && editingViz">
              <v-card-text>
                <v-chart
                  :style="{height: vizHeight + 'px'}"
                  :key="rerenderViz"
                  :option="option"
                />
              </v-card-text>
            </v-card>
            <v-chart
              v-else-if="displayChart"
              :style="{height: vizHeight + 'px'}"
              :key="rerenderViz"
              :option="option"
            />
            <v-progress-linear
              color="red lighten-2"
              buffer-value="0"
              stream
              height="20"
              v-if="loadingData"
            >Loading Data</v-progress-linear>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <ChartsList :activeChart="chart" :showChartsList="showChartsList" @close="hideChartsList" @chartSelected='chartSelected' />
  </v-container>
</template>
<script>
import draggable from 'vuedraggable'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, BarChart, LineChart, ScatterChart, RadarChart, GaugeChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import ChartsList from './ChartsList.vue'
import ChartSettings from './settings/ChartSettings.vue'
import GeneralSettings from './settings/GeneralSettings.vue'

use([
  CanvasRenderer,
  PieChart,
  BarChart,
  LineChart,
  ScatterChart,
  RadarChart,
  GaugeChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

export default {
  props: {
    editingViz: {
      type: Boolean,
      default: true
    },
    rerenderViz: {
      type: Number
    },
    vizHeight: {
      type: Number,
      default: 400
    },
    id: {
      type: String
    }
  },
  data () {
    return {
      me: this,
      renderSettings: false,
      vizId: '',
      data: '',
      confirmDelete: false,
      loadingData: false,
      displayChart: false,
      datasets: [],
      dataset: {},
      dimensions: [],
      categories: [],
      series: [],
      filters: [],
      aggregations: [{
        name: 'value_count',
        display: 'CNT'
      }, {
        name: 'sum',
        display: 'SUM'
      }, {
        name: 'avg',
        display: 'AVG'
      }],
      activeDimension: {
        location: '',
        index: -1,
        name: ''
      },
      showChartsList: false,
      showValuesSelector: false,
      chart: { type: 'bar', subType: '', icon: 'mdi-chart-bar', title: 'Bar Chart', description: 'Presents data with rectangular bars at heights or lengths proportional to the values they represent' },
      option: {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        title: {
          show: true,
          text: 'My Chart',
          textAlign: 'auto',
          left: 'center',
          textStyle: {}
        },
        series: [],
        xAxis: [],
        yAxis: {}
      },
      chartOptions: [],
      dragArea: false
    }
  },
  methods: {
    buildFilters () {
      const filter = {
        bool: {
          must: [],
          must_not: []
        }
      }
      for (const category of this.categories) {
        let field = category.name
        if (category.type === 'text') {
          field += '.keyword'
        }
        if (category.defaultFilter !== 'selected') {
          continue
        }
        if (Array.isArray(category.selectedValues)) {
          const terms = {
            terms: {}
          }
          terms.terms[field] = []
          for (const value of category.selectedValues) {
            terms.terms[field].push(value)
          }
          if (category.filterCondition === 'exclude') {
            filter.bool.must_not.push(terms)
          } else {
            filter.bool.must.push(terms)
          }
        }
      }
      for (const series of this.series) {
        let field = series.name
        if (series.type === 'text') {
          field += '.keyword'
        }
        if (series.defaultFilter !== 'selected') {
          continue
        }
        if (Array.isArray(series.selectedValues)) {
          const terms = {
            terms: {}
          }
          terms.terms[field] = []
          for (const value of series.selectedValues) {
            terms.terms[field].push(value)
          }
          if (series.filterCondition === 'exclude') {
            filter.bool.must_not.push(terms)
          } else {
            filter.bool.must.push(terms)
          }
        }
      }
      for (const filters of this.filters) {
        let field = filters.name
        if (filters.type === 'text') {
          field += '.keyword'
        }
        if (filters.defaultFilter !== 'selected') {
          continue
        }
        if (Array.isArray(filters.selectedValues)) {
          const terms = {
            terms: {}
          }
          terms.terms[field] = []
          for (const value of filters.selectedValues) {
            terms.terms[field].push(value)
          }
          if (filters.filterCondition === 'exclude') {
            filter.bool.must_not.push(terms)
          } else {
            filter.bool.must.push(terms)
          }
        }
      }
      return filter
    },
    buildQuery () {
      this.data = ''
      const query = {
        size: 0
      }
      let seriesField = this.series[0].name
      if (this.series[0].type === 'text') {
        seriesField += '.keyword'
      }
      if (this.categories.length > 0) {
        query.aggs = {
          categories: {}
        }
        if (this.categories.length === 1) {
          const category = this.categories[0]
          let field = category.name
          if (category.type === 'text') {
            field += '.keyword'
          }
          const term = {}
          term[category.name] = {
            terms: {
              field
            }
          }
          query.aggs.categories.composite = {
            sources: [term]
          }
        } else {
          const terms = []
          for (const category of this.categories) {
            let field = category.name
            if (category.type === 'text') {
              field += '.keyword'
            }
            const term = {}
            term[category.name] = {
              terms: {
                field,
                missing_bucket: true
              }
            }
            terms.push(term)
          }
          query.aggs.categories.composite = {
            size: 1000,
            sources: terms
          }
        }
        query.aggs.categories.aggs = {
          series: {}
        }
        if (this.series[0].aggsBy.name === 'value_count' && this.chart.type !== 'pie') {
          query.aggs.categories.aggs.series.terms = {
            field: seriesField,
            order: { _key: 'asc' },
            // min_doc_count: 0,
            size: 2000000
          }
        } else {
          const aggBy = this.series[0].aggsBy.name
          query.aggs.categories.aggs.series[aggBy] = { field: seriesField }
        }
      } else {
        const terms = {}
        terms[this.series[0].name] = {
          terms: {
            field: seriesField
          }
        }
        query.aggs = {
          series: {
            composite: {
              size: 1000,
              sources: [terms]
            }
          }
        }
      }
      const filter = this.buildFilters()
      query.query = {
        bool: filter.bool
      }
      query.reportOptions = {
        locationBasedConstraint: true
      }
      this.getData(query).then(() => {
        this.parseResults()
      })
    },
    getData (query) {
      return new Promise((resolve, reject) => {
        let category = 'categories'
        if (this.maxCategories === 0) {
          category = 'series'
        }
        this.loadingData = true
        this.displayChart = false
        const url = `/es/${this.dataset.name}/_search?filter_path=aggregations`
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(query)
        })
          .then((response) => {
            response
              .json()
              .then((data) => {
                if (!this.data) {
                  this.data = data
                } else if (data.aggregations[category].buckets && data.aggregations[category].buckets.length > 0) {
                  this.data.aggregations[category].buckets = this.data.aggregations[category].buckets.concat(data.aggregations[category].buckets)
                }
                if (data.aggregations && data.aggregations[category].after_key) {
                  query.aggs[category].composite.after = data.aggregations[category].after_key
                  this.getData(query).then(() => {
                    return resolve()
                  })
                } else {
                  return resolve()
                }
              })
              .catch((err) => {
                console.log(err)
                return reject(err)
              })
          })
          .catch((err) => {
            console.log(err)
          })
      })
    },
    async parseResults () {
      const level1Cat = []
      let level2Cat = []
      const keys = {}
      const series = {}
      if (this.data.aggregations.categories) {
        for (const bucket of this.data.aggregations.categories.buckets) {
          if (Object.keys(bucket.key).length > 1) {
            const catKeys = Object.keys(bucket.key)
            if (!keys[bucket.key[catKeys[0]]]) {
              keys[bucket.key[catKeys[0]]] = []
            }
            keys[bucket.key[catKeys[0]]].push(bucket.key[catKeys[1]])
          } else {
            if (typeof bucket.key === 'object') {
              const keys = Object.keys(bucket.key)
              for (const key of keys) {
                level1Cat.push(bucket.key[key])
              }
            } else {
              level1Cat.push(bucket.key)
            }
          }
          if (bucket.series.buckets) {
            for (const value of bucket.series.buckets) {
              let name = value.key
              if (value.key_as_string) {
                name = value.key_as_string
              }
              if (!series[name]) {
                series[name] = []
              }
              series[name].push(value.doc_count)
            }
          } else if (bucket.series.value) {
            if (!series[this.series[0].display]) {
              series[this.series[0].display] = []
            }
            if (this.hasAxis) {
              series[this.series[0].display].push(bucket.series.value)
            } else {
              series[this.series[0].display].push({
                name: bucket.key[Object.keys(bucket.key)[0]],
                value: bucket.series.value
              })
            }
          }
        }
        if (Object.keys(keys).length > 0) {
          for (const key in keys) {
            level2Cat = [...level2Cat, ...keys[key]]
            level1Cat.push(key)
          }
        }
      } else if (this.data.aggregations.series) {
        if (!series[this.series[0].display]) {
          series[this.series[0].display] = []
        }
        if (this.data.aggregations.series.buckets) {
          for (const bucket of this.data.aggregations.series.buckets) {
            // level1Cat.push(bucket.key)
            series[this.series[0].display].push({
              name: bucket.key,
              value: bucket.doc_count
            })
          }
        } else if (this.data.aggregations.series.value) {
          series[this.series[0].display].push({
            name: this.series[0].display,
            value: this.data.aggregations.series.value
          })
        }
      }
      this.option.xAxis = []
      this.option.yAxis = {}
      this.option.series = []
      if (level1Cat && level1Cat.length > 0 && this.hasAxis) {
        if (level2Cat && level2Cat.length > 0) {
          this.option.xAxis.push({
            type: 'category',
            data: level2Cat
          })
        }
        if (level1Cat && level1Cat.length > 0) {
          this.option.xAxis.push({
            type: 'category',
            data: level1Cat
          })
        }
        this.option.yAxis = {
          type: 'value'
        }
      } else {
        delete this.option.yAxis
        delete this.option.xAxis
      }
      const chartOpt = this.chartOptions.find((opt) => {
        return opt.type === this.chart.type
      })
      for (const seriesName in series) {
        this.option.series.push({
          name: seriesName,
          type: this.chart.type,
          ...chartOpt,
          data: series[seriesName]
        })
      }
      await this.$nextTick()
      this.loadingData = false
      this.displayChart = true
    },
    getDimensionValues (type, indexInType) {
      if (type !== 'categories' && type !== 'series' && type !== 'filters') {
        return false
      }
      const dimension = this[type][indexInType].name
      const url = `/es/populateFilter/${this.dataset.name}/${dimension}?dataType=${this[type][indexInType].type}`
      this.$set(this[type][indexInType], 'allValues', [])
      if (!this[type][indexInType].selectedValues) {
        this.$set(this[type][indexInType], 'selectedValues', [])
        this.$set(this[type][indexInType], 'highlightedAllValues', -1)
        this.$set(this[type][indexInType], 'defaultFilter', -1)
        this.$set(this[type][indexInType], 'filterCondition', -1)
        this.$set(this[type][indexInType], 'highlightedSelectedValues', -1)
      }
      fetch(url, {
        method: 'GET'
      }).then((response) => {
        response
          .json()
          .then((data) => {
            for (const bucket of data) {
              if (this[type][indexInType].selectedValues.indexOf(bucket.key.value) === -1) {
                this[type][indexInType].allValues.push(
                  bucket.key.value
                )
              }
            }
            this.activeDimension.location = type
            this.activeDimension.name = this[type][indexInType].display
            this.activeDimension.index = indexInType
            this.showValuesSelector = true
          })
      })
    },
    moveDimensionValue (from, to, moveAll) {
      this[this.activeDimension.location][this.activeDimension.index].defaultFilter = 'selected'
      if (moveAll) {
        this[this.activeDimension.location][this.activeDimension.index][to] = [
          ...this[this.activeDimension.location][this.activeDimension.index][to],
          ...this[this.activeDimension.location][this.activeDimension.index][from]
        ]
        this[this.activeDimension.location][this.activeDimension.index][to].sort()
        this[this.activeDimension.location][this.activeDimension.index][from] = []
      } else {
        let position = -1
        if (from === 'allValues') {
          position = this[this.activeDimension.location][this.activeDimension.index].highlightedAllValues
        } else if (from === 'selectedValues') {
          position = this[this.activeDimension.location][this.activeDimension.index].highlightedSelectedValues
        }
        this[this.activeDimension.location][this.activeDimension.index][to].push(
          this[this.activeDimension.location][this.activeDimension.index][from][position]
        )
        this[this.activeDimension.location][this.activeDimension.index][to].sort()
        this[this.activeDimension.location][this.activeDimension.index][from].splice(position, 1)
      }
      this.$set(this[this.activeDimension.location][this.activeDimension.index], 'highlightedAllValues', -1)
      this.$set(this[this.activeDimension.location][this.activeDimension.index], 'highlightedSelectedValues', -1)
    },
    closeDimValuesSelector () {
      this.showValuesSelector = false
      this.$set(this[this.activeDimension.location][this.activeDimension.index], 'highlightedAllValues', -1)
      this.$set(this[this.activeDimension.location][this.activeDimension.index], 'highlightedSelectedValues', -1)
    },
    removeDimension (from, position) {
      this[from].splice(position, 1)
      document.getElementById('hiddenActivator').click()
    },
    move (from, to, position) {
      if (to === 'series') {
        this.setDefaultAgg(this[from][position])
      }
      this[to].push(this[from][position])
      this[from].splice(position, 1)
    },
    changeAgg (position, agg) {
      const aggregation = this.aggregations.find((aggregation) => {
        return aggregation.name === agg
      })
      if (aggregation) {
        this.series[position].aggsBy = aggregation
      }
      document.getElementById('seriesActivator').click()
    },
    dragEnd (evt) {
      this.dragArea = false
      if (evt.to.id !== evt.from.id) {
        let position = evt.newIndex
        // if a dimension is dragged at the end of the dragArea chip, then the newIndex will be higher by 1 as the dragArea chip is not pushed into series or categories array
        if (this[evt.to.id].length === position) {
          position -= 1
        }
        this.getDimensionValues(evt.to.id, position)
      }
    },
    dragStart () {
      this.dragArea = true
    },
    dragging (evt) {
      if (evt.to.id === 'categories' && this.categories.length >= this.maxCategories) {
        return false
      }
      if (evt.to.id === 'series') {
        if (this.series.length > 0) {
          return false
        }
        this.setDefaultAgg(evt.draggedContext.element)
      }
    },
    setDefaultAgg (component) {
      if (!component.aggsBy) {
        if (component.type === 'long') {
          const agg = this.aggregations.find((agg) => {
            return agg.name === 'sum'
          })
          if (agg) {
            this.$set(component, 'aggsBy', agg)
          }
        } else {
          const agg = this.aggregations.find((agg) => {
            return agg.name === 'value_count'
          })
          if (agg) {
            this.$set(component, 'aggsBy', agg)
          }
        }
      }
    },
    datasetSelected () {
      return new Promise((resolve, reject) => {
        this.activeDimension = {
          location: '',
          index: -1,
          name: ''
        }
        this.categories = []
        this.series = []
        this.filters = []
        fetch('/es/listFields/' + this.dataset.name + '?id=' + this.dataset.id).then((response) => {
          response.json().then((fields) => {
            this.dimensions = fields
            this.$emit('dimensions', this.dimensions)
            return resolve()
          })
        }).catch((err) => {
          console.log(err)
          return reject(err)
        })
      })
    },
    hideChartsList () {
      this.showChartsList = false
    },
    chartSelected (chart) {
      this.chart = chart
    },
    generalSettings (setting) {
      for (const set in setting) {
        this.option[set] = setting[set]
      }
    },
    chartSettings (setting) {
      let updated = false
      for (const index in this.chartOptions) {
        if (this.chartOptions[index].type === setting.type) {
          this.chartOptions[index] = setting
          updated = true
        }
      }
      if (!updated) {
        this.chartOptions.push(setting)
      }

      // update series
      if (this.option.series && this.option.series.length > 0) {
        for (const series of this.option.series) {
          if (series.type === setting.type) {
            for (const stng in setting) {
              series[stng] = setting[stng]
            }
          }
        }
      }
    },
    save () {
      // deep copy
      const options = JSON.parse(JSON.stringify(this.option))
      for (const opt of options.series) {
        delete opt.data
      }
      const visualization = {
        resourceType: 'Basic',
        meta: {
          profile: ['http://ihris.org/fhir/StructureDefinition/ihris-data-visualization']
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
          valueString: this.option.title.text
        }, {
          url: 'http://ihris.org/fhir/StructureDefinition/ihris-visualization-dataset',
          extension: [{
            url: 'name',
            valueString: this.dataset.name
          }, {
            url: 'id',
            valueString: this.dataset.id
          }]
        }, {
          url: 'http://ihris.org/fhir/StructureDefinition/ihris-visualization-settings',
          valueBase64Binary: window.btoa(JSON.stringify(options))
        }, {
          url: 'http://ihris.org/fhir/StructureDefinition/ihris-visualization-permissions',
          extension: [{
            url: 'shared',
            valueBoolean: true
          }]
        }]
      }
      for (const cat of this.categories) {
        const cats = [{
          url: 'name',
          valueString: cat.name
        }]
        if (cat.defaultFilter) {
          cats.push({
            url: 'defaultFilter',
            valueString: cat.defaultFilter
          })
        }
        if (cat.filterCondition) {
          cats.push({
            url: 'filterCondition',
            valueString: cat.filterCondition
          })
        }
        if (cat.selectedValues) {
          cats.push({
            url: 'selectedValues',
            valueString: window.btoa(JSON.stringify(cat.selectedValues))
          })
        }
        visualization.extension.push({
          url: 'http://ihris.org/fhir/StructureDefinition/ihris-visualization-categories',
          extension: cats
        })
      }
      for (const ser of this.series) {
        const sers = [{
          url: 'name',
          valueString: ser.name
        }, {
          url: 'aggsBy',
          valueString: ser.aggsBy.name
        }]
        if (ser.defaultFilter) {
          sers.push({
            url: 'defaultFilter',
            valueString: ser.defaultFilter
          })
        }
        if (ser.filterCondition) {
          sers.push({
            url: 'filterCondition',
            valueString: ser.filterCondition
          })
        }
        if (ser.selectedValues) {
          sers.push({
            url: 'selectedValues',
            valueString: window.btoa(JSON.stringify(ser.selectedValues))
          })
        }
        visualization.extension.push({
          url: 'http://ihris.org/fhir/StructureDefinition/ihris-visualization-series',
          extension: sers
        })
      }
      for (const fil of this.filters) {
        const fils = [{
          url: 'name',
          valueString: fil.name
        }]
        if (fil.defaultFilter) {
          fils.push({
            url: 'defaultFilter',
            valueString: fil.defaultFilter
          })
        }
        if (fil.filterCondition) {
          fils.push({
            url: 'filterCondition',
            valueString: fil.filterCondition
          })
        }
        if (fil.selectedValues) {
          fils.push({
            url: 'selectedValues',
            valueString: window.btoa(JSON.stringify(fil.selectedValues))
          })
        }
        visualization.extension.push({
          url: 'http://ihris.org/fhir/StructureDefinition/ihris-visualization-filters',
          extension: fils
        })
      }
      let method = 'POST'
      if (this.vizId) {
        method = 'PUT'
        visualization.id = this.vizId
      }
      fetch('/fhir/Basic/' + this.vizId, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(visualization)
      })
        .then((response) => {
          if (response.status !== 200 && response.status !== 201) {
            this.$store.state.snackbar.enabled = true
            this.$store.state.snackbar.text = 'Failed to save Visualization!'
            this.$store.state.snackbar.color = 'error'
            return
          }
          response.json().then((data) => {
            this.$store.state.snackbar.enabled = true
            this.$store.state.snackbar.text = 'Visualization saved successfully!'
            this.$store.state.snackbar.color = 'primary'
            this.vizId = data.id
          })
        })
        .catch((error) => {
          this.$store.state.snackbar.enabled = true
          this.$store.state.snackbar.text = 'Failed to save Visualization!'
          this.$store.state.snackbar.color = 'error'
          console.error('Error:', error)
        })
    },
    deleteViz () {
      fetch('/fhir/Basic/' + this.vizId, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    getViz () {
      fetch('/fhir/Basic/' + this.vizId).then((response) => {
        response.json()
          .then(async (data) => {
            const datasetExt = data.extension.find((ext) => {
              return ext.url === 'http://ihris.org/fhir/StructureDefinition/ihris-visualization-dataset'
            })
            const datasetName = datasetExt.extension.find((ext) => {
              return ext.url === 'name'
            }).valueString
            const datasetId = datasetExt.extension.find((ext) => {
              return ext.url === 'id'
            }).valueString
            this.dataset = {
              id: datasetId,
              name: datasetName
            }
            await this.datasetSelected()
            for (const vizData of data.extension) {
              if (vizData.url === 'http://ihris.org/fhir/StructureDefinition/ihris-visualization-categories') {
                const name = vizData.extension.find((ext) => {
                  return ext.url === 'name'
                })
                const catDim = this.dimensions.find((dim) => {
                  return dim.name === name.valueString
                })
                if (catDim) {
                  let selectedValues = vizData.extension.find((ext) => {
                    return ext.url === 'selectedValues'
                  })
                  if (selectedValues) {
                    try {
                      selectedValues = JSON.parse(window.atob(selectedValues.valueString))
                    } catch (error) {
                      console.log(error)
                    }
                    catDim.selectedValues = selectedValues
                  }
                  const defaultFilter = vizData.extension.find((ext) => {
                    return ext.url === 'defaultFilter'
                  })
                  if (defaultFilter) {
                    catDim.defaultFilter = defaultFilter.valueString
                  }
                  const filterCondition = vizData.extension.find((ext) => {
                    return ext.url === 'filterCondition'
                  })
                  if (filterCondition) {
                    catDim.filterCondition = filterCondition.valueString
                  }
                  this.categories.push(catDim)
                }
              }
              if (vizData.url === 'http://ihris.org/fhir/StructureDefinition/ihris-visualization-series') {
                const name = vizData.extension.find((ext) => {
                  return ext.url === 'name'
                })
                const serDim = this.dimensions.find((dim) => {
                  return dim.name === name.valueString
                })
                const aggsBy = vizData.extension.find((ext) => {
                  return ext.url === 'aggsBy'
                })
                if (aggsBy) {
                  const agg = this.aggregations.find((agg) => {
                    return agg.name === aggsBy.valueString
                  })
                  if (agg) {
                    serDim.aggsBy = agg
                  }
                }
                if (serDim) {
                  let selectedValues = vizData.extension.find((ext) => {
                    return ext.url === 'selectedValues'
                  })
                  if (selectedValues) {
                    try {
                      selectedValues = JSON.parse(window.atob(selectedValues.valueString))
                    } catch (error) {
                      console.log(error)
                    }
                    serDim.selectedValues = selectedValues
                  }
                  const defaultFilter = vizData.extension.find((ext) => {
                    return ext.url === 'defaultFilter'
                  })
                  if (defaultFilter) {
                    serDim.defaultFilter = defaultFilter.valueString
                  }
                  const filterCondition = vizData.extension.find((ext) => {
                    return ext.url === 'filterCondition'
                  })
                  if (filterCondition) {
                    serDim.filterCondition = filterCondition.valueString
                  }
                  this.series.push(serDim)
                }
              }

              if (vizData.url === 'http://ihris.org/fhir/StructureDefinition/ihris-visualization-filters') {
                const name = vizData.extension.find((ext) => {
                  return ext.url === 'name'
                })
                const filDim = this.dimensions.find((dim) => {
                  return dim.name === name.valueString
                })
                if (filDim) {
                  let selectedValues = vizData.extension.find((ext) => {
                    return ext.url === 'selectedValues'
                  })
                  if (selectedValues) {
                    try {
                      selectedValues = JSON.parse(window.atob(selectedValues.valueString))
                    } catch (error) {
                      console.log(error)
                    }
                    filDim.selectedValues = selectedValues
                  }
                  const defaultFilter = vizData.extension.find((ext) => {
                    return ext.url === 'defaultFilter'
                  })
                  if (defaultFilter) {
                    filDim.defaultFilter = defaultFilter.valueString
                  }
                  const filterCondition = vizData.extension.find((ext) => {
                    return ext.url === 'filterCondition'
                  })
                  if (filterCondition) {
                    filDim.filterCondition = filterCondition.valueString
                  }
                  this.filters.push(filDim)
                }
              }
              if (vizData.url === 'http://ihris.org/fhir/StructureDefinition/ihris-visualization-settings') {
                const settings = vizData.valueBase64Binary
                try {
                  this.option = JSON.parse(window.atob(settings))
                  for (const chartOpt of this.option.series) {
                    const exist = this.chartOptions.find((opt) => {
                      return opt.type === chartOpt.type
                    })
                    if (!exist) {
                      delete chartOpt.name
                      this.chartOptions.push(chartOpt)
                      const chart = this.$store.state.charts.find((chart) => {
                        return chart.type === chartOpt.type
                      })
                      this.chart = chart
                    }
                  }
                } catch (error) {
                  console.log(error)
                }
              }
            }
            this.renderSettings = true
            this.buildQuery()
          })
      })
    }
  },
  components: {
    draggable,
    ChartsList,
    VChart,
    GeneralSettings,
    ChartSettings
  },
  computed: {
    vizWidth () {
      if (this.editingViz) {
        return 8
      }
      return 12
    },
    canDisplayChart () {
      if (this.chart.type && this.series.length > 0 && ((this.maxCategories > 0 && this.categories.length > 0) || this.maxCategories === 0)) {
        return true
      }
      return false
    },
    hasAxis () {
      if (this.chart.type === 'pie' || this.chart.type === 'gauge') {
        return false
      }
      return true
    },
    maxCategories () {
      if (this.chart.type === 'pie') {
        return 1
      }
      if (this.chart.type === 'gauge') {
        return 0
      }
      return 2
    }
  },
  watch: {
    maxCategories (val) {
      if (val === 0) {
        this.categories = []
      }
    },
    series () {
      this.activeDimension = {
        location: '',
        index: -1,
        name: ''
      }
    },
    categories () {
      this.activeDimension = {
        location: '',
        index: -1,
        name: ''
      }
    }
  },
  created () {
    if (this.datasets.length > 0) {
      this.dataset = this.datasets[0]
    }
    if (this.id) {
      this.vizId = this.id
    } else if (this.$route.params.id) {
      this.vizId = this.$route.params.id
    }
    fetch('/es/indices').then((response) => {
      response.json().then((indices) => {
        this.datasets = indices
        if (this.vizId) {
          this.getViz()
        } else {
          this.vizId = ''
          this.renderSettings = true
        }
      })
    }).catch((err) => {
      console.log(err)
    })
  }
}
</script>
<style scoped>
  .dstfields:hover {
    background-color: antiquewhite;
  }
  .chart {
    height: 400px;
  }
</style>
