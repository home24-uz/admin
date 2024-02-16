<template lang="html">
  <div class="all-orders">
    <TitleBlock title="Все заказы" :breadbrumb="['Заказы']" lastLink="Все заказы">
    </TitleBlock>
    <div class="container_xl app-container">
      <OrderStatusMenu />
    </div>
    <div class="container_xl app-container mb-5">
      <div class="card_block py-5">
        <div class="d-flex justify-content-between align-items-center card_header">
          <div class="order-list-header-grid w-100 align-items-center">
            <SearchInput
              placeholder="Поиск заказа"
              @changeSearch="
                ($event) => changeSearch($event, '/orders/all-orders', '__GET_ORDERS')
              "
            />
            <div class="input status-select">
              <el-date-picker
                v-model="value1"
                type="daterange"
                @change="onChangeDate"
                start-placeholder="Дата начала"
                end-placeholder="Дата окончания"
              >
              </el-date-picker>
            </div>
            <StatusFilter
              @changeStatus="($event) => changeStatus($event, 'operator')"
              :propOptions="operators"
              propName="operator"
              propPlaceholder="Операторы"
            />
            <StatusFilter
              @changeStatus="($event) => changeStatus($event, 'region')"
              :propOptions="regions"
              propName="region"
              propPlaceholder="Регионы"
            />
            <a-button
              @click="clearQuery('/orders/all-orders', '__GET_ORDERS')"
              type="primary"
              class="d-flex align-items-center justify-content-center"
              style="height: 38px"
              ><a-icon type="reload"
            /></a-button>
          </div>
        </div>
        <a-table
          :columns="columnOrders"
          :data-source="orders"
          :loading="loading"
          :pagination="false"
          align="center"
          :customRow="
            (column) => {
              return {
                on: {
                  click: (e) => clickRow(column), // click header row
                },
              };
            }
          "
        >
          <span slot="orderId" slot-scope="text">#{{ text }}</span>
          <span slot="operator" slot-scope="text">{{
            text ? text?.username : "----"
          }}</span>
          <span slot="user_address" slot-scope="text">{{
            text?.delivery_method == "pickup"
              ? "Самовывоз"
              : text?.user_address?.region?.name?.ru
          }}</span>
          <nuxt-link
            :to="`/orders/${text?.id}/details`"
            slot="name"
            slot-scope="text"
            align="center"
          >
            {{ text?.name }}
          </nuxt-link>
          <a slot="price" slot-scope="text">${{ text }}</a>
          <span slot="customTitle"></span>

          <span
            slot="tags"
            slot-scope="tags"
            class="tags-style"
            :class="{
              tag_pending: tags == 'pending',
              tag_accepted: tags == 'accepted',
              tag_canceled: tags == 'canceled',
              tag_done: tags == 'done',
              tag_new: tags == 'new',
              tag_returned: tags == 'returned',
            }"
          >
            {{ statusTypes[tags] }}
          </span>
          <span slot="btns" slot-scope="text">
            <span
              class="action-btn"
              v-if="checkAccess('orders', 'PUT')"
              @click="$router.push(`/orders/${text}/edit`)"
            >
              <img :src="editIcon" alt="" />
            </span>
          </span>
        </a-table>
        <div class="d-flex justify-content-end mt-4">
          <a-pagination
            class="table-pagination"
            :simple="false"
            v-model.number="current"
            :total="totalPage"
            :page-size.sync="params.pageSize"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SearchInput from "../../components/form/Search-input.vue";
import TitleBlock from "../../components/Title-block.vue";
import moment from "moment";
import global from "../../mixins/global";
import columns from "../../mixins/columns";
import OrderStatusMenu from "../../components/OrderStatusMenu.vue";
import authAccess from "@/mixins/authAccess";
import StatusFilter from "../../components/form/Status-filter.vue";
export default {
  layout: "toolbar",
  mixins: [global, columns, authAccess],
  data() {
    return {
      
      operators: [],
      value1: "",
      operatorsValue: null,
      regions: [],
      editIcon: require("../../assets/svg/components/edit-icon.svg"),
      loading: false,
      orders: [],
      options: [
        {
          value: 0,
          label: "All23432ewqrw",
        },
        {
          value: "active",
          label: "Активныйsdfsdf",
        },
        {
          value: "inactive",
          label: "Неактивныйsdfsdf",
        },
      ],
    };
  },
  async mounted() {
    if (
      !Object.keys(this.$route.query).includes("page") ||
      !Object.keys(this.$route.query).includes("per_page")
    ) {
      await this.$router.replace({
        path: "/orders/all-orders",
        query: {
          page: this.params.page,
          per_page: this.params.pageSize,
        },
      });
    }
    this.__GET_ORDERS();
    this.__GET_REGIONS();
    this.__GET_OPERATORS();
    this.current = Number(this.$route.query.page);
    this.params.pageSize = Number(this.$route.query.per_page);
  },
  methods: {
    clickRow(obj) {
      this.$router.push(`/orders/${obj?.id}/details`);
    },
    async changeStatus(val, queryName) {
      // this.status = val;
      if (val) {
        await this.$router.replace({
          path: this.$route.path,
          query: { ...this.$route.query, [queryName]: val },
        });
      } else {
        let query = { ...this.$route.query };
        delete query[queryName];
        await this.$router.replace({
          path: this.$route.path,
          query: { ...query },
        });
      }

      this.__GET_ORDERS();
    },
    moment,
    async __GET_ORDERS() {
      this.loading = true;
      const data = await this.$store.dispatch("fetchOrders/getOrders", {
        ...this.$route.query,
      });
      this.loading = false;
      const pageIndex = this.indexPage(
        data?.orders?.current_page,
        data?.orders?.per_page
      );
      this.orders = data?.orders?.data.map((item, index) => {
        return {
          ...item,
          key: index + pageIndex,
          orderId: item.id,
          phone_number: `+${item.phone_number}`,
          dateAdd: moment(item?.created_at).format("DD/MM/YYYY HH:mm"),
          count: item?.products.length,
        };
      });
      this.totalPage = data?.orders?.total;
    },
    async __GET_OPERATORS() {
      const data = await this.$store.dispatch("fetchAdmins/getAdmins");
      this.operators = await data?.users?.map((item) => {
        return {
          label: item.username,
          value: item.id,
        };
      });
      this.operatorsValue = this.$route.query?.operator;
    },
    async __GET_REGIONS() {
      const data = await this.$store.dispatch("fetchRegions/getRegions");
      this.regions = data?.regions?.data?.map((item) => {
        return {
          label: item.name.ru,
          value: item.id,
        };
      });
    },
    async onChangeDate(e) {
      let dates = []
      if (val) {
        await this.$router.replace({
          path: this.$route.path,
          query: { ...this.$route.query, [queryName]: val },
        });
      } else {
        let query = { ...this.$route.query };
        delete query[queryName];
        await this.$router.replace({
          path: this.$route.path,
          query: { ...query },
        });
      }

      this.__GET_ORDERS();
    },
    indexPage(current_page, per_page) {
      return (current_page * 1 - 1) * per_page + 1;
    },
  },
  watch: {
    async current(val) {
      this.changePagination(val, "/orders/all-orders", "__GET_ORDERS");
    },
  },
  components: { TitleBlock, SearchInput, OrderStatusMenu, StatusFilter },
};
</script>
