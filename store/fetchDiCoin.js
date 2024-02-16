export const actions = {
  async postDiCoin({}, data) {
    const res = await this.$axios.$post(`/dicoin`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async showDiCoin() {
    const res = await this.$axios.$get(`/dicoin`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
};
