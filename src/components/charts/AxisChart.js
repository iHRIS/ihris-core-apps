import { ref } from "vue";
export default function AxisChart(
  series,
  categories,
  chart,
  option,
  chartOptions,
  dataset
) {
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
      if (series.value.length === 0) {
        return resolve();
      }
      data.value = "";
      let seriesField = series.value[0].name;
      if (series.value[0].type === "text") {
        seriesField += ".keyword";
      }
      if (categories.value.length > 0) {
        query.value.aggs = {
          categories: {},
        };
        if (categories.value.length === 1) {
          const category = categories.value[0];
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
          query.value.aggs.categories.composite = {
            sources: [term],
          };
        } else {
          const terms = [];
          for (const category of categories.value) {
            let field = category.name;
            if (category.type === "text") {
              field += ".keyword";
            }
            const term = {};
            term[category.name] = {
              terms: {
                field,
                missing_bucket: true,
              },
            };
            terms.push(term);
          }
          query.value.aggs.categories.composite = {
            size: 1000,
            sources: terms,
          };
        }
        query.value.aggs.categories.aggs = {
          series: {},
        };
        if (
          series.value[0].aggsBy.name === "value_count" &&
          chart.value.type !== "pie"
        ) {
          query.value.aggs.categories.aggs.series.terms = {
            field: seriesField,
            order: { _key: "asc" },
            // min_doc_count: 0,
            size: 2000000,
          };
        } else {
          const aggBy = series.value[0].aggsBy.name;
          query.value.aggs.categories.aggs.series[aggBy] = {
            field: seriesField,
          };
        }
      } else {
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
      }
      getData()
        .then(() => {
          parseResults();
          return resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  function getData() {
    return new Promise((resolve, reject) => {
      let category = "categories";
      if (chart.value.maxCategories === 0) {
        category = "series";
      }
      const url = `/es/${dataset.value.name}/_search?filter_path=aggregations`;
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(query.value),
      })
        .then((response) => {
          response
            .json()
            .then((results) => {
              if (!data.value) {
                data.value = results;
              } else if (
                results.aggregations[category].buckets &&
                results.aggregations[category].buckets.length > 0
              ) {
                data.value.aggregations[category].buckets =
                  data.value.aggregations[category].buckets.concat(
                    results.aggregations[category].buckets
                  );
              }
              if (
                results.aggregations &&
                results.aggregations[category].after_key
              ) {
                query.value.aggs[category].composite.after =
                  results.aggregations[category].after_key;
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

  async function parseResults() {
    const level1Cat = [];
    let level2Cat = [];
    const keys = {};
    const seriesData = {};
    if (data.value.aggregations.categories) {
      for (const bucket of data.value.aggregations.categories.buckets) {
        if (Object.keys(bucket.key).length > 1) {
          const catKeys = Object.keys(bucket.key);
          if (!keys[bucket.key[catKeys[0]]]) {
            keys[bucket.key[catKeys[0]]] = [];
          }
          keys[bucket.key[catKeys[0]]].push(bucket.key[catKeys[1]]);
        } else {
          if (typeof bucket.key === "object") {
            const keys = Object.keys(bucket.key);
            for (const key of keys) {
              level1Cat.push(bucket.key[key]);
            }
          } else {
            level1Cat.push(bucket.key);
          }
        }
        if (bucket.series.buckets) {
          for (const value of bucket.series.buckets) {
            let name = value.key;
            if (value.key_as_string) {
              name = value.key_as_string;
            }
            if (!seriesData[name]) {
              seriesData[name] = [];
            }
            seriesData[name].push(value.doc_count);
          }
        } else if (bucket.series.value) {
          if (!seriesData[series.value[0].display]) {
            seriesData[series.value[0].display] = [];
          }
          if (chart.value.hasAxis) {
            seriesData[series.value[0].display].push(bucket.series.value);
          } else {
            seriesData[series.value[0].display].push({
              name: bucket.key[Object.keys(bucket.key)[0]],
              value: bucket.series.value,
            });
          }
        }
      }
      if (Object.keys(keys).length > 0) {
        for (const key in keys) {
          level2Cat = [...level2Cat, ...keys[key]];
          level1Cat.push(key);
        }
      }
    } else if (data.value.aggregations.series) {
      if (!seriesData[series.value[0].display]) {
        seriesData[series.value[0].display] = [];
      }
      if (data.value.aggregations.series.buckets) {
        for (const bucket of data.value.aggregations.series.buckets) {
          // level1Cat.push(bucket.key)
          seriesData[series.value[0].display].push({
            name: bucket.key,
            value: bucket.doc_count,
          });
        }
      } else if (data.value.aggregations.series.value) {
        seriesData[series.value[0].display].push({
          name: series.value[0].display,
          value: data.value.aggregations.series.value,
        });
      }
    }
    let xAxisSettings = {};
    if (option.value.xAxis && option.value.xAxis.length > 0) {
      xAxisSettings = JSON.parse(JSON.stringify(option.value.xAxis[0]));
      delete xAxisSettings.data;
    }
    let yAxisSettings = {};
    if (option.value.yAxis) {
      yAxisSettings = xAxisSettings = JSON.parse(
        JSON.stringify(option.value.yAxis)
      );
    }
    option.value.xAxis = [];
    option.value.yAxis = {};
    option.value.series = [];
    if (level1Cat && level1Cat.length > 0 && chart.value.hasAxis) {
      if (level2Cat && level2Cat.length > 0) {
        option.value.xAxis.push({
          ...xAxisSettings,
          type: "category",
          data: level2Cat,
        });
      }
      if (level1Cat && level1Cat.length > 0) {
        option.value.xAxis.push({
          ...xAxisSettings,
          type: "category",
          data: level1Cat,
        });
      }
      option.value.yAxis = {
        type: "value",
        ...yAxisSettings,
      };
    } else {
      delete option.value.yAxis;
      delete option.value.xAxis;
    }
    const chartOpt = chartOptions.value.find((opt) => {
      return opt.type === chart.value.type;
    });
    for (const seriesName in seriesData) {
      option.value.series.push({
        name: seriesName,
        type: chart.value.type,
        ...chartOpt,
        data: seriesData[seriesName],
      });
    }
  }
  return {
    addFilters,
    getChartData,
  };
}
