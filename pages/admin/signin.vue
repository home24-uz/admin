<template lang="html">
  <div class="signin-container">
    <div class="form-block">
      <div class="form-card">
        <div class="form-title">
          <h1>Sign In</h1>
        </div>
        <form action="">
          <div class="d-flex flex-column">
            <input class="form-control" type="text" placeholder="Email" />
            <input
              class="form-control"
              type="password"
              placeholder="Password"
            />
            <div class="form-btn" @click="login">Sign In</div>
          </div>
        </form>
      </div>
    </div>
    <div class="signin-bg"></div>
  </div>
</template>
<script>
export default {
  // middleware: "auth",
  methods: {
    login() {
      // localStorage.setItem("Auth", "token");
      this.$router.push("/catalog/products");
    },
  },
};
</script>
<style lang=""></style>
