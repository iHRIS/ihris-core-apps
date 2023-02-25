import { ref } from "vue";
export default function MetricChart(series, option, dataset) {
  let data = ref("");
  const query = ref({
    size: 0,
    query: {},
    reportOptions: {
      locationBasedConstraint: true,
    },
  });

  function addFilters(filters) {
    query.value.query = {
      bool: filters.bool,
    };
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
      data.value = "";
      if (series.value.length === 0) {
        delete query.value.size;
        getData()
          .then(() => {
            option.value.graphic.elements[0].style.text =
              data.value.toLocaleString();
            return resolve();
          })
          .catch((err) => {
            return reject(err);
          });
      } else {
        let seriesField = series.value[0].name;
        if (series.value[0].type === "text") {
          seriesField += ".keyword";
        }
        const terms = {};
        terms[series.value[0].name] = {
          terms: {
            field: seriesField,
          },
        };
        query.value.aggs = {
          series: {
            composite: {
              size: 1000,
              sources: [terms],
            },
          },
        };
        getData()
          .then(() => {
            option.value.graphic.elements[0].style.text =
              data.value.toLocaleString();
            return resolve();
          })
          .catch((err) => {
            reject(err);
          });
      }
    });
  }

  function getData() {
    return new Promise((resolve, reject) => {
      let reqOpt = {};
      let url = `/es/${dataset.value.name}/_search?filter_path=aggregations`;
      if (series.value.length === 0) {
        url = `/es/${dataset.value.name}/_count`;
        reqOpt.method = "POST";
        reqOpt.body = JSON.stringify(query.value);
        reqOpt.headers = {
          "Content-Type": "application/json",
        };
      } else {
        reqOpt.method = "POST";
        reqOpt.headers = {
          "Content-Type": "application/json",
        };
        reqOpt.body = JSON.stringify(query.value);
      }
      fetch(url, reqOpt)
        .then((response) => {
          response
            .json()
            .then((results) => {
              mergeResults(results);
              if (
                results.aggregations &&
                results.aggregations["series"].after_key
              ) {
                query.value.aggs["series"].composite.after =
                  results.aggregations["series"].after_key;
                getData().then(() => {
                  return resolve();
                });
              } else {
                return resolve();
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
    });
  }

  function mergeResults(results) {
    if (series.value.length === 0) {
      data.value = parseInt(results.count);
    } else {
      for (const bucket of results.aggregations.series.buckets) {
        if (data.value) {
          data.value += parseInt(bucket.doc_count);
        } else {
          data.value = parseInt(bucket.doc_count);
        }
      }
    }
  }

  return {
    addFilters,
    getChartData,
  };
}
