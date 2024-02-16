export const actions = {
  async getOrders({}, payload) {
    const res = await this.$axios.$get(`/orders`, {
      params: payload,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async getOrdersById({}, payload) {
    const res = await this.$axios.$get(`/orders/${payload.id}`, {
      params: payload.params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async postOrders({}, data) {
    const res = await this.$axios.$post(`/orders`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async editOrders({}, payload) {
    const res = await this.$axios.$put(`/orders/${payload.id}`, payload.data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async deleteOrders({}, id) {
    const res = await this.$axios.$delete(`/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
};
