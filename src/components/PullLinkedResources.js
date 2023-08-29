import { ref } from "vue"

export default function PullLinkedResource(parent) {
  let links = ref([])
  function referenceParent(extDefinition) {
    let hasReference = false
    for(let element of extDefinition.differential.element) {
      let found = element.type && element.type.find((type) => {
        return type.code === "Reference" && type.targetProfile && type.targetProfile.includes(parent.url)
      })
      if(found) {
        hasReference = true
        break
      }
    }
    return hasReference
  }
  function getReferenceURL(extDefinition) {
    let urls = []
    for(let element of extDefinition.differential.element) {
      if(!element.mustSupport) {
        continue
      }
      let type = element.type && element.type.find((type) => {
        return type.code === "Reference" && type.targetProfile && type.targetProfile.length > 0
      })
      if(type) {
        urls = urls.concat(type.targetProfile)
      }
    }
    return urls
  }
  function getDefinition(id) {
    return new Promise((resolve, reject) => {
      fetch("/fhir/StructureDefinition/" + id).then((response) => {
        response.json().then((def) => {
          resolve(def)
        }).catch((err) => {
          reject(err)
        })
      }).catch((err) => {
        reject(err)
      })
    })
  }
  function loadDirectLinks() {
    return new Promise((resolve, reject) => {
      getDefinition(parent.id).then(async(parentDef) => {
        for(let element of parentDef.differential.element) {
          let urls = []
          let typeExtension = element.type && element.type.find((type) => {
            return type.code === 'Extension' && type.profile && type.profile.length > 0
          })
          let typeReference = element.type && element.type.find((type) => {
            return type.code === 'Reference' && type.targetProfile && type.targetProfile.length > 0
          })
          if(typeExtension) {
            let profile = typeExtension.profile[0].split("/")
            let id = profile[profile.length - 1]
            await getDefinition(id).then(async (extDefinition) => {
              let refUrls = getReferenceURL(extDefinition)
              urls = urls.concat(refUrls)
            })
          }
          if(typeReference) {
            urls = urls.concat(typeReference.targetProfile)
          }
          if(urls.length === 0) {
            continue
          }
          urls = urls.join(",")
          await fetch("/fhir/StructureDefinition?url=" + urls + "&_count=200").then((response) => {
            response.json().then((definitions) => {
              for(let definition of definitions.entry) {
                links.value.push({
                  id: definition.resource.id,
                  url: definition.resource.url,
                  name: definition.resource.name,
                  type: definition.resource.type,
                  title: definition.resource.title || definition.resource.type,
                  description: definition.resource.description,
                  linkType: "direct"
                })
              }
            })
          })
        }
        console.log('Done for direct');
        return resolve()
      })
    })
  }
  function loadIndirectLinks(url) {
    return new Promise((resolve, reject) => {
      if(!url) {
        url = "/fhir/StructureDefinition?kind=resource&_sort=title,type&_count=200"
      }
      fetch(url).then((response) => {
        response.json().then(async(structs) => {
          if(!structs.entry) {
            return resolve()
          }
          for(let struct of structs.entry) {
            for(let element of struct.resource.differential.element) {
              let typeExtension = element.type && element.type.find((type) => {
                return type.code === 'Extension' && type.profile && type.profile.length > 0
              })
              let typeReference = element.type && element.type.find((type) => {
                return type.code === 'Reference' && type.targetProfile && type.targetProfile.length > 0
              })
              if(typeExtension) {
                let profile = typeExtension.profile[0].split("/")
                let id = profile[profile.length - 1]
                await getDefinition(id).then((extDefinition) => {
                  if(referenceParent(extDefinition)) {
                    links.value.push({
                      id: struct.resource.id,
                      url: struct.resource.url,
                      name: struct.resource.name,
                      type: struct.resource.type,
                      title: struct.resource.title || struct.resource.type,
                      description: struct.resource.description,
                    })
                  }
                })
              }
              if(typeReference && typeReference.targetProfile.includes(parent.url)) {
                links.value.push({
                  id: struct.resource.id,
                  url: struct.resource.url,
                  name: struct.resource.name,
                  type: struct.resource.type,
                  title: struct.resource.title || struct.resource.type,
                  description: struct.resource.description,
                  linkType: "indirect"
                })
              }
            }
          }
          let next = structs.link.find((link) => {
            return link.relation === 'next'
          })
          if(next) {
            url = next.url.replace(/_getpages=[^&]*&*/, "").replace("/fhir?","/fhir/StructureDefinition?")
            url = url.substring(url.indexOf("/fhir/"));
            url += "&kind=resource&_sort=title,type&_count=200"
            loadIndirectLinks(url.substring(url.indexOf("/fhir"))).then(() => {
              resolve()
            }).catch((err) => {
              reject(err)
            })
          } else {
            console.log('Done indirect');
            resolve()
          }
        })
      })
    })
  }

  function loadLinks() {
    return new Promise((resolve, reject) => {
      links.value = []
      Promise.all([loadIndirectLinks(), loadDirectLinks()]).then(() => {
        return resolve(links.value)
      })
    })
  }

  return {
    loadLinks
  }
}