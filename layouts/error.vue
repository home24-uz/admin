<template lang="html">
  <div class="error-container">
    <div class="error-block">
      <div class="error-card d-flex flex-column align-items-center">
        <h1>
      
          Oops!
        </h1>
        <div class="error-text">We can't find that page.</div>

        <div class="error-img">
          <img src="../assets/images/404-error.png" alt="" />
        </div>
        <div class="to-home btn btn-primary" @click="$auth.logout('local')">
          Return Home
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['error']
};
</script>
