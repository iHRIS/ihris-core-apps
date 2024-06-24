import { createStore } from "vuex";

const store = createStore({
  state: {
    user: {
      loggedin: false,
      name: "",
      obj: {},
    },
    idp: "ihris",
    fhirFlattener: "fhir2es",
    security_off: false,
    message: {
      type: "info",
      text: null,
      timeout: 5000,
      active: false,
    },
    coreURL: "",
    charts: [
      {
        type: "bar",
        subType: "",
        renderComponent: "IhrisAxisChart",
        icon: "mdi-chart-bar",
        hasAxis: true,
        maxCategories: 2,
        maxSeries: 1,
        minCategories: 0,
        minSeries: 1,
        title: "Bar Chart",
        description:
          "Presents data with rectangular bars at heights or lengths proportional to the values they represent",
      },
      {
        type: "pie",
        subType: "",
        renderComponent: "IhrisPieChart",
        icon: "mdi-chart-pie",
        hasAxis: false,
        maxCategories: 2,
        maxSeries: 0,
        minCategories: 1,
        minSeries: 0,
        title: "Pie Chart",
        description: "Compare data in propotion to a whole",
      },
      {
        type: "pie",
        subType: "donut",
        renderComponent: "IhrisPieChart",
        icon: "mdi-chart-donut",
        hasAxis: false,
        maxCategories: 2,
        maxSeries: 0,
        minCategories: 1,
        minSeries: 0,
        title: "Donut",
        description: "Compare data in propotion to a whole",
      },
      {
        type: "tabular",
        subType: "",
        renderComponent: "IhrisTabularChart",
        icon: "mdi-table-large",
        hasAxis: false,
        maxCategories: 1,
        maxSeries: 1,
        minCategories: 0,
        minSeries: 1,
        title: "Tabular",
        description: "Display data on a table",
      },
      {
        type: "line",
        subType: "",
        renderComponent: "IhrisAxisChart",
        icon: "mdi-chart-line",
        hasAxis: true,
        maxCategories: 2,
        maxSeries: 1,
        minCategories: 1,
        minSeries: 1,
        title: "Line Chart",
        description: "Display data as a series of points",
      },
      {
        type: "line",
        subType: "area",
        renderComponent: "IhrisAxisChart",
        icon: "mdi-chart-areaspline",
        hasAxis: true,
        maxCategories: 2,
        maxSeries: 1,
        minCategories: 1,
        minSeries: 1,
        title: "Area",
        description: "Emphasize the data between an axis and a line",
      },
      {
        type: "gauge",
        subType: "",
        renderComponent: "IhrisAxisChart",
        icon: "mdi-gauge",
        hasAxis: false,
        maxCategories: 0,
        maxSeries: 1,
        minCategories: 1,
        minSeries: 1,
        title: "Gauge",
        description: "Show the status of a metric",
      },
      {
        type: "metric",
        subType: "",
        renderComponent: "MetricChart",
        icon: "mdi-numeric-10-circle",
        hasAxis: false,
        maxCategories: 0,
        maxSeries: 1,
        minCategories: 0,
        minSeries: 0,
        title: "Metric",
        description: "Show a calculation as a single number",
      },
      {
        type: "scatter",
        subType: "",
        renderComponent: "IhrisAxisChart",
        icon: "mdi-chart-scatter-plot",
        hasAxis: true,
        maxCategories: 2,
        maxSeries: 1,
        minCategories: 1,
        minSeries: 1,
        title: "Scatter",
        description: "Show information that changes over time",
      },
      {
        type: "map",
        subType: "",
        renderComponent: "IhrisAxisChart",
        icon: "mdi-google-maps",
        hasAxis: false,
        maxCategories: 2,
        maxSeries: 1,
        minCategories: 1,
        minSeries: 1,
        title: "Open as Map",
        description: "Show information that changes over time",
      },
    ],
  },
  getters: {},
  mutations: {
    login(state, user) {
      state.user.loggedin = true;
      state.user.name = user.name;
      state.user.role = user.role;
      state.user.userId = user.userId;
      state.user.obj = user.obj;
    },
    logout(state) {
      state.user.loggedin = false;
      state.user.name = "";
      state.user.name = "";
      state.user.location = "";
      state.user.role = "";
      state.user.reference = "";
      state.user.facilityId = "";
      state.user.physicalLocation = "";
    },
    securityOff(state, data) {
      state.security_off = data;
    },
    closeMessage(state) {
      state.message.active = false;
    },
    setMessage(state, data) {
      if (typeof data === "string") {
        state.message.type = "info";
        state.message.timeout = 5000;
        state.message.text = data;
        state.message.active = true;
      } else {
        state.message.type = data.type || "info";
        state.message.timeout = data.timeout || 5000;
        state.message.text = data.text;
        state.message.active = true;
      }
    },
  },
  actions: {},
  modules: {},
});
export default store;
