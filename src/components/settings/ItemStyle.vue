<template>
  <div>
    <v-dialog
      v-model="displayProgBorderColor"
      width="313px"
    >
      <v-color-picker
        class="ma-2"
        canvas-height="300"
        v-model="settings.borderColor"
      ></v-color-picker>
    </v-dialog>
    <v-dialog
      v-model="displayProgColor"
      width="313px"
    >
      <v-color-picker
        class="ma-2"
        canvas-height="300"
        v-model="settings.color"
      ></v-color-picker>
    </v-dialog>
    <v-dialog
      v-model="displayISShadowColor"
      width="313px"
    >
      <v-color-picker
        class="ma-2"
        canvas-height="300"
        v-model="settings.shadowColor"
      ></v-color-picker>
    </v-dialog>
    <v-row>
      <v-col cols="6">
        Progress color:
      </v-col>
      <v-col cols="6">
        <v-card :color="settings.color" width="30px" height="20" @click="displayProgColor = true">
          <v-card-text @click="displayProgColor = true">

          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        Progress border color:
      </v-col>
      <v-col cols="6">
        <v-card :color="settings.borderColor" width="30px" height="20" @click="displayProgBorderColor = true">
          <v-card-text @click="displayProgBorderColor = true">

          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-bind="attrs"
              v-on="on"
              v-model="settings.borderWidth"
              type="number"
              label="Border Width"
              min="0"
              max="10000"
              @input="updated"
            ></v-text-field>
          </template>
          <span>Border width. No border when it is set to be 0</span>
        </v-tooltip>
      </v-col>
      <v-col cols="12">
        <v-select
          :items="borderTypes"
          v-model="settings.borderType"
          label="Border type"
          @input="updated"
        ></v-select>
      </v-col>
      <v-col cols="12">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-bind="attrs"
              v-on="on"
              v-model="settings.shadowBlur"
              type="number"
              label="Size of shadow blur"
              min="0"
              max="40"
              @input="updated"
            ></v-text-field>
          </template>
          <span>This attribute should be used along with shadowColor, shadowOffsetX, shadowOffsetY to set shadow to component</span>
        </v-tooltip>
      </v-col>
      <v-col cols="6">
        Shadow Color:
      </v-col>
      <v-col cols="6">
        <v-card :color="settings.shadowColor" width="30px" height="20" @click="displayISShadowColor = true">
          <v-card-text @click="displayISShadowColor = true">

          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-bind="attrs"
              v-on="on"
              v-model="settings.shadowOffsetX"
              type="number"
              label="Horizontal Offset"
              min="-90"
              max="90"
              @input="updated"
            ></v-text-field>
          </template>
          <span>Offset distance on the horizontal direction of shadow</span>
        </v-tooltip>
      </v-col>
      <v-col cols="6">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-bind="attrs"
              v-on="on"
              v-model="settings.shadowOffsetY"
              type="number"
              label="Vertical Offset"
              min="-90"
              max="90"
              @input="updated"
            ></v-text-field>
          </template>
          <span>Offset distance on the vertical direction of shadow</span>
        </v-tooltip>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  props: ['subscriber', 'values'],
  data () {
    return {
      settings: {
        borderColor: '#000',
        color: '',
        borderWidth: 0,
        borderType: 'solid',
        shadowBlur: 0,
        shadowColor: '',
        shadowOffsetX: 0,
        shadowOffsetY: 0
      },
      borderTypes: ['solid', 'dashed', 'dotted'],
      displayProgBorderColor: false,
      displayISShadowColor: false,
      displayProgColor: false
    }
  },
  methods: {
    updated () {
      this.$emit(this.subscriber, this.settings)
    }
  },
  created () {
    for (const index in this.values) {
      if (Object.keys(this.settings).indexOf(index) !== -1) {
        this.settings[index] = this.values[index]
      }
    }
  }
}
</script>
