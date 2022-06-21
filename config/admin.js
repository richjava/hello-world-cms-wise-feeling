module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '5c1183c47af151c8b0c4413e2b80b3b5'),
  },
});
