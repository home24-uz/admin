<template lang="html">
  <div>
    <div class="card_block py-5">
      <div class="order-links-grid">
        <nuxt-link
          class="order-links"
          :class="{ 'active-orders': $route.path == '/orders/new-orders' }"
          to="/orders/new-orders"
        >
          <span class="order-light-blue"></span> Новые ({{
            this.$store.state.ordersCount.new
          }})
        </nuxt-link>
        <nuxt-link
          class="order-links"
          :class="{
            'active-orders': $route.path == '/orders/pending-orders',
          }"
          to="/orders/pending-orders"
        >
          <span class="order-yellow"></span> Ожидание ({{
            this.$store.state.ordersCount.pending
          }})
        </nuxt-link>
        <nuxt-link
          class="order-links"
          :class="{
            'active-orders': $route.path == '/orders/delivery-orders',
          }"
          to="/orders/delivery-orders"
        >
          <span class="order-grey"></span>
          В доставке ({{ this.$store.state.ordersCount.on_the_way }})
        </nuxt-link>
        <nuxt-link
          class="order-links"
          :class="{
            'active-orders': $route.path == '/orders/accepted-orders',
          }"
          to="/orders/accepted-orders"
        >
          <span class="order-black"></span> Принятые ({{
            this.$store.state.ordersCount.accepted
          }})
        </nuxt-link>

        <nuxt-link
          class="order-links"
          :class="{ 'active-orders': $route.path == '/orders/returned-orders' }"
          to="/orders/returned-orders"
        >
          <span class="order-purple"></span> Возврат ({{
            this.$store.state.ordersCount.returned
          }})
        </nuxt-link>
        <nuxt-link
          class="order-links"
          :class="{
            'active-orders': $route.path == '/orders/done-orders',
          }"
          to="/orders/done-orders"
        >
          <span class="order-green"></span> Доставленные ({{
            this.$store.state.ordersCount.done
          }})
        </nuxt-link>
        <nuxt-link
          class="order-links"
          :class="{
            'active-orders': $route.path == '/orders/canceled-orders',
          }"
          to="/orders/canceled-orders"
        >
          <span class="order-red"></span> Отмененные ({{
            this.$store.state.ordersCount.canceled
          }})
        </nuxt-link>
      </div>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style lang=""></style>
