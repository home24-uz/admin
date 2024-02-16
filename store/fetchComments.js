export const actions = {
  async getComments({}, payload) {
    try {
      const res = await this.$axios.$get(`/comments`, {
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
  async getCommentsById({}, id) {
    try {
      const res = await this.$axios.$get(`/comments/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      return res;
    } catch (e) {
      return e.response;
    }
  },
  async postComments({}, data) {
    try {
      const res = await this.$axios.$post(`/comments`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      return res;
    } catch (e) {
      return e.response;
    }
  },
  async editComments({}, payload) {
    try {
      const res = await this.$axios.$put(
        `/comments/${payload.id}`,
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
  async deleteComments({}, id) {
    try {
      const res = await this.$axios.$delete(`/comments/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      return res;
    } catch (e) {
      return e.response;
    }
  },
  async postGroups({}, data) {
    const res = await this.$axios.$post(`/comments_groups`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async getGroups() {
    const res = await this.$axios.$get(`/comments_groups/all`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
};
