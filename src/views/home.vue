<template>
  <v-card color="basil">
    <v-card-title class="text-center justify-center py-6">
      <h1 class="font-weight-bold text-h5 text-basil">
        <p class="pt-4">
          <v-icon class="mr-2" color="primary">mdi-account-cog-outline</v-icon>
          Navigation and Permission Manager App
        </p>
        <v-divider class="my-2"></v-divider>
      </h1>
    </v-card-title>
    <v-tabs
      v-model="tab"
      bg-color="transparent"
      color="basil"
      grow
    >
      <v-tab
        v-for="item in items"
        :key="item"
        :value="item"
      >
        {{ item }}
      </v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <v-window-item
        v-for="item in items"
        :key="item"
        :value="item"
      >
        <v-card
          color="basil"
          flat
        >
          <v-card-text v-if="item==='Manage Tasks And Permission'">
            <manage-nav-home></manage-nav-home>
          </v-card-text>
          <v-card-text v-if="item==='Manage Role'">
            <manage-role></manage-role>
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>
  </v-card>
</template>
<script>
import ManageNavHome from "./manage-nav-home.vue";
import ManageRole from "./manage-role.vue";

export default {
  components: {ManageRole, ManageNavHome},
  data() {
    return {
      tab: 'Manage Tasks And Permission',
      items: [
        'Manage Tasks And Permission', 'Manage Role',
      ]
    }
  },
}
</script>
<style>
/* Helper classes */
.text-basil {
  color: #356859 !important;
}
</style>
