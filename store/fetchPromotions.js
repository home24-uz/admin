export const actions = {
  async getPromotions({}, payload) {
    try {
      const res = await this.$axios.$get(`/promotions`, {
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
  async getPromotionsById({}, id) {
    try {
      const res = await this.$axios.$get(`/promotions/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      return res;
    } catch (e) {
      return e.response;
    }
  },
  async postPromotions({}, data) {
    const res = await this.$axios.$post(`/promotions`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async editPromotions({}, payload) {
    try {
      const res = await this.$axios.$put(
        `/promotions/${payload.id}`,
        payload.data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
      return res;
    } catch (e) {
      return e.response;
    }
  },
  async deletePromotions({}, id) {
    try {
      const res = await this.$axios.$delete(`/promotions/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      return res;
    } catch (e) {
      return e.response;
    }
  },
};
