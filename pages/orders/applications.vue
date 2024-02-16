<template lang="html">
  <div>
    <TitleBlock title="Заявки" :breadbrumb="['Заказы']" lastLink="Заявки">
      <div class="d-flex">
        <!-- <div
          class="add-btn add-header-btn add-header-btn-padding btn-primary"
          @click="$router.push('/catalog/add_products')"
        >
          <span class="svg-icon" v-html="addIcon"></span>
          Добавить продукт
        </div> -->
      </div>
    </TitleBlock>
    <div class="container_xl app-container">
      <div class="card_block py-5">
        <div class="d-flex justify-content-between align-items-center card_header">
          <div class="prodduct-list-header-grid w-100 align-items-center">
            <SearchInput placeholder="Поиск" @changeSearch="changeSearch" />
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <a-table
          :columns="columnProductClick"
          :data-source="data"
          :loading="loading"
          :pagination="false"
          :page-size="params.pageSize"
          align="center"
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            columnWidth: '40px',
            align: 'right',
          }"
        >
          <span slot="img" slot-scope="text">
            <img
              v-if="text != null"
              class="table-image"
              :src="text.product?.images[0]?.sm_img"
              alt="text"
            />
            <!-- <nuxt-img
              format="webp"
              v-if="text != null"
              class="table-image"
              :src="text.product?.images[0]?.sm_img"
              alt="text"
            /> -->
            <nuxt-img
              format="webp"
              v-else
              class="table-image"
              src="../../assets/images/photo_2023-03-04_13-28-58.jpg"
              alt="text"
            />
          </span>
          <div slot="created_at" slot-scope="text">
            {{ moment(text).format("DD/MM/YYYY,  hh:mm") }}
          </div>
          <div slot="product" slot-scope="text">
            <h6>{{ text.product?.info?.name?.ru }}</h6>
            <span>{{
              text?.category?.parent?.parent &&
              text?.category?.parent?.parent?.name?.ru +
                "/" +
                text?.category?.parent?.name?.ru +
                "/" +
                text?.category?.name?.ru
            }}</span>
          </div>
          <span slot="phone_number" slot-scope="text"> {{ `+${text}` }}</span>
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

          <span slot="id" slot-scope="text">
            <span class="action-btn" @click="editApp(text)">
              <span v-html="editIcon"></span>
            </span>
            <a-popconfirm
              title="Are you sure delete this row?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="deletePoduct(text)"
              @cancel="cancel"
            >
              <span class="action-btn">
                <span v-html="deleteIcon"></span>
              </span>
            </a-popconfirm>
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
    <a-modal v-model="visible" title="Изменить статус" :closable="false" @ok="handleOk">
      <el-form
        label-position="top"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
      >
        <div>
          <div class="form-block mb-0">
            <el-form-item prop="type" label="Статус">
              <el-select class="w-100" v-model="ruleForm.status" placeholder="Cтатус">
                <el-option
                  v-for="(item, index) in options"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <template slot="footer">
        <div class="add_modal-footer d-flex justify-content-end">
          <div
            class="add-btn add-header-btn add-header-btn-padding btn-light-primary mx-3"
            @click="handleOk"
          >
            Отмена
          </div>
          <a-button
            class="add-btn add-header-btn btn-primary"
            type="primary"
            @click="submit"
          >
            Сохранить
          </a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script>
import SearchInput from "../../components/form/Search-input.vue";
import StatusFilter from "../../components/form/Status-filter.vue";
import TitleBlock from "../../components/Title-block.vue";
import global from "../../mixins/global";
import status from "@/mixins/status";
import columns from "../../mixins/columns";
import moment from "moment";
import authAccess from "@/mixins/authAccess";

export default {
  mixins: [global, status, columns, authAccess],
  data() {
    return {
      visible: false,
      rules: {},
      ruleForm: {
        status: undefined,
      },
      brandSelect: [
        {
          value: 2,
          label: "Samsung",
        },
        {
          value: 3,
          label: "Apple",
        },
        {
          value: 0,
          label: "HP",
        },
      ],
      options: [
        { value: "pending", label: "Ожидание" },
        {
          value: "accepted",
          label: "Принятые",
        },
        {
          value: "canceled",
          label: "Отмененные",
        },
      ],
      brandSearch: "",
      status: "",
      loading: true,
      editIcon: require("../../assets/svg/components/edit-icon.svg?raw"),
      deleteIcon: require("../../assets/svg/components/delete-icon.svg?raw"),
      addIcon: require("../../assets/svg/components/add-icon.svg?raw"),
      tableData: [],
      selectedRowKeys: [], // Check here to configure the default column
      products: [],
      data: [],
      searchProduct: "",
    };
  },
  methods: {
    moment,
    editApp(id) {
      let obj = this.data.find((item) => item.id == id);
      this.ruleForm.status = obj.status;
      this.editId = obj.id;
      this.visible = true;
    },
    submit() {
      this.$refs["ruleForm"].validate((valid) =>
        valid ? this.__EDIT_DATA(this.ruleForm) : false
      );
    },
    handleOk() {
      this.visible = false;
    },
    async __GET_PRODUCTS() {
      this.loading = true;
      this.products = await this.$store.dispatch("fetchApplications/getOneClickOrders", {
        ...this.$route.query,
      });
      this.totalPage = this.products.products?.total;
      this.loading = false;
      this.data = this.products.orders.data;
    },
    async __EDIT_DATA(res) {
      try {
        await this.$store.dispatch("fetchApplications/editOneClickOrders", {
          id: this.editId,
          data: res,
        });
        this.$notify({
          title: "Success",
          message: "Успешно изменен",
          type: "success",
        });
        this.handleOk();
        this.__GET_PRODUCTS();
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
    deletePoduct(id) {
      this.__DELETE_GLOBAL(
        id,
        "fetchApplications/deleteOneClickOrders",
        "Заявкa успешно удален",
        "__GET_PRODUCTS"
      );
    },
    changeSearch(val) {
      this.searchProduct = val.target.value;
    },
    changeStatus(val) {
      // this.status = val;
    },
  },
  async mounted() {
    this.getFirstData("/orders/applications", "__GET_PRODUCTS");
  },
  watch: {
    async current(val) {
      this.changePagination(val, "/orders/applications", "__GET_PRODUCTS");
    },
  },
  components: {
    SearchInput,
    TitleBlock,
    StatusFilter,
  },
  layout: "toolbar",
};
</script>
