import { ref } from "vue";
export default function IhrisTabularChart(
  series,
  categories,
  chart,
  option,
  chartOptions,
  dataset,
  otherOptions,
  fhirFlattener
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
    console.error(JSON.stringify(otherOptions.value, 0, 2));
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
      if (series.value[0].hasKeyword) {
        seriesField += ".keyword";
      }
      if (categories.value.length > 0) {
        query.value.aggs = {
          categories: {},
        };
        if (categories.value.length === 1) {
          if (fhirFlattener === "fhir2sql") {
            let categoryName = categories.value[0].name;
            let seriesName = series.value[0].name;
            query.value = `select a.*,coalesce(count,0) as count
            from 
            ((select * from (select distinct ${categoryName} from ${dataset.value.name}) as foo,(select distinct ${seriesName} from ${dataset.value.name}) as baa)) a
            left join
            (select ${categoryName}, ${seriesName},count(*) as count from ${dataset.value.name} group by ${categoryName},${seriesName}) as  b
            on a.${categoryName}=b.${categoryName} and a.${seriesName}=b.${seriesName}
            order by a.${categoryName},b.${seriesName}`;
          } else if (fhirFlattener === "fhir2es") {
            const category = categories.value[0];
            let field = category.name;
            if (category.hasKeyword) {
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
          }
        } else {
          const terms = [];
          for (const category of categories.value) {
            let field = category.name;
            if (category.hasKeyword) {
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
        if (fhirFlattener === "fhir2es") {
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
              min_doc_count: 0,
              size: 2000000,
            };
          } else {
            const aggBy = series.value[0].aggsBy.name;
            query.value.aggs.categories.aggs.series[aggBy] = {
              field: seriesField,
            };
          }
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
      console.log("getting data");
      getData()
        .then(() => {
          if (categories.value.length > 1) {
            parseMultiCategoryResults();
          } else {
            if (fhirFlattener === "fhir2sql") {
              parseSQLResults();
            } else {
              parseResults();
            }
          }
          return resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  function getData() {
    return new Promise((resolve, reject) => {
      if (fhirFlattener === "fhir2es") {
        let aggKey = "categories";
        if (chart.value.maxCategories === 0 || categories.value.length === 0) {
          aggKey = "series";
        }
        const url = `/es/${dataset.value.name}/_search?filter_path=aggregations`;
        console.log(url);
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
                  results.aggregations[aggKey].buckets &&
                  results.aggregations[aggKey].buckets.length > 0
                ) {
                  data.value.aggregations[aggKey].buckets =
                    data.value.aggregations[aggKey].buckets.concat(
                      results.aggregations[aggKey].buckets
                    );
                }
                if (
                  results.aggregations &&
                  results.aggregations[aggKey].after_key
                ) {
                  query.value.aggs[aggKey].composite.after =
                    results.aggregations[aggKey].after_key;
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
      } else if (fhirFlattener === "fhir2sql") {
        const url = `/fhir2sql/run-sql`;
        fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: query.value,
          }),
        }).then((response) => {
          response.json().then((results) => {
            data.value = results;
            return resolve();
          });
        });
      }
    });
  }

  async function parseMultiCategoryResults() {
    let level1Cats = [];
    let level2Cats = [];
    const keys = {};
    const seriesData = {};
    for (const bucket of data.value.aggregations.categories.buckets) {
      const catKeys = Object.keys(bucket.key);
      if (!keys[bucket.key[catKeys[0]]]) {
        keys[bucket.key[catKeys[0]]] = {
          categories: [],
          values: {},
        };
      }
      keys[bucket.key[catKeys[0]]].categories.push(bucket.key[catKeys[1]]);
      if (bucket.series.buckets) {
        for (const value of bucket.series.buckets) {
          let name = value.key;
          if (value.key_as_string) {
            name = value.key_as_string;
          }
          if (!keys[bucket.key[catKeys[0]]].values[name]) {
            keys[bucket.key[catKeys[0]]].values[name] = [];
          }
          if (value.doc_count > 0) {
            keys[bucket.key[catKeys[0]]].values[name].push(value.doc_count);
          } else {
            keys[bucket.key[catKeys[0]]].values[name].push("-");
          }
        }
      } else if (bucket.series.value) {
        let value = bucket.series.value;
        if (value === 0) {
          value = "-";
        }
        let name =
          series.value[0].aggsBy.display + "(" + series.value[0].display + ")";
        if (!keys[bucket.key[catKeys[0]]].values[name]) {
          keys[bucket.key[catKeys[0]]].values[name] = [];
        }
        keys[bucket.key[catKeys[0]]].values[name].push(value);
      }
    }
    for (let level1 in keys) {
      let cats = keys[level1].categories;
      for (let cat of cats) {
        //check if category is missing on other levels and add it with a value 0
        for (let otherLevel1 in keys) {
          if (otherLevel1 === level1) {
            continue;
          }
          const exist = keys[otherLevel1].categories.find((catInOther) => {
            return cat === catInOther;
          });
          if (!exist) {
            keys[otherLevel1].categories.push(cat);
            keys[otherLevel1].categories.sort();
            const index = keys[otherLevel1].categories.indexOf(cat);
            //insert zero at the index of missing category
            for (let serKey in keys[otherLevel1].values) {
              keys[otherLevel1].values[serKey].splice(index, 0, "-");
            }
          }
        }
      }
    }

    level1Cats = Object.keys(keys);
    for (let level1Cat of level1Cats) {
      level2Cats = level2Cats.concat(keys[level1Cat].categories);
      for (let serKey in keys[level1Cat].values) {
        if (!seriesData[serKey]) {
          seriesData[serKey] = [];
        }
        seriesData[serKey] = seriesData[serKey].concat(
          keys[level1Cat].values[serKey]
        );
      }
    }

    let xAxisSettings = {};
    if (option.value.xAxis && option.value.xAxis.length > 0) {
      xAxisSettings = JSON.parse(JSON.stringify(option.value.xAxis[0]));
      delete xAxisSettings.data;
    }
    let yAxisSettings = {};
    if (option.value.yAxis) {
      yAxisSettings = JSON.parse(JSON.stringify(option.value.yAxis));
    }
    option.value.xAxis = [];
    option.value.yAxis = {};
    option.value.series = [];
    if (level2Cats && level2Cats.length > 0) {
      option.value.xAxis.push({
        ...xAxisSettings,
        type: "category",
        data: level2Cats,
      });
    }
    if (level1Cats && level1Cats.length > 0) {
      option.value.xAxis.push({
        ...xAxisSettings,
        type: "category",
        data: level1Cats,
      });
    }
    option.value.yAxis = {
      type: "value",
      ...yAxisSettings,
    };
    const chartOpt = chartOptions.value.find((opt) => {
      return opt.type === chart.value.type;
    });
    for (const seriesName in seriesData) {
      let hasGtZero = seriesData[seriesName].find((vl) => {
        return vl !== "-";
      });
      //remove all series data that has all zero
      if (!hasGtZero) {
        continue;
      }
      option.value.series.push({
        name: seriesName,
        type: chart.value.type,
        ...chartOpt,
        data: seriesData[seriesName],
      });
    }
  }
  async function parseSQLResults() {
    let displayTopValues = otherOptions.value.horizontalValues.displayTopValues;
    let displayTotalValues = otherOptions.value.horizontalValues.totalValues;
    const level1Cat = [];
    const seriesData = {};
    if (displayTopValues) {
      data.value.sort((a, b) => {
        return b.count - a.count;
      });
    }
    let key;
    if (categories.value.length) {
      key = categories.value[0].name;
    } else {
      key = series.value[0].name;
    }
    for (const bucket of data.value) {
      let exists = level1Cat.find((cat) => {
        return cat === bucket[key];
      });
      if (
        !exists &&
        (!displayTopValues || displayTotalValues > level1Cat.length)
      ) {
        level1Cat.push(bucket[key]);
      } else if (!exists && !level1Cat[displayTotalValues]) {
        level1Cat[displayTotalValues] = "Others";
      }
      if (bucket.series && bucket.series.buckets) {
        for (const value of bucket.series.buckets) {
          let name = value.key;
          if (value.key_as_string) {
            name = value.key_as_string;
          }
          if (!seriesData[name]) {
            seriesData[name] = [];
          }
          let val = value.doc_count;
          if (val === 0) {
            val = "-";
          }
          if (
            displayTopValues &&
            seriesData[name].length >= displayTotalValues
          ) {
            if (!seriesData[name][displayTotalValues]) {
              seriesData[name][displayTotalValues] = val;
            } else {
              if (val !== "-" && seriesData[name][displayTotalValues] == "-") {
                seriesData[name][displayTotalValues] = 0;
              }
              if (seriesData[name][displayTotalValues] !== "-" && val == "-") {
                continue;
              }
              seriesData[name][displayTotalValues] += val;
            }
          } else {
            seriesData[name].push(val);
          }
        }
      } else if (bucket.series && bucket.series.value) {
        let value = bucket.series.value;
        if (value === 0) {
          value = "-";
        }
        if (!seriesData[series.value[0].display]) {
          seriesData[series.value[0].display] = [];
        }
        seriesData[series.value[0].display].push(value);
      } else if (categories.value.length === 0) {
        let name = series.value[0].display;
        let value = bucket.doc_count;
        if (value === 0) {
          value = "-";
        }
        if (!seriesData[series.value[0].display]) {
          seriesData[series.value[0].display] = [];
        }

        if (
          displayTopValues &&
          seriesData[series.value[0].display].length >= displayTotalValues
        ) {
          if (!seriesData[name][displayTotalValues]) {
            seriesData[name][displayTotalValues] = value;
          } else {
            if (value !== "-" && seriesData[name][displayTotalValues] == "-") {
              seriesData[name][displayTotalValues] = 0;
            }
            if (seriesData[name][displayTotalValues] !== "-" && value == "-") {
              continue;
            }
            seriesData[name][displayTotalValues] += value;
          }
        } else {
          seriesData[name].push(value);
        }
      }
    }
    let xAxisSettings = {};
    if (
      option.value.xAxis &&
      Array.isArray(option.value.xAxis) &&
      option.value.xAxis.length > 0
    ) {
      xAxisSettings = JSON.parse(JSON.stringify(option.value.xAxis[0]));
      delete xAxisSettings.data;
    } else if (option.value.xAxis) {
      xAxisSettings = JSON.parse(JSON.stringify(option.value.xAxis));
      delete xAxisSettings.data;
    }
    let yAxisSettings = {};
    if (
      option.value.yAxis &&
      Array.isArray(option.value.yAxis) &&
      option.value.yAxis.length > 0
    ) {
      yAxisSettings = JSON.parse(JSON.stringify(option.value.yAxis[0]));
      delete yAxisSettings.data;
    } else if (option.value.yAxis) {
      yAxisSettings = JSON.parse(JSON.stringify(option.value.yAxis));
      delete yAxisSettings.data;
    }
    option.value.xAxis = [];
    option.value.yAxis = [];
    option.value.series = [];
    if (level1Cat && level1Cat.length > 0) {
      if (otherOptions.value.barsDirection === "vertical") {
        option.value.xAxis.push({
          ...xAxisSettings,
          type: "category",
          data: level1Cat,
        });
      } else {
        option.value.yAxis.push({
          ...yAxisSettings,
          type: "category",
          data: level1Cat,
        });
      }
    }
    if (otherOptions.value.barsDirection === "vertical") {
      option.value.yAxis.push({
        ...yAxisSettings,
        type: "value",
      });
    } else {
      option.value.xAxis.push({
        ...xAxisSettings,
        type: "value",
      });
    }
    const chartOpt = chartOptions.value.find((opt) => {
      return opt.type === chart.value.type;
    });
    for (const seriesName in seriesData) {
      let hasGtZero = seriesData[seriesName].find((vl) => {
        return vl !== "-";
      });
      //remove all series data that has all zero
      if (!hasGtZero) {
        continue;
      }
      option.value.series.push({
        name: seriesName,
        type: chart.value.type,
        stack: "ser",
        ...chartOpt,
        data: seriesData[seriesName],
      });
    }
  }
  async function parseResults() {
    let displayTopValues = otherOptions.value.horizontalValues.displayTopValues;
    let displayTotalValues = otherOptions.value.horizontalValues.totalValues;
    let aggKey = "categories";
    if (chart.value.maxCategories === 0 || categories.value.length === 0) {
      aggKey = "series";
    }
    const seriesData = {};
    if (displayTopValues) {
      data.value.aggregations[aggKey].buckets.sort((a, b) => {
        return b.doc_count - a.doc_count;
      });
    }
    let rows = [];
    for (const bucket of data.value.aggregations[aggKey].buckets) {
      const keys = Object.keys(bucket.key);
      for (const key of keys) {
        if (!displayTopValues || displayTotalValues > rows.length) {
          rows.push({
            name: bucket.key[key],
          });
        } else if (!rows[displayTotalValues]) {
          rows[displayTotalValues] = { name: "Others" };
        }
      }
      if (bucket.series && bucket.series.buckets) {
        for (const value of bucket.series.buckets) {
          let name = value.key;
          if (value.key_as_string) {
            name = value.key_as_string;
          }
          let val = value.doc_count;
          if (val === 0) {
            val = "-";
          }
          if (displayTopValues && rows.length > displayTotalValues) {
            if (!rows[displayTotalValues][name]) {
              rows[displayTotalValues][name] = val;
            } else {
              if (val !== "-" && rows[displayTotalValues][name] == "-") {
                rows[displayTotalValues][name] = 0;
              }
              if (rows[displayTotalValues][name] !== "-" && val == "-") {
                continue;
              }
              rows[displayTotalValues][name] += val;
            }
          } else {
            rows[rows.length - 1][name] = val;
          }
        }
      } else if (bucket.series && bucket.series.value) {
        let value = bucket.series.value;
        if (value === 0) {
          value = "-";
        }
        rows[rows.length - 1][series.value[0].display] = value;
      } else if (categories.value.length === 0) {
        let name = series.value[0].display;
        let value = bucket.doc_count;
        if (value === 0) {
          value = "-";
        }

        if (displayTopValues && rows.length > displayTotalValues) {
          if (!seriesData[name][displayTotalValues]) {
            rows[displayTotalValues][name] = value;
          } else {
            if (value !== "-" && seriesData[name][displayTotalValues] == "-") {
              rows[displayTotalValues][name] = 0;
            }
            if (seriesData[name][displayTotalValues] !== "-" && value == "-") {
              continue;
            }
            rows[displayTotalValues][name] += value;
          }
        } else {
          rows[rows.length - 1][name] = value;
        }
      }
    }
    option.value.rows = rows;
  }
  return {
    addFilters,
    getChartData,
  };
}
