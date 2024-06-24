import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

import { createVuetify } from "vuetify";
import { VDateInput } from "vuetify/labs/VDateInput";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
    VDateInput,
  },
  theme: {
    themes: {
      light: {
        colors: {
          primary: "#569fd3",
          secondary: "#5f6062",
          accent: "#78496a",
          error: "#b32317",
          info: "#005595",
          success: "#8a8d35",
          warning: "#d06f1a",
        },
      },
    },
  },
});
