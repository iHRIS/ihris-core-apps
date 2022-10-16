<template>
  <div>
    <v-dialog
      v-model="displayColor"
      width="313px"
    >
      <v-color-picker
        class="ma-2"
        canvas-height="300"
        v-model="axisPointer.handle.color"
      ></v-color-picker>
    </v-dialog>
    <v-row>
      <v-col cols="12">
        <v-switch label="Show/Hide" v-model="axisPointer.show" @change="updated"></v-switch>
        <v-select
          :items="types"
          v-model="axisPointer.type"
          label="Indicator type"
          @change="updated"
        ></v-select>
        <v-switch label="Trigger tooltip" v-model="axisPointer.triggerTooltip" @change="updated"></v-switch>
        <v-text-field
          v-model="axisPointer.value"
          label="Current value"
          type="number"
          @input="updated"
        ></v-text-field>
        <v-expansion-panels multiple focusable>
          <v-expansion-panel>
            <v-expansion-panel-header>Label of axis pointer</v-expansion-panel-header>
            <v-expansion-panel-content>
              <div>
                <v-switch label="Show/Hide" v-model="axisPointer.label.show" @change="updated"></v-switch>
              </div>
              <div>
                <v-text-field
                  v-model="axisPointer.label.margin"
                  type="number"
                  label="Distance between label and axis"
                  min="0"
                  max="100"
                  @input="updated"
                ></v-text-field>
              </div>
              <div>
                <TextStyle @textStyle='labelStyle' />
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-expansion-panels multiple focusable>
          <v-expansion-panel>
            <v-expansion-panel-header>Handle (Button to drag axisPointer)</v-expansion-panel-header>
            <v-expansion-panel-content>
              <div>
                <v-switch label="Show/Hide" v-model="axisPointer.handle.show" @change="updated"></v-switch>
              </div>
              <div>
                <v-text-field
                  v-model="axisPointer.handle.size"
                  type="number"
                  label="Handle size"
                  min="0"
                  max="100"
                  @input="updated"
                ></v-text-field>
              </div>
              <div>
                <v-row>
                  <v-col cols="6">
                    Color:
                  </v-col>
                  <v-col cols="6">
                    <v-card :color="axisPointer.handle.color" width="30px" height="20" @click="displayColor = true">
                      <v-card-text @click="displayColor = true">

                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import TextStyle from './TextStyle.vue'
export default {
  data () {
    return {
      displayColor: false,
      axisPointer: {
        show: false,
        type: 'line',
        label: {
          show: false,
          margin: 3,
          color: '#fff',
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontFamily: 'sans-serif',
          lineHeight: 12
        },
        triggerTooltip: true,
        value: '',
        handle: {
          show: true,
          size: 45,
          color: '#333'
        }
      },
      types: ['line', 'shadow', 'none']
    }
  },
  watch: {
    'axisPointer.handle.color': function (val, oldVal) {
      if (val !== oldVal) {
        this.updated()
      }
    }
  },
  methods: {
    externalSettings (setting) {
      this.axisPointer[setting.name] = setting.value
      this.updated()
    },
    labelStyle (setting) {
      for (const style in setting.value) {
        this.axisPointer.label[style] = setting.value[style]
      }
      this.updated()
    },
    updated () {
      this.$emit('chartAxisPointer', { name: 'axisPointer', value: this.axisPointer })
    }
  },
  components: {
    TextStyle
  }
}
</script>
