export const actions = {
  async getCategories({}, payload) {
    try {
      const res = await this.$axios.$get(`/categories`, {
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
  async postCategories({}, data) {
    const res = await this.$axios.$post(`/categories`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async getCategoriesById({}, id) {
    try {
      const res = await this.$axios.$get(`/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      return res;
    } catch (e) {
      return e.response;
    }
  },
  async editCategories({}, payload) {
    const res = await this.$axios.$put(
      `/categories/${payload.id}`,
      payload.data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      }
    );
    return res;
  },
  async deleteCategories({}, id) {
    const res = await this.$axios.$delete(`/categories/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async postGroups({}, data) {
    const res = await this.$axios.$post(`/categories_groups`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
};
