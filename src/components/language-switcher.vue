<template>
  <v-menu class="ma-8" v-model="languageMenu" location="bottom">
    <template v-slot:activator="{ props }">
      <v-btn class="text-capitalize" v-bind="props">
        <v-icon icon="mdi-web"></v-icon>
        {{ activeLang }}
        <v-icon size="small" location="right">mdi-menu-down</v-icon>
      </v-btn>
    </template>
    <v-list dense>
      <v-list-item
        v-for="(lang, index) in languages"
        :key="index"
        @click="handleMenuItemClick(lang)"
      >
        <v-list-item-title>{{ lang.language }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { loadLanguage } from "../i18n";
// import { eventBus } from "../main";
export default {
  data() {
    return {
      languages: [],
      activeLang: "English",
      activeFlag: "en",
      dialog: false,
      languageMenu: false,
    };
  },
  created() {
    this.getLanguageList();
    // eventBus.$on("getLanguageList", () => {
    //   this.getLanguageList();
    // });
  },
  methods: {
    handleMenuItemClick(lang) {
      loadLanguage(lang.locale);
      localStorage.setItem("activeLang", lang.language);
      localStorage.setItem("activeFlag", lang.flag);
      localStorage.setItem("activeLocale", lang.locale);
      this.activeLang = lang.language;
      this.activeFlag = lang.flag;
    },
    getLanguageList() {
      fetch("/translator/getTranslatedLanguages").then((data) => {
        data.json().then((response) => {
          this.languages = response;
          this.languages.sort((a, b) => {
            if (a.language < b.language) {
              return -1;
            }
            if (a.language > b.language) {
              return 1;
            }
            return 0;
          });
          const activeLocale =
            localStorage.getItem("activeLocale") || this.$i18n.locale || "en";
          const activeLanguage = this.languages.find((lang) => {
            return lang.locale === activeLocale;
          });
          this.$i18n.locale = activeLanguage.locale;
          this.activeLang = activeLanguage.language;
          this.$loadLanguage(activeLanguage.locale || "en");
        });
      });
    },
  },
};
</script>
