export const actions = {
  async getTranslations({}, payload) {
    try {
      const res = await this.$axios.$get(`/translates`, {
        params: payload,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      return res;
    } catch (e) {
      return e;
    }
  },
  async getTranslateGruop({}, payload) {
    try {
      const res = await this.$axios.$get(`/translate_groups`, {
        params: payload,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      return res;
    } catch (e) {
      return e;
    }
  },
  async getAllTranslations() {
    const res = await this.$axios.$get(`/translates/all`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async getTranslationsById({}, id) {
    try {
      const res = await this.$axios.$get(`/translates/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      return res;
    } catch (e) {
      return e;
    }
  },

  async postTranslations({}, data) {
    const res = await this.$axios.$post(`/translates`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async postUpdateTranslations({}, data) {
    const res = await this.$axios.$put(`/translates/multiple_update`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async postTranslateGroup({}, data) {
    const res = await this.$axios.$post(`/translate_groups`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async editTranslations({}, payload) {
    const res = await this.$axios.$put(
      `/translates/${payload.id}`,
      payload.data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      }
    );
    return res;
  },
  async deleteTranslations({}, id) {
    const res = await this.$axios.$delete(`/translates/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
};
