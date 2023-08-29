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
        <v-autocomplete
          label="Field"
          :loading="loading"
          :items="fields"
          outlined
          hide-details="auto"
          item-text="display"
          item-value="code"
          dense
          return-object
        />
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
const treeData = ref({
  id1: {
    text: "text1",
    children: ["id11", "id12"]
  },
  id11: {
    text: "text11",
    children: ["id21", "id22"],
  },
  id12: {
    text: "text12",
  },
  id21: {
    text: "text21",
  },
  id22: {
    text: "text22",
  },
  id2: {
    text: "text2",
  },
})
let config = ref({
  roots: ["id1", "id2"]
})
const elements = ref([])
const skipFileds = ref(["id", "meta", "implicitRules", "language", "text", "contained", "modifierExtension"])
const loading = ref(false)
const fields = ref([])
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
  getTopField(node.id, node.parent)
}
function loadStructure() {
  fields.value = []
  config.value.roots = ["id1", "id2"]
  loading.value = true
  fetch("/fhir/StructureDefinition/" + props.id).then((response) => {
    response.json().then((structure) => {
      elements.value = structure.snapshot.element
      getTopField(structure.type)
      loading.value = false
    })
  })
}

function getTopField(base) {
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
      if(modId.length === 2) {
        let exist = fields.value.find((field) => {
          return element.id.startsWith(base + '.' + field + '.') || element.id.startsWith(base + '.' + field + ':') || element.id === base + '.' + field
        })
        if(exist) {
          continue
        }
        fields.value.push(modId[1])
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
      } else if(modId.length === 3 && !element.id.includes(":")) {
        let id = element.id.split(".")
        id.pop()
        id = id.join(".")
        getTopField(id)
      }
    }
  }
  // console.error(JSON.stringify(treeData, 0, 2));
  // getExtensionFields("Basic.extension:document.extension")
}

function getExtensionFields(base) {
  for(let element of elements.value) {
    if(!element.id.startsWith(base + ':')) {
      continue
    }
    let modId = element.id.replace(base + ":", "")
    if(modId.includes(".") || modId.includes(".")) {
      continue
    }
    console.error(element.id);
  }
}
</script>
