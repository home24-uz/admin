export default function ({ redirect }) {
  const loggeduser = localStorage.getItem("Auth");
  if (loggeduser) {
    redirect("/catalog/products");
  }
}
