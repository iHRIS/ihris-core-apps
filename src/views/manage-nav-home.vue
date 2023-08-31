<template>
  <v-snackbar v-model="snackbar" timeout="2000">
    {{ snackbarText }}

    <template v-slot:action="{ attrs }">
      <v-btn
        :color="snackbarColor"
        text
        v-bind="attrs"
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
  <v-progress-linear
    v-if="isLoading"
    buffer-value="0"
    color="red lighten-2"
    stream
  ></v-progress-linear>
  <v-card v-else class="mx-8" elevation="1">
    <v-row class="mb-2">
      <v-col cols="6">
        <v-card-title align="center">Select Option To Update</v-card-title>
        <v-container fluid>
          <v-row
            align="end"
            justify="start"
          >
            <v-btn
              :disabled="isSaving"
              class="ml-12 mb-2"
              color="secondary"
              outlined
              @click="reload"
            >
              <v-icon class="mr-2" left>
                mdi-reload
              </v-icon>
              ReLoad
            </v-btn>
            <v-btn
              :disabled="isSaving"
              :download="filename"
              :href="downloadUrl"
              class="ml-12 mb-2"
              color="primary"
              depressed
              @click="downloadFSHFile"

            >
              <v-icon class="mr-2" left>
                mdi-download-outline
              </v-icon>
              Download FSH file
            </v-btn>
            <v-btn
              :disabled="isSaving"
              class="ml-12 mb-2"
              color="primary"
              depressed
              @click="onSave"
            >
              <v-icon class="mr-2" left>
                mdi-upload-outline
              </v-icon>
              Upload To FHIR Server
            </v-btn>
          </v-row>
        </v-container>
        <!--        <v-card-text>-->
        <!--          <pre>{{ JSON.stringify(this.config, null, 2) }}</pre>-->
        <!--        </v-card-text>-->
      </v-col>
      <v-col cols="6">
        <v-card-title align="center">Preview Generated Code</v-card-title>
        <v-container fluid>
          <v-row
            align="center"
            justify="center"
          >
            <v-switch v-model="showElement" color="primary" inset label="Preview Generated Code"></v-switch>
            <v-select
              v-if="showElement"
              v-model="selectedForPreview"
              :items="previewOptions"
              active
              dense
              density="compact"
              item-title="label"
              label="Preview The Result"
              return-object
              style="max-width: 50%"
              variant="outlined"
            ></v-select>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <div id="code">
      <v-progress-circular
        v-if="isSaving"
        :size="70"
        :width="8"
        color="primary"
        indeterminate

      ></v-progress-circular>
    </div>
    <div v-if="showElement && !isSaving" id="code">
      <view-code v-if="selectedForPreview.value === 'fsh'" :code="FSHCode.join('\n')"
                 :language="selectedForPreview.value"></view-code>
      <view-code v-if="selectedForPreview.value === 'json'" :code="JSON.stringify(this.bundle, null, 2)"
                 :language="selectedForPreview.value"></view-code>
    </div>
  </v-card>
</template>
<script>

import ViewCode from "../components/viewCode.vue";
import {ref} from 'vue';

export default {
  name: "manage-nav-home",
  components: {ViewCode},
  data() {
    return {
      isLoading: false,
      isSaving: false,
      turnOnPreview: true,
      selectedForPreview: {label: "FHIR FSH", value: "fsh"},
      previewOptions: [{label: "FHIR JSON", value: "json"}, {label: "FHIR FSH", value: "fsh"}],
      config: [],
      menus: [],
      FSHCode: [],
      bundle: {
        resourceType: "Bundle",
        type: "transaction",
        entry: [],
      },
      downloadUrl: '#',
      filename: '',
      pagesId: [],
      snackbarColor: "green",
      snackbarText: "",
      snackbar: false,
      questionnaireIds: [],
      allResource: []
    }
  },
  async created() {
    this.isLoading = true
    await this.fetchTaskResources();
    await this.updateConfig();
  },
  setup() {
    const showElement = ref(true);
    return {
      showElement,
    };
  },
  methods: {
    updateConfig: function () {
      return new Promise((resolve, reject) => {
        fetch("/auth").then(() => {
          fetch("/fhir/Parameters/ihris-config")
            .then((response) => {
              response
                .json()
                .then(async (data) => {
                  this.config = data.parameter.find(x => x.name === "config").part
                  let nav = this.config.filter(x => {
                    let menu = this.getMenu(x.name)
                    if (menu) {
                      return menu
                    }
                  })
                  const filteredNames = this.getMenuName(nav);
                  this.menus = this.filterMenu(filteredNames)
                  await this.getQuestionnaire()
                  await this.getPages();
                  this.generateFSHCode(this.menus)
                  this.generateFHIRResource(this.menus)
                  this.isLoading = false
                  return resolve();
                })
                .catch((err) => {
                  reject(err);
                });
            })
            .catch((err) => {
              reject(err);
            });
        });
      });
    },
    getMenu: function (str) {
      let regex = /site:nav:menu:(.*):text/;
      let match = str.match(regex);
      if (match) {
        return str;
      } else {
        return null;
      }
    },
    onSave: function () {
      console.log("to be saved",this.bundle)
      this.isSaving = true
      fetch("/taskAndRole/saveTask", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.bundle),
      }).then((response) => {
        if (response.status === 201) {
          this.isSaving = false;
          this.snackbarText = "Task Saved Success Fully!"
          this.snackbar = true;
        }
      }).catch(err => {
        this.isSaving = false
        this.snackbarText = "Unable to save the Tasks!"
        this.snackbarColor = "red"
        this.snackbar = true;
        console.log(err)
      });
    },
    reload: async function () {
      this.isLoading = true
      await this.updateConfig();
    },
    getMenuName: function (nav) {
      const regex = /menu:(.*):text/;
      return nav.map((x) => {
        const match = regex.exec(x.name);
        if (match) {
          return match[1];
        }
      });
    },
    findAndRemove: function (array, element) {
      let index = array.indexOf(element);
      if (index !== -1) {
        array.splice(index, 1);
      }
      return array;
    },
    filterMenu: function (menu) {
      let itemToBeRemoved = [];
      const instance = menu.map((x) => {
        // let returnData = {}
        //
        // let menuList = x.split(".");
        // let url = "";
        // for (const menu of menuList) {
        //   if (!url) {
        //     url += `site:nav:menu:${menu}`;
        //   } else {
        //     url += `:menu:${menu}`;
        //   }
        // }
        // url += ":url";
        //
        // let y = this.config.find(y => y.name === url)
        // // && !(y.name.includes("database"))
        // if (y && y.valueString.startsWith("/resource")) {
        //   returnData.url = y;
        // }
        //

        if (x.includes(":menu:")) {
          let parent = x.split(":menu:")[0];
          if (!itemToBeRemoved.includes(parent)) {
            itemToBeRemoved.push(parent);
          }
          // returnData.name = x.replaceAll(":menu:", ".", 10);
          // return x.replaceAll(":menu:", ".", 10);
        }
        // returnData.name = x
        return x;
      });
      // itemToBeRemoved.map((x) => this.findAndRemove(instance, x));
      return instance;
    },
    generateFSHCode: function (menus) {
      this.allResource.map(res => {
        let id = res.toLowerCase()
        let readInstance = `ihris-task-read-${id}-resource`
        let writeInstance = `ihris-task-write-${id}-resource`
        this.FSHCode.push(`
Instance:   ${readInstance}
InstanceOf:     IhrisTask
Title:          "iHRIS Task To Read ${res} resource"
Usage:          #example
* code = IhrisResourceCodeSystem#task
* extension[name].valueString = "read-${id}-resource"
* extension[attributes][0].extension[permission].valueCode = IhrisTaskPermissionCodeSystem#read
* extension[attributes][0].extension[resource].valueCode = IhrisTaskResourceCodeSystem#${res}
`)
        this.FSHCode.push(`
Instance:       ${writeInstance}
InstanceOf:     IhrisTask
Title:          "iHRIS Task To Write ${res} resource"
Usage:          #example
* code = IhrisResourceCodeSystem#task
* extension[name].valueString = "write-${id}-resource"
* extension[attributes][0].extension[permission].valueCode = IhrisTaskPermissionCodeSystem#write
* extension[attributes][0].extension[resource]..valueCode = IhrisTaskResourceCodeSystem#${res}
* extension[compositeTask][0].valueReference = Reference(Basic/${readInstance})`)
      })
      this.questionnaireIds.map(id => {
        this.FSHCode.push(`
Instance:       ihris-task-write-questionnaire-${id}
InstanceOf:     IhrisTask
Title:          "iHRIS Task To Write Questionnaire ${id}"
Usage:          #example
* code = IhrisResourceCodeSystem#task
* extension[name].valueString = "Write ${id} Questionnaire"
* extension[attributes][0].extension[permission].valueCode = IhrisTaskPermissionCodeSystem#write
* extension[attributes][0].extension[resource].valueCode = IhrisTaskResourceCodeSystem#Questionnaire
* extension[attributes][0].extension[instance].valueId = ${id}
`)
      })
      this.pagesId.map(page => {
        let title = page.id.split("ihris-page-").pop().replaceAll("-", " ").split(" ").map(y => y = y.charAt(0).toUpperCase() + y.slice(1)).join(" ")
        let fsh = `
Instance:       ihris-task-read-${page.id}
InstanceOf:     IhrisTask
Usage:          #example
Title:          "iHRIS Task To Read ${title} Page"
* code = IhrisResourceCodeSystem#task
* extension[name].valueString = "View ${title} Page"
* extension[attributes][0].extension[permission].valueCode = IhrisTaskPermissionCodeSystem#read
* extension[attributes][0].extension[resource].valueCode = IhrisTaskResourceCodeSystem#Basic
* extension[attributes][0].extension[instance].valueId = "${page.id}"`
        if (page.resource) {
          page.resource.map((x, index) => {
            fsh = fsh + "\n" + `* extension[compositeTask][${index}].valueReference = Reference(Basic/ihris-task-write-${x.toLowerCase()})`
          })
        }
        if (page.sections.length > 1) {
          page.sections.map(x => {
            let id =x.toLowerCase().replaceAll(" ", "-")
            console.log({x,id})
              this.FSHCode.push(`
Instance:       ihris-task-view-${id}-section
InstanceOf:     IhrisTask
Title:          "iHRIS Task To view ${x} Section"
Usage:          #example
* code = IhrisResourceCodeSystem#task
* extension[name].valueString = "View ${x} Section"
* extension[attributes][0].extension[permission].valueCode = IhrisTaskPermissionCodeSystem#special
* extension[attributes][0].extension[resource].valueCode = IhrisTaskResourceCodeSystem#section
* extension[attributes][0].extension[instance].valueId = ${x}
              `)
            }
          )
        }
        this.FSHCode.push(fsh)
      })
      menus.map(x => {
        let valueId = x
        let instance = x.replaceAll(".", "-").replaceAll("_", "-").replaceAll(":","-")
        let id = instance.replaceAll("_", "-")
        let tittle = x.includes(".") ? x.replaceAll(".", " ").replaceAll("-", " ").replaceAll("_", "-").split(" ").map(y => y = y.charAt(0).toUpperCase() + y.slice(1)).join(" ") : x.charAt(0).toUpperCase() + x.slice(1)
        let name = `View ${id.replaceAll("-", " ").split(" ").map(y => y = y.charAt(0).toUpperCase() + y.slice(1)).join(" ")} Menu`;

        console.log("check navigation",instance)
        this.FSHCode.push(`
Instance:       ihris-task-navigation-${instance}
InstanceOf:     IhrisTask
Usage:          #example
Title:          "iHRIS Task To Navigate to ${tittle}"
* code = IhrisResourceCodeSystem#task
* extension[name].valueString = "${name}"
* extension[attributes][0].extension[permission].valueCode = IhrisTaskPermissionCodeSystem#special
* extension[attributes][0].extension[resource].valueCode = IhrisTaskResourceCodeSystem#navigation
* extension[attributes][0].extension[instance].valueId = "${valueId}"
            `)
      })
    },
    generateFHIRResource: function (menus) {
      this.allResource.map(res => {
        let id = res.toLowerCase()
        let readInstance = `ihris-task-read-${id}-resource`
        let writeInstance = `ihris-task-write-${id}-resource`
        let dataRead = {
          resource:
            {
              "resourceType": "Basic",
              "meta": {
                "profile": ["http://ihris.org/fhir/StructureDefinition/ihris-task"]
              },
              "extension": [{
                "url": "http://ihris.org/fhir/StructureDefinition/ihris-basic-name",
                "valueString": `read-${id}-resource`
              }, {
                "url": "http://ihris.org/fhir/StructureDefinition/task-attributes",
                "extension": [{
                  "url": "permission",
                  "valueCode": "read"
                }, {
                  "url": "resource",
                  "valueCode": res
                }]
              }],
              "code": {
                "coding": [{
                  "system": "http://ihris.org/fhir/CodeSystem/ihris-resource-codesystem",
                  "code": "task"
                }]
              }
            },
          request: {
            method: "PUT",
            url: `Basic/${readInstance}`,
          },
        };
        let dataWrite = {
          resource:
            {
              "resourceType": "Basic",
              "meta": {
                "profile": ["http://ihris.org/fhir/StructureDefinition/ihris-task"]
              },
              "extension": [{
                "url": "http://ihris.org/fhir/StructureDefinition/ihris-basic-name",
                "valueString": `write-${id}-resource`
              }, {
                "url": "http://ihris.org/fhir/StructureDefinition/task-attributes",
                "extension": [{
                  "url": "permission",
                  "valueCode": "write"
                }, {
                  "url": "resource",
                  "valueCode": res
                }]
              }, {
                "url": "http://ihris.org/fhir/StructureDefinition/composite-task",
                "valueReference": {
                  "reference": `Basic/${readInstance}`
                }
              }],
              "code": {
                "coding": [{
                  "system": "http://ihris.org/fhir/CodeSystem/ihris-resource-codesystem",
                  "code": "task"
                }]
              }
            },
          request: {
            method: "PUT",
            url: `Basic/${writeInstance}`,
          },
        };
        this.bundle.entry.push(dataRead)
        this.bundle.entry.push(dataWrite)
      })
      this.pagesId.map(page => {
        let title = page.id.split("ihris-page-").pop().replaceAll("-", " ").split(" ").map(y => y = y.charAt(0).toUpperCase() + y.slice(1)).join(" ")
        let data = {
          resource: {
            resourceType: "Basic",
            meta: {
              profile: ["http://ihris.org/fhir/StructureDefinition/ihris-task"],
            },
            extension: [
              {
                url: "http://ihris.org/fhir/StructureDefinition/ihris-basic-name",
                valueString: `View ${title} Page`,
              },
              {
                url: "http://ihris.org/fhir/StructureDefinition/task-attributes",
                extension: [
                  {
                    url: "permission",
                    valueCode: "read",
                  },
                  {
                    url: "resource",
                    valueCode: "Basic",
                  },
                  {
                    url: "instance",
                    valueId: page.id,
                  },
                ],
              },
            ],
            code: {
              coding: [
                {
                  system:
                    "http://ihris.org/fhir/CodeSystem/ihris-resource-codesystem",
                  code: "task",
                },
              ],
            },
          },
          request: {
            method: "PUT",
            url: `Basic/ihris-task-read-${page.id}`,
          },
        };
        if (page.resource) {
          page.resource.map((x, index) => {
            let compositeTask = {
              "url": "http://ihris.org/fhir/StructureDefinition/composite-task",
              "valueReference": {
                "reference": `Basic/ihris-task-write-${x.toLowerCase()}-resource`
              }
            }
            data.resource.extension.push(compositeTask)
          })
        }
        this.bundle.entry.push(data)
        if (page.sections.length > 1) {
          page.sections.map(x => {
              let sectionData = {
                resource: {
                  resourceType: "Basic",
                  meta: {
                    profile: ["http://ihris.org/fhir/StructureDefinition/ihris-task"],
                  },
                  extension: [
                    {
                      url: "http://ihris.org/fhir/StructureDefinition/ihris-basic-name",
                      valueString: `View ${x} Section`,
                    },
                    {
                      url: "http://ihris.org/fhir/StructureDefinition/task-attributes",
                      extension: [
                        {
                          url: "permission",
                          valueCode: "special",
                        },
                        {
                          url: "resource",
                          valueCode: "section",
                        },
                        {
                          url: "instance",
                          valueId: x,
                        },
                      ],
                    },
                  ],
                  code: {
                    coding: [
                      {
                        system:
                          "http://ihris.org/fhir/CodeSystem/ihris-resource-codesystem",
                        code: "task",
                      },
                    ],
                  },
                },
                request: {
                  method: "PUT",
                  url: `Basic/ihris-task-view-${x.toLowerCase().replaceAll(" ", "-")}-section`,
                },
              };
              this.bundle.entry.push(sectionData)
            }
          )
        }
      })
      menus.map((x) => {
        let valueId = x
        let instance =  x.replaceAll(".", "-").replaceAll("_", "-").replaceAll(":","-")
        let id = instance.replaceAll("_", "-");
        console.log({instance,id})
        let tittle = x.includes(".")
          ? x
            .replaceAll(".", " ")
            .replaceAll("-", " ")
            .replaceAll("_", "-")
            .split(" ")
            .map((y) => (y = y.charAt(0).toUpperCase() + y.slice(1)))
            .join(" ")
          : x.charAt(0).toUpperCase() + x.slice(1);
        let name = `View ${id.replaceAll("-", " ").split(" ").map(y => y = y.charAt(0).toUpperCase() + y.slice(1)).join(" ")} Menu`;
        let data = {
          resource: {
            resourceType: "Basic",
            id: `ihris-task-navigation-${instance}`,
            meta: {
              profile: ["http://ihris.org/fhir/StructureDefinition/ihris-task"],
            },
            code: {
              coding: [
                {
                  code: "task",
                  system:
                    "http://ihris.org/fhir/CodeSystem/ihris-resource-codesystem",
                },
              ],
            },
            extension: [
              {
                url: "http://ihris.org/fhir/StructureDefinition/ihris-basic-name",
                valueString: name,
              },
              {
                extension: [
                  {
                    url: "permission",
                    valueCode: "special",
                  },
                  {
                    url: "resource",
                    valueCode: "navigation",
                  },
                  {
                    url: "instance",
                    valueId: valueId,
                  },
                ],
                url: "http://ihris.org/fhir/StructureDefinition/task-attributes",
              },
            ],
          },
          request: {
            method: "PUT",
            url: `Basic/ihris-task-navigation-${instance}`,
          },
        };
        this.bundle.entry.push(data)
      });
    },
    downloadFSHFile: function () {
      const fshData = encodeURIComponent(this.FSHCode.join("\n"))
      this.downloadUrl = `data:text/plain;charset=utf-8,${fshData}`
      this.filename = 'example.fsh'
    },
    getPages: async function () {
      let _profile = "http://ihris.org/fhir/StructureDefinition/ihris-page"
      let url = `/fhir/Basic?_profile=${_profile}&_count=1000`
      let response = await fetch(url)
      if (response.ok) {
        let data = await response.json()
        this.pagesId = await Promise.all(data.entry.map(async x => {
          let resource = []
          let sections = x.resource.extension.filter(
            (x) => x.url === "http://ihris.org/fhir/StructureDefinition/ihris-page-section"
          ).map(x => x.extension.find(y => y.url === "name")?.valueString)
          let a = x.resource.extension
            .find(
              (y) =>
                y.url === "http://ihris.org/fhir/StructureDefinition/ihris-page-display"
            )
            .extension.find((e) => e.url === "resource").valueReference.reference;
          if (a.startsWith("CodeSystem")) {
            resource.push("CodeSystem", "ValueSet");
          } else {
            let data = await this.getResource(a)
            if (data) {
              resource.push(data.type);
            }
            if (data.reference) {
              resource.push(...data.reference);
            }
          }
          return {
            id: x.resource.id,
            resource:[...new Set(resource)],
            sections
          }
        }))
      }
    },
    getResource: async function (val) {
      let returnData = {}
      let [resType, id] = val.split("/");
      let url = `/fhir/${resType}/${id}`;
      let response = await fetch(url)
      let data = await response.json()
      returnData.type = data.type
      let reference = data.differential.element.filter(x => {
        if (x?.type?.[0].code === "Reference") {
          return true
        }
      })
      let allReference = []
      let profile = reference.map(x => x.type[0].targetProfile[0])
      allReference = [...allReference, ...profile]
      let valueSetAll = data.differential.element.filter(x => {
        if (x?.binding?.valueSet) {
          return true
        }
      })
      let valueSet = valueSetAll.map(x => x.binding.valueSet)

      allReference = [...allReference, ...valueSet]
      let referenceResource = []
      if (allReference.length > 0) {
        referenceResource = await Promise.all(allReference.map(async x => {
          let [resType, id] = x.split('/').slice(-2)
          let url = `/fhir/${resType}/${id}`;
          let response = await fetch(url)
          if (response.ok) {
            let data = await response.json()
            if (data.type) {
              return data.type
            }
            if (resType === "ValueSet") {
              return resType
            }
          }
        }))
      }
      const filteredArray = referenceResource.filter((element) => element != null);
      let allRelatedResource = data.snapshot.element.filter(x => x?.type?.[0].code === "Reference").map(x => x?.type?.[0].targetProfile?.[0].split("/").pop()).filter(x => (x !== undefined && x !== "Resource" && x !== "Endpoint"))
      for (const res of allRelatedResource) {
        if (this.allResource.includes(res)) {
          filteredArray.push(res)
        } else {
          try {
            let response = await fetch(`/fhir/StructureDefinition/${res}`)
            let data = await response.json()
            if (data.resourceType === "StructureDefinition") {
              filteredArray.push(data.type)
            }
          } catch (e) {
            console.log(e)
          }
        }
      }
      let newUniqResource = Array.from(new Set(filteredArray));
      if (newUniqResource.length > 0) {
        returnData.reference = newUniqResource
      }
      return returnData;
    },
    getQuestionnaire: async function () {
      let _profile = "http://ihris.org/fhir/StructureDefinition/ihris-questionnaire"
      let url = `/fhir/Questionnaire?_profile=${_profile}&_count=1000`
      let response = await fetch(url)
      if (response.ok) {
        let data = await response.json()
        this.questionnaireIds = data.entry.map(x => x.resource.id)
      }
    },
    fetchTaskResources: async function () {
      let url = `/fhir/CodeSystem/ihris-task-resource`;
      let response = await fetch(url)
      let data = await response.json()
      this.allResource = undefined
      this.allResource = data.concept.map(x => x.code).filter(x => x !== "*")
    }
  }
}
</script>

<style scoped>
#code {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 16px;
}
</style>
