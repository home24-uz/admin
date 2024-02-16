<template lang="html">
  <div class="login_container">
    <div class="login_block">
      <div class="login_header mb-10">
        <h1 class="mb-3">Admin Panel</h1>
      </div>
      <div class="login_form">
        <a-form-model :model="auth" ref="ruleFormAuth" :rules="rules" layout="vertical">
          <div class="login_input mb-10">
            <label for="">Login</label>
            <a-form-model-item prop="username" class="mb-0">
              <a-input
                type="text"
                class="input"
                v-model="auth.username"
                placeholder="Login..."
              />
            </a-form-model-item>
          </div>
          <div class="login_input mb-10">
            <div class="d-flex justify-content-between">
              <label for="">Password</label>
              <!-- <nuxt-link to="/">Forgot Password ?</nuxt-link> -->
            </div>
            <a-form-model-item prop="password" class="mb-0">
              <a-input
                type="password"
                class="input"
                v-model="auth.password"
                placeholder="Password"
              />
            </a-form-model-item>
          </div>
        </a-form-model>
        <transition name="slide-fade">
          <span class="mb-3 d-block" style="margin-top: -15px">
            <a-alert
              v-if="showError"
              message="Пароль или логин неверный"
              type="error"
              closable
              show-icon
              :after-close="handleClose"
            />
          </span>
        </transition>
      </div>
      <div class="login_btn d-flex justify-content-center" @click="login">Continue</div>
    </div>
  </div>
</template>
<script>
export default {
  // middleware: "auth",
  middleware: "login",
  data() {
    return {
      showError: false,
      rules: {
        username: [
          { required: true, message: "This field is required", trigger: "change" },
        ],
        password: [
          { required: true, message: "This field is required", trigger: "change" },
        ],
      },
      auth: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    async __AUTH(data) {
      try {
        const res = await this.$store.dispatch("fetchAuth/auth", data);
        localStorage.setItem("auth_token", res.token);
        this.$store.commit("logIn");
        this.$router.push("/");
      } catch (e) {
        this.showError = true;
      }
    },
    login() {
      this.$refs.ruleFormAuth.validate((valid) => {
        if (valid) {
          this.__AUTH(this.auth);
        }
      });
    },
  },
};
</script>
<style lang="scss">
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
.login_input input {
  height: auto;
}
.login_input .ant-form-explain {
  position: absolute;
}
</style>
