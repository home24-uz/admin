export default async function ({ redirect, $axios, store }) {
  try {
    const data = await $axios.$post(
      `/auth/me`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      }
    );

    store.commit("takeOperatorName", data?.me);
    store.commit("permissions", data?.permissions);
    store.commit("checkRole", data?.role);
  } catch (e) {
    localStorage.removeItem("auth_token");
    redirect("/admin/login");
  }
}
