<template>
  <v-container grid-list-xs>
    <v-expansion-panels multiple focusable>
      <v-expansion-panel>
        <v-expansion-panel-title>Metric Value</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="settings.graphic.elements[0].style.fontSize"
                type="number"
                label="Font Size"
                min="5"
                max="100"
                @input="updated"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                :items="fontWeight"
                v-model="settings.graphic.elements[0].style.fontWeight"
                label="Font Weight"
                @change="updated"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-switch
                color="blue"
                label="Enable Animation"
                v-model="animation"
                @change="animate(0)"
              >
              </v-switch>
            </v-col>
            <v-col cols="12">
              <v-switch
                v-if="animation"
                color="blue"
                label="Loop Animation"
                v-model="settings.graphic.elements[0].keyframeAnimation.loop"
                @change="updated"
              >
              </v-switch>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-tooltip activator="parent" location="bottom"
        >Settings about metric value</v-tooltip
      >
    </v-expansion-panels>
    <v-expansion-panels multiple focusable>
      <v-expansion-panel>
        <v-expansion-panel-title>Metric Title</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="settings.graphic.elements[1].style.text"
                label="Title"
                @input="updated"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="settings.graphic.elements[1].style.fontSize"
                type="number"
                label="Font Size"
                min="5"
                max="100"
                @input="updated"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                :items="fontWeight"
                v-model="settings.graphic.elements[1].style.fontWeight"
                label="Font Weight"
                @change="updated"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-switch
                color="blue"
                label="Enable Animation"
                v-model="animation"
                @change="animate(1)"
              >
              </v-switch>
            </v-col>
            <v-col cols="12">
              <v-switch
                v-if="animation"
                color="blue"
                label="Loop Animation"
                v-model="settings.graphic.elements[1].keyframeAnimation.loop"
                @change="updated"
              >
              </v-switch>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-tooltip activator="parent" location="bottom"
        >Settings about metric title</v-tooltip
      >
    </v-expansion-panels>
  </v-container>
</template>
<script>
import { ref, computed, onMounted } from "vue";
export default {
  props: { options: Object },
  setup(props, context) {
    const fontWeight = ref(["normal", "bold", "bolder", "lighter"]);
    const animation = ref(false);
    const settings = ref({
      graphic: {
        elements: [
          {
            type: "text",
            left: "center",
            style: {
              text: "",
              fontSize: 40,
              fontWeight: "bold",
              lineDash: [0, 200],
              lineDashOffset: 0,
              fill: "transparent",
              stroke: "#000",
              lineWidth: 1,
            },
            keyframeAnimation: {
              duration: 3000,
              loop: false,
              keyframes: [
                {
                  percent: 0.7,
                  style: {
                    fill: "transparent",
                    lineDashOffset: 200,
                    lineDash: [200, 0],
                  },
                },
                {
                  // Stop for a while.
                  percent: 0.8,
                  style: {
                    fill: "transparent",
                  },
                },
                {
                  percent: 1,
                  style: {
                    fill: "black",
                  },
                },
              ],
            },
          },
          {
            type: "text",
            left: "center",
            style: {
              text: "\n\n Total Staffs",
              fontSize: 30,
              fontWeight: "bold",
              lineDash: [0, 200],
              lineDashOffset: 0,
              fill: "transparent",
              stroke: "#000",
              lineWidth: 1,
            },
            keyframeAnimation: {
              duration: 3000,
              loop: false,
              keyframes: [
                {
                  percent: 0.7,
                  style: {
                    fill: "transparent",
                    lineDashOffset: 200,
                    lineDash: [200, 0],
                  },
                },
                {
                  // Stop for a while.
                  percent: 0.8,
                  style: {
                    fill: "transparent",
                  },
                },
                {
                  percent: 1,
                  style: {
                    fill: "black",
                  },
                },
              ],
            },
          },
        ],
      },
    });
    let option = computed({
      get() {
        return props.options;
      },
      set(value) {
        context.emit("update:options", value);
      },
    });
    onMounted(() => {
      option.value = settings.value;
      updated();
    });
    function animate(index) {
      if (animation.value) {
        settings.value.graphic.elements[
          index
        ].keyframeAnimation.duration = 3000;
      } else {
        settings.value.graphic.elements[index].keyframeAnimation.duration = 1;
      }
      updated();
    }
    function updated() {
      console.error(JSON.stringify(option.value, 0, 2));
      console.log("update");
    }

    return {
      fontWeight,
      animation,
      settings,
      animate,
      updated,
    };
  },
};
</script>
