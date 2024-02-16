export const actions = {
  async getData({}, payload) {
    const res = await this.$axios.$get(`/newsletters`, {
      params: payload,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },

  async postMessages({}, data) {
    const res = await this.$axios.$post(`/newsletters-send`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async deleteMessage({}, id) {
    const res = await this.$axios.$delete(`/newsletters/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
};
