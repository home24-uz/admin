export default {
  router: {
    extendRoutes(routes) {
      routes.push({
        path: "/admin/login",
        component: "~/pages/admin/login.vue",
      });
    },
  },
  head: {
    title: "E-shop admin panel",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/svg", href: "/favicon.svg" }],
  },
  css: [
    "~/assets/scss/app.scss",
    "~/assets/scss/custom/page/_app-styles.scss",
    "~/assets/fonts/stylesheet.css",
  ],
  serverMiddleware: ["~/serverMiddleware/blockImages.js"],

  plugins: [
    { src: "~plugins/element-ui.js", ssr: false },
    { src: "~plugins/quill-editor.js", ssr: false },
    { src: "~plugins/antd-ui.js", ssr: false },
    { src: "~/plugins/chart.js", srr: false },
    { src: "~plugins/v-mask.js", ssr: false },
    { src: "~plugins/apex-chart.js", ssr: false },
  ],

  axios: {
    credentials: true,
    init(axios) {
      axios.defaults.withCredentials = true;
    },
    baseURL: process.env.BASE_URL,
  },
  components: true,

  buildModules: ["@nuxtjs/svg", "@nuxt/postcss8", "@nuxtjs/dotenv"],

  modules: [
    "bootstrap-vue/nuxt",
    "@nuxtjs/axios",
    // "@nuxtjs/auth",
    "@nuxtjs/dotenv",
    "nuxt-precompress",
    "@nuxt/image",
  ],
  ssr: false,
  build: {
    // analyze: true,
  },
  loadingIndicator: {
    name: "folding-cube",
    color: "#1890ff",
    background: "white",
  },

  nuxtPrecompress: {
    enabled: true, // Enable in production
    report: false, // set true to turn one console messages during module init
    test: /\.(js|css|html|txt|xml|svg)$/, // files to compress on build
    middleware: {
      enabled: true,
      enabledStatic: true,
      encodingsPriority: ["br", "gzip"],
    },
    gzip: {
      enabled: true,
      filename: "[path].gz[query]",
      threshold: 10240,
      minRatio: 0.8,
      compressionOptions: { level: 9 },
    },
    brotli: {
      enabled: true,
      filename: "[path].br[query]",
      compressionOptions: { level: 11 },
      threshold: 10240,
      minRatio: 0.8,
    },
  },
  server: {
    port: process.env.PORT,
    host: process.env.HOST,
  },
};
