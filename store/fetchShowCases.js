export const actions = {
  async getShowCasesById({}, payload) {
    try {
      const res = await this.$axios.$get(`/showcases/${payload}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      return res;
    } catch (e) {
      return e.response;
    }
  },
  async getShowCasesAll({}, payload) {
    try {
      const res = await this.$axios.$get(`/showcases/all`, {
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
  async editShowCases({}, payload) {
    const res = await this.$axios.$put(
      `/showcases/${payload.id}`,
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
