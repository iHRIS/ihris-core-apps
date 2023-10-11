<template>
  <div class="home" style="text-align: center">
    The iHRIS Translation App lets you translate the iHRIS interface into
    different languages that are supported by Google Translate. <br />
    You may start by clicking on the plus sign below, selecting the language to
    translate to and clicking the add button.<br />
    Once done with the translating, click come back to this page and click the
    upload option below.
    <!--</div>-->
    <br /><br />
    <!--div class="home"-->
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
    <v-dialog
      transition="dialog-top-transition"
      max-width="600"
      v-model="addDialog"
    >
      <v-card>
        <v-toolbar color="primary" dark> Select Language</v-toolbar>
        <v-card-text>
          <div class="text-h6">
            <v-autocomplete
              v-model="language"
              :items="languages"
              item-value="locale"
              item-title="name"
              dense
              filled
              label="Languages"
            ></v-autocomplete>
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="addDialog = false">
            <v-icon>mdi-close</v-icon>
            Close
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn :disabled="!language" text @click="add">
            <v-icon>mdi-plus</v-icon>
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      transition="dialog-top-transition"
      max-width="600"
      v-model="addOtherDialog"
    >
      <v-card>
        <v-toolbar color="primary" dark
          >Type Non-Google Translate Language</v-toolbar
        >
        <v-card-text>
          <div class="text-h6">
            <v-text-field
              v-model="language"
              hint="Enter Language Not supported by google translate"
              clearable
              required
              label="Language"
            >
            </v-text-field>
            <!--<v-text-field 
              v-model="language"
              hint="Enter three later short code for the above language"
              clearable
              required 
              label="Language Code">
            </v-text-field>-->
          </div>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn text @click="addOtherDialog = false">
            <v-icon>mdi-close</v-icon>
            Close
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn text @click="add">
            <v-icon>mdi-plus</v-icon>
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <center>
      <v-card class="mx-auto" max-width="500" tile>
        <v-toolbar dark color="primary">
          <v-icon>mdi-google-translate</v-icon>
          <v-spacer></v-spacer>
          <v-toolbar-title>Enabled Languages</v-toolbar-title>
        </v-toolbar>
        <v-card-title primary-title>
          <v-row>
            <v-col cols="5">
              <div class="text-subtitle-2">Select to view</div>
            </v-col>
            <v-col cols="2">
              <v-btn
                class="mx-2"
                dark
                color="indigo"
                small
                icon
                @click="getLanguages"
              >
                <v-icon>mdi-google-translate</v-icon>
                <v-tooltip activator="parent" location="top">
                  Add New Google Language
                </v-tooltip>
              </v-btn>
            </v-col>
            <v-col cols="2">
              <v-btn
                class="mx-2"
                dark
                color="indigo"
                small
                icon
                @click="addOtherDialog = true"
              >
                <v-icon>mdi-plus</v-icon>
                <v-tooltip activator="parent" location="top">
                  Add New Non-Google Language
                </v-tooltip>
              </v-btn>
            </v-col>
            <v-col cols="2">
              <v-btn
                class="mx-2"
                dark
                color="indigo"
                small
                icon
                @click="populateTexts"
              >
                <v-icon>mdi-publish</v-icon>
                <v-tooltip activator="parent" location="top">
                  Populate languages with iHRIS Texts
                </v-tooltip>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-list>
          <v-list-item
            v-for="(lang, i) in translatedLanguages"
            :key="i"
            :value="lang"
            color="primary"
            rounded="xl"
          >
            <v-row>
              <v-col>
                <v-list-item-title
                  v-text="lang.language"
                  @click="selected(lang)"
                ></v-list-item-title>
              </v-col>
              <v-col v-if="textExtractionStatus[lang.locale].active">
                <v-progress-linear
                  color="deep-purple accent-4"
                  indeterminate
                  rounded
                  height="6"
                  v-if="textExtractionStatus[lang.locale].running"
                ></v-progress-linear>
                <v-icon v-if="textExtractionStatus[lang.locale].displayStatus">
                  mdi-check
                </v-icon>
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>
      </v-card>
    </center>
  </div>
</template>
<script>
export default {
  data() {
    return {
      snackbarColor: "green",
      snackbarText: "",
      snackbar: false,
      addDialog: false,
      addOtherDialog: false,
      translatedLanguages: [],
      selectedLocale: "",
      languages: [],
      language: "",
      textExtractionStatus: {},
    };
  },
  methods: {
    getTranslatedLanguages() {
      fetch("/translator/getTranslatedLanguages")
        .then((response) => {
          response.json().then((lang) => {
            this.translatedLanguages = lang;
            for (const lang of this.translatedLanguages) {
              this.textExtractionStatus[lang.locale] = {};
              this.textExtractionStatus[lang.locale].active = false;
              this.textExtractionStatus[lang.locale].running = false;
              this.textExtractionStatus[lang.locale].displayStatus = false;
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    selected(lang) {
      this.$router.push({
        path: "/review/" + lang.locale,
      });
    },
    populateTexts() {
      for (const lang of this.translatedLanguages) {
        this.textExtractionStatus[lang.locale].active = true;
        // this.textExtractionStatus[lang.locale].running = true
      }
      this.textExtractionStatus.en.running = true;
      fetch("/translator/extractTexts/en")
        .then((response) => {
          this.textExtractionStatus.en.running = false;
          this.textExtractionStatus.en.displayStatus = true;
          if (response.status === 200) {
            for (const lang of this.translatedLanguages) {
              if (lang.locale === "en") {
                continue;
              }
              this.textExtractionStatus[lang.locale].active = true;
              this.textExtractionStatus[lang.locale].running = true;
              fetch("/translator/extractTexts/" + lang.locale)
                .then((response) => {
                  if (response.status === 200) {
                    this.textExtractionStatus[lang.locale].running = false;
                    this.textExtractionStatus[lang.locale].displayStatus = true;
                  }
                })
                .catch(() => {
                  this.textExtractionStatus[lang.locale].running = false;
                  this.snackbar = true;
                  this.snackbarColor = "red";
                  this.snackbarText = "Error Occured for English";
                });
            }
          }
        })
        .catch(() => {
          this.textExtractionStatus.en.running = false;
          this.snackbar = true;
          this.snackbarColor = "red";
          this.snackbarText = "Error Occured for English";
        });
    },
    getLanguages() {
      this.addDialog = true;
      fetch("/translator/languages").then((response) => {
        response.json().then((languages) => {
          this.languages = languages;
        });
      });
    },
    add() {
      fetch("/translator/addLanguage/" + this.language, { method: "POST" })
        .then((response) => {
          if (response.status === 201) {
            this.addDialog = false;
            this.getTranslatedLanguages();
            this.snackbar = true;
            this.snackbarColor = "green";
            this.snackbarText = "Language Added";
            this.emitter.emit("getLanguageList");
          } else {
            this.snackbar = true;
            this.snackbarColor = "red";
            this.snackbarText = "Error Occured";
          }
        })
        .catch(() => {
          this.snackbar = true;
          this.snackbarColor = "red";
          this.snackbarText = "Error Occured";
        });
    },
  },
  created() {
    this.getTranslatedLanguages();
  },
};
</script>
