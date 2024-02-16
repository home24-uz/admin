<template lang="html">
  <div class="v-notification">
    <div class="v-notification-icon">
      <span v-html="iconBuy"></span>
    </div>
    <div class="v-notification-body">
      <h4>Mahsulot Taqqoslash ga muvaf-faqiyatli qo’shildi.</h4>
      <p>Haridlar qilishda davom eting!</p>
    </div>
    <!-- <span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M13.9959 2.00586L2.00586 13.9434"
          stroke="#D9D9D9"
          stroke-width="2.20091"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M14 13.95L2 2"
          stroke="#D9D9D9"
          stroke-width="2.20091"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      iconBuy: require("../assets/svg/components/toast-buy.svg?raw"),
    };
  },
};
</script>
<style lang="css">
.v-notification {
  padding: 24px;
  background: #ffffff;
  border-radius: 16px;
  display: grid;
  grid-template-columns: 85px auto;
  max-width: 528px;
  position: fixed;
  top: 194px;
  right: 144px;
}
.v-notification-body {
  display: flex;
  flex-direction: column;
}
.v-notification-body h4 {
  font-family: var(--SB_600);
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 150%;
  color: #000000;
}
.v-notification-body p {
  margin-top: 10px;
  font-family: var(--SB_500);
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 150%;
  color: #949494;
}
</style>
