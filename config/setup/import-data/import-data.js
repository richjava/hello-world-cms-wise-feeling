const importPageData = require('./import-page-data');
const importEntityData = require('./import-entity-data');
const importLayoutData = require('./import-layout-data');
const importGlobalData = require('./import-global-data');
const setPublicPermissions = require('../set-public-permissions');

const permissions = require('../../../.data/permissions');

async function importData(strapi) {
    // Allow read of application content types
    await setPublicPermissions(strapi, permissions);
    // Create all entries
    await importGlobalData(strapi);
    await importLayoutData(strapi);
    await importPageData(strapi);
    await importEntityData(strapi);
  };

module.exports = importData;