export const actions = {
  async getBrands({}, payload) {
    const res = await this.$axios.$get(`/brands`, {
      params: payload,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async getAllBrands() {
    const res = await this.$axios.$get(`/brands/all`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async getBrandsById({}, id) {
    try {
      const res = await this.$axios.$get(`/brands/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      return res;
    } catch (e) {
      return e.response;
    }
  },
  async postBrands({}, data) {
    const res = await this.$axios.$post(`/brands`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async editBrands({}, payload) {
    const res = await this.$axios.$put(`/brands/${payload.id}`, payload.data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async deleteBrands({}, id) {
    const res = await this.$axios.$delete(`/brands/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async postGroups({}, data) {
    const res = await this.$axios.$post(`/brands_groups`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async getGroups() {
    const res = await this.$axios.$get(`/brands_groups/all`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
};
