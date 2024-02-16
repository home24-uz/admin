<template lang="html">
  <div class="input status-select">
    <el-select
      v-model="value"
      :placeholder="propPlaceholder || 'Статус'"
      @change="($event) => $emit('changeStatus', $event)"
    >
      <el-option
        v-for="item in propOptions || options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  props: ["propOptions", "propPlaceholder", "propName"],
  data() {
    return {
      options: [
        {
          value: 0,
          label: "All",
        },
        {
          value: "active",
          label: "Активный",
        },
        {
          value: "inactive",
          label: "Неактивный",
        },
      ],
      value: "",
    };
  },
  computed: {
    routerQuery() {
      return this.$route.query[this.propName];
    },
  },
  mounted() {
    if (this.propName == "status") this.value = this.$route.query[this.propName];
  },
  watch: {
    "propOptions.length"() {
      if (
        this.propOptions?.find(
          (item) => item?.value == this.$route.query[this.propName]
        ) &&
        this.propName
      )
        this.value = this.propOptions?.find(
          (item) => item?.value == this.$route.query[this.propName]
        )?.value;
    },
    routerQuery(val) {
      if (!val && this.propName) {
        this.value = "";
      }
    },
  },
};
</script>
