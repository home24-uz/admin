export const actions = {
  async getPermissions({}, payload) {
    try {
      const res = await this.$axios.$get(`/permissions`, {
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
  async getPermissionsById({}, id) {
    try {
      const res = await this.$axios.$get(`/permissions/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      return res;
    } catch (e) {
      return e.response;
    }
  },
  async postPermissions({}, data) {
    try {
      const res = await this.$axios.$post(`/permissions`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      return res;
    } catch (e) {
      return e.response;
    }
  },
  async editPermissions({}, payload) {
    try {
      const res = await this.$axios.$put(
        `/permissions/${payload.id}`,
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
  async deletePermissions({}, id) {
    try {
      const res = await this.$axios.$delete(`/permissions/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      return res;
    } catch (e) {
      return e.response;
    }
  },

  async getPermissionGroups({}, payload) {
    try {
      const res = await this.$axios.$get(`/permission_groups`, {
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
  async getPermissionGroupsById({}, id) {
    try {
      const res = await this.$axios.$get(`/permission_groups/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      return res;
    } catch (e) {
      return e.response;
    }
  },
  async postPermissionGroups({}, data) {
    try {
      const res = await this.$axios.$post(`/permission_groups`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      return res;
    } catch (e) {
      return e.response;
    }
  },
  async editPermissionGroups({}, payload) {
    try {
      const res = await this.$axios.$put(
        `/permission_groups/${payload.id}`,
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
  async deletePermissionGroups({}, id) {
    try {
      const res = await this.$axios.$delete(`/permission_groups/${id}`, {
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
