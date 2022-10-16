<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-switch label="Show/Hide" v-model="title.show" @change="updated"></v-switch>
        <v-text-field
          v-model="title.text"
          label="Text"
          @input="updated"
        ></v-text-field>
        <v-select
          :items="textAligns"
          v-model="title.textAlign"
          label="Text Alignment"
          @change="updated"
        ></v-select>
        <v-expansion-panels multiple focusable>
          <v-expansion-panel>
            <v-expansion-panel-header>Text Style</v-expansion-panel-header>
            <v-expansion-panel-content>
              <TextStyle @textStyle='externalSettings' />
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
      title: {
        show: true,
        text: 'My Chart',
        textAlign: 'auto',
        left: 'center',
        textStyle: {}
      },
      textAligns: ['auto', 'left', 'right', 'center']
    }
  },
  methods: {
    externalSettings (setting) {
      this.title[setting.name] = setting.value
      this.updated()
    },
    updated () {
      this.$emit('chartTitle', { name: 'title', value: this.title })
    }
  },
  components: {
    TextStyle
  }
}
</script>
