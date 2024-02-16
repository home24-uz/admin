<template lang="html">
  <div class="loader">
    <a-spin />
  </div>
</template>
<script>
export default {};
</script>
<style lang="css" scoped>
.loader {
  position: fixed;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 100;
  top: 0;
  left: 0;
  overflow: hidden;
}
</style>
