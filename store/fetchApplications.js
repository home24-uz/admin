export const actions = {
  async getOneClickOrders() {
    const res = await this.$axios.$get(`/one_click_orders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async deleteOneClickOrders({}, id) {
    const res = await this.$axios.$delete(`/one_click_orders/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async editOneClickOrders({}, payload) {
    const res = await this.$axios.$put(
      `/one_click_orders/${payload.id}`,
      payload.data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      }
    );
    return res;
  },
};
