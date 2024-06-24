<template>
  <v-container fluid>
    <v-row v-if="editingViz">
      <v-col cols="auto">
        <v-btn
          color="tertiary"
          size="large"
          @click="$router.push({ name: 'home' })"
        >
          <v-icon start color="primary">mdi-home</v-icon> {{ $t(`App.hardcoded-texts.Home`) }}
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn color="tertiary" size="large" @click="save">
          <v-icon start color="primary">mdi-content-save-check</v-icon> {{ $t(`App.hardcoded-texts.Save`) }}
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn color="tertiary" size="large" @click="confirmDelete = true">
          <v-icon start color="primary">mdi-delete</v-icon>{{ $t(`App.hardcoded-texts.Delete`) }}
        </v-btn>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto">
        <h2 style="text-align: center">{{ $t(`App.hardcoded-texts.Data Vizualizer`) }}</h2>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto">
        <v-btn color="tertiary" size="large" @click="listViz">
          <v-icon start color="primary">mdi-open-in-app</v-icon>{{ $t(`App.hardcoded-texts.Open`) }}
          <v-tooltip activator="parent" location="top">
            {{ $t(`App.hardcoded-texts.Open Another Visualization`) }}
          </v-tooltip>
        </v-btn>
      </v-col>
    </v-row>
    <v-dialog
      persistent
      transition="dialog-top-transition"
      v-model="displayVizList"
      width="960px"
    >
      <v-toolbar color="primary" density="compact" height="40px">
        <v-toolbar-title> {{ $t(`App.hardcoded-texts.Available Vizualizations`) }} </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-icon @click="displayVizList = false" style="cursor: pointer"
          >mdi-close</v-icon
        >
      </v-toolbar>
      <v-progress-linear
        :indeterminate="loadingData"
        :active="loadingData"
        color="secondary"
      ></v-progress-linear>
      <v-card class="overflow-auto">
        <v-card-text>
          <template v-if="visualizations.length > 0">
            <v-list density="compact">
              <v-list-item
                v-for="(value, i) in visualizations"
                :key="i"
                @click="$router.push({ path: '/vizBuilder/' + value.id })"
                active-color="primary"
                rounded="xl"
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
    <v-dialog v-model="confirmDelete" persistent width="600">
      <v-card>
        <v-layout style="height: 50px">
          <v-system-bar color="primary">
            <v-icon @click="confirmDelete = false"> mdi-close </v-icon>
          </v-system-bar>
        </v-layout>
        <v-card-title class="text-h5">
          {{ $t(`App.hardcoded-texts.Delete Vizualization Confirmation`) }}
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="confirmDelete = false">
            {{ $t(`App.hardcoded-texts.No`) }}
          </v-btn>
          <v-btn color="green darken-1" text @click="deleteViz"> {{ $t(`App.hardcoded-texts.Yes`) }} </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      persistent
      transition="dialog-top-transition"
      v-model="showValuesSelector"
      width="960px"
    >
      <v-card>
        <v-toolbar color="primary" density="compact">
          <v-toolbar-title>
            {{ $t(`App.hardcoded-texts.Values For`) }} {{ activeDimension.name }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-icon @click="closeValuesSelector" style="cursor: pointer"
            >mdi-close</v-icon
          >
        </v-toolbar>
        <v-card-actions v-if="activeDimension.index > -1">
          <v-radio-group
            inline
            density="compact"
            v-model="
              this[activeDimension.location][activeDimension.index]
                .defaultFilter
            "
          >
            <v-radio label="Use All" value="all"></v-radio>
            <v-radio label="Use Selected Below" value="selected"></v-radio>
          </v-radio-group>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="closeValuesSelector" size="small"
            > {{ $t(`App.hardcoded-texts.Save`) }}</v-btn
          >
        </v-card-actions>
        <v-card-text
          v-if="
            activeDimension.index > -1 &&
            this[activeDimension.location][activeDimension.index]
              .defaultFilter !== 'all'
          "
        >
          <v-row>
            <v-col cols="6">
              All Values<br /><br />
              <v-card height="499" class="overflow-auto">
                <v-card-text>
                  <v-progress-linear
                    :indeterminate="true"
                    v-if="activeDimension.loading"
                  />
                  <v-list
                    density="compact"
                    v-if="
                      this[activeDimension.location][activeDimension.index]
                        .defaultFilter !== 'all'
                    "
                  >
                    <v-list-item
                      v-for="(value, i) in this[activeDimension.location][
                        activeDimension.index
                      ].allValues"
                      :key="i"
                      :value="value"
                      @click="
                        this[activeDimension.location][
                          activeDimension.index
                        ].highlightedAllValues = i
                      "
                      active-color="primary"
                      rounded="xl"
                    >
                      <template v-slot:prepend>
                        <v-icon icon="mdi-menu-right"></v-icon>
                      </template>
                      <v-list-item-title>
                        <label style="font-size: 13px">
                          {{ value }}
                        </label>
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="1" class="fill-height">
              <br />
              <br />
              <br />
              <v-btn
                :disabled="
                  this[activeDimension.location][activeDimension.index]
                    .highlightedAllValues < 0
                "
                size="x-small"
                icon
                @click="
                  moveDimensionValue('allValues', 'selectedValues', false)
                "
              >
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
              <br />
              <v-btn
                :disabled="
                  this[activeDimension.location][activeDimension.index]
                    .allValues.length === 0
                "
                size="x-small"
                icon
                @click="moveDimensionValue('allValues', 'selectedValues', true)"
              >
                <v-icon>mdi-chevron-double-right</v-icon>
              </v-btn>
              <br />
              <br />
              <br />
              <v-divider height="5"></v-divider>
              <br />
              <br />
              <br />
              <v-btn
                :disabled="
                  this[activeDimension.location][activeDimension.index]
                    .highlightedSelectedValues < 0
                "
                size="x-small"
                text
                icon
                @click="
                  moveDimensionValue('selectedValues', 'allValues', false)
                "
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <br />
              <v-btn
                :disabled="
                  this[activeDimension.location][activeDimension.index]
                    .selectedValues.length === 0
                "
                size="x-small"
                text
                icon
                @click="moveDimensionValue('selectedValues', 'allValues', true)"
              >
                <v-icon>mdi-chevron-double-left</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="5">
              <v-row>
                <v-col cols="auto"> Selected Values - </v-col>
                <v-col cols="auto">
                  <v-radio-group
                    inline
                    density="compact"
                    v-model="
                      this[activeDimension.location][activeDimension.index]
                        .filterCondition
                    "
                  >
                    <v-radio label="Include" value="include"></v-radio>
                    <v-radio label="Exclude" value="exclude"></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
              <v-card height="499" class="overflow-auto">
                <v-card-text>
                  <v-list
                    shaped
                    density="compact"
                    v-if="
                      this[activeDimension.location][activeDimension.index]
                        .defaultFilter !== 'all'
                    "
                  >
                    <v-list-item
                      v-for="(value, i) in this[activeDimension.location][
                        activeDimension.index
                      ].selectedValues"
                      :key="i"
                      :value="value"
                      @click="
                        this[activeDimension.location][
                          activeDimension.index
                        ].highlightedSelectedValues = i
                      "
                      active-color="primary"
                      rounded="xl"
                    >
                      <v-list-item-title>
                        <v-icon>mdi-menu-right</v-icon>
                        <label style="font-size: 13px">
                          {{ value }}
                        </label>
                      </v-list-item-title>
                    </v-list-item>
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
            <input type="button" id="hiddenActivator" />
            <v-card>
              <v-card-text>
                <v-row>
                  <v-autocomplete
                    :items="datasets"
                    label="Datasets"
                    v-model="dataset"
                    item-value="name"
                    item-title="display"
                    return-object
                    @update:modelValue="datasetSelected"
                  ></v-autocomplete>
                </v-row>
                <v-row v-if="dimensions.length > 0"><h3>Dimensions</h3></v-row>
                <v-row v-else-if="dataset.id && dimensions.length == 0"
                  ><h3>{{ $t(`App.hardcoded-texts.No Dimensions Available`) }}</h3></v-row
                >
                <v-row>
                  <ul>
                    <draggable
                      :list="dimensions"
                      @start="dragStart"
                      @end="dragEnd"
                      :move="dragging"
                      :group="{
                        name: 'visualization',
                        pull: 'clone',
                        put: false,
                      }"
                      itemKey="name"
                    >
                      <template #item="{ element, index }">
                        <li
                          width="600"
                          class="dstfields"
                          style="cursor: move; width: 260px; height: 30px"
                          :key="index"
                        >
                          {{ element.display }}
                        </li>
                      </template>
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
                  <v-card-title> {{ $t(`App.hardcoded-texts.Filters`) }} </v-card-title>
                  <v-card-text>
                    <draggable
                      :list="filters"
                      @start="dragStart"
                      @end="dragEnd"
                      :move="dragging"
                      id="filters"
                      group="visualization"
                      itemKey="name"
                    >
                      <template #item="{ element, index }">
                        <v-chip
                          :key="index"
                          color="black"
                          size="small"
                          variant="outlined"
                        >
                          {{ element.display }}
                          <v-menu
                            transition="slide-y-transition"
                            rounded="b-xl"
                            :close-on-content-click="false"
                          >
                            <template v-slot:activator="{ props }">
                              <v-icon
                                v-bind="props"
                                id="filtersActivator"
                                color="black"
                              >
                                mdi-dots-horizontal
                              </v-icon>
                            </template>
                            <v-list rounded>
                              <v-list-item
                                link
                                @click="getDimensionValues('filters', index)"
                              >
                                <template v-slot:prepend>
                                  <v-icon icon="mdi-filter-minus"></v-icon>
                                </template>
                                <v-list-item-title
                                  >Filter Values</v-list-item-title
                                >
                              </v-list-item>
                              <v-list-item
                                link
                                @click="removeDimension('filters', index)"
                              >
                                <template v-slot:prepend>
                                  <v-icon icon="mdi-minus-circle"></v-icon>
                                </template>
                                <v-list-item-title>Remove</v-list-item-title>
                              </v-list-item>
                              <v-list-item
                                link
                                @click="move('filters', 'series', index)"
                                :disabled="series.length >= chart.maxSeries"
                              >
                                <template v-slot:prepend>
                                  <v-icon icon="mdi-cursor-move"></v-icon>
                                </template>
                                <v-list-item-title
                                  >Move to series</v-list-item-title
                                >
                              </v-list-item>
                              <v-list-item
                                link
                                @click="move('filters', 'categories', index)"
                                :disabled="
                                  categories.length >= chart.maxCategories
                                "
                              >
                                <template v-slot:prepend>
                                  <v-icon icon="mdi-cursor-move"></v-icon>
                                </template>
                                <v-list-item-title
                                  >Move to categories</v-list-item-title
                                >
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </v-chip>
                      </template>
                    </draggable>
                  </v-card-text>
                </v-card>
                <v-divider></v-divider>
                <v-card shaped>
                  <v-card-title>
                    {{ $t(`App.hardcoded-texts.Charts`) }}
                    <v-icon @click="showChartsList = true"
                      >mdi-dots-vertical</v-icon
                    >
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="2">
                        <v-icon size="x-large" color="primary">
                          {{ chart.icon }}
                        </v-icon>
                      </v-col>
                      <v-col cols="9">
                        <b>{{ chart.title }}</b>
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
            <h2><v-icon>mdi-cog-outline</v-icon> {{ $t(`App.hardcoded-texts.Settings`) }}</h2>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <ChartSettings
              v-if="chart.type && renderSettings"
              :chartType="chart.type"
              :chartSubType="chart.subType"
              @chartSettings="chartSettings"
              v-model:option="option"
              :key="'chart' + chart.type + chart.subType"
            />
            <GeneralSettings
              v-if="renderSettings"
              :chartType="chart.type"
              :chartSubType="chart.subType"
              @generalSettings="generalSettings"
              :option="option"
              :key="'general' + chart.type + chart.subType"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col :cols="vizWidth">
        <v-row>
          <v-col cols="4" v-if="editingViz && chart.maxCategories > 0">
            <v-card width="200" height="100" rounded>
              <v-card-title style="font-size: 16px"> {{ $t(`App.hardcoded-texts.Categories`) }} </v-card-title>
              <v-card-text>
                <draggable
                  id="categories"
                  :list="categories"
                  @start="dragStart"
                  @end="dragEnd"
                  :move="dragging"
                  group="visualization"
                  itemKey="name"
                >
                  <template #item="{ element, index }">
                    <v-chip
                      :key="index"
                      color="green"
                      size="small"
                      variant="outlined"
                      style="cursor: move"
                    >
                      {{ element.display }}
                      <v-menu
                        transition="slide-y-transition"
                        rounded="b-xl"
                        :close-on-content-click="false"
                      >
                        <template v-slot:activator="{ props }">
                          <v-icon
                            v-bind="props"
                            id="categoriesActivator"
                            color="black"
                          >
                            mdi-dots-horizontal
                          </v-icon>
                        </template>
                        <v-list rounded>
                          <v-list-item
                            link
                            @click="getDimensionValues('categories', index)"
                          >
                            <template v-slot:prepend>
                              <v-icon icon="mdi-filter-minus"></v-icon>
                            </template>
                            <v-list-item-title>Filter Values</v-list-item-title>
                          </v-list-item>
                          <v-list-item
                            link
                            @click="removeDimension('categories', index)"
                          >
                            <template v-slot:prepend>
                              <v-icon icon="mdi-minus-circle"></v-icon>
                            </template>
                            <v-list-item-title>Remove</v-list-item-title>
                          </v-list-item>
                          <v-list-item
                            link
                            @click="move('categories', 'series', index)"
                            :disabled="series.length > 0"
                          >
                            <template v-slot:prepend>
                              <v-icon icon="mdi-cursor-move"></v-icon>
                            </template>
                            <v-list-item-title
                              >Move to series</v-list-item-title
                            >
                          </v-list-item>
                          <v-list-item
                            link
                            @click="move('categories', 'filters', index)"
                          >
                            <template v-slot:prepend>
                              <v-icon icon="mdi-cursor-move"></v-icon>
                            </template>
                            <v-list-item-title
                              >Move to filters</v-list-item-title
                            >
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-chip>
                  </template>
                </draggable>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="3" v-if="editingViz && chart.maxSeries > 0">
            <v-card width="200" height="100">
              <v-card-title style="font-size: 16px">{{ $t(`App.hardcoded-texts.Series`) }}</v-card-title>
              <v-card-text>
                <draggable
                  :list="series"
                  @start="dragStart"
                  @end="dragEnd"
                  :move="dragging"
                  id="series"
                  group="visualization"
                  itemKey="name"
                >
                  <template #item="{ element, index }">
                    <div>
                      <v-chip
                        :key="index"
                        color="blue"
                        dark
                        size="small"
                        variant="outlined"
                        style="cursor: move"
                      >
                        {{ element.aggsBy.display }}({{ element.display }})
                        <v-menu
                          transition="slide-y-transition"
                          rounded="b-xl"
                          :close-on-content-click="false"
                        >
                          <template v-slot:activator="{ props }">
                            <v-icon
                              color="black"
                              v-bind="props"
                              id="seriesActivator"
                              >mdi-dots-horizontal</v-icon
                            >
                          </template>
                          <v-list rounded>
                            <v-list-group
                              value="Aggregations"
                              prepend-icon="mdi-sigma"
                              no-action
                            >
                              <template v-slot:activator="{ props }">
                                <v-list-item
                                  v-bind="props"
                                  title="Aggregations"
                                ></v-list-item>
                              </template>
                              <v-list-item
                                link
                                @click="changeAgg(index, 'value_count')"
                              >
                                <v-list-item-title>Count</v-list-item-title>
                              </v-list-item>
                              <v-list-item link v-if="element.type === 'long'">
                                <v-list-item-title
                                  @click="changeAgg(index, 'sum')"
                                >
                                  Sum
                                </v-list-item-title>
                              </v-list-item>
                              <v-list-item link v-if="element.type === 'long'">
                                <v-list-item-title
                                  @click="changeAgg(index, 'avg')"
                                >
                                  Average
                                </v-list-item-title>
                              </v-list-item>
                            </v-list-group>
                            <v-list-item
                              link
                              @click="getDimensionValues('series', index)"
                            >
                              <template v-slot:prepend>
                                <v-icon icon="mdi-filter-minus"></v-icon>
                              </template>
                              <v-list-item-title
                                >Filter Values</v-list-item-title
                              >
                            </v-list-item>
                            <v-list-item link @click="series.splice(index, 1)">
                              <template v-slot:prepend>
                                <v-icon icon="mdi-minus-circle"></v-icon>
                              </template>
                              <v-list-item-title>Remove</v-list-item-title>
                            </v-list-item>
                            <v-list-item
                              link
                              @click="move('series', 'categories', index)"
                              :disabled="
                                categories.length >= chart.maxCategories
                              "
                            >
                              <template v-slot:prepend>
                                <v-icon icon="mdi-cursor-move"></v-icon>
                              </template>
                              <v-list-item-title
                                >Move to categories</v-list-item-title
                              >
                            </v-list-item>
                            <v-list-item
                              link
                              @click="move('series', 'filters', index)"
                            >
                              <template v-slot:prepend>
                                <v-icon icon="mdi-cursor-move"></v-icon>
                              </template>
                              <v-list-item-title
                                >Move to filters</v-list-item-title
                              >
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </v-chip>
                      <v-chip v-if="dragArea && series.length < chart.maxSeries"
                        >Drop Here</v-chip
                      >
                    </div>
                  </template>
                </draggable>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="2">
            <v-btn
              color="success"
              @click="loadChartData"
              size="small"
              :disabled="!canDisplayChart"
              v-if="editingViz"
            >
              <v-icon start>mdi-sitemap</v-icon>
              {{ $t(`App.hardcoded-texts.Visualize`) }}
            </v-btn>
          </v-col>
        </v-row>
        <v-row v-if="editingViz"> </v-row>
        <v-row>
          <v-col cols="12">
            <template
              v-if="chart && chart.renderComponent === 'IhrisTabularChart'"
            >
              {{ option.title.text }}
              <v-card v-if="displayChart && editingViz">
                <v-card-text>
                  <v-data-table
                    :height="vizHeight + 'px'"
                    :key="softRerenderViz"
                    :items="option.rows"
                  />
                </v-card-text>
              </v-card>
              <v-data-table
                v-else-if="displayChart"
                :height="vizHeight + 'px'"
                :key="softRerenderViz"
                :items="option.rows"
              />
            </template>
            <template v-else>
              <v-card v-if="displayChart && editingViz">
                <v-card-text>
                  <v-chart
                    :style="{ height: vizHeight + 'px' }"
                    :key="softRerenderViz"
                    :option="option"
                  />
                </v-card-text>
              </v-card>
              <v-chart
                v-else-if="displayChart"
                :style="{ height: vizHeight + 'px' }"
                :key="softRerenderViz"
                :option="option"
              />
            </template>
            <v-progress-linear
              color="red lighten-2"
              buffer-value="0"
              stream
              height="20"
              v-if="loadingData"
              >Loading Data</v-progress-linear
            >
          </v-col>
          <v-col
            cols="12"
            v-if="
              renderSettings &&
              (chart.renderComponent === 'IhrisAxisChart' ||
                chart.renderComponent === 'IhrisTabularChart')
            "
          >
            <h3>{{ $t(`App.hardcoded-texts.Basic Settings`) }}</h3>
            <v-row>
              <v-col cols="6">
                <v-switch
                  color="blue"
                  label="Show top values only"
                  v-model="otherOptions.horizontalValues.displayTopValues"
                >
                  <v-tooltip activator="parent" location="bottom"
                    >Only display top values and group the rest into
                    others</v-tooltip
                  >
                </v-switch>
              </v-col>
              <v-col
                cols="6"
                v-if="otherOptions.horizontalValues.displayTopValues"
              >
                <v-text-field
                  v-model="otherOptions.horizontalValues.totalValues"
                  type="number"
                  label="Total Top Values"
                  min="0"
                >
                  <v-tooltip activator="parent" location="bottom"
                    >Whether to move text slightly vertically</v-tooltip
                  >
                </v-text-field>
              </v-col>
              <v-col cols="6">
                {{ $t(`App.hardcoded-texts.Bars Direction`) }}
                <v-radio-group
                  @change="loadChartData"
                  inline
                  v-model="otherOptions.barsDirection"
                  color="blue"
                >
                  <v-radio label="Vertical" value="vertical"></v-radio>
                  <v-radio label="Horizontal" value="horizontal"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <ChartsList
      :activeChart="chart"
      :showChartsList="showChartsList"
      @close="hideChartsList"
      @chartSelected="chartSelected"
    />
  </v-container>
</template>
<script>
import { Base64 } from "js-base64";
import {
  ref,
  computed,
  watch,
  onMounted,
  nextTick,
  getCurrentInstance,
} from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import draggable from "vuedraggable";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import {
  PieChart,
  BarChart,
  LineChart,
  ScatterChart,
  RadarChart,
  GaugeChart,
} from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  GraphicComponent,
  ToolboxComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import MetricChart from "./charts/IhrisMetricChart.js";
import IhrisAxisChart from "./charts/IhrisAxisChart.js";
import IhrisPieChart from "./charts/IhrisPieChart.js";
import IhrisTabularChart from "./charts/IhrisTabularChart.js";
import ChartsList from "./ChartsList.vue";
import ChartSettings from "./settings/ChartSettings.vue";
import GeneralSettings from "./settings/GeneralSettings.vue";

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
  GridComponent,
  GraphicComponent,
  ToolboxComponent,
]);

export default {
  props: {
    externalFilters: {
      type: Array,
      default: function () {
        return [];
      },
    },
    editingViz: {
      type: Boolean,
      default: true,
    },
    softRerenderViz: {
      type: Number,
    },
    hardRerenderViz: {
      type: Number,
    },
    vizHeight: {
      type: Number,
      default: 400,
    },
    id: {
      type: String,
    },
  },
  setup(props, context) {
    const route = useRoute();
    const store = useStore();
    const internalInstance = getCurrentInstance();

    const visualizations = ref([]);
    const displayVizList = ref(false);
    const renderSettings = ref(false);
    const vizId = ref("");
    const confirmDelete = ref(false);
    const loadingData = ref(false);
    const displayChart = ref(false);
    const datasets = ref([]);
    const dataset = ref("");
    const dimensions = ref([]);
    const categories = ref([]);
    const series = ref([]);
    const filters = ref([]);
    const aggregations = ref([
      {
        name: "value_count",
        display: "CNT",
      },
      {
        name: "sum",
        display: "SUM",
      },
      {
        name: "avg",
        display: "AVG",
      },
    ]);
    const activeDimension = ref({
      location: "",
      index: -1,
      name: "",
      loading: false,
    });
    const showChartsList = ref(false);
    const showValuesSelector = ref(false);
    const chart = ref({});
    const option = ref({});
    const otherOptions = ref({
      horizontalValues: {
        displayTopValues: true,
        totalValues: 20,
      },
      barsDirection: "vertical",
    });
    const chartOptions = ref([]);
    const dragArea = ref(false);
    let addFilters = ref(function () {});
    let getChartData = ref(function () {});
    const vizTitle = computed(() => {
      if (option.value.title) {
        return option.value.title.text;
      } else if (chart.value.type === "metric") {
        return option.value.graphic.elements[1].style.text;
      }
      return "";
    });
    const vizWidth = computed(() => {
      if (props.editingViz) {
        return 8;
      }
      return 12;
    });
    const canDisplayChart = computed(() => {
      if (
        chart.value.type &&
        categories.value.length >= chart.value.minCategories &&
        series.value.length >= chart.value.minSeries
      ) {
        return true;
      }
      return false;
    });

    watch(
      filters,
      () => {
        const filter = buildFilters();
        addFilters.value(filter);
      },
      { deep: true }
    );
    watch(series, () => {
      activeDimension.value = {
        location: "",
        index: -1,
        name: "",
      };
    });
    watch(categories, () => {
      activeDimension.value = {
        location: "",
        index: -1,
        name: "",
      };
    });
    watch(
      () => props.hardRerenderViz,
      () => {
        loadChartData();
      }
    );

    function reloadIhrisChart() {
      if (chart.value.renderComponent === "IhrisAxisChart") {
        const IhrisChart = IhrisAxisChart(
          series,
          categories,
          chart,
          option,
          chartOptions,
          dataset,
          otherOptions,
          store.state.fhirFlattener
        );
        addFilters.value = IhrisChart.addFilters;
        getChartData.value = IhrisChart.getChartData;
      } else if (chart.value.renderComponent === "IhrisPieChart") {
        const IhrisChart = IhrisPieChart(
          series,
          categories,
          chart,
          option,
          chartOptions,
          dataset,
          store.state.fhirFlattener
        );
        addFilters.value = IhrisChart.addFilters;
        getChartData.value = IhrisChart.getChartData;
      } else if (chart.value.renderComponent === "IhrisTabularChart") {
        const IhrisChart = IhrisTabularChart(
          series,
          categories,
          chart,
          option,
          chartOptions,
          dataset,
          otherOptions,
          store.state.fhirFlattener
        );
        addFilters.value = IhrisChart.addFilters;
        getChartData.value = IhrisChart.getChartData;
      } else if (chart.value.renderComponent === "MetricChart") {
        const IhrisChart = MetricChart(series, option, dataset);
        addFilters.value = IhrisChart.addFilters;
        getChartData.value = IhrisChart.getChartData;
      }
    }
    function buildFilters() {
      const filter = {
        bool: {
          must: [],
          must_not: [],
        },
      };
      for (const category of categories.value) {
        let field = category.name;
        if (category.hasKeyword) {
          field += ".keyword";
        }
        if (category.defaultFilter !== "selected") {
          continue;
        }
        if (Array.isArray(category.selectedValues)) {
          const terms = {
            terms: {},
          };
          terms.terms[field] = [];
          for (const value of category.selectedValues) {
            terms.terms[field].push(value);
          }
          if (category.filterCondition === "exclude") {
            filter.bool.must_not.push(terms);
          } else {
            filter.bool.must.push(terms);
          }
        }
      }
      for (const srs of series.value) {
        let field = srs.name;
        if (srs.hasKeyword) {
          field += ".keyword";
        }
        if (srs.defaultFilter !== "selected") {
          continue;
        }
        if (Array.isArray(srs.selectedValues)) {
          const terms = {
            terms: {},
          };
          terms.terms[field] = [];
          for (const value of srs.selectedValues) {
            terms.terms[field].push(value);
          }
          if (srs.filterCondition === "exclude") {
            filter.bool.must_not.push(terms);
          } else {
            filter.bool.must.push(terms);
          }
        }
      }
      for (const flt of filters.value) {
        let field = flt.name;
        if (flt.hasKeyword) {
          field += ".keyword";
        }
        if (flt.defaultFilter !== "selected") {
          continue;
        }
        if (Array.isArray(flt.selectedValues)) {
          const terms = {
            terms: {},
          };
          terms.terms[field] = [];
          for (const value of flt.selectedValues) {
            terms.terms[field].push(value);
          }
          if (flt.filterCondition === "exclude") {
            filter.bool.must_not.push(terms);
          } else {
            filter.bool.must.push(terms);
          }
        }
      }
      for (const extFilter of props.externalFilters) {
        let field = extFilter.name;
        if (extFilter.hasKeyword) {
          field += ".keyword";
        }
        if (
          (extFilter.type === "date" || extFilter.type === "long") &&
          extFilter.filterCondition !== "="
        ) {
          if (!filter.bool.filter) {
            filter.bool.filter = [];
          }
          let range = {};
          range[field] = {};
          if (extFilter.filterCondition === "range") {
            let dateRanges = extFilter.values[0].split(" to ");
            let from = dateRanges[0];
            let to = dateRanges[1];
            if (extFilter.type === "date") {
              from = internalInstance.appContext.config.globalProperties
                .$moment(from, "DD-MM-YYYY")
                .format("YYYY-MM-DD");
              to = internalInstance.appContext.config.globalProperties
                .$moment(to, "DD-MM-YYYY")
                .format("YYYY-MM-DD");
            }
            range[field] = {
              gte: from,
              lte: to,
            };
          } else {
            range[field][extFilter.filterCondition] = extFilter.values[0];
          }
          filter.bool.filter.push({
            range,
          });
        } else if (Array.isArray(extFilter.values)) {
          const terms = {
            terms: {},
          };
          terms.terms[field] = [];
          for (let value of extFilter.values) {
            if (
              extFilter.type === "date" &&
              extFilter.filterCondition === "="
            ) {
              value = internalInstance.appContext.config.globalProperties
                .$moment(value, "DD-MM-YYYY")
                .format("YYYY-MM-DD");
            }
            terms.terms[field].push(value);
          }
          if (extFilter.filterCondition === "exclude") {
            filter.bool.must_not.push(terms);
          } else {
            filter.bool.must.push(terms);
          }
        }
      }
      return filter;
    }

    function loadChartData() {
      const filter = buildFilters();
      addFilters.value(filter);
      loadingData.value = true;
      displayChart.value = false;
      getChartData.value().then(() => {
        loadingData.value = false;
        displayChart.value = true;
      });
    }

    function closeValuesSelector() {
      showValuesSelector.value = false;
      setTimeout(() => {
        activeDimension.value = {
          location: "",
          index: -1,
          name: "",
          loading: false,
        };
      }, 1000);
    }

    function changeAgg(position, agg) {
      const aggregation = aggregations.value.find((aggregation) => {
        return aggregation.name === agg;
      });
      if (aggregation) {
        series.value[position].aggsBy = aggregation;
      }
      document.getElementById("seriesActivator").click();
    }

    function dragStart() {
      dragArea.value = true;
      if (categories.value.length < chart.value.maxCategories) {
        categories.value.push({
          name: "drophere",
          display: "Drop Here",
        });
      }
      if (series.value.length < chart.value.maxSeries) {
        series.value.push({
          name: "drophere",
          display: "",
          aggsBy: {
            display: "Drop Here",
          },
        });
      }
      filters.value.push({
        name: "drophere",
        display: "Drop Here",
      });
    }

    function setDefaultAgg(component) {
      if (!component.aggsBy) {
        if (component.type === "long") {
          const agg = aggregations.value.find((agg) => {
            return agg.name === "sum";
          });
          component.aggsBy = agg;
        } else {
          const agg = aggregations.value.find((agg) => {
            return agg.name === "value_count";
          });
          if (agg) {
            component.aggsBy = agg;
          }
        }
      }
    }

    function dragging(evt) {
      if (
        evt.to.id === "categories" &&
        categories.value.length >= chart.value.maxCategories + 1
      ) {
        return false;
      }
      if (evt.to.id === "series") {
        if (series.value.length >= chart.value.maxSeries + 1) {
          return false;
        }
        setDefaultAgg(evt.draggedContext.element);
      }
    }

    function datasetSelected() {
      return new Promise((resolve, reject) => {
        activeDimension.value = {
          location: "",
          index: -1,
          name: "",
        };
        categories.value = [];
        series.value = [];
        filters.value = [];
        let url =
          "/es/listFields/" + dataset.value.name + "?id=" + dataset.value.id;
        if (store.state.fhirFlattener === "fhir2sql") {
          url =
            "/fhir2sql/listFields/" +
            dataset.value.name +
            "?id=" +
            dataset.value.id;
        }
        fetch(url)
          .then((response) => {
            response.json().then((fields) => {
              dimensions.value = fields;
              dimensions.value.dataset = dataset.value.name;
              context.emit("dimensions", {
                dataset: {
                  name: dataset.value.name,
                  display: dataset.value.display,
                },
                data: dimensions.value,
              });
              return resolve();
            });
          })
          .catch((err) => {
            console.log(err);
            return reject(err);
          });
      });
    }

    function hideChartsList() {
      showChartsList.value = false;
    }

    function chartSelected(value) {
      option.value = {};
      chart.value = value;
      reloadIhrisChart();
    }

    function generalSettings(setting) {
      option.value = setting;
    }

    function chartSettings(setting) {
      let updated = false;
      for (const index in chartOptions.value) {
        if (chartOptions.value[index].type === setting.type) {
          chartOptions.value[index] = setting;
          updated = true;
        }
      }
      if (!updated) {
        chartOptions.value.push(setting);
      }

      // update series
      if (option.value.series && option.value.series.length > 0) {
        for (const series of option.value.series) {
          if (series.type === setting.type) {
            for (const stng in setting) {
              series[stng] = setting[stng];
            }
          }
        }
      }
      if (displayChart.value) {
        loadChartData();
      }
    }

    function save() {
      // deep copy
      const options = JSON.parse(JSON.stringify(option.value));
      const otherOpts = JSON.parse(JSON.stringify(otherOptions.value));
      if (options.series) {
        for (const opt of options.series) {
          delete opt.data;
        }
      }
      const visualization = {
        resourceType: "Basic",
        meta: {
          profile: [
            "http://ihris.org/fhir/StructureDefinition/ihris-data-visualization",
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
            valueString: vizTitle.value,
          },
          {
            url: "http://ihris.org/fhir/StructureDefinition/ihris-visualization-chart",
            extension: [
              {
                url: "type",
                valueString: chart.value.type,
              },
              {
                url: "subtype",
                valueString: chart.value.subType,
              },
            ],
          },
          {
            url: "http://ihris.org/fhir/StructureDefinition/ihris-visualization-dataset",
            extension: [
              {
                url: "name",
                valueString: dataset.value.name,
              },
              {
                url: "id",
                valueString: dataset.value.id,
              },
            ],
          },
          {
            url: "http://ihris.org/fhir/StructureDefinition/ihris-visualization-settings",
            valueBase64Binary: Base64.encode(JSON.stringify(options)),
          },
          {
            url: "http://ihris.org/fhir/StructureDefinition/ihris-visualization-other-settings",
            valueBase64Binary: Base64.encode(JSON.stringify(otherOpts)),
          },
          {
            url: "http://ihris.org/fhir/StructureDefinition/ihris-visualization-permissions",
            extension: [
              {
                url: "shared",
                valueBoolean: true,
              },
            ],
          },
        ],
      };
      for (const cat of categories.value) {
        const cats = [
          {
            url: "name",
            valueString: cat.name,
          },
        ];
        if (cat.defaultFilter) {
          cats.push({
            url: "defaultFilter",
            valueString: cat.defaultFilter,
          });
        }
        if (cat.filterCondition) {
          cats.push({
            url: "filterCondition",
            valueString: cat.filterCondition,
          });
        }
        if (cat.selectedValues) {
          cats.push({
            url: "selectedValues",
            valueString: Base64.encode(JSON.stringify(cat.selectedValues)),
          });
        }
        visualization.extension.push({
          url: "http://ihris.org/fhir/StructureDefinition/ihris-visualization-categories",
          extension: cats,
        });
      }
      for (const ser of series.value) {
        const sers = [
          {
            url: "name",
            valueString: ser.name,
          },
          {
            url: "aggsBy",
            valueString: ser.aggsBy.name,
          },
        ];
        if (ser.defaultFilter) {
          sers.push({
            url: "defaultFilter",
            valueString: ser.defaultFilter,
          });
        }
        if (ser.filterCondition) {
          sers.push({
            url: "filterCondition",
            valueString: ser.filterCondition,
          });
        }
        if (ser.selectedValues) {
          sers.push({
            url: "selectedValues",
            valueString: Base64.encode(JSON.stringify(ser.selectedValues)),
          });
        }
        visualization.extension.push({
          url: "http://ihris.org/fhir/StructureDefinition/ihris-visualization-series",
          extension: sers,
        });
      }
      for (const fil of filters.value) {
        const fils = [
          {
            url: "name",
            valueString: fil.name,
          },
        ];
        if (fil.defaultFilter) {
          fils.push({
            url: "defaultFilter",
            valueString: fil.defaultFilter,
          });
        }
        if (fil.filterCondition) {
          fils.push({
            url: "filterCondition",
            valueString: fil.filterCondition,
          });
        }
        if (fil.selectedValues) {
          fils.push({
            url: "selectedValues",
            valueString: Base64.encode(JSON.stringify(fil.selectedValues)),
          });
        }
        visualization.extension.push({
          url: "http://ihris.org/fhir/StructureDefinition/ihris-visualization-filters",
          extension: fils,
        });
      }
      let method = "POST";
      if (vizId.value) {
        method = "PUT";
        visualization.id = vizId.value;
      }
      fetch("/fhir/Basic/" + vizId.value, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(visualization),
      })
        .then((response) => {
          if (response.status !== 200 && response.status !== 201) {
            store.commit("setMessage", {
              type: "error",
              text: "Failed to save Visualization!",
              timeout: 2000,
            });
            return;
          }
          response.json().then((data) => {
            store.commit("setMessage", {
              type: "primary",
              text: "Visualization saved successfully!",
              timeout: 2000,
            });
            vizId.value = data.id;
          });
        })
        .catch((error) => {
          store.commit("setMessage", {
            type: "error",
            text: "Failed to save Visualization!",
            timeout: 2000,
          });
          console.error("Error:", error);
        });
    }

    function deleteViz() {
      fetch("/fhir/Basic/" + vizId.value, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    function getVizById() {
      fetch("/fhir/Basic/" + vizId.value).then((response) => {
        response.json().then(async (data) => {
          const datasetExt = data.extension.find((ext) => {
            return (
              ext.url ===
              "http://ihris.org/fhir/StructureDefinition/ihris-visualization-dataset"
            );
          });
          const datasetName = datasetExt.extension.find((ext) => {
            return ext.url === "name";
          }).valueString;
          const datasetId = datasetExt.extension.find((ext) => {
            return ext.url === "id";
          }).valueString;
          const datasetDisplay = datasets.value.find((dtst) => {
            return dtst.id === datasetId;
          }).display;
          dataset.value = {
            id: datasetId,
            name: datasetName,
            display: datasetDisplay,
          };
          await datasetSelected();
          const chartExt = data.extension.find((ext) => {
            return (
              ext.url ===
              "http://ihris.org/fhir/StructureDefinition/ihris-visualization-chart"
            );
          });
          const type = chartExt.extension.find((ext) => {
            return ext.url === "type";
          }).valueString;
          let subtype = chartExt.extension.find((ext) => {
            return ext.url === "subtype";
          }).valueString;
          if (!subtype) {
            subtype = "";
          }
          chart.value = store.state.charts.find((ct) => {
            return ct.type === type && ct.subType === subtype;
          });
          // reloadIhrisChart();

          for (const vizData of data.extension) {
            if (
              vizData.url ===
              "http://ihris.org/fhir/StructureDefinition/ihris-visualization-categories"
            ) {
              const name = vizData.extension.find((ext) => {
                return ext.url === "name";
              });
              const catDim = dimensions.value.find((dim) => {
                return dim.name === name.valueString;
              });
              if (catDim) {
                let selectedValues = vizData.extension.find((ext) => {
                  return ext.url === "selectedValues";
                });
                if (selectedValues) {
                  try {
                    selectedValues = JSON.parse(
                      Base64.decode(selectedValues.valueString)
                    );
                  } catch (error) {
                    console.log(error);
                  }
                  catDim.selectedValues = selectedValues;
                }
                const defaultFilter = vizData.extension.find((ext) => {
                  return ext.url === "defaultFilter";
                });
                if (defaultFilter) {
                  catDim.defaultFilter = defaultFilter.valueString;
                }
                const filterCondition = vizData.extension.find((ext) => {
                  return ext.url === "filterCondition";
                });
                if (filterCondition) {
                  catDim.filterCondition = filterCondition.valueString;
                }
                categories.value.push(catDim);
              }
            }
            if (
              vizData.url ===
              "http://ihris.org/fhir/StructureDefinition/ihris-visualization-series"
            ) {
              const name = vizData.extension.find((ext) => {
                return ext.url === "name";
              });
              const serDim = dimensions.value.find((dim) => {
                return dim.name === name.valueString;
              });
              const aggsBy = vizData.extension.find((ext) => {
                return ext.url === "aggsBy";
              });
              if (aggsBy) {
                const agg = aggregations.value.find((agg) => {
                  return agg.name === aggsBy.valueString;
                });
                if (agg) {
                  serDim.aggsBy = agg;
                }
              }
              if (serDim) {
                let selectedValues = vizData.extension.find((ext) => {
                  return ext.url === "selectedValues";
                });
                if (selectedValues) {
                  try {
                    selectedValues = JSON.parse(
                      Base64.decode(selectedValues.valueString)
                    );
                  } catch (error) {
                    console.log(error);
                  }
                  serDim.selectedValues = selectedValues;
                }
                const defaultFilter = vizData.extension.find((ext) => {
                  return ext.url === "defaultFilter";
                });
                if (defaultFilter) {
                  serDim.defaultFilter = defaultFilter.valueString;
                }
                const filterCondition = vizData.extension.find((ext) => {
                  return ext.url === "filterCondition";
                });
                if (filterCondition) {
                  serDim.filterCondition = filterCondition.valueString;
                }
                series.value.push(serDim);
              }
            }

            if (
              vizData.url ===
              "http://ihris.org/fhir/StructureDefinition/ihris-visualization-filters"
            ) {
              const name = vizData.extension.find((ext) => {
                return ext.url === "name";
              });
              const filDim = dimensions.value.find((dim) => {
                return dim.name === name.valueString;
              });
              if (filDim) {
                let selectedValues = vizData.extension.find((ext) => {
                  return ext.url === "selectedValues";
                });
                if (selectedValues) {
                  try {
                    selectedValues = JSON.parse(
                      Base64.decode(selectedValues.valueString)
                    );
                  } catch (error) {
                    console.log(error);
                  }
                  filDim.selectedValues = selectedValues;
                }
                const defaultFilter = vizData.extension.find((ext) => {
                  return ext.url === "defaultFilter";
                });
                if (defaultFilter) {
                  filDim.defaultFilter = defaultFilter.valueString;
                }
                const filterCondition = vizData.extension.find((ext) => {
                  return ext.url === "filterCondition";
                });
                if (filterCondition) {
                  filDim.filterCondition = filterCondition.valueString;
                }
                filters.value.push(filDim);
              }
            }
            if (
              vizData.url ===
              "http://ihris.org/fhir/StructureDefinition/ihris-visualization-settings"
            ) {
              let settings = vizData.valueBase64Binary;
              try {
                settings = JSON.parse(Base64.decode(settings));
                option.value = settings;
                if (option.value.series) {
                  for (const chartOpt of option.value.series) {
                    const exist = chartOptions.value.find((opt) => {
                      return opt.type === chartOpt.type;
                    });
                    if (!exist) {
                      delete chartOpt.name;
                      chartOptions.value.push(chartOpt);
                    }
                  }
                }
              } catch (error) {
                console.log(error);
              }
            }

            if (
              vizData.url ===
              "http://ihris.org/fhir/StructureDefinition/ihris-visualization-other-settings"
            ) {
              let othersettings = vizData.valueBase64Binary;
              try {
                othersettings = JSON.parse(Base64.decode(othersettings));
                otherOptions.value = othersettings;
              } catch (error) {
                console.log(error);
              }
            }
          }
          await nextTick();
          renderSettings.value = true;
          reloadIhrisChart();
          loadChartData();
        });
      });
    }

    function getVizByUrl(url) {
      return new Promise((resolve, reject) => {
        if (!url) {
          url =
            "/fhir/Basic?_count=200&_profile=http://ihris.org/fhir/StructureDefinition/ihris-data-visualization";
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
                visualizations.value.push({
                  id: entry.resource.id,
                  name: name.valueString,
                });
              }
            }
            const next = data.link.find((link) => {
              return link.relation === "next";
            });
            if (next) {
              next.url = next.url.substring(next.url.indexOf("/fhir/"));
              getVizByUrl(next.url)
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
    }

    function listViz() {
      loadingData.value = true;
      displayVizList.value = true;
      visualizations.value = [];
      getVizByUrl().then(() => {
        loadingData.value = false;
      });
    }

    onMounted(() => {
      if (datasets.value.length > 0) {
        dataset.value = datasets.value[0];
      }
      if (props.id) {
        vizId.value = props.id;
      } else if (route.params.id) {
        vizId.value = route.params.id;
      } else {
        chart.value = store.state.charts.find((chart) => {
          return chart.type === "bar";
        });
        reloadIhrisChart();
      }
      let url = "/es/indices";
      if (store.state.fhirFlattener === "fhir2sql") {
        url = "/fhir2sql/reports-list";
      }
      fetch(url)
        .then((response) => {
          response.json().then((indices) => {
            datasets.value = indices;
            if (vizId.value) {
              getVizById();
            } else {
              vizId.value = "";
              renderSettings.value = true;
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });

    return {
      visualizations,
      displayVizList,
      renderSettings,
      vizId,
      confirmDelete,
      loadingData,
      displayChart,
      datasets,
      dataset,
      dimensions,
      categories,
      series,
      filters,
      activeDimension,
      showChartsList,
      showValuesSelector,
      chart,
      option,
      otherOptions,
      chartOptions,
      dragArea,
      vizWidth,
      canDisplayChart,
      addFilters,
      setDefaultAgg,
      loadChartData,
      closeValuesSelector,
      changeAgg,
      dragStart,
      dragging,
      datasetSelected,
      hideChartsList,
      chartSelected,
      generalSettings,
      chartSettings,
      save,
      deleteViz,
      getVizById,
      listViz,
    };
  },
  methods: {
    getDimensionValues(type, indexInType) {
      if (type !== "categories" && type !== "series" && type !== "filters") {
        return false;
      }
      this.showValuesSelector = true;
      this.activeDimension.location = type;
      this.activeDimension.loading = true;
      this.activeDimension.name = this[type][indexInType].display;
      this.activeDimension.index = indexInType;
      const dimension = this[type][indexInType].name;
      let url = `/es/populateFilter/${this.dataset.name}/${dimension}?dataType=${this[type][indexInType].type}&hasKeyword=${this[type][indexInType].hasKeyword}`;
      if (this.$store.state.fhirFlattener === "fhir2sql") {
        url = `/fhir2sql/populateFilter/${this.dataset.name}/${dimension}?dataType=${this[type][indexInType].type}`;
      }
      this[type][indexInType].allValues = [];
      if (!this[type][indexInType].selectedValues) {
        this[type][indexInType].selectedValues = [];
        this[type][indexInType].highlightedAllValues = -1;
        this[type][indexInType].defaultFilter = -1;
        this[type][indexInType].filterCondition = -1;
        this[type][indexInType].highlightedSelectedValues = -1;
      }
      fetch(url, {
        method: "GET",
      }).then((response) => {
        response.json().then((data) => {
          for (const bucket of data) {
            let value;
            if (this.$store.state.fhirFlattener === "fhir2sql") {
              let key = Object.keys(bucket)[0];
              value = bucket[key];
            } else {
              value = bucket.key.value;
            }
            if (this[type][indexInType].selectedValues.indexOf(value) === -1) {
              this[type][indexInType].allValues.push(value);
            }
          }
          this.activeDimension.loading = false;
        });
      });
    },
    moveDimensionValue(from, to, moveAll) {
      this[this.activeDimension.location][
        this.activeDimension.index
      ].defaultFilter = "selected";
      if (moveAll) {
        this[this.activeDimension.location][this.activeDimension.index][to] = [
          ...this[this.activeDimension.location][this.activeDimension.index][
            to
          ],
          ...this[this.activeDimension.location][this.activeDimension.index][
            from
          ],
        ];
        this[this.activeDimension.location][this.activeDimension.index][
          to
        ].sort();
        this[this.activeDimension.location][this.activeDimension.index][from] =
          [];
      } else {
        let position = -1;
        if (from === "allValues") {
          position =
            this[this.activeDimension.location][this.activeDimension.index]
              .highlightedAllValues;
        } else if (from === "selectedValues") {
          position =
            this[this.activeDimension.location][this.activeDimension.index]
              .highlightedSelectedValues;
        }
        this[this.activeDimension.location][this.activeDimension.index][
          to
        ].push(
          this[this.activeDimension.location][this.activeDimension.index][from][
            position
          ]
        );
        this[this.activeDimension.location][this.activeDimension.index][
          to
        ].sort();
        this[this.activeDimension.location][this.activeDimension.index][
          from
        ].splice(position, 1);
      }
      this[this.activeDimension.location][
        this.activeDimension.index
      ].highlightedAllValues = -1;
      this[this.activeDimension.location][
        this.activeDimension.index
      ].highlightedSelectedValues = -1;
    },
    closeDimValuesSelector() {
      this.showValuesSelector = false;
      this[this.activeDimension.location][
        this.activeDimension.index
      ].highlightedAllValues = -1;
      this[this.activeDimension.location][
        this.activeDimension.index
      ].highlightedSelectedValues = -1;
    },
    removeDimension(from, position) {
      this[from].splice(position, 1);
      document.getElementById("hiddenActivator").click();
    },
    move(from, to, position) {
      if (to === "series") {
        this.setDefaultAgg(this[from][position]);
      }
      this[to].push(this[from][position]);
      this[from].splice(position, 1);
    },
    dragEnd(evt) {
      this.dragArea = false;
      let index = this.categories.findIndex((drp) => {
        return drp.name === "drophere";
      });
      if (index > -1) {
        this.categories.splice(index, 1);
      }

      index = this.series.findIndex((drp) => {
        return drp.name === "drophere";
      });
      if (index > -1) {
        this.series.splice(index, 1);
      }

      index = this.filters.findIndex((drp) => {
        return drp.name === "drophere";
      });
      if (index > -1) {
        this.filters.splice(index, 1);
      }
      if (evt.to.id !== evt.from.id) {
        let position = evt.newIndex;
        // if a dimension is dragged at the end of the dragArea chip, then the newIndex will be higher by 1 as the dragArea chip is not pushed into series or categories array
        if (this[evt.to.id].length === position) {
          position -= 1;
        }
        this.getDimensionValues(evt.to.id, position);
      }
    },
  },
  components: {
    draggable,
    ChartsList,
    VChart,
    GeneralSettings,
    ChartSettings,
  },
};
</script>
<style scoped>
.dstfields:hover {
  background-color: antiquewhite;
}
.chart {
  height: 400px;
}
</style>
