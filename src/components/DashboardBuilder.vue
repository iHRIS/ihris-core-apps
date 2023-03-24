<template>
  <v-container fluid>
    <v-dialog
      persistent
      transition="dialog-top-transition"
      v-model="showValuesSelector"
      width="560px"
    >
      <v-toolbar color="primary" density="compact" height="40px">
        <v-toolbar-title>
          Values For {{ activeDimension.data.display }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon @click="showValuesSelector = false" style="cursor: pointer"
          >mdi-close</v-icon
        >
      </v-toolbar>
      <v-card class="overflow-auto">
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
              Apply
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
              <v-icon start color="primary">mdi-home</v-icon> Home
            </v-btn>
            &nbsp;
            <v-btn color="tertiary" size="small" @click="reload">
              <v-icon start color="primary">mdi-reload</v-icon> Reload
            </v-btn>
            &nbsp;
            <v-btn
              color="tertiary"
              size="small"
              @click="save"
              :disabled="!canSave"
            >
              <v-icon start color="primary">mdi-content-save-check</v-icon> Save
            </v-btn>
            &nbsp;
            <v-btn color="tertiary" size="small" @click="listViz">
              <v-icon start color="primary">mdi-plus</v-icon> Insert
              Visualization
            </v-btn>
            &nbsp;
            <v-btn
              color="tertiary"
              size="small"
              @click="$router.push({ name: 'vizBuilder' })"
            >
              <v-icon start color="primary">mdi-plus</v-icon> Create
              Visualization
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <v-row>
          <v-col cols="2">
            <v-text-field
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
          <v-col cols="2">
            <v-autocomplete
              size="10"
              width="30"
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
            {{ filter.display }}: {{ value.name }}
          </v-chip>
        </template>
        <template v-if="loadingDashData">
          <v-progress-linear :indeterminate="true"></v-progress-linear>
        </template>
        <template v-else-if="visualizations.length === 0">
          <div style="text-align: center">
            Your dashboard is blank. Click Add Visualization button to add
            dashboard items
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
        filterCondition: "include",
        data: "",
        loading: false,
      },
    };
  },
  watch: {
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
        if (this.activeDimension.selectedValues.length === 0) {
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
            const next = data.link.find((link) => {
              return link.relation === "next";
            });
            if (next) {
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
    applyFilters() {
      this.showValuesSelector = false;
      this.reloadAllViz();
      this.activeDimension.data = {};
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
      this.activeDimension.filterCondition = "include";
      const filter = this.filters.find((filter) => {
        return filter.name === this.activeDimension.data.name;
      });
      if (filter) {
        this.activeDimension.filterCondition = filter.filterCondition;
        this.activeDimension.selectedValues = JSON.parse(
          JSON.stringify(filter.values)
        );
      }
      const url = `/es/populateFilter/${val.dataset.name}/${val.name}?dataType=${val.type}`;
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
      this.getViz().then(() => {
        this.loadingAvailableVizs = false;
      });
    },
    getViz(url) {
      return new Promise((resolve, reject) => {
        this.availableViz = [];
        if (!url) {
          url =
            "/fhir/Basic?_profile=http://ihris.org/fhir/StructureDefinition/ihris-data-visualization";
        }
        fetch(url).then((response) => {
          response.json().then((data) => {
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
            const next = data.link.find((link) => {
              return link.relation === "next";
            });
            if (next) {
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
              valueInteger: viz.i,
            },
            {
              url: "static",
              valueBoolean: viz.static,
            },
          ],
        });
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
