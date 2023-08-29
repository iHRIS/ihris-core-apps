<template>
 <v-container grid-list-xs>
  <AddLinkDialog
    @linkAdded="linkAdded"
    v-model:addChildResDialog="addChildResDialog"
    :parentRelationship="relationShip"
  />
  <AddFieldDialog
    v-if="relationShip.resource.id"
    @linkAdded="linkAdded"
    v-model:showAddFieldDialog="showAddFieldDialog"
    :id="relationShip.resource.id"
  />
  <v-card 
    class="mx-auto"
    max-width="800"
    outlined
    >
    <v-card-title class="primary darken-1 white--text text-uppercase font-weight-bold">
      Build Report
    </v-card-title>
    <v-card-text class="my-3">
      <v-row>
        <v-col cols="12">
          <v-autocomplete
            label="Primary Resource"
            :loading="loading"
            :items="structures"
            v-model="relationShip.resource"
            outlined
            hide-details="auto"
            item-text="display"
            item-value="code"
            dense
            return-object
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="relationShip.name"
            label="Report Unique Name*"
            outlined
            hide-details="auto"
            dense
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="relationShip.label"
            label="Report Display Name*"
            outlined
            hide-details="auto"
            dense
          />
        </v-col>
      </v-row>
      <div v-if="relationShip.resource && relationShip.resource.id">
        <v-expansion-panels>
          <v-expansion-panel :title="'Fields for ' + relationShip.resource.title">
            <v-expansion-panel-text>
              <v-spacer></v-spacer><v-btn color="success" size="small" @click="showAddFieldDialog = true"><v-icon location="left">mdi-plus</v-icon>Add</v-btn>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
      <div v-if="relationShip.children && relationShip.children.length > 0">
        <v-expansion-panels variant="popout">
          <v-expansion-panel
            v-for="(link,i) in relationShip.children"
            :key="i"
            :title="link.label"
          >
            <v-expansion-panel-text>
              <LinkedResource :relationShip="link" />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
      <v-col offset="11">
        <v-btn :disabled="!canAddLink" icon color="primary" @click="addChildResDialog = true">
          <v-icon>mdi-plus</v-icon>
          <v-tooltip
            activator="parent"
            location="top"
          >
            Add a new child resource
          </v-tooltip>
        </v-btn>
      </v-col>
    </v-card-text>
  </v-card>
 </v-container>
</template>
<script setup>
  import { onMounted, ref, computed } from 'vue'
  import LinkedResource from './LinkedResource.vue'
  import AddFieldDialog from './AddFieldDialog.vue';
  import AddLinkDialog from './AddLinkDialog.vue';
  const relationShip = ref({
    resource: "",
    name: "ff",
    label: "Licensed Professionals",
    query: "",
    locationBasedConstraint: false,
    displayCheckbox: false,
    fields: [],
    children: []
  })
  const addChildResDialog = ref(false)
  const showAddFieldDialog = ref(false)
  const structures = ref([])
  const loading = ref(false)
  const canAddLink = computed(() => {
    if(relationShip.value.resource && relationShip.value.name) {
      return true
    }
    return false
  })
  function linkAdded(link) {
    relationShip.value.children.push(link)
  }
  function getStructureDef(url) {
    return new Promise((resolve, reject) => {
      if(!url) {
        url = "/fhir/StructureDefinition?kind=resource&_elements=url,name,type,title,description&_sort=title,type&_count=200"
      }
      fetch(url).then((response) => {
        response.json().then((structs) => {
          if(!structs.entry) {
            return resolve()
          }
          for(let struct of structs.entry) {
            structures.value.push({
              id: struct.resource.id,
              url: struct.resource.url,
              name: struct.resource.name,
              type: struct.resource.type,
              title: struct.resource.title || struct.resource.type,
              description: struct.resource.description,
            })
          }
          let next = structs.link.find((link) => {
            return link.relation === 'next'
          })
          if(next) {
            url = next.url.replace(/_getpages=[^&]*&*/, "").replace("/fhir?","/fhir/StructureDefinition?")
            url = url.substring(url.indexOf("/fhir/"));
            url += "&kind=resource&_sort=title,type"
            getStructureDef(url.substring(url.indexOf("/fhir"))).then(() => {
              resolve()
            }).catch((err) => {
              reject(err)
            })
          } else {
            resolve()
          }
        })
      })
    })
  }
  onMounted(() => {
    loading.value = true
    getStructureDef().then(() => {
      loading.value = false
    })
  })
</script>