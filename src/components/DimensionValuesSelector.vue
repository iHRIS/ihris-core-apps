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
          <v-col cols="5">

          </v-col>
          <v-col cols="2">

          </v-col>
          <v-col cols="5">

          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="success"
          @click='close'
          small
        >Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: ['showValuesSelector', 'activeChart', 'allValues', 'selectedValues'],
  data () {
    return {
    }
  },
  computed: {
    show () {
      return this.showValuesSelector
    }
  },
  methods: {
    close () {
      this.$emit('closeDimValuesSelector')
    },
    selected (index) {
      this.$emit('chartSelected', this.charts[index])
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
