export const actions = {
  async getDiscount({}, payload) {
    const res = await this.$axios.$get(`/discounts`, {
      params: payload,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async postDiscount({}, data) {
    const res = await this.$axios.$post(`/discounts`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },

  async editDiscount({}, payload) {
    const res = await this.$axios.$put(
      `/discounts/${payload.id}`,
      payload.data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      }
    );
    return res;
  },
  async showDiscount({}, id) {
    const res = await this.$axios.$get(`/discounts/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async deleteDiscount({}, id) {
    const res = await this.$axios.$delete(`/discounts/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
};
