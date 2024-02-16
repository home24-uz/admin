<template lang="html">
  <div class="login_container">
    <div class="login_block">
      <div class="login_header mb-10">
        <h1 class="mb-3">Sign In to Home24 Admin</h1>
      </div>
      <div class="login_form">
        <div class="login_input mb-10">
          <label for="">Number</label>
          <input type="text" class="input" />
        </div>
        <div class="login_input mb-10">
          <div class="d-flex justify-content-between">
            <label for="">Password</label>
            <nuxt-link to="/">Forgot Password ?</nuxt-link>
          </div>
          <input type="password" class="input" />
        </div>
      </div>
      <div class="login_btn d-flex justify-content-center" @click="login">Continue</div>
    </div>
  </div>
</template>
<script>
export default {
  // middleware: "auth",
  methods: {
    login() {
      // this.$auth.loginWith("local", {
      //   data: {
      //     nbm: "+998910028174",
      //     password: "mypass1234",
      //   },
      // });
      this.$router.push("/catalog/products");
      // localStorage.setItem("Auth", "token");
      // this.$router.push("/catalog/products");
    },
  },
};
</script>
<style lang="scss"></style>
