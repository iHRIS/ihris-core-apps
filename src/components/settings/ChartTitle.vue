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
import { ref, onMounted } from "vue";
import TextStyle from "./TextStyle.vue";
export default {
  props: ["values", "optValues"],
  setup(props, context) {
    const title = ref({
      show: true,
      text: "My Chart",
      textAlign: "auto",
      left: "center",
      textStyle: {},
    });
    const textAligns = ref(["auto", "left", "right", "center"]);
    const expandTextStyle = ref([]);

    function externalSettings(setting) {
      title.value[setting.name] = setting.value;
      updated();
    }

    function updated() {
      context.emit("chartTitle", { name: "title", value: title.value });
    }

    onMounted(() => {
      for (const index in props.values) {
        title.value[index] = props.values[index];
      }
      expandTextStyle.value = [0];
      setTimeout(() => {
        expandTextStyle.value = [];
      }, 500);
    });

    return {
      title,
      textAligns,
      expandTextStyle,
      externalSettings,
      updated,
    };
  },
  components: {
    TextStyle,
  },
};
</script>
