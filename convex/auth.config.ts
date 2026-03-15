export default {
  providers: [
    {
      // Password-based auth via @convex-dev/auth
      domain: process.env.CONVEX_SITE_URL,
      applicationID: "convex",
    },
  ],
};
