<template>
  <v-dialog
    persistent
    transition="dialog-top-transition"
    v-model="show"
    width="800px"
  >
    <v-card>
      <v-system-bar window color="primary" dark>
        Select Chart Type
        <v-spacer></v-spacer>
        <v-icon @click.native="close" style="cursor: pointer">mdi-close</v-icon>
      </v-system-bar>
      <v-card-text>
        <v-row>
          <v-col cols="4" v-for="(chart, index) in $store.state.charts" :key="index">
            <v-list class="chart">
                <v-list-item>
                  <v-list-item-content>
                    <v-row @click="selected(index)" :class="{activeChart: chart.type === activeChart.type && chart.subType === activeChart.subType}">
                      <v-col cols="2">
                        <v-icon x-large color="purple">
                          {{chart.icon}}
                        </v-icon>
                      </v-col>
                      <v-spacer></v-spacer>
                      <v-col cols="9">
                        <div>
                          <b>{{chart.title}}</b>
                        </div>
                        <div style="font-size: 12px">
                          {{chart.description}}
                        </div>
                      </v-col>
                    </v-row>
                  </v-list-item-content>
                </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="success"
          @click='close'
          small
        >close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: ['showChartsList', 'activeChart'],
  computed: {
    show () {
      return this.showChartsList
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    selected (index) {
      this.$emit('chartSelected', this.$store.state.charts[index])
      this.$emit('close')
    }
  }
}
</script>
<style>
  .activeChart {
    background-color: aqua;
    font-size: x-large;
    border: 3px solid black;
  }
  .chart :hover {
    cursor: pointer;
    background-color: aliceblue;
  }
</style>
