<template lang="html">
  <div class="product-character-container">
    <div class="product-character-block">
      <div
        class="product-character-items"
        v-for="(item, index) in character"
        :key="index"
      >
        <div class="product-character-name">{{ item.name }}</div>
        <div class="product-character-info">{{ item.info }}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      character: [
        {
          name: "Бренд",
          info: "Product name",
        },
        {
          name: "Количество SIM-карт",
          info: "Product name",
        },
        {
          name: "Версия ОС",
          info: "Product name",
        },
        {
          name: "Версия ОС",
          info: "Product name",
        },
        {
          name: "Тип SIM-карты",
          info: "Beeline",
        },
        {
          name: "Вес(гр)",
          info: "Product name",
        },
        {
          name: "Бренд",
          info: "Product name",
        },
      ],
    };
  },
};
</script>
<style lang=""></style>
