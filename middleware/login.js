export default function ({ store, redirect }) {
  const token = localStorage.getItem("auth_token");
  if (!!token) redirect("/");
}
