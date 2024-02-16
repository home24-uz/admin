export default {
  methods: {
    checkAccess(name, action) {
      if (this.$store.state?.role) {
        return this.$store.state?.permissions
          ?.find((item) => item.url == name)
          ?.methods.includes(action);
      } else {
        return true;
      }
    },
  },
};
