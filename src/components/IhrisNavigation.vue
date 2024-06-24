<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="mini"
    permanent
    color="#0d3552"
    class="primary text-white font-weight-bold"
    style="z-index: 3"
    @click="minimizeDrawer"
    v-if="$store.state.user.loggedin"
  >
    <v-list-item class="px-2 py-2">
      <template v-slot:prepend>
        <v-icon
          style="cursor: pointer"
          size="48"
          class="text-white"
          icon="mdi-account-circle"
        ></v-icon>
      </template>
      <template v-slot:append>
        <v-icon
          @click.stop="minimizeDrawer"
          class="text-white"
          icon="mdi-chevron-left"
        ></v-icon>
      </template>
      <v-list-item-title class="text-white">
        {{ $store.state.user.name }}
      </v-list-item-title>
      <v-list-item-subtitle class="text-white">
        {{ $store.state.user.role }}
      </v-list-item-subtitle>
    </v-list-item>
    <v-divider class="grey"></v-divider>
    <v-list
      nav
      density="compact"
      v-if="$store.state.user.loggedin"
      :opened="open"
    >
      <template v-for="item in menu">
        <template v-if="item.menu">
          <v-list-group
            :value="item.id"
            @click.stop="deactivate(menu, item, 'parent')"
            :key="item.id"
            :id="item.id"
            :prepend-icon="item.icon"
            v-model="item.title"
            :class="
              item.active && !mini
                ? 'primary pa-3'
                : item.active && mini
                ? 'primary'
                : ''
            "
            no-action
            style="border-radius: 20px"
          >
            <template v-slot:activator="{ props }">
              <v-list-item
                class="subtitle-1 font-weight-bold text-uppercase"
                v-bind="props"
              >
                {{ $t(`App.menu.${item.text}`) }}
              </v-list-item>
            </template>
            <v-list-item
              @click.stop="deactivate(menu, item, 'child')"
              v-for="sub in item.menu"
              :key="sub.id"
              :href="sub.url"
              :value="sub.text + item.id"
              class="text-right"
              density="compact"
              append-icon="mdi-chevron-right"
            >
              <v-list-item-title>
                {{ $t(`App.menu.${sub.text}`) }}
              </v-list-item-title>
            </v-list-item>
          </v-list-group>
        </template>
        <template v-else>
          <v-list-item
            @click.stop="deactivate(menu, item)"
            :href="item.url"
            :key="item.id"
            :value="item.id + item.text"
            class="text-white subtitle-1 font-weight-bold text-uppercase"
          >
            <template v-slot:prepend>
              <v-icon
                @click.stop="deactivate(menu, item)"
                color="white"
                :icon="item.icon"
              ></v-icon>
            </template>
            {{ $t(`App.menu.${item.text}`) }}
          </v-list-item>
        </template>
      </template>
    </v-list>
    <v-list nav dark class="primary lighten-1" dense v-else>
      <v-list-item v-for="auth in nav.auths" :key="auth.id">
        <v-list-item-title>
          <auth-button
            :big="true"
            :data="auth"
            v-on:loggedin="$emit('loggedin', $event)"
          ></auth-button>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import AuthButton from "./auth-button.vue";

export default {
  name: "the-navigation",
  props: ["nav"],
  components: {
    AuthButton,
  },
  mounted: function () {
    this.updateMenu();
  },
  watch: {
    nav: {
      handler() {
        this.updateMenu();
      },
      deep: true,
    },
  },
  data: function () {
    return {
      menu: [],
      mini: false,
      drawer: true,
      open: [],
      lastOpen: "",
    };
  },
  methods: {
    minimizeDrawer() {
      if (this.mini === false) {
        if (this.open.length > 0) {
          this.lastOpen = this.open[0];
        } else {
          this.lastOpen = "";
        }
        this.open = [];
      } else if (this.mini) {
        if (this.lastOpen) {
          this.open.push(this.lastOpen);
        }
      }
      this.mini = !this.mini;
    },
    deactivate(menu, activeItem, type) {
      if (type === "child") {
        return;
      }
      if (this.mini) {
        this.mini = false;
        if (activeItem.active) {
          return;
        }
      }
      if (activeItem.active === false) {
        for (let item of menu) {
          if (item.id !== activeItem.id && item.active) {
            item.active = false;
          }
        }
      }
      this.open = [activeItem.id];
      if (activeItem.active === true) {
        activeItem.active = false;
        this.open = [];
      } else {
        activeItem.active = true;
      }
    },
    updateMenu: function () {
      this.menu = [];
      for (let menu_id of Object.keys(this.nav.menu)) {
        let entry = {};
        entry = {
          id: menu_id,
          text: this.nav.menu[menu_id].text,
          icon: this.nav.menu[menu_id].icon,
          order: this.nav.menu[menu_id].order,
        };
        if (this.nav.active === menu_id) {
          if (!this.mini) {
            this.open.push(menu_id);
          } else {
            this.lastOpen = menu_id;
          }
          entry.active = true;
        } else {
          entry.active = false;
        }
        if (this.nav.menu[menu_id].menu) {
          entry.menu = [];
          for (let sub_id of Object.keys(this.nav.menu[menu_id].menu)) {
            let sub = {
              id: sub_id,
              text: this.nav.menu[menu_id].menu[sub_id].text,
              url:
                this.$store.state.coreURL +
                this.nav.menu[menu_id].menu[sub_id].url,
              order: this.nav.menu[menu_id].menu[sub_id].order,
            };
            entry.menu.push(sub);
            entry.menu.sort((a, b) =>
              a.text === b.text ? 0 : a.text < b.text ? -1 : 1
            );
            //entry.menu.sort( (a,b) => Number(a.order) === Number(b.order) ? 0 : ( Number(a.order) < Number(b.order) ? -1 : 1 ) )
          }
        } else if (this.nav.menu[menu_id].url) {
          entry.url = this.nav.menu[menu_id].url;
        }
        this.menu.push(entry);
      }

      this.menu.sort((a, b) =>
        Number(a.order) === Number(b.order)
          ? 0
          : Number(a.order) < Number(b.order)
          ? -1
          : 1
      );
    },
  },
  created() {
    this.minimizeDrawer();
  },
};
</script>
<style scoped>
.v-application .primary {
  background-color: #0d3552 !important;
  border-color: var(--v-primary-base) !important;
}
.v-application .primary.darken-2 {
  background-color: #00000000 !important;
  border-color: #000000 !important;
}
</style>
