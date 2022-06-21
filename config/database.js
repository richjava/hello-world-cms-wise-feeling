const path = require('path');
const parse = require("pg-connection-string").parse;

module.exports = ({ env }) => {
  if (env('NODE_ENV') === 'production') {
    const { host, port, database, user, password } = parse(
      process.env.DATABASE_URL
    );
    return {
      connection: {
        client: "postgres",
        connection: {
          host,
          port,
          database,
          user,
          password,
          ssl: {
            rejectUnauthorized: false,
          },
        },
        debug: false,
      },
    };

    // return {
    //   connection: {
    //     client: 'postgres',
    //     connection: {
    //       host: env('DATABASE_HOST', '127.0.0.1'),
    //       port: env.int('DATABASE_PORT', 5432),
    //       database: env('DATABASE_NAME', 'strapi'),
    //       user: env('DATABASE_USERNAME', 'strapi'),
    //       password: env('DATABASE_PASSWORD', 'strapi'),
    //       ssl: {
    //         rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false),
    //       },
    //     },
    //     debug: false,
    //   },
    // };
  }

  return {
    connection: {
      client: 'sqlite',
      connection: {
        filename: path.join(__dirname, '..', env('DATABASE_FILENAME', '.tmp/data.db')),
      },
      useNullAsDefault: true,
    }
  }  
};
