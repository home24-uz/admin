export const actions = {
  async getSiteInfo({}, payload) {
    const res = await this.$axios.$get(`/info`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },

  async editSiteInfo({}, payload) {
    const res = await this.$axios.$put(`/info/1`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
};
