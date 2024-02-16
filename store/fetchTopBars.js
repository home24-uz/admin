export const actions = {
  async getTopBars({}, payload) {
    const res = await this.$axios.$get(`/bars`, {
      params: payload,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async getTopBarsSearch({}, payload) {
    const res = await this.$axios.$get(`/bars/search`, {
      params: payload,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async getTopBarsById({}, id) {
    const res = await this.$axios.$get(`/bars/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async postTopBars({}, data) {
    const res = await this.$axios.$post(`/bars`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async editTopBars({}, payload) {
    const res = await this.$axios.$put(`/bars/${payload.id}`, payload.data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async deleteTopBars({}, id) {
    const res = await this.$axios.$delete(`/bars/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
};
