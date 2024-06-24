<template>
  <v-container fluid>
    <v-dialog v-model="deleteDash" persistent width="auto">
      <v-card>
        <v-card-title class="text-h5">
          {{ $t(`App.hardcoded-texts.confirm_delete_dashboard`) }}
        </v-card-title>
        <v-card-actions class="justify-end">
          <v-btn color="green darken-1" text @click="deleteDash = false">
            {{ $t(`App.hardcoded-texts.No`) }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="deleteDashboard">Yes </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      persistent
      transition="dialog-top-transition"
      v-model="showValuesSelector"
      width="560px"
    >
      <v-toolbar color="primary" density="compact" height="40px">
        <v-toolbar-title>
          {{ $t(`App.hardcoded-texts.Values For`) }}
          {{ activeDimension.data.display }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon @click="showValuesSelector = false" style="cursor: pointer"
          >mdi-close</v-icon
        >
      </v-toolbar>
      <v-card class="overflow-auto" v-if="!supportsRange">
        <v-row>
          <v-col cols="auto">
            <br />
            <v-radio-group inline v-model="activeDimension.filterCondition">
              <v-radio label="Include" value="include"></v-radio>
              <v-radio label="Exclude" value="exclude"></v-radio>
            </v-radio-group>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="2">
            <br />
            <v-btn color="accent" size="small" @click="applyFilters">
              {{ activeDimension.data.Apply1 }}
            </v-btn>
          </v-col>
        </v-row>
        <v-card-text>
          <template v-for="(filter, dimensionIndex) in filters">
            <template v-if="filter.name === activeDimension.data.name">
              <v-chip
                v-for="(value, valueIndex) in filter.values"
                :key="value.name"
                color="green"
                text-color="red"
                variant="outlined"
                closable
                @click:close="removeFilter(dimensionIndex, valueIndex)"
              >
                {{ value.name }}
              </v-chip>
            </template>
          </template>
          <v-data-table
            hide-default-header
            :items-per-page="20"
            :headers="[{ key: 'name', title: 'name' }]"
            :items="activeDimension.dimValues"
            :loading="activeDimension.loading"
            dense
            show-select
            return-object
            v-model="activeDimension.selectedValues"
          />
        </v-card-text>
      </v-card>
      <v-card class="overflow-auto" v-else>
        <v-row justify="center">
          <v-col cols="6" offset="3">
            <br />
            <v-select
              :items="nonRangeFilterConditions"
              v-model="activeDimension.filterCondition"
              label="Condition"
            ></v-select>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="2">
            <br />
            <v-btn color="accent" size="small" @click="applyFilters">
              {{ activeDimension.data.Apply1 }}
            </v-btn>
          </v-col>
        </v-row>
        <v-card-text v-if="activeDimension.data.type === 'date'">
          <v-row justify="space-around">
            <template v-if="activeDimension.filterCondition === 'range'">
              <v-date-input
                v-model="fromRange[activeDimension.data.name]"
                label="From Date"
                max-width="368"
              ></v-date-input>
              <v-date-input
                v-model="toRange[activeDimension.data.name]"
                label="To Date"
                max-width="368"
              ></v-date-input>
            </template>
            <v-date-input
              v-else
              v-model="nonRangeFilter[activeDimension.data.name]"
              label="Select Date"
              max-width="368"
            ></v-date-input>
          </v-row>
        </v-card-text>
        <v-card-text v-else-if="activeDimension.data.type === 'long'">
          <v-row justify="space-around">
            <template v-if="activeDimension.filterCondition === 'range'">
              <v-text-field
                v-model="fromRange[activeDimension.data.name]"
                label="From"
                max-width="160"
                type="number"
              ></v-text-field>
              <v-text-field
                v-model="toRange[activeDimension.data.name]"
                label="To"
                max-width="160"
                type="number"
              ></v-text-field>
            </template>
            <v-text-field
              v-else
              label="Filter Value"
              max-width="160"
              type="number"
              v-model="nonRangeFilter[activeDimension.data.name]"
            ></v-text-field>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      transition="dialog-top-transition"
      v-model="displayVizList"
      width="960px"
    >
      <v-toolbar color="primary" density="compact" height="40px">
        <v-toolbar-title> Available Vizualizations </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon @click="displayVizList = false" style="cursor: pointer"
          >mdi-close</v-icon
        >
      </v-toolbar>
      <v-progress-linear
        :indeterminate="loadingAvailableVizs"
        :active="loadingAvailableVizs"
        color="secondary"
      />
      <v-card>
        <v-card-text>
          <template v-if="availableViz.length > 0">
            <v-list shaped density="compact">
              <v-list-item
                v-for="(value, i) in this.availableViz"
                :key="i"
                @click="addVizualization(value.id)"
              >
                <template v-slot:prepend>
                  <v-icon icon="mdi-menu-right"></v-icon>
                </template>
                <v-list-item-title>
                  <label style="font-size: 13px; cursor: pointer">
                    {{ value.name }}
                  </label>
                </v-list-item-title>
              </v-list-item>
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
            <v-btn
              color="tertiary"
              size="small"
              @click="$router.push({ name: 'home' })"
            >
              <v-icon start color="primary">mdi-home</v-icon> {{ $t(`App.hardcoded-texts.Home`) }}
            </v-btn>
            &nbsp;
            <v-btn color="tertiary" size="small" @click="reload">
              <v-icon start color="primary">mdi-reload</v-icon> {{ $t(`App.hardcoded-texts.Reload`) }}
            </v-btn>
            &nbsp;
            <v-btn
              color="tertiary"
              size="small"
              @click="save"
              :disabled="!canSave"
            >
              <v-icon start color="primary">mdi-content-save-check</v-icon> {{ $t(`App.hardcoded-texts.Save`) }}
            </v-btn>
            &nbsp;
            <v-btn color="tertiary" size="small" @click="listViz">
              <v-icon start color="primary">mdi-plus</v-icon> {{ $t(`App.hardcoded-texts.Insert Visualization`) }}
            </v-btn>
            &nbsp;
            <v-btn
              color="tertiary"
              size="small"
              @click="$router.push({ name: 'vizBuilder' })"
            >
              <v-icon start color="primary">mdi-plus</v-icon> {{ $t(`App.hardcoded-texts.Create Visualization`) }}
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <v-row>
          <v-col cols="auto">
            <v-text-field
              size="10"
              label="Dashboard Title*"
              outlined
              density="compact"
              v-model="title"
              v-if="editingDash"
            />
            <template v-else>
              <v-chip variant="outlined" label size="large">
                {{ title }}
              </v-chip>
            </template>
          </v-col>
          <v-col cols="auto">
            <v-autocomplete
              size="10"
              width="260"
              v-model="activeDimension.data"
              :items="dimensions"
              item-title="display"
              item-value="name"
              return-object
              clearable
              label="Filter By"
              density="compact"
              @update:modelValue="activateDimension"
            ></v-autocomplete>
          </v-col>
          <v-col v-if="!editingDash" cols="auto">
            <v-btn
              icon
              color="tertiary"
              size="small"
              @click="editingDash = true"
            >
              <v-icon color="primary">mdi-pencil</v-icon>
              <v-tooltip activator="parent" location="top">
                Edit this dashboard
              </v-tooltip>
            </v-btn>
          </v-col>
          <v-col v-if="!editingDash" cols="auto">
            <v-btn
              icon
              color="tertiary"
              size="small"
              @click="deleteDash = true"
            >
              <v-icon color="error">mdi-delete-circle</v-icon>
              <v-tooltip activator="parent" location="top">
                Delete this dashboard
              </v-tooltip>
            </v-btn>
          </v-col>
          <v-col v-else cols="auto">
            <v-btn icon color="white" size="small" @click="cancelEditing">
              <v-icon color="error">mdi-close-thick</v-icon>
              <v-tooltip activator="parent" location="top">
                Cancel Editing
              </v-tooltip>
            </v-btn>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="3">
            <v-row>
              <v-col cols="9">
                <v-autocomplete
                  v-model="dashboardId"
                  :items="dashboards"
                  item-title="name"
                  item-value="id"
                  filled
                  density="compact"
                  label="Other Dashboards"
                  @update:modelValue="
                    $router.push({
                      name: 'dashBuilder',
                      params: { edit: false, id: dashboardId },
                    })
                  "
                ></v-autocomplete>
              </v-col>
              <v-col cols="3" v-if="dashboardId">
                <v-btn
                  icon
                  dark
                  color="indigo"
                  size="small"
                  @click="
                    $router.push({
                      name: 'dashBuilder',
                      params: { edit: true },
                    })
                  "
                >
                  <v-icon>mdi-plus</v-icon>
                  <v-tooltip activator="parent" location="top">
                    Add New Dashboard
                  </v-tooltip>
                </v-btn>
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
            text-color="red"
            variant="outlined"
            closable
            @click:close="removeFilter(dimensionIndex, valueIndex)"
          >
            {{ filter.display }}:
            <template v-if="value.name">
              {{ value.name }}
            </template>
            <template v-else>
              {{ value }}
              <!-- {{ this.$moment(value).format("DD-MM-YYYY") }} -->
            </template>
          </v-chip>
        </template>
        <template v-if="loadingDashData">
          <v-progress-linear :indeterminate="true"></v-progress-linear>
        </template>
        <template v-else-if="visualizations.length === 0">
          <div style="text-align: center">
            {{ $t(`App.hardcoded-texts.Dashboard Instructions1`) }}
          {{ $t(`App.hardcoded-texts.Dashboard Instructions2`) }}
          </div>
        </template>
        <grid-layout
          v-model:layout="visualizations"
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
            <v-card :height="viz.hPx + 37">
              <v-menu
                transition="slide-y-transition"
                rounded="b-xl"
                :close-on-content-click="false"
              >
                <template v-slot:activator="{ props }">
                  <v-icon v-bind="props">mdi-dots-horizontal</v-icon>
                </template>
                <v-list rounded dense>
                  <v-list-item link @click="removeViz(viz.i)">
                    <template v-slot:prepend>
                      <v-icon size="small" icon="mdi-minus"></v-icon>
                    </template>
                    <v-list-item-title>
                      Remove Visualization
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    link
                    @click="$router.push({ path: '/vizBuilder/' + viz.id })"
                  >
                    <template v-slot:prepend>
                      <v-icon icon="mdi-pencil"></v-icon>
                    </template>
                    <v-list-item-title>Edit</v-list-item-title>
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
import VisualizationBuilder from "@/components/VisualizationBuilder.vue";
export default {
  props: {
    edit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dashboards: [],
      loadingDashData: false,
      editingDash: false,
      deleteDash: false,
      visualizations: [],
      dimensions: [],
      displayVizList: false,
      loadingAvailableVizs: false,
      availableViz: [],
      hardRerenderViz: 0,
      title: "",
      dashboardId: "",
      chart_layout: {},
      showValuesSelector: false,
      filters: [],
      activeDimension: {
        dimValues: [],
        selectedValues: [],
        nonRangeFilterValues: [],
        filterCondition: "include",
        nonRangeFilterCondition: "=",
        data: "",
        loading: false,
      },
      nonRangeFilterConditions: [
        {
          title: "Equal",
          value: "=",
        },
        {
          title: "Range",
          value: "range",
        },
        {
          title: "Greater than",
          value: "gt",
        },
        {
          title: "Greater than or equal",
          value: "gte",
        },
        {
          title: "Less than",
          value: "lt",
        },
        {
          title: "Less than or equal",
          value: "lte",
        },
      ],
      fromRange: {},
      toRange: {},
      nonRangeFilter: {},
    };
  },
  watch: {
    fromRange: {
      handler(val) {
        if (val) {
          let from = val[this.activeDimension.data.name];
          if (this.activeDimension.data.type === "date") {
            from = this.$moment(from).format("DD-MM-YYYY");
          }
          if (this.activeDimension.selectedValues.length) {
            let dateRange =
              this.activeDimension.selectedValues[0].split(" to ");
            dateRange[0] = from;
            this.activeDimension.selectedValues[0] = dateRange.join(" to ");
          } else {
            this.activeDimension.selectedValues[0] = from + " to ";
          }
        }
      },
      deep: true,
    },
    toRange: {
      handler(val) {
        if (val) {
          let to = val[this.activeDimension.data.name];
          if (this.activeDimension.data.type === "date") {
            to = this.$moment(to).format("DD-MM-YYYY");
          }
          if (this.activeDimension.selectedValues.length) {
            let dateRange =
              this.activeDimension.selectedValues[0].split(" to ");
            dateRange[1] = to;
            this.activeDimension.selectedValues[0] = dateRange.join(" to ");
          } else {
            this.activeDimension.selectedValues[0] = "  to " + to;
          }
        }
      },
      deep: true,
    },
    nonRangeFilter: {
      handler(val) {
        if (this.activeDimension.data.type === "date") {
          this.activeDimension.selectedValues[0] = this.$moment(
            val[this.activeDimension.data.name]
          ).format("DD-MM-YYYY");
        } else {
          this.activeDimension.selectedValues[0] =
            val[this.activeDimension.data.name];
        }
      },
      deep: true,
    },
    activeDimension: {
      handler() {
        if (!this.activeDimension.data.name) {
          return;
        }
        const index = this.filters.findIndex((filter) => {
          return filter.name === this.activeDimension.data.name;
        });
        const filter = {
          name: this.activeDimension.data.name,
          display: this.activeDimension.data.display,
          values: this.activeDimension.selectedValues,
          type: this.activeDimension.data.type,
          filterCondition: this.activeDimension.filterCondition,
        };
        if (!Array.isArray(filter.values)) {
          filter.values = [filter.values];
        }
        if (
          filter.type === "date" &&
          filter.filterCondition === "range" &&
          filter.values.length > 1
        ) {
          let first = this.$moment(filter.values[0]).format("DD-MM-YYYY");
          let last = this.$moment(
            filter.values[filter.values.length - 1]
          ).format("DD-MM-YYYY");
          filter.values = [first + " to " + last];
        }
        if (
          !this.activeDimension.selectedValues ||
          this.activeDimension.selectedValues.length === 0
        ) {
          if (index > -1) {
            this.filters.splice(index, 1);
          }
        } else if (index === -1) {
          this.filters.push(filter);
        } else {
          this.filters[index] = filter;
        }
      },
      deep: true,
    },
  },
  computed: {
    supportsRange() {
      if (
        this.activeDimension.data.type === "date" ||
        this.activeDimension.data.type === "long"
      ) {
        return true;
      }
      return false;
    },
    canSave() {
      if (this.visualizations.length > 0 && this.title) {
        return true;
      }
      return false;
    },
    draggable() {
      if (this.editingDash) {
        return true;
      }
      return false;
    },
    resizable() {
      if (this.editingDash) {
        return true;
      }
      return false;
    },
  },
  methods: {
    listDashboard() {
      this.dashboards = [];
      this.loading = true;
      this.displayDashList = true;
      this.getDashboards().then(() => {
        this.loading = false;
      });
    },
    getDashboards(url) {
      return new Promise((resolve, reject) => {
        if (!url) {
          url =
            "/fhir/Basic?_profile=http://ihris.org/fhir/StructureDefinition/ihris-dashboard";
        }
        fetch(url).then((response) => {
          response.json().then((data) => {
            if (data && data.entry && data.entry.length) {
              for (const entry of data.entry) {
                const name = entry.resource.extension.find((ext) => {
                  return (
                    ext.url ===
                    "http://ihris.org/fhir/StructureDefinition/ihris-basic-name"
                  );
                });
                if (name) {
                  this.dashboards.push({
                    id: entry.resource.id,
                    name: name.valueString,
                  });
                }
              }
            }
            const next = data.link.find((link) => {
              return link.relation === "next";
            });
            if (next) {
              next.url = next.url.substring(next.url.indexOf("/fhir/"));
              this.getDashboards(next.url)
                .then(() => {
                  return resolve();
                })
                .catch((err) => {
                  return reject(err);
                });
            } else {
              return resolve();
            }
          });
        });
      });
    },
    cancelEditing() {
      if (this.dashboardId) {
        this.editingDash = false;
      } else {
        this.$router.push({ name: "home" });
      }
    },
    deleteDashboard() {
      if (this.dashboardId) {
        fetch("/fhir/Basic/" + this.dashboardId, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }).then(() => {
          this.$router.push({ name: "home" });
        });
      } else {
        this.$router.push({ name: "home" });
      }
    },
    applyFilters() {
      this.showValuesSelector = false;
      this.reloadAllViz();
      this.activeDimension.data = "";
    },
    removeFilter(dimensionIndex, valueIndex) {
      this.filters[dimensionIndex].values.splice(valueIndex, 1);
      if (this.filters[dimensionIndex].values.length === 0) {
        this.filters.splice(dimensionIndex, 1);
      }
      this.reloadAllViz();
    },
    reloadAllViz() {
      this.hardRerenderViz++;
    },
    activateDimension(val) {
      this.showValuesSelector = true;
      this.activeDimension.loading = true;
      this.activeDimension.dimValues = [];
      this.activeDimension.selectedValues = [];
      if (val.type === "date" || val.type === "long" || val.type === "float") {
        this.activeDimension.filterCondition = "=";
      } else {
        this.activeDimension.filterCondition = "include";
      }
      const filter = this.filters.find((filter) => {
        return filter.name === this.activeDimension.data.name;
      });
      if (filter) {
        this.activeDimension.filterCondition = filter.filterCondition;
        this.activeDimension.selectedValues = JSON.parse(
          JSON.stringify(filter.values)
        );
      }
      if (val.type !== "date" && val.type !== "long" && val.type !== "float") {
        const url = `/es/populateFilter/${val.dataset.name}/${val.name}?dataType=${val.type}&hasKeyword=${val.hasKeyword}`;
        fetch(url, {
          method: "GET",
        }).then((response) => {
          response.json().then((data) => {
            this.activeDimension.loading = false;
            for (const bucket of data) {
              this.activeDimension.dimValues.push({
                name: bucket.key.value,
              });
            }
          });
        });
      } else {
        this.activeDimension.loading = false;
      }
    },
    popDimensions(dims) {
      for (const dim of dims.data) {
        const exists = this.dimensions.find((popDim) => {
          return popDim.name === dim.name;
        });
        if (!exists) {
          dim.dataset = dims.dataset;
          this.dimensions.push(dim);
        }
      }
    },
    getDashboard() {
      this.loadingDashData = true;
      this.visualizations = [];
      fetch("/fhir/Basic/" + this.dashboardId).then((response) => {
        response.json().then((data) => {
          this.loadingDashData = false;
          for (const extension of data.extension) {
            if (
              extension.url ===
              "http://ihris.org/fhir/StructureDefinition/ihris-basic-name"
            ) {
              this.title = extension.valueString;
            }
            if (
              extension.url ===
              "http://ihris.org/fhir/StructureDefinition/ihris-dashboard-visualization"
            ) {
              const id = extension.extension.find((ext) => {
                return ext.url === "vizID";
              }).valueString;
              const x = extension.extension.find((ext) => {
                return ext.url === "horizontal";
              }).valueDecimal;
              const y = extension.extension.find((ext) => {
                return ext.url === "vertical";
              }).valueDecimal;
              const w = extension.extension.find((ext) => {
                return ext.url === "width";
              }).valueDecimal;
              const h = extension.extension.find((ext) => {
                return ext.url === "height";
              }).valueDecimal;
              const hPx = extension.extension.find((ext) => {
                return ext.url === "heightPx";
              }).valueDecimal;
              const i = extension.extension.find((ext) => {
                return ext.url === "itemID";
              }).valueInteger;
              const stat = extension.extension.find((ext) => {
                return ext.url === "static";
              }).valueBoolean;
              this.visualizations.push({
                id,
                x,
                y,
                w,
                h,
                hPx,
                i,
                static: stat,
              });
            }
          }
        });
      });
    },
    resizeEvent: function (i, newH, newW, newHPx, newWPx) {
      const viz = this.visualizations.find((viz) => {
        return viz.i === i;
      });
      viz.hPx = newHPx - 36;
      viz.rerender++;
    },
    resizedEvent(i, newH, newW, newHPx, newWPx) {
      const viz = this.visualizations.find((viz) => {
        return viz.i === i;
      });
      viz.hPx = newHPx - 36;
      viz.rerender++;
    },
    listViz() {
      this.loadingAvailableVizs = true;
      this.displayVizList = true;
      this.availableViz = [];
      this.getViz().then(() => {
        this.loadingAvailableVizs = false;
      });
    },
    getViz(url) {
      return new Promise((resolve, reject) => {
        if (!url) {
          url =
            "/fhir/Basic?_count=200&_profile=http://ihris.org/fhir/StructureDefinition/ihris-data-visualization";
        }
        fetch(url).then((response) => {
          response.json().then((data) => {
            if (data.entry && data.entry.length) {
              for (const entry of data.entry) {
                const name = entry.resource.extension.find((ext) => {
                  return (
                    ext.url ===
                    "http://ihris.org/fhir/StructureDefinition/ihris-basic-name"
                  );
                });
                if (name) {
                  this.availableViz.push({
                    id: entry.resource.id,
                    name: name.valueString,
                  });
                }
              }
            }
            const next = data.link.find((link) => {
              return link.relation === "next";
            });
            if (next) {
              next.url = next.url.substring(next.url.indexOf("/fhir/"));
              this.getViz(next.url)
                .then(() => {
                  return resolve();
                })
                .catch((err) => {
                  return reject(err);
                });
            } else {
              return resolve();
            }
          });
        });
      });
    },
    addVizualization(id) {
      let maxY = 0;
      let maxX = 0;
      for (const viz of this.visualizations) {
        if (viz.y > maxY) {
          maxY = viz.y;
        }
        if (viz.x > maxX) {
          maxX = viz.x;
        }
      }
      if (this.visualizations.length > 0) {
        maxY += 11.2;
      }
      this.visualizations.push({
        id: id,
        x: maxX,
        y: maxY,
        w: 6,
        h: 11.2,
        hPx: 400,
        i: this.visualizations.length,
        static: false,
        rerender: 0,
      });
    },
    save() {
      const dashboard = {
        resourceType: "Basic",
        meta: {
          profile: [
            "http://ihris.org/fhir/StructureDefinition/ihris-dashboard",
          ],
        },
        code: {
          coding: [
            {
              code: "visualization",
              system:
                "http://ihris.org/fhir/CodeSystem/ihris-resource-codesystem",
            },
          ],
        },
        extension: [
          {
            url: "http://ihris.org/fhir/StructureDefinition/ihris-basic-name",
            valueString: this.title,
          },
        ],
      };
      let index = 0;
      for (const viz of this.visualizations) {
        dashboard.extension.push({
          url: "http://ihris.org/fhir/StructureDefinition/ihris-dashboard-visualization",
          extension: [
            {
              url: "vizID",
              valueString: viz.id,
            },
            {
              url: "horizontal",
              valueDecimal: viz.x,
            },
            {
              url: "vertical",
              valueDecimal: viz.y,
            },
            {
              url: "width",
              valueDecimal: viz.w,
            },
            {
              url: "height",
              valueDecimal: viz.h,
            },
            {
              url: "heightPx",
              valueDecimal: viz.hPx,
            },
            {
              url: "itemID",
              valueInteger: index,
            },
            {
              url: "static",
              valueBoolean: viz.static,
            },
          ],
        });
        index++;
      }
      let method = "POST";
      if (this.dashboardId) {
        method = "PUT";
        dashboard.id = this.dashboardId;
      } else {
        this.dashboardId = "";
      }
      fetch("/fhir/Basic/" + this.dashboardId, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dashboard),
      })
        .then((response) => {
          if (response.status !== 200 && response.status !== 201) {
            this.$store.commit("setMessage", {
              type: "error",
              text: "Failed to save Dashboard!",
              timeout: 2000,
            });
            return;
          }
          response.json().then((data) => {
            this.$store.commit("setMessage", {
              type: "primary",
              text: "Dashboard saved successfully!",
              timeout: 4000,
            });
            this.dashboardId = data.id;
          });
        })
        .catch((error) => {
          this.$store.commit("setMessage", {
            type: "error",
            text: "Failed to save Dashboard!",
            timeout: 2000,
          });
          console.error("Error:", error);
        });
    },
    removeViz(i) {
      const index = this.visualizations.findIndex((viz) => {
        return viz.i === i;
      });
      if (index > -1) {
        this.visualizations.splice(index, 1);
      }
    },
    reload() {
      if (this.dashboardId) {
        this.getDashboard();
      } else {
        this.visualizations = [];
      }
    },
  },
  created() {
    if (!this.$route.params.id) {
      this.editingDash = true;
    }
    this.dashboardId = this.$route.params.id;
    if (this.dashboardId) {
      this.getDashboard();
    }
    this.listDashboard();
  },
  components: {
    VisualizationBuilder,
  },
};
</script>
