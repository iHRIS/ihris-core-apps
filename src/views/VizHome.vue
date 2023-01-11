<template>
  <v-container grid-list-xs>
    <v-dialog
      persistent
      transition="dialog-top-transition"
      v-model="displayVizList"
      width="960px"
    >
      <v-system-bar
        window
        color="primary"
        dark
        height="40px"
      >
        <b>Available Vizualizations</b>
        <v-spacer></v-spacer>
        <v-icon @click.native="displayVizList = false" style="cursor: pointer">mdi-close</v-icon>
      </v-system-bar>
      <v-progress-linear :indeterminate="loading" :active="loading" color="secondary"></v-progress-linear>
      <v-card>
        <v-card-text>
          <template v-if="visualizations.length > 0">
            <v-list
              shaped
              dense
            >
              <v-list-item-group
                color="primary"
              >
              <v-list-item
                v-for="(value, i) in this.visualizations"
                :key="i"
                @click="$router.push({path: '/vizBuilder/' + value.id})"
              >
                <v-list-item-content>
                  <v-list-item-title>
                    <v-icon>mdi-menu-right</v-icon>
                    <label style="font-size: 13px; cursor: pointer;">
                      {{value.name}}
                    </label>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              </v-list-item-group>
            </v-list>
          </template>
        </v-card-text>
      </v-card>
    </v-dialog>
    <div>
      <center>
        iHRIS Data Visualizer lets you create different charts to easily visualize your data for better decision making. <br>
        You may start by creating a new visualization or open an existing visualization to either edit it or creating a new visualization based on the open data visualization.
      </center>
    </div>
    <br>
    <v-row justify="center">
      <v-col cols="auto">
        <v-btn color="success" x-large @click="listViz">
          <v-icon left x-large>mdi-book-open-page-variant</v-icon>Open
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn color="success" x-large @click="$router.push({name: 'vizBuilder'})">
          <v-icon left x-large>mdi-plus</v-icon>New
        </v-btn>
      </v-col>
      <v-col cols="auto">
        <v-btn color="success" x-large @click="$router.push({name: 'dashBuilder'})">
          <v-icon left x-large>mdi-plus</v-icon>New Dashboard
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      displayVizList: false,
      loading: false,
      visualizations: []
    }
  },
  methods: {
    listViz () {
      this.loading = true
      this.displayVizList = true
      this.getViz().then(() => {
        this.loading = false
      })
    },
    getViz (url) {
      return new Promise((resolve, reject) => {
        if (!url) {
          url = '/fhir/Basic?_profile=http://ihris.org/fhir/StructureDefinition/ihris-data-visualization'
        }
        fetch(url).then((response) => {
          response.json()
            .then((data) => {
              for (const entry of data.entry) {
                const name = entry.resource.extension.find((ext) => {
                  return ext.url === 'http://ihris.org/fhir/StructureDefinition/ihris-basic-name'
                })
                if (name) {
                  this.visualizations.push({
                    id: entry.resource.id,
                    name: name.valueString
                  })
                }
              }
              const next = data.link.find((link) => {
                return link.relation === 'next'
              })
              if (next) {
                this.getViz(next.url).then(() => {
                  return resolve()
                }).catch((err) => {
                  return reject(err)
                })
              } else {
                return resolve()
              }
            })
        })
      })
    }
  }
}
</script>
