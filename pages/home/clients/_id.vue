<template lang="html">
  <div class="all-orders">
    <TitleBlock title="Клиенты" :breadbrumb="['Главная']" lastLink="Клиенты"></TitleBlock>
    <div class="container_xl app-container mt-5">
      <div class="mt-4 mb-5">
        <div class="custom_block customer_card_padding">
          <div class="customer_card">
            <div class="customer_details">
              <h1>{{ client?.name }}</h1>
            </div>
          </div>
          <div class="customer_tab">
            <span
              @click="customerTab = 1"
              :class="{ 'avtive-customerTab': customerTab == 1 }"
            >
              Настройки
            </span>
            <span
              @click="customerTab = 2"
              :class="{ 'avtive-customerTab': customerTab == 2 }"
            >
              Заказы
            </span>
          </div>
        </div>
      </div>
      <div class="mt-4 mb-5" v-if="customerTab == 1">
        <div class="custom_block">
          <div class="hr_header px-4 pt-4">
            <FormTitle title="Детали профиля" />
          </div>
          <div class="customer_info px-4 pb-4">
            <div class="order-details-items bb_none">
              <span>Дата Добавлена</span>
              <p>{{ moment(client?.created_at).format("DD/MM/YYYY") }}</p>
            </div>
            <div class="order-details-items bb_none">
              <span> Номер телефона</span>
              <p>{{ client?.login ? `+${client?.login}` : "----" }}</p>
            </div>
            <div class="order-details-items bb_none">
              <span> Электронная почта </span>
              <span>{{ client?.email ? client?.email : "----" }}</span>
            </div>
           
          </div>
        </div>
      </div>
      <div class="mt-4 mb-5" v-if="customerTab == 1">
        <div class="custom_block">
          <div class="hr_header px-4 pt-4">
            <FormTitle title="Адреса" />
          </div>
          <div class="customer_info px-4 pb-4" v-if="client?.addresses?.length > 0">
            <div
              class="order-details-items bb_none"
              v-for="address in client?.addresses"
              :key="address?.id"
            >
              <span
                ><svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    opacity="0.3"
                    d="M18.0624 15.3453L13.1624 20.7453C12.5624 21.4453 11.5624 21.4453 10.9624 20.7453L6.06242 15.3453C4.56242 13.6453 3.76242 11.4453 4.06242 8.94534C4.56242 5.34534 7.46242 2.44534 11.0624 2.04534C15.8624 1.54534 19.9624 5.24534 19.9624 9.94534C20.0624 12.0453 19.2624 13.9453 18.0624 15.3453Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M12.0624 13.0453C13.7193 13.0453 15.0624 11.7022 15.0624 10.0453C15.0624 8.38849 13.7193 7.04535 12.0624 7.04535C10.4056 7.04535 9.06241 8.38849 9.06241 10.0453C9.06241 11.7022 10.4056 13.0453 12.0624 13.0453Z"
                    fill="currentColor"
                  ></path>
                </svg>
                {{ address?.region?.name?.ru }}, {{ address?.district?.name?.ru }},
                {{ address?.village?.name?.ru }}, {{ address?.address }}</span
              >
            </div>
          </div>
          <div class="px-4 pb-4" v-else>
            <div class="d-flex justify-content-center w-100 mt-5">
              <a-empty />
            </div>
          </div>
        </div>
      </div>

      <div class="mb-5" v-if="customerTab == 2">
        <div class="card_block py-5">
          <div class="d-flex justify-content-between align-items-center card_header">
            <div class="d-flex align-items-between justify-content-between w-100 pt-4">
              <FormTitle title="Заказы" />

              <div class="d-flex align-items-center"></div>
            </div>
          </div>
          <a-table
            :columns="columns"
            :data-source="client?.orders"
            :pagination="false"
            align="center"
          >
            <span slot="id" slot-scope="text"
              ><nuxt-link :to="`/orders/${text}/details`">#{{ text }}</nuxt-link></span
            >
            <span slot="created_at" slot-scope="text">{{
              moment(text).format("DD/MM/YYYY")
            }}</span>
            <span slot="phone_number" slot-scope="text">+{{ text }}</span>
            <span slot="adress" slot-scope="text">{{
              text
                ? `${address?.find((item) => item?.id == text)?.region?.name?.ru}, ${
                    address?.find((item) => item?.id == text)?.district?.name?.ru
                  }, ${address?.find((item) => item?.id == text)?.address}`
                : "----"
            }}</span>
            <a slot="img" slot-scope="text"
              ><img class="table-image" src="../../../assets/images/image.png" alt=""
            /></a>
            <nuxt-link
              to="/catalog/products"
              slot="client"
              slot-scope="text"
              align="center"
            >
              {{ text }}
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
                tag_returned: tags == 'returned',
                tag_new: tags == 'new',
                tag_done: tags == 'done',
              }"
            >
              {{ tags }}
            </span>
            <span slot="btns" slot-scope="text">
              <span class="action-btn" @click="tableActions(text)">
                <img :src="editIcon" alt="" />
              </span>
              <span class="action-btn" @click="tableActions(text)">
                <img :src="deleteIcon" alt="" />
              </span>
            </span>
          </a-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AddBtn from "../../../components/form/Add-btn.vue";
import SearchInput from "../../../components/form/Search-input.vue";
import TitleBlock from "../../../components/Title-block.vue";
import FormTitle from "../../../components/Form-title.vue";
import moment from "moment";
export default {
  layout: "toolbar",
  data() {
    return {
      pageSize: 10,
      editIcon: require("../../../assets/svg/components/edit-icon.svg"),
      deleteIcon: require("../../../assets/svg/components/delete-icon.svg"),
      tableData: [],
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      activeName: "summa",
      address: [],
      client: {},
      customerTab: 1,
      lang: [
        {
          key: "Русский",
        },
        {
          key: "Uzbek",
        },
        {
          key: "English",
        },
      ],
      data: [
        {
          key: "1",
          orderId: "#123",
          client: "A nam .column-name .column-name",
          dataAdd: "22.22.2022",
          dataEdit: "22.22.2022",
          price: "23423432",
          statusSum: "status",
          tags: "Success",
          btns: "id",
        },
        {
          key: "2",
          orderId: "#123",
          client: "A nam .column-name .column-name",
          dataAdd: "22.22.2022",
          dataEdit: "22.22.2022",
          price: "23423432",
          statusSum: "status",
          tags: "Success",
          btns: "id",
        },
        {
          key: "3",
          orderId: "#123",
          client: "A nam .column-name .column-name",
          dataAdd: "22.22.2022",
          dataEdit: "22.22.2022",
          price: "23423432",
          statusSum: "status",
          tags: "Success",
          btns: "id",
        },
        {
          key: "4",
          orderId: "#123",
          client: "A nam .column-name .column-name",
          dataAdd: "22.22.2022",
          dataEdit: "22.22.2022",
          price: "23423432",
          statusSum: "status",
          tags: "Success",
          btns: "id",
        },
        {
          key: "5",
          orderId: "#123",
          client: "A nam .column-name .column-name",
          dataAdd: "22.22.2022",
          dataEdit: "22.22.2022",
          price: "23423432",
          statusSum: "status",
          tags: "Success",
          btns: "id",
        },
      ],
      data2: [
        {
          key: "1",
          dateAdd: "22.22.2022",
          comment: "lorem ipsum ssdf dsfsdf",
          customer: "No",
          tags: "Completed",
        },
        {
          key: "2",
          dateAdd: "22.22.2022",
          comment: "lorem ipsum ssdf dsfsdf",
          customer: "No",
          tags: "Failed",
        },
        {
          key: "3",
          dateAdd: "22.22.2022",
          comment: "lorem ipsum ssdf dsfsdf",
          customer: "No",
          tags: "Pending",
        },
        {
          key: "4",
          dateAdd: "22.22.2022",
          comment: "lorem ipsum ssdf dsfsdf",
          customer: "No",
          tags: "Processing",
        },
        {
          key: "5",
          dateAdd: "22.22.2022",
          comment: "lorem ipsum ssdf dsfsdf",
          customer: "No",
          tags: "Delivered",
        },
        {
          key: "6",
          dateAdd: "22.22.2022",
          comment: "lorem ipsum ssdf dsfsdf",
          customer: "No",
          tags: "Delivering",
        },
      ],
      dataOrder: [
        {
          key: "1",
          orderId: "#123",
          product: "A nam .column-name .column-name",
          sku: "123234352",
          qty: "2",
          price: "$120.00",
          totalSum: "$240.00",
        },
        {
          key: "2",
          orderId: "#123",
          product: "A nam .column-name .column-name",
          sku: "123234352",
          qty: "2",
          price: "$120.00",
          totalSum: "$240.00",
        },
        {
          key: "3",
          orderId: "#123",
          product: "A nam .column-name .column-name",
          sku: "123234352",
          qty: "2",
          price: "$120.00",
          totalSum: "$240.00",
        },
      ],

      columns: [
        {
          title: "Номер заказ",
          dataIndex: "id",
          key: "id",
          slots: { title: "customTitle" },
          scopedSlots: { customRender: "id" },
          className: "column-code",
        },

        {
          title: "Номер клиента",
          dataIndex: "phone_number",
          scopedSlots: { customRender: "phone_number" },
          className: "column-code",
          key: "phone_number",
        },
        {
          title: "Адрес",
          dataIndex: "user_address_id",
          scopedSlots: { customRender: "adress" },
          className: "column-name",
          key: "user_address_id",
        },
        {
          title: "статус",
          dataIndex: "status",
          scopedSlots: { customRender: "tags" },
          className: "column-tags",
          key: "status",
        },
        {
          title: "дата",
          dataIndex: "created_at",
          scopedSlots: { customRender: "created_at" },
          className: "column-code",
          key: "created_at",
        },
      ],
      columns2: [
        {
          title: "ДАТА ДОБАВЛЕНА",
          dataIndex: "dateAdd",
          key: "dateAdd",
          slots: { title: "customTitle" },
          scopedSlots: { customRender: "dateAdd" },
          className: "column-code",
        },

        {
          title: "КОММЕНТАРИЙ",
          dataIndex: "comment",
          scopedSlots: { customRender: "comment" },
          className: "column-code",
          key: "comment",
        },

        {
          title: "СТАТУС ЗАКАЗА",
          dataIndex: "tags",
          scopedSlots: { customRender: "tags" },
          className: "column-tags",
          key: "tags",
        },
        {
          title: "КЛИЕНТ УВЕДОМЛЕН",
          dataIndex: "customer",
          scopedSlots: { customRender: "customer" },
          className: "column-code",
          key: "customer",
        },
      ],
    };
  },
  mounted() {
    if (this.data) {
      this.tableData = this.data;
    }
    this.__GET_CLIENT();
  },
  methods: {
    moment,
    tableActions(id) {},
    async __GET_CLIENT() {
      const data = await this.$store.dispatch(
        "fetchClients/showClients",
        this.$route.params.id
      );
      this.client = data?.client;
      this.address = data?.client?.addresses;
    },
  },
  components: {
    TitleBlock,
    SearchInput,
    AddBtn,
    FormTitle,
    FormTitle,
  },
};
</script>
<style lang="scss"></style>
