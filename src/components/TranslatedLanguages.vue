<template>
  <div class="home">
    <v-snackbar
      v-model="snackbar"
      timeout="2000"
    >
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
    <v-dialog
      transition="dialog-top-transition"
      max-width="600"
      v-model="addDialog"
    >
      <template v-slot:default="dialog">
        <v-card>
          <v-toolbar
            color="primary"
            dark
          >Select Language</v-toolbar>
          <v-card-text>
            <div class="text-h6">
              <v-autocomplete
                v-model="language"
                :items="languages"
                item-value="locale"
                item-text="name"
                dense
                filled
                label="Languages"
              ></v-autocomplete>
            </div>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn
              text
              @click="dialog.value = false"
            >
              <v-icon>mdi-close</v-icon>
              Close
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="!language"
              text
              @click="add"
            >
              <v-icon>mdi-plus</v-icon>
              Add
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
    <center>
      <v-card
        class="mx-auto"
        max-width="300"
        tile
      >
        <v-app-bar
          dark
          color="primary"
        >
          <v-icon>mdi-google-translate</v-icon>
          <v-spacer></v-spacer>
          <v-toolbar-title>Available Translations</v-toolbar-title>
        </v-app-bar>
        <v-card-title primary-title>
          Select to view
          <v-spacer></v-spacer>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="mx-2"
                fab
                dark
                color="indigo"
                small
                @click="getLanguages"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <span>Add New Language</span>
          </v-tooltip>
        </v-card-title>
        <v-list shaped>
          <v-list-item-group
            v-model="selectedLocale"
            color="primary"
          >
            <v-list-item
              v-for="(lang, i) in translatedLanguages"
              :key="i"
            >
              <v-list-item-content>
                <v-list-item-title v-text="lang.language" @click="selected(lang)"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <v-card-actions>

        </v-card-actions>
      </v-card>
    </center>
  </div>
</template>

<script>
export default {
  data () {
    return {
      snackbarColor: 'green',
      snackbarText: '',
      snackbar: false,
      addDialog: false,
      translatedLanguages: [],
      selectedLocale: '',
      languages: [],
      language: ''
    }
  },
  methods: {
    getTranslatedLanguages () {
      fetch('/dictionary/getTranslatedLanguages').then((response) => {
        response.json().then(lang => {
          this.translatedLanguages = lang
        })
      }).catch(err => {
        console.log(err)
      })
    },
    selected (lang) {
      this.$router.push({
        path: '/review/' + lang.locale
      })
    },
    getLanguages () {
      this.addDialog = true
      fetch('/dictionary/languages').then((response) => {
        response.json().then((languages) => {
          this.languages = languages
        })
      })
    },
    add () {
      fetch('/dictionary/addLanguage/' + this.language, { method: 'POST' }).then((response) => {
        if (response.status === 201) {
          this.addDialog = false
          this.getTranslatedLanguages()
          this.snackbar = true
          this.snackbarColor = 'green'
          this.snackbarText = 'Language Added'
        } else {
          this.snackbar = true
          this.snackbarColor = 'red'
          this.snackbarText = 'Error Occured'
        }
      }).catch(() => {
        this.snackbar = true
        this.snackbarColor = 'red'
        this.snackbarText = 'Error Occured'
      })
    }
  },
  created () {
    this.getTranslatedLanguages()
  }
}
</script>
