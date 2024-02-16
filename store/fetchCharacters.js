export const actions = {
  async getCharacteristics({}, payload) {
    try {
      const res = await this.$axios.$get(`/characteristics`, {
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
  async getOptions({}, payload) {
    try {
      const res = await this.$axios.$get(`/characteristics_options`, {
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
  async postOptions({}, data) {
    try {
      const res = await this.$axios.$post(
        `/characteristics_options/store_more`,
        data,
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
  async getCharacteristicsById({}, id) {
    try {
      const res = await this.$axios.$get(`/characteristics/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      return res;
    } catch (e) {
      return e.response;
    }
  },
  async postCharacteristics({}, data) {
    const res = await this.$axios.$post(`/characteristics`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async editCharacteristics({}, payload) {
    const res = await this.$axios.$put(
      `/characteristics/${payload.id}`,
      payload.data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      }
    );
    return res;
  },
  async deleteCharacteristics({}, id) {
    try {
      const res = await this.$axios.$delete(`/characteristics/${id}`, {
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
    const res = await this.$axios.$post(`/characteristics_groups`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async getGroups({}, payload) {
    const res = await this.$axios.$get(`/characteristics_groups/all`, {
      params: payload,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
  async deleteGroups({}, id) {
    const res = await this.$axios.$delete(`/characteristics/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res;
  },
};
