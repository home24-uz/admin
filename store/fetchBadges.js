export const actions = {
  async getBadges({}, payload) {
    const res = await this.$axios.$get(`/product_badges`, {
      params: payload,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async postBadges({}, data) {
    const res = await this.$axios.$post(`/product_badges`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },

  async editBadges({}, payload) {
    const res = await this.$axios.$put(
      `/product_badges/${payload.id}`,
      payload.data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      }
    );
    return res;
  },
  async showBadges({}, id) {
    const res = await this.$axios.$get(`/product_badges/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async deleteBadges({}, id) {
    const res = await this.$axios.$delete(`/product_badges/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
};
