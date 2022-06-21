/** !
 * @fileOverview A Built.JS Javascript library for Strapi CMS projects.
 */
 (function () {
  "use strict";
  const isFirstRun = require("./is-first-run");
  const importData = require("./import-data/import-data");
  
  module.exports = { isFirstRun, importData };
})();
