export const actions = {
  async auth({}, data) {
    const res = await this.$axios.$post(`/auth/login`, data);
    return res;
  },
  async logOut({}, data) {
    const res = await this.$axios.$post(
      `/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      }
    );
    return res;
  },
};
