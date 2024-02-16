<template lang="html">
  <div>
    <TitleBlock title="Клиенты" :breadbrumb="['Главная']" lastLink="Клиенты">
    </TitleBlock>
    <div class="container_xl app-container">
      <div class="card_block py-5">
        <div class="d-flex justify-content-between align-items-center pt-4">
          <div class="d-flex justify-content-between w-100">
            <FormTitle title="Клиенты" />
          </div>
        </div>
        <div class="antd_table product_table">
          <a-table
            :columns="columns"
            :data-source="clients"
            :pagination="false"
            align="center"
          >
            <a slot="img" slot-scope="text"
              ><img class="table-image" src="../../../assets/images/image.png" alt=""
            /></a>
            <span
              @click="$router.push(`/home/clients/${text?.id}`)"
              slot="name"
              slot-scope="text"
            >
              <h6 style="cursor: pointer">{{ text?.name }}</h6>
            </span>
            <h4 slot="number" slot-scope="text">{{ text }}</h4>
            <a slot="price" slot-scope="text">${{ text }}</a>
            <span slot="key" slot-scope="text">#{{ text }}</span>
            <span slot="created_at" slot-scope="text">{{
              moment(text).format("DD/MM/YYYY")
            }}</span>
            <span slot="email" slot-scope="text">{{ text ? text : "----" }}</span>
            <span slot="customTitle"></span>

            <span
              slot="tags"
              slot-scope="tags"
              class="tags-style"
              :class="{
                tag_new: tags == 'Success',
                tag_pending: tags == 'in progress',
                tag_accepted: tags == 'Approved',
                tag_canceled: tags == 'rejected',
              }"
            >
              {{ tags }}
            </span>
            <span slot="btns" slot-scope="text">
              <span
                class="action-btn"
                v-if="checkAccess('clients', 'PUT')"
                @click="$router.push(`/home/clients/${text}`)"
              >
                <img :src="editIcon" alt="" />
              </span>
              <span
                class="action-btn"
                v-if="checkAccess('clients', 'DELETE')"
                @click="tableActions(text)"
              >
                <img :src="deleteIcon" alt="" />
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
  </div>
</template>
<script>
import AddBtn from "../../../components/form/Add-btn.vue";
import SearchInput from "../../../components/form/Search-input.vue";
import Title from "../../../components/Title.vue";
import TitleBlock from "../../../components/Title-block.vue";
import FormTitle from "../../../components/Form-title.vue";
import moment from "moment";
import global from "../../../mixins/global";
import authAccess from "@/mixins/authAccess";

export default {
  // middleware: "auth",
  mixins: [global, authAccess],
  data() {
    return {
      editIcon: require("../../../assets/svg/components/edit-icon.svg"),
      deleteIcon: require("../../../assets/svg/components/delete-icon.svg"),
      loading: false,
      clients: [],
      columns: [
        {
          title: "№",
          dataIndex: "key",
          key: "key",
          slots: { title: "customTitle" },
          scopedSlots: { customRender: "key" },
          align: "left",
          className: "column-name",
          width: "60px",
        },
        {
          title: "ФИО",
          slots: { title: "customTitle" },
          scopedSlots: { customRender: "name" },
          className: "column-name",
          width: "30%",
        },
        {
          title: "Номер телефона",
          dataIndex: "login",
          scopedSlots: { customRender: "login" },
          className: "column-code",
          key: "login",
          //   width: "10%",
        },
        {
          title: "Дата регистрации",
          dataIndex: "created_at",
          key: "created_at",
          align: "center",
          scopedSlots: { customRender: "created_at" },
          className: "column-date",
        },
        {
          title: "email",
          dataIndex: "email",
          className: "column-qty",
          scopedSlots: { customRender: "email" },
          key: "email",
          align: "center",
        },

        {
          title: "действия",
          key: "id",
          dataIndex: "id",
          scopedSlots: { customRender: "btns" },
          className: "column-btns",
          align: "right",
        },
      ],
      options: [
        {
          value: "All",
          label: "All",
        },
        {
          value: "Published",
          label: "Published",
        },
        {
          value: "Scheduled",
          label: "Scheduled",
        },
        {
          value: "Inactive",
          label: "Неактивен",
        },
      ],
      value: "",
      data: [
        {
          key: "1",
          name: "HONOR MagicBook X 15BBR",

          number: "02887003",
          email: "example@gmail.com",
          username: "6 700 000 sum",

          img: "Published",

          btns: "id",
        },
        {
          key: "2",
          name: "HONOR MagicBook X 15BBR",
          number: "02887003",
          email: "example@gmail.com",
          username: "6 700 000 sum",

          img: "Published",

          btns: "id",
        },
        {
          key: "3",
          name: "HONOR MagicBook X 15BBR",
          number: "02887003",
          email: "example@gmail.com",
          username: "6 700 000 sum",

          img: "Published",

          btns: "id",
        },
        {
          key: "4",
          name: "HONOR MagicBook X 15BBR",
          number: "02887003",
          email: "example@gmail.com",
          username: "6 700 000 sum",

          img: "Published",

          btns: "id",
        },
      ],
    };
  },
  methods: {
    tableActions(id) {},
    moment,
    async __GET_CLIENTS() {
      this.loading = true;
      const data = await this.$store.dispatch("fetchClients/getClients", {
        ...this.$route.query,
      });
      this.loading = false;
      const pageIndex = this.indexPage(
        data?.clients?.current_page,
        data?.clients?.per_page
      );
      this.clients = data?.clients?.data.map((item, index) => {
        return {
          ...item,
          key: index + pageIndex,
          indexId: index + pageIndex,
          dateAdd: moment(item?.created_at).format("DD/MM/YYYY"),
        };
      });
      this.totalPage = data?.clients?.total;
      this.clients.dataAdd = moment(data?.clients?.created_at).format("DD/MM/YYYY");
    },
    indexPage(current_page, per_page) {
      return (current_page * 1 - 1) * per_page + 1;
    },
  },

  mounted() {
    this.getFirstData("/home/clients", "__GET_CLIENTS");
  },
  watch: {
    async current(val) {
      this.changePagination(val, "/home/clients", "__GET_CLIENTS");
    },
  },
  components: {
    AddBtn,
    SearchInput,
    Title,
    TitleBlock,
    FormTitle,
  },
  layout: "toolbar",
};
</script>
