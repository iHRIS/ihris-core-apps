<template>
  <v-container grid-list-xs>
    <div style="text-align: center">
      iHRIS Data Visualizer lets you create different charts to easily visualize
      your data for better decision making. <br />
      You may start by creating a new visualization or open an existing
      visualization to either edit it or creating a new visualization based on
      the open data visualization.
    </div>
    <br />
    <v-row justify="center">
      <v-col cols="auto">
        <v-btn
          variant="outlined"
          color="primary"
          size="x-large"
          @click="$router.push({ name: 'vizBuilder' })"
        >
          <v-icon start size="x-large">mdi-eye</v-icon>Visualizations
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn
          variant="outlined"
          color="primary"
          size="x-large"
          @click="
            $router.push({
              name: 'dashBuilder',
              params: { edit: true },
            })
          "
        >
          <v-icon start size="x-large">mdi-view-dashboard-edit </v-icon>
          Dashboards
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      displayVizList: false,
      displayDashList: false,
      loading: false,
      visualizations: [],
    };
  },
  methods: {
    listViz() {
      this.loading = true;
      this.displayVizList = true;
      this.getViz().then(() => {
        this.loading = false;
      });
    },
    getViz(url) {
      return new Promise((resolve, reject) => {
        if (!url) {
          url =
            "/fhir/Basic?_profile=http://ihris.org/fhir/StructureDefinition/ihris-data-visualization";
        }
        fetch(url).then((response) => {
          response.json().then((data) => {
            for (const entry of data.entry) {
              const name = entry.resource.extension.find((ext) => {
                return (
                  ext.url ===
                  "http://ihris.org/fhir/StructureDefinition/ihris-basic-name"
                );
              });
              if (name) {
                this.visualizations.push({
                  id: entry.resource.id,
                  name: name.valueString,
                });
              }
            }
            const next = data.link.find((link) => {
              return link.relation === "next";
            });
            if (next) {
              this.getViz(next.url)
                .then(() => {
                  return resolve();
                })
                .catch((err) => {
                  return reject(err);
                });
            } else {
              return resolve();
            }
          });
        });
      });
    },
  },
};
</script>
