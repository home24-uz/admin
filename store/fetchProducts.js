export const actions = {
  async getProducts({}, payload) {
    const res = await this.$axios.$get(`/products`, {
      params: payload,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async getPShowcaseSearch({}, payload) {
    const res = await this.$axios.$get(`/products_variations/search`, {
      params: payload,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async getProductsSearch({}, payload) {
    const res = await this.$axios.$get(`/products/get_undone_variations`, {
      params: payload,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async getProductsById({}, id) {
    const res = await this.$axios.$get(`/products/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async postProducts({}, data) {
    const res = await this.$axios.$post(`/products`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async editProducts({}, payload) {
    const res = await this.$axios.$put(
      `/products/${payload.id}`,
      payload.data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      }
    );
    return res;
  },
  async deleteProducts({}, id) {
    const res = await this.$axios.$delete(`/products/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async deleteProductsVariation({}, id) {
    const res = await this.$axios.$delete(`/variations/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async postGroups({}, data) {
    const res = await this.$axios.$post(`/products_groups`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
};
