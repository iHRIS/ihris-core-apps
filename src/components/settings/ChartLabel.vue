<template>
  <v-row>
    <v-col cols="12">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-switch
            v-bind="attrs"
            v-on="on"
            label="Show/Hide"
            v-model="label.show"
            @change="updated"
          />
        </template>
        <span>Whether to show labels</span>
      </v-tooltip>
    </v-col>
    <v-col cols="12">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-bind="attrs"
            v-on="on"
            v-model="label.rotate"
            type="number"
            label="Rotate"
            min="-90"
            max="90"
            @input="updated"
          ></v-text-field>
        </template>
        <span>Rotate label, from -90 degree to 90, positive value represents rotate anti-clockwise</span>
      </v-tooltip>
    </v-col>
    <v-col cols="6">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-bind="attrs"
            v-on="on"
            v-model="labelXOffset"
            type="number"
            label="Horizontal Offset"
            min="-90"
            max="90"
            @input="labelOffset"
          ></v-text-field>
        </template>
        <span>Whether to move text slightly horizontally</span>
      </v-tooltip>
    </v-col>
    <v-col cols="6">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-bind="attrs"
            v-on="on"
            v-model="labelYOffset"
            type="number"
            label="Vertical Offset"
            min="-90"
            max="90"
            @input="labelOffset"
          ></v-text-field>
        </template>
        <span>Whether to move text slightly vertically</span>
      </v-tooltip>
    </v-col>
    <v-col cols="12">
      <TextStyle @textStyle='LabelTextStyle' />
    </v-col>
  </v-row>
</template>
<script>
import TextStyle from './TextStyle.vue'
export default {
  props: ['subscriber', 'default'],
  data () {
    return {
      label: {
        show: false,
        rotate: 0,
        offset: [0, 0]
      }
    }
  },
  created () {
    this.labelXOffset = this.label.offset[0]
    this.labelYOffset = this.label.offset[1]
    if (this.default) {
      const labelSetProp = Object.keys(this.label)
      for (const def in this.default) {
        if (labelSetProp.includes(def)) {
          this.label[def] = this.default[def]
        }
      }
    }
    this.updated()
  },
  methods: {
    updated () {
      this.$emit(this.subscriber, this.label)
    },
    LabelTextStyle (setting) {
      for (const style in setting.value) {
        this.label[style] = setting.value[style]
      }
      this.updated()
    },
    labelOffset () {
      this.label.offset = [this.labelXOffset, this.labelYOffset]
      this.updated()
    }
  },
  components: {
    TextStyle
  }
}
</script>
