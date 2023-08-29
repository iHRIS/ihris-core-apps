<template>
  <v-container grid-list-xs>
    <AddLinkDialog
      @linkAdded="linkAdded"
      v-model:addChildResDialog="addChildResDialog"
      :parentRelationship="relationShip" 
    />
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
    <template v-if="relationShip.children && relationShip.children.length > 0">
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
    </template>
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
  </v-container>
</template>
<script setup>
  import { ref, computed } from 'vue'
  import AddLinkDialog from './AddLinkDialog.vue';
  const props = defineProps({
    relationShip: {}
  })
  const relationShip = ref(props.relationShip)
  const addChildResDialog = ref(false)
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
</script>