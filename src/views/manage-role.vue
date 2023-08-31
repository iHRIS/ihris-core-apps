<template>
  <v-card class="mx-8" elevation="0">
    <!-- to edit -->
    <v-container v-if="!create && edit" style="max-width: 1500px">
      <div v-if="loading" style="text-align: center">
        <v-progress-circular
          :size="50"
          :width="4"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </div>
      <v-card v-else>
        <v-card-title
          class="font-light"
          style="display: inline-block; width: 100%"
        >
        <span class="float-left text-left"
        ><v-icon>mdi-account-cog</v-icon> Edit
          {{ this.selectedToEdit.name }} Role</span
        >
          <span class="float-right text-right">
          <v-btn
            class="mr-2"
            color="primary"
            elevation="3"
            @click="
              () => {
                this.edit = false;
                this.create = false;
              }
            "
          >
            cancel
          </v-btn>
          <v-btn
            :disabled="!valid || this.editTask.length == 0"
            color="primary"
            elevation="3"
            @click="onUpdate()"
          >
            Save
          </v-btn>
        </span>
        </v-card-title>
        <v-spacer></v-spacer>
        <v-divider class="mx-0" horizontal></v-divider>
        <v-row no-gutters>
          <v-col cols="4">
            <v-card-title style="text-align: center; background-color: #569fd3; font-size: 20px">Role</v-card-title>
            <v-col>
              <ul>
                <li style="display: inline-block; width: 100%">
                  <v-form v-model="valid">
                    <v-text-field
                      v-model="editName"
                      :rules="[rules.required]"
                      class="mb-4"
                      density="compact"
                      label="Role Name"
                      placeholder="Role Name"
                      variant="outlined"
                    ></v-text-field>
                    <v-select
                      v-model="editSubRole"
                      :items="roleList"
                      chips
                      clearable
                      density="compact"
                      item-title="name"
                      item-value="id"
                      label="Select Role"
                      multiple
                      variant="outlined"
                    ></v-select>
                    <v-switch
                      v-model="editIsActive"
                      label="Is Role Primary"
                    ></v-switch>
                  </v-form>
                </li>
              </ul>
            </v-col>
          </v-col>
          <v-divider class="mx-0 bg-teal-600" vertical></v-divider>
          <v-col
          >
            <v-card-title style="text-align: center; background-color: #569fd3; font-size: 20px">Task/Permissions
            </v-card-title>
            <v-container class="px-6">
              <v-card-title>
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="search"
                  append-inner-icon="mdi-magnify"
                  density="compact"
                  hide-details
                  label="Search"
                  single-line
                  variant="outlined"
                ></v-text-field>
              </v-card-title>
              <v-data-table
                v-model="editTask"
                :headers="headersCreateRole"
                :items="permissionList"
                :search="search"
                class="elevation-1"
                item-key="id"
                show-select
              >
              </v-data-table>
            </v-container>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
    <!-- to create -->
    <v-container v-else-if="create && !edit" style="max-width: 1500px">
      <div v-if="loading" style="text-align: center">
        <v-progress-circular
          :size="50"
          :width="4"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </div>
      <v-card v-else>
        <v-card-title
          class="font-light"
          style="display: inline-block; width: 100%"
        >
        <span class="float-left text-left"
        ><v-icon class="mr-2">mdi-account-cog</v-icon>Create Role</span>
          <span class="float-right text-right">
          <v-btn
            class="mr-2"
            color="primary"
            elevation="3"
            @click="
              () => {
                this.create = false;
              }
            "
          >
            cancel
          </v-btn>
          <v-btn
            :disabled="!valid || this.selected.length == 0"
            color="primary"
            elevation="3"
            @click="onSave()"
          >
            Save
          </v-btn>
        </span>
        </v-card-title>
        <v-spacer></v-spacer>
        <v-divider class="mx-0" horizontal></v-divider>
        <v-row no-gutters>
          <v-col cols="4">
            <v-card-title style="text-align: center; background-color: #569fd3; font-size: 20px">Role</v-card-title>
            <v-col>
              <ul>
                <li style="display: inline-block; width: 100%">
                  <v-form v-model="valid">
                    <v-text-field
                      v-model="roleName"
                      :rules="[rules.required]"
                      class="mb-4"
                      density="compact"
                      hide-details
                      label="Role Name"
                      placeholder="Role Name"
                      variant="outlined"
                    ></v-text-field>
                    <v-select
                      v-model="selectedRoles"
                      :items="roleList"
                      chips
                      clearable
                      density="compact"
                      item-title="name"
                      item-value="id"
                      label="Select Role"
                      multiple
                      variant="outlined"
                    ></v-select>
                    <v-switch
                      v-model="isActive"
                      label="Is Role Primary"
                    ></v-switch>
                  </v-form>
                </li>
              </ul>
            </v-col>
          </v-col>
          <v-divider class="mx-0 bg-teal-600" vertical></v-divider>
          <v-col>
            <v-card-title style="text-align: center; background-color: #569fd3; font-size: 20px">Task/Permissions
            </v-card-title>
            <v-container class="px-6">
              <v-card-title>
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="search"
                  append-inner-icon="mdi-magnify"
                  density="compact"
                  hide-details
                  label="Search"
                  single-line
                  variant="outlined"
                ></v-text-field>
              </v-card-title>
              <v-data-table
                v-model="selected"
                :headers="headersCreateRole"
                :items="permissionList"
                :search="search"
                class="elevation-1"
                item-value="id"
                show-select
              >
              </v-data-table>
            </v-container>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
    <!-- to view -->
    <v-container v-else-if="!edit && !create">
      <div v-if="loading" style="text-align: center">
        <v-progress-circular
          :size="50"
          :width="4"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </div>
      <v-card v-else>
        <v-card-title
          class="font-light"
          style="display: inline-block; width: 100%"
        >
        <span class="float-left text-left"
        ><v-icon class="mr-2">mdi-account-cog</v-icon>Roles</span
        >
          <span class="float-right text-right">
          <v-btn
            color="primary"
            elevation="3"
            @click="
              () => {
                this.create = true;
                this.edit = false;
              }
            "
          >
            Create Custom Roles
          </v-btn>
        </span>
        </v-card-title>
        <v-spacer></v-spacer>
        <v-divider class="mx-0" horizontal></v-divider>
        <v-row no-gutters>
          <v-col>
            <v-container class="px-6">
              <v-card-title>
                <th></th>
                <v-spacer></v-spacer>
                <v-row>
                  <v-col></v-col>
                  <v-col
                    cols="12"
                    sm="6"
                  >
                    <v-text-field
                      v-model="search"
                      append-inner-icon="mdi-magnify"
                      density="compact"
                      hide-details
                      label="Search"
                      single-line
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-title>
              <v-data-table
                v-model:expanded="expandedRole"
                :headers="headers"
                :items="roleList"
                :search="search"
                class="elevation-1 mx-12 px-8"
                item-value="name"
                show-expand
                style="font-size: medium;"
              >
                <template v-slot:item.actions="{ item }">
                  <v-btn color="info" prepend-icon="mdi-pencil" rounded="md" variant="elevated"
                         @click="editItem(item)">
                    Edit
                  </v-btn>
                </template>
                <template v-slot:expanded-row="{ columns, item }">
                  <v-container>
                    <p class="text-subtitle-2 text-center">Assigned Tasks to <strong>{{ item.raw.name }}</strong></p>
                    <v-list class="column_wrapper">
                      <v-list-item v-for="item in item.raw.assignedTask" :key="item">
                        <template v-slot:prepend>
                          <v-icon color="green">mdi-checkbox-multiple-marked-circle-outline</v-icon>
                        </template>
                        <v-list-item-title>{{ item }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-container>
                </template>
              </v-data-table>
            </v-container>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </v-card>
</template>
<script>
import querystring from "querystring"

export default {
  name: "manage-role",
  data() {
    return {
      expandedRole: [],
      create: false,
      edit: false,
      valid: false,
      loading: false,
      search: "",
      singleSelect: true,
      selected: [],
      isActive: false,
      roleName: "",
      rules: {
        required: (value) => !!value || "Required.",
      },
      headers: [
        {
          title: "Role Name",
          sortable: true,
          key: "name",
        },
        {
          title: "Actions",
          align: "center",
          sortable: false,
          key: "actions",
        },
      ],
      headersCreateRole: [
        {
          title: "Role Name",
          sortable: true,
          key: "name",
        }
      ],
      permissionList: [],
      roleList: [],
      selectedToEdit: null,
      editName: "",
      editIsActive: undefined,
      editTask: [],
      editSubRole: undefined,
      selectedRoles: undefined,
      editResource:undefined
    };
  },
  async beforeMount() {
    await this.fetchUserTask();
    await this.fetchUserRole();
  },
  methods: {
    async fetchUserTask() {
      const response = await fetch(`/fhir/Basic/?_profile=http://ihris.org/fhir/StructureDefinition/ihris-task&_count=5000`);
      const data = await response.json();
      let subTasks = [];
      // data.extension.map((d) => {
      //   if (
      //     d.url === "http://ihris.org/fhir/StructureDefinition/composite-task"
      //   ) {
      //     subTasks.push(d.valueReference.reference.split("/").pop());
      //   }
      // });
      data.entry.map(({resource}) => {
        let name = resource.extension.find(
          (d) =>
            d.url ===
            "http://ihris.org/fhir/StructureDefinition/ihris-basic-name"
        ).valueString;
        this.permissionList.push({id: resource.id, name: name, subTasks});
      })

      // let name = data.extension.find(
      //   (d) =>
      //     d.url ===
      //     "http://ihris.org/fhir/StructureDefinition/ihris-basic-name"
      // ).valueString;
      this.permissionList.push({id: data.id, name: name, subTasks});
    },
    async fetchUserRole() {
      let params = {
        _profile: "http://ihris.org/fhir/StructureDefinition/ihris-role",
        _count: 1000,
      };
      let url = "/fhir/Basic?_sort=name" + "&" + querystring.stringify(params);
      return new Promise((resolve) => {
        fetch(url)
          .then((response) => {
            if (response.ok) {
              response
                .json()
                .then((data) => {
                  if (data?.entry?.length > 0) {
                    data.entry.map((d) => {
                      let name = d.resource.extension.find(
                        (d) =>
                          d.url ===
                          "http://ihris.org/fhir/StructureDefinition/ihris-basic-name"
                      )?.valueString;
                      let assignedTask = d.resource.extension.filter(x => x.url === "http://ihris.org/fhir/StructureDefinition/ihris-assign-task").map(task => task.valueReference.reference
                        .split("/").pop());
                      this.roleList.push({id: d.resource.id, name, assignedTask});
                    });
                  }
                  resolve();
                })
                .catch((err) => {
                  console.log("failed fetch facility", url, err);
                  resolve();
                });
            } else {
              resolve();
            }
          })
          .catch((err) => {
            console.log("failed fetch facility", url, err);
            resolve();
          });
      });
    },
    onSave() {
      return new Promise((resolve) => {
        let resource = {
          "resourceType": "Basic",
          "meta": {
            "profile": [
              "http://ihris.org/fhir/StructureDefinition/ihris-role"
            ]
          },
          "extension": [
            {
              "url": "http://ihris.org/fhir/StructureDefinition/ihris-basic-name",
              "valueString": this.roleName
            },
            {
              "url": "http://ihris.org/fhir/StructureDefinition/ihris-role-primary",
              "valueBoolean": this.isActive
            }
          ],
          "code": {
            "coding": [
              {
                "system": "http://ihris.org/fhir/CodeSystem/ihris-resource-codesystem",
                "code": "role"
              }
            ]
          }
        }
        for (let task of this.selected) {
          resource.extension.push({
            "url": "http://ihris.org/fhir/StructureDefinition/ihris-assign-task",
            "valueReference": {
              "reference": `Basic/${task}`
            }
          })
        }
        for (const role of this.selectedRoles) {
          resource.extension.push({
            "url": "http://ihris.org/fhir/StructureDefinition/ihris-assign-role",
            "valueReference": {
              "reference": `Basic/${role}`
            }
          })
        }
        fetch("/taskAndRole/saveRole", {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(resource),
        }).then(async (response) => {
          if (response.status === 201) {
            this.$store.commit("setMessage", {
              type: "success",
              text: "Role Added successfully.",
            });
            this.create = false;
            this.roleList = []
            await this.fetchUserRole();
          }
        }).catch(err => {
          this.$store.commit("setMessage", {
            type: "error",
            text: "Role could not be added.",
          });
          console.log(err)
        });
        resolve();
      });
    },
    editItem(item) {
      this.edit = true;
      let id = item.props.title.id
      this.selectedToEdit = item;
      let url = `/fhir/Basic/${id}`;
      return new Promise((resolve) => {
        fetch(url)
          .then((response) => {
            if (response.ok) {
              response
                .json()
                .then((data) => {
                  let resource = data;
                  this.editResource = data;
                  this.editName = resource.extension.find(x => x.url === "http://ihris.org/fhir/StructureDefinition/ihris-basic-name")?.valueString;
                  this.editIsActive = resource.extension.find(x => x.url === "http://ihris.org/fhir/StructureDefinition/ihris-role-primary")?.valueBoolean
                  this.editTask = resource.extension.filter(x => x.url === "http://ihris.org/fhir/StructureDefinition/ihris-assign-task").map(x => x.valueReference.reference.split("/").pop())
                  this.editSubRole = resource.extension.filter(x => x.url === "http://ihris.org/fhir/StructureDefinition/ihris-assign-role").map(x => x.valueReference.reference.split("/").pop())
                  this.permissionList.sort((a, b) => {
                    const indexA = this.editTask.indexOf(a.id);
                    const indexB = this.editTask.indexOf(b.id);
                    return indexB - indexA;
                  });
                  resolve();
                })
                .catch((err) => {
                  console.log("failed fetch facility", url, err);
                  resolve();
                });
            } else {
              resolve();
            }
          })
          .catch((err) => {
            console.log("failed fetch facility", url, err);
            resolve();
          });
      });
    },
    onUpdate() {
      return new Promise((resolve) => {
        let name = this.editResource.extension.find(x => x.url === "http://ihris.org/fhir/StructureDefinition/ihris-basic-name")
        name.valueString = this.editName;

        let isPrimary = this.editResource.extension.find(x => x.url === "http://ihris.org/fhir/StructureDefinition/ihris-role-primary")
        isPrimary.valueBoolean = this.editIsActive

        let indexes = [];

        this.editResource.extension.forEach((ext, index) => {
          if (ext.url === "http://ihris.org/fhir/StructureDefinition/ihris-assign-task") {
            indexes.push(index);
          }
        });
        this.editResource.extension.forEach((ext, index) => {
          if (ext.url === "http://ihris.org/fhir/StructureDefinition/ihris-assign-role") {
            indexes.push(index);
          }
        });

        indexes.reverse().forEach(index => {
          this.editResource.extension.splice(index, 1);
        });

        for (let task of this.editTask) {
           this.editResource.extension.push({
            "url": "http://ihris.org/fhir/StructureDefinition/ihris-assign-task",
            "valueReference": {
              "reference": `Basic/${task}`
            }
          })
        }
        for (const role of this.editSubRole) {
           this.editResource.extension.push({
            "url": "http://ihris.org/fhir/StructureDefinition/ihris-assign-role",
            "valueReference": {
              "reference": `Basic/${role}`
            }
          })
        }

        for (let key in this.editResource.meta) {
          if (key !== "profile") {
            delete this.editResource.meta[key];
          }
        }
        fetch("/taskAndRole/updateRole", {
          method: "PUT",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.editResource),
        }).then(async (response) => {
          if (response.status === 201) {
            this.$store.commit("setMessage", {
              type: "success",
              text: "Role Updated successfully.",
            });
            this.edit = false;

            this.roleList = []
             await this.fetchUserRole();
          }
        }).catch(err => {
          this.$store.commit("setMessage", {
            type: "error",
            text: "Role could not be updated!.",
          });
          console.log(err)
        });
        resolve();
      });
    },
  },
  watch: {
    create: function () {
      this.search = "";
    },
    edit: function () {
      this.search = "";
    },
  },
};
</script>
<style scoped>
.custom-label input:checked + svg {
  display: block !important;
}

.column_wrapper {
  column-count: 3;
}


</style>
