export const generalMixin = {
  data () {
    return {
      dashboards: []
    }
  },
  methods: {
    listDashboard () {
      this.dashboards = []
      this.loading = true
      this.displayDashList = true
      this.getDashboards().then(() => {
        this.loading = false
      })
    },
    getDashboards (url) {
      return new Promise((resolve, reject) => {
        if (!url) {
          url = '/fhir/Basic?_profile=http://ihris.org/fhir/StructureDefinition/ihris-dashboard'
        }
        fetch(url).then((response) => {
          response.json()
            .then((data) => {
              for (const entry of data.entry) {
                const name = entry.resource.extension.find((ext) => {
                  return ext.url === 'http://ihris.org/fhir/StructureDefinition/ihris-basic-name'
                })
                if (name) {
                  this.dashboards.push({
                    id: entry.resource.id,
                    name: name.valueString
                  })
                }
              }
              const next = data.link.find((link) => {
                return link.relation === 'next'
              })
              if (next) {
                this.getDashboards(next.url).then(() => {
                  return resolve()
                }).catch((err) => {
                  return reject(err)
                })
              } else {
                return resolve()
              }
            })
        })
      })
    }
  }
}
