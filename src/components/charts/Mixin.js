import sqlstring from "sqlstring";
export default {
  createSQLFilters(data) {
    console.error(JSON.stringify(data, 0, 2));
    let where = "";
    if (data.must && data.must.length) {
      for (let must of data.must) {
        let keys = Object.keys(must.terms);
        let column = keys.find((ky) => {
          return ky != "type";
        });
        let value = must.terms[column];
        let thisWhere = "";
        if (where) {
          thisWhere += " and";
        }
        if (Array.isArray(value)) {
          thisWhere += " (";
          for (let index in value) {
            let val = sqlstring.escape(value[index]);
            if (index > 0) {
              thisWhere += " or";
            }
            thisWhere += ` ${column}=${val}`;
          }
          thisWhere += ")";
        } else {
          thisWhere += ` ${column} like ${sqlstring.escape("%" + value + "%")}`;
        }
        where += thisWhere;
      }
    }
    if (data.must_not && data.must_not.length) {
      for (let must_not of data.must_not) {
        let column = Object.keys(must_not.terms)[0];
        let value = must_not.terms[column];
        let thisWhere = "";
        if (where) {
          thisWhere += " and";
        }
        if (Array.isArray(value)) {
          thisWhere += " (";
          for (let index in value) {
            let val = sqlstring.escape(value[index]);
            if (index > 0) {
              thisWhere += " and";
            }
            thisWhere += ` ${column}!=${val}`;
          }
          thisWhere += ")";
        }
        where += thisWhere;
      }
    }
    return where;
  },
};
