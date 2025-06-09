// src/utils/buildQueryString.js

function buildQueryStringV5(params, prefix = "") {
  const query = [];

  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const value = params[key];
      const const_newPrefix = prefix ? `${prefix}[${key}]` : key;

      if (value === null || value === undefined) {
        continue;
      }

      if (typeof value === "object" && !Array.isArray(value)) {
        query.push(buildQueryStringV5(value, const_newPrefix));
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (typeof item === "object") {
            query.push(
              buildQueryStringV5(item, `${const_newPrefix}[${index}]`)
            );
          } else {
            query.push(`${const_newPrefix}=${encodeURIComponent(item)}`);
          }
        });
      } else {
        query.push(`${const_newPrefix}=${encodeURIComponent(value)}`);
      }
    }
  }

  return query.filter(Boolean).join("&");
}

export { buildQueryStringV5 };