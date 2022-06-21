const setup = require("../api");
const createEntry = require("../create-entry");
const fileUtils = require("../file-utils");
const { layout } = require("../../../.data/data.json");

async function importLayoutData(strapi) {
  if (!layout) {
    return;
  }
  const files = await fileUtils.getFilesData(layout.files);
  await createEntry(strapi, layout.slug, layout.data, files);
}

module.exports = importLayoutData;
