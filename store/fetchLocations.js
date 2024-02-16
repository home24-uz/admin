export const actions = {
  async getLocations({}, payload) {
    const res = await this.$axios.$get(`/branches`, {
      params: payload,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async postLocations({}, data) {
    const res = await this.$axios.$post(`/branches`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },

  async editLocations({}, payload) {
    const res = await this.$axios.$put(
      `/branches/${payload.id}`,
      payload.data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      }
    );
    return res;
  },
  async showLocations({}, id) {
    const res = await this.$axios.$get(`/branches/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async deleteLocations({}, id) {
    const res = await this.$axios.$delete(`/branches/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
};
