export const actions = {
  async getDashboard({}, payload) {
    try {
      const res = await this.$axios.$get(`/dashboard`, {
        params: payload,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      return res;
    } catch (e) {
      return e.response;
    }
  },

};
