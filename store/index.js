export const state = () => ({
  showcases: [],
  changeShowcases: true,
  authenticated: false,
  permissions: [],
  operator: {
    name: "",
  },
  role: null,
  ordersCount: {
    all: 0,
    accepted: 0,
    canceled: 0,
    done: 0,
    new: 0,
    pending: 0,
    returned: 0,
    on_the_way: 0,
  },
});

export const mutations = {
  permissions(state, payload) {
    if (payload) {
      state.permissions = payload;
    }
  },
  logIn(state) {
    state.authenticated = true;
  },
  checkRole(state, payload) {
    state.role = payload;
  },
  showcases(state, payload) {
    state.showcases = payload.data;
    state.changeShowcases = payload.change;
  },
  takeOperatorName(state, payload) {
    state.operator = payload;
  },
  ordersCount(state, payload) {
    state.ordersCount.all =
      payload.pending + payload.accepted + payload.canceled + payload.new + payload.done + payload.on_the_way;
    state.ordersCount.new = payload.new;
    state.ordersCount.pending = payload.pending;
    state.ordersCount.accepted = payload.accepted;
    state.ordersCount.canceled = payload.canceled;
    state.ordersCount.done = payload.done;
    state.ordersCount.returned = payload.returned;
    state.ordersCount.on_the_way = payload.on_the_way;
  },
};

export const actions = {
  async getOrdersCount({ commit }, payload) {
    const res = await this.$axios.$get(`/orders/counts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    commit("ordersCount", res?.counts);
  },
  async getShowCasesStore({ commit }, payload) {
    const res = await this.$axios.$get(`/showcases/all`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    commit("showcases", { data: res?.showcases, change: payload });
  },
  async getPermissions({ commit }, payload) {
    try {
      const res = await this.$axios.$post(
        `/auth/me`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
      commit("permissions", res?.permissions);
      commit("checkRole", res?.role);
      commit("takeOperatorName", res?.me);
    } catch (e) {
      localStorage.removeItem("auth_token");
      this.$router.push("/");
    }
  },
};
