<template lang="html">
  <div>
    {{ data }}
    <el-input type="text" v-model="data" />
  </div>
</template>
<script>
export default {
  props: {
    calback: {
      type: Function,
    },
  },
  data() {
    return {
      data: "",
    };
  },
  methods: {
    exp(val) {
      if (this.calback()) {
        this.calback(val);
      }
    },
  },
  watch: {
    data(val) {
        this.exp(val)
    }
  }
};
</script>
<style lang=""></style>
