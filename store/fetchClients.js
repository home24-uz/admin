export const actions = {
  async getClients({}, data) {
    const res = await this.$axios.$get(`/clients`, {
      params: { ...data },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async showClients({}, id) {
    const res = await this.$axios.$get(`/clients/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
};
