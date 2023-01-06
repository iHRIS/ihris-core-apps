<template>
  <div>
    <v-dialog
      v-model="displayColor"
      width="313px"
    >
      <v-color-picker
        class="ma-2"
        canvas-height="300"
        v-model="style.color"
      ></v-color-picker>
    </v-dialog>
    <v-row>
      <v-col cols="6">
        <v-row>
          <v-col cols="6">
            Color:
          </v-col>
          <v-col cols="6">
            <v-card :color="style.color" width="30px" height="20" @click="displayColor = true">
              <v-card-text @click="displayColor = true">

              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-select
              :items="fontStyles"
              v-model="style.fontStyle"
              label="Font Style"
              @change="updated"
            ></v-select>
          </v-col>
          <v-col cols="12">
            <v-select
              :items="fontWeight"
              v-model="style.fontWeight"
              label="Font Weight"
              @change="updated"
            ></v-select>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="style.fontFamily"
              label="Font Family"
              @input="updated"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="style.fontSize"
              type="number"
              label="Font Size"
              min="5"
              max="100"
              @input="updated"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="style.lineHeight"
              type="number"
              label="Line Height"
              min="5"
              max="100"
              @input="updated"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  props: ['values'],
  data () {
    return {
      displayColor: false,
      style: {
        color: '#020203FF',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontFamily: 'sans-serif',
        fontSize: 12,
        lineHeight: 12
      },
      fontStyles: ['normal', 'italic', 'oblique'],
      fontWeight: ['normal', 'bold', 'bolder', 'lighter']
    }
  },
  watch: {
    'style.color': function (val, oldVal) {
      if (val !== oldVal) {
        this.updated()
      }
    }
  },
  methods: {
    updated () {
      this.$emit('textStyle', { name: 'textStyle', value: this.style })
    }
  },
  created () {
    for (const index in this.values) {
      if (Object.keys(this.style).indexOf(index) !== -1) {
        this.style[index] = this.values[index]
      }
    }
    this.updated()
  }
}
</script>
