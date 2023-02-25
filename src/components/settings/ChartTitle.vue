<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-switch
          color="blue"
          label="Show/Hide"
          v-model="title.show"
          @change="updated"
        ></v-switch>
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
        <v-expansion-panels multiple focusable v-model="expandTextStyle">
          <v-expansion-panel>
            <v-expansion-panel-title>Text Style</v-expansion-panel-title>
            <v-expansion-panel-text>
              <TextStyle
                @textStyle="externalSettings"
                :values="title.textStyle"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import TextStyle from "./TextStyle.vue";
export default {
  props: ["values"],
  data() {
    return {
      title: {
        show: true,
        text: "My Chart",
        textAlign: "auto",
        left: "center",
        textStyle: {},
      },
      textAligns: ["auto", "left", "right", "center"],
      expandTextStyle: [],
    };
  },
  methods: {
    externalSettings(setting) {
      this.title[setting.name] = setting.value;
      this.updated();
    },
    updated() {
      this.$emit("chartTitle", { name: "title", value: this.title });
    },
  },
  components: {
    TextStyle,
  },
  created() {
    for (const index in this.values) {
      this.title[index] = this.values[index];
    }
    this.expandTextStyle = [0];
    setTimeout(() => {
      this.expandTextStyle = [];
    }, 500);
  },
};
</script>
