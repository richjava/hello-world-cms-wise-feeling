'use strict';
const {importData, isFirstRun} = require('./../config/setup/api');

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    (async() => {
      const shouldImportSeedData =
        process.env.IS_SETUP_DATA || await isFirstRun(strapi);
      if (shouldImportSeedData) {
        try {
          await importData(strapi);
        } catch (error) {
          console.log('Could not import seed data');
          console.error(error);
        }
      }
    })() 
  },
};
