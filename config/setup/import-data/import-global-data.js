const setup = require("../api");
const createEntry = require("../create-entry");
const fileUtils = require("../file-utils");
const { global } = require("../../../.data/data.json");

async function importGlobalData(strapi) {
  if (!global) {
    return;
  }
  const files = await fileUtils.getFilesData(global.files);
  await createEntry(strapi, global.slug, global.data, files);
}


module.exports = importGlobalData;
