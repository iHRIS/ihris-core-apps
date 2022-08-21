<template>
  <v-container grid-list-xs>
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
      v-model="confirmGTrans"
    >
      <template v-slot:default="dialog">
        <v-card>
          <v-toolbar
            color="primary"
            dark
          >Proceed?</v-toolbar>
          <v-card-text>
            This will overwrite all existing {{language}} translations, do you want to proceed?
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn
              text
              @click="dialog.value = false"
            >
              <v-icon>mdi-close</v-icon>
              No
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              text
              @click="googleTranslate"
            >
              <v-icon>mdi-check</v-icon>
              Yes
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title primary-title>
            {{language}} Translations
            <v-spacer></v-spacer>
            <v-btn
              color="success"
              :disabled="translationProgress.showTransProgress"
              small
              @click="confirmGTrans = true"
            >
              <v-icon left>mdi-google-translate</v-icon>
              Translate with google
            </v-btn>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              label="Search"
              class="mx-4"
              clearable
              prepend-icon="mdi-magnify"
            ></v-text-field>
          </v-card-title>
          <v-card-text>
            <v-progress-linear
              v-model="translationProgress.percent"
              height="25"
              stream
              v-if="translationProgress.showTransProgress"
            >
              <strong>{{ translationProgress.translated }}/{{translationProgress.required}}</strong>
            </v-progress-linear>
            <v-data-table
              :headers="headers"
              :items="translations"
              :search="search"
              :loading="loading"
              loading-text="Loading"
              class="elevation-1"
              style="cursor: pointer"
            >
              <template v-slot:item="{ item, index }">
                <tr @click="edit(item)">
                  <td>{{++index}}</td>
                  <td>{{ item.en | limitTexts }}</td>
                  <td>{{ item.text | limitTexts }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col v-if="selected.key">
        WORD: <br><br>
        <i><b>{{selected.en}}</b></i><br><br>
        TRANSLATION:
        <v-textarea
          clearable
          clear-icon="mdi-close-circle"
          v-model="newTranslation"
          style="background-color: #FFFFC2; font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"
        ></v-textarea>
        <v-spacer></v-spacer>
        <v-btn small rounded color="primary" dark @click="save">
          <v-icon left>mdi-content-save</v-icon>
          Save
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>

export default {
  data () {
    return {
      snackbarColor: 'green',
      snackbarText: '',
      snackbar: false,
      confirmGTrans: false,
      loading: true,
      search: '',
      selected: {},
      newTranslation: '',
      translations: [],
      headers: [{
        text: 'SN',
        value: 'sn'
      }, {
        text: 'Word',
        value: 'en'
      }, {
        text: 'Translated To',
        value: 'text'
      }],
      translationProgress: {
        showTransProgress: false,
        required: 0,
        translated: 0,
        percent: 0,
        interval: ''
      }
    }
  },
  filters: {
    limitTexts (val) {
      if (val.length < 100) {
        return val
      }
      return val.substring(0, 100) + '...'
    }
  },
  methods: {
    edit (val) {
      this.selected = val
      this.newTranslation = val.text
    },
    save () {
      fetch('/dictionary/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          locale: this.$route.params.locale,
          path: this.selected.key,
          text: this.newTranslation
        })
      }).then((response) => {
        if (response.status === 200) {
          this.getTranslations()
          this.snackbar = true
          this.snackbarColor = 'green'
          this.snackbarText = 'Translation Updated'
        }
      }).catch(() => {
        this.snackbar = true
        this.snackbarColor = 'red'
        this.snackbarText = 'Error Occured'
      })
    },
    getTranslations (silent) {
      if (!silent) {
        this.loading = true
      }
      fetch('/dictionary/getTranslations/' + this.$route.params.locale).then((response) => {
        response.json().then(trans => {
          this.loading = false
          this.translations = trans.translations
          this.language = trans.language
        })
      }).catch(err => {
        console.log(err)
      })
    },
    googleTranslate () {
      this.confirmGTrans = false
      fetch('/dictionary/translate/en/' + this.$route.params.locale).then((response) => {
        if (response.status === 200) {
          this.translationProgress.interval = setInterval(() => {
            this.googleTranslateCount()
          }, 1000)
        }
      }).catch(() => {
        this.snackbar = true
        this.snackbarColor = 'red'
        this.snackbarText = 'Error Occured During Translation'
      })
    },
    googleTranslateCount () {
      this.translationProgress.showTransProgress = true
      fetch('/dictionary/translationCount/en/' + this.$route.params.locale).then((response) => {
        response.json().then((count) => {
          this.getTranslations(true)
          this.translationProgress.required = count.from
          this.translationProgress.translated = count.to
          this.translationProgress.percent = parseInt(count.to) * 100 / parseInt(count.from)
          if (count.from === count.to || !count.running) {
            clearInterval(this.translationProgress.interval)
            this.translationProgress.showTransProgress = false
          }
        })
      }).catch(() => {
        this.snackbar = true
        this.snackbarColor = 'red'
        this.snackbarText = 'Cant get progress'
      })
    }
  },
  created () {
    this.language = this.$route.params.locale
    this.getTranslations()
    fetch('/dictionary/translationCount/en/' + this.$route.params.locale).then((response) => {
      response.json().then((translation) => {
        if (translation.running) {
          this.translationProgress.showTransProgress = true
          this.translationProgress.interval = setInterval(() => {
            this.googleTranslateCount()
          }, 1000)
        }
      })
    }).catch(() => {
      this.snackbar = true
      this.snackbarColor = 'red'
      this.snackbarText = 'Cant get translation progress'
    })
  },
  beforeDestroy () {
    clearInterval(this.translationProgress.interval)
  }
}
</script>
