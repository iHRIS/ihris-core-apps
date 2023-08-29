<template>
  <v-container grid-list-xs>
    <v-dialog
      v-model="showDialog"
      persistent
      max-width="900px"
      transition="dialog-transition"
    >
      <v-card>
        <v-toolbar color="primary" class="darken-1 white--text text-uppercase font-weight-bold" dark>
          Add Child Resource
          <v-spacer></v-spacer>
          <v-btn icon color="white" @click="updateValue">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-autocomplete
                label="Primary Resource"
                :loading="loading"
                :items="referenceResources"
                v-model="selectedResource.resource"
                outlined
                hide-details="auto"
                item-text="title"
                dense
                return-object
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="selectedResource.name"
                label="Report Unique Name*"
                outlined
                hide-details="auto"
                dense
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="selectedResource.label"
                label="Report Display Name*"
                outlined
                hide-details="auto"
                dense
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="addLink">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script setup>
import { watch, ref } from 'vue';
import PullLinkedResources from "./PullLinkedResources.js"
  const props = defineProps({
    addChildResDialog: Boolean,
    parentRelationship: Object
  })
  const loading = ref(false)
  const referenceResources = ref([])
  const selectedResource = ref({
    resource: "",
    name: "ss",
    label: "ss",
    children: []
  })
  const emit = defineEmits(['update:addChildResDialog', 'linkAdded'])

  const updateValue = () => {
    emit('update:addChildResDialog', false)
  }
  const showDialog = ref(props.addChildResDialog)
  watch(() => props.addChildResDialog, async(newVal) => {
    if(newVal) {
      loading.value = true
      referenceResources.value = []
      PullLinkedResources(props.parentRelationship.resource).loadLinks().then((links) => {
        referenceResources.value = links
        loading.value = false
      })
    }
    showDialog.value = newVal
  })
  function addLink() {
    updateValue()
    emit('linkAdded', selectedResource.value)
  }
</script>