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
        Add Field
        <v-spacer></v-spacer>
        <v-btn icon color="white" @click="updateValue">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <Tree @node-focus="nodeOpen" :nodes="treeData" :config="config"></Tree>
      </v-card-text>
    </v-card>
    </v-dialog>
  </v-container>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import Tree from "vue3-treeview";
import "vue3-treeview/dist/style.css";
const emit = defineEmits(['update:showAddFieldDialog'])
const props = defineProps({
  id: "",
  showAddFieldDialog: Boolean
})
const treeData = ref({})
let config = ref({
  checkboxes: true,
  roots: []
})
const elements = ref([])
const skipFileds = ref(["id", "meta", "implicitRules", "language", "text", "contained", "modifierExtension"])
const loading = ref(false)
const showDialog = ref(props.showAddFieldDialog)
const updateValue = () => {
  emit('update:showAddFieldDialog', false)
}
watch(() => props.showAddFieldDialog, async(newVal) => {
  loadStructure()
  showDialog.value = newVal
})
onMounted(() => {
  loadStructure()
});
function nodeOpen(node) {
  console.error(JSON.stringify(node, 0, 2));
}
function loadStructure() {
  config.value.roots = []
  treeData.value = {}
  loading.value = true
  fetch("/fhir/StructureDefinition/" + props.id).then((response) => {
    response.json().then((structure) => {
      elements.value = structure.snapshot.element
      getFields(structure.type)
      cleanTreeExtensions()
      loading.value = false
    })
  })
}

function cleanTreeExtensions() {
  for(let data in treeData.value) {
    if(data.endsWith(".extension") && !treeData.value[data].children) {
      let ids = data.split(".extension")
      ids.pop()
      parent = ids.join(".extension")
      let childIndex = treeData.value[parent].children.findIndex((child) => {
        return child === data
      })
      treeData.value[parent].children.splice(childIndex, 1)
      delete treeData.value[data]
    }
  }
}

function getFields(base) {
  for(let element of elements.value) {
    if(!element.id.startsWith(base)) {
      continue
    }
    let skip = skipFileds.value.find((skip) => {
      return base + "." + skip === element.id
    })
    if(skip) {
      continue
    }
    let modId = element.id.replace(base, "")
    if(modId) {
      modId = modId.split(".")
      if(modId.length === 2 && !element.id.includes(":")) {
        if(treeData.value[element.id]) {
          continue
        }
        let label = modId[1]
        if(element.label) {
          label = element.label
        }
        if(treeData.value[base]) {
          if(!treeData.value[base].children) {
            treeData.value[base].children = []
          }
          treeData.value[base].children.push(element.id)
        } else {
          config.value.roots.push(element.id)
        }
        treeData.value[element.id] = {
          text: label
        }
        if(modId[1] === "extension") {
          treeData.value[element.id].text = "Extensions"
          getExtensionFields(element.id)
        }
      } else if(modId.length === 3 && !element.id.includes(":")) {
        let id = element.id.split(".")
        id.pop()
        id = id.join(".")
        getFields(id)
      }
    }
  }
}

function getExtensionFields(base) {
  for(let element of elements.value) {
    if(!element.id.startsWith(base + ':')) {
      continue
    }
    let modId = element.id.replace(base + ":", "")
    if(modId.includes(".") && (!element.id.endsWith(".extension") || modId.split('.').length !== 2)) {
      continue
    }
    if(!modId.includes(".")) {
      let label = element.label
      if(!label) {
        label = modId
      }
      if(treeData.value[base]) {
        if(!treeData.value[base].children) {
          treeData.value[base].children = []
        }
        treeData.value[base].children.push(element.id)
      } else {
        config.value.roots.push(element.id)
      }
      treeData.value[element.id] = {
        text: label
      }
    } else if(modId.includes(".")) {
      let ids = element.id.split(".extension")
      ids.pop()
      parent = ids.join(".extension")
      if(!treeData.value[parent].children) {
        treeData.value[parent].children = []
      }
      treeData.value[parent].children.push(element.id)
      treeData.value[element.id] = {
        text: "Extensions"
      }
      getExtensionFields(element.id)
    }
  }
}
</script>
