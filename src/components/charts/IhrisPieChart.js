import { ref } from "vue";
import store from "../../store";
import mixin from "./Mixin";
export default function IhrisPieChart(
  series,
  categories,
  chart,
  option,
  chartOptions,
  dataset,
  fhirFlattener
) {
  let qrData = ref({
    size: 0,
    query: {},
    reportOptions: {
      locationBasedConstraint: true,
    },
  });
  const queryFilters = ref({});

  function addFilters(filters) {
    queryFilters.value = filters;
  }
  function getChartData() {
    return new Promise((resolve, reject) => {
      buildQuery()
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  function buildQuery() {
    return new Promise((resolve, reject) => {
      option.value.series = [];
      const chartOpt = chartOptions.value.find((opt) => {
        return opt.type === chart.value.type;
      });
      const promises = [];
      const radius = [
        [0, "30%"],
        ["45%", "60%"],
      ];
      for (let index in categories.value) {
        const category = categories.value[index];
        promises.push(
          new Promise((resolve1, reject1) => {
            let query = "";
            if (fhirFlattener === "fhir2es") {
              query = JSON.parse(JSON.stringify(qrData.value));
              query.aggs = {
                categories: {},
              };
              let field = category.name;
              if (category.type === "text") {
                field += ".keyword";
              }
              const term = {};
              term[category.name] = {
                terms: {
                  field,
                },
              };
              query.aggs.categories.composite = {
                size: 1000,
                sources: [term],
              };
              if (queryFilters.value.bool) {
                query.query = {
                  bool: queryFilters.value.bool,
                };
              }
            } else if (fhirFlattener === "fhir2sql") {
              let where = mixin.createSQLFilters(queryFilters.value.bool);
              query = `select ${category.name}, count(${category.name}) from ${dataset.value.name}`;
              if (where) {
                query += ` where ${where}`;
              }
              query += ` GROUP BY ${category.name}`;
              let userLocExt =
                store.state.user.obj.resource &&
                store.state.user.obj.resource.extension.find((ext) => {
                  return (
                    ext.url ===
                    "http://ihris.org/fhir/StructureDefinition/ihris-user-location"
                  );
                });
              if (userLocExt) {
                let userLoc = userLocExt.valueReference.reference;
                let locationRestriction = `(ihris_ihris_related_group like '%${userLoc},%' or ihris_ihris_related_group like '%${userLoc}')`;
                query += `${locationRestriction}`;
              }
            }
            getData(query, {})
              .then((data) => {
                let values = [];
                if (fhirFlattener === "fhir2sql") {
                  for (let bucket of data) {
                    values.push({
                      value: bucket.count,
                      name: bucket[category.name],
                    });
                  }
                } else {
                  for (let bucket of data.aggregations.categories.buckets) {
                    values.push({
                      value: bucket.doc_count,
                      name: bucket.key[category.name],
                    });
                  }
                }
                let seriesData = {
                  name: category.display,
                  type: chart.value.type,
                  data: values,
                  ...chartOpt,
                };
                if (categories.value.length > 1) {
                  seriesData.radius = radius[index];
                }
                option.value.series.push(seriesData);
                resolve1();
              })
              .catch(() => {
                reject1();
              });
          })
        );
      }
      Promise.all(promises)
        .then(() => {
          return resolve();
        })
        .catch(() => {
          return reject();
        });
    });
  }

  function getData(query, data) {
    return new Promise((resolve, reject) => {
      if (fhirFlattener === "fhir2sql") {
        const url = `/fhir2sql/run-sql`;
        fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query,
          }),
        }).then((response) => {
          response.json().then((results) => {
            return resolve(results);
          });
        });
      } else {
        const url = `/es/${dataset.value.name}/_search?filter_path=aggregations`;
        fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(query),
        })
          .then((response) => {
            response
              .json()
              .then((results) => {
                if (!data.aggregations) {
                  data = results;
                } else if (
                  results.aggregations.categories.buckets &&
                  results.aggregations.categories.buckets.length > 0
                ) {
                  data.aggregations.categories.buckets =
                    data.aggregations.categories.buckets.concat(
                      results.aggregations.categories.buckets
                    );
                }
                if (
                  results.aggregations &&
                  results.aggregations.categories.after_key
                ) {
                  query.aggs.categories.composite.after =
                    results.aggregations.categories.after_key;
                  getData(query, data).then((results) => {
                    return resolve(results);
                  });
                } else {
                  return resolve(data);
                }
              })
              .catch((err) => {
                console.log(err);
                return reject(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }
  return {
    addFilters,
    getChartData,
  };
}
