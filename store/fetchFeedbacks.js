export const actions = {
  async getFeedbacks({}, payload) {
    const res = await this.$axios.$get(`/feedbacks`, {
      params: payload,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async getFeedbacksById({}, id) {
    const res = await this.$axios.$get(`/feedbacks/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async postFeedbacks({}, data) {
    const res = await this.$axios.$post(`/feedbacks`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async editFeedbacks({}, payload) {
    const res = await this.$axios.$put(
      `/feedbacks/${payload.id}`,
      payload.data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      }
    );
    return res;
  },
  async deleteFeedbacks({}, id) {
    const res = await this.$axios.$delete(`/feedbacks/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
};
