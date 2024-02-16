<template lang="html">
  <div>
    <TitleBlock title="Скидки" :breadbrumb="['Маркетинг']" lastLink="Скидки">
      <div
        v-if="checkAccess('discount', 'POST')"
        class="add-btn add-header-btn add-header-btn-padding btn-primary"
        @click="$router.push('/inbox/discount/add')"
      >
        <span class="svg-icon" v-html="addIcon"></span>
        Добавить
      </div>
    </TitleBlock>
    <div class="container_xl app-container">
      <div class="card_block py-5">
        <div class="d-flex justify-content-between align-items-center card_header">
          <div
            class="prodduct-list-header-grid w-100 align-items-center"
            style="grid-gap: 1.25rem"
          >
            <SearchInput
              placeholder="Поиск"
              @changeSearch="changeSearch($event, '/inbox/discount', '__GET_DISCOUNT')"
            />
            <span></span>
            <div class="input status-select">
              <el-select v-model="value" placeholder="Статус" @change="changeStatus">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <a-button
              @click="clearQuery('/inbox/discount', '__GET_DISCOUNT')"
              type="primary"
              class="d-flex align-items-center justify-content-center"
              style="height: 38px"
              ><a-icon type="reload"
            /></a-button>
          </div>
        </div>
        <div class="antd_table product_table">
          <a-table
            :columns="columnDiscount"
            :data-source="discounts"
            :pagination="false"
            :loading="loading"
            align="center"
          >
            <span slot="key" slot-scope="text">#{{ text }}</span>
            <span slot="name" slot-scope="text">
              <h6>{{ text?.ru }}</h6>
            </span>
            <span slot="desc" slot-scope="text">
              {{ text?.ru }}
            </span>
            <span slot="id" slot-scope="text">
              <span
                class="action-btn"
                v-if="checkAccess('discount', 'PUT')"
                @click="$router.push(`/inbox/discount/${text.id}`)"
              >
                <img :src="editIcon" alt="" />
              </span>
              <a-popconfirm
                v-if="checkAccess('discount', 'DELETE') && value"
                title="Are you sure delete this row?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="deleteAtribut(text)"
                @cancel="cancel"
              >
                <span class="action-btn">
                  <img :src="deleteIcon" alt="" />
                </span>
              </a-popconfirm>
            </span>
          </a-table>
          <div class="d-flex justify-content-between mt-4">
            <!-- <el-select
              v-model="params.pageSize"
              class="table-page-size"
              placeholder="Select"
              @change="
                ($event) =>
                  changePageSizeGlobal($event, '/inbox/discount', '__GET_DISCOUNT')
              "
            >
              <el-option
                v-for="item in pageSizes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select> -->
            <span></span>
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
import TitleBlock from "../../../components/Title-block.vue";
import SearchInput from "../../../components/form/Search-input.vue";
import global from "../../../mixins/global";
import status from "@/mixins/status";
import authAccess from "@/mixins/authAccess";
import columns from "../../../mixins/columns";
import StatusFilter from "../../../components/form/Status-filter.vue";

export default {
  layout: "toolbar",
  mixins: [global, status, columns, authAccess],
  data() {
    return {
      loading: true,
      editIcon: require("../../../assets/svg/components/edit-icon.svg"),
      deleteIcon: require("../../../assets/svg/components/delete-icon.svg"),
      addIcon: require("../../../assets/svg/components/add-icon.svg?raw"),
      selectedRowKeys: [],
      discounts: [],
      data: [],
      options: [
        {
          value: 1,
          label: "Активный",
        },
        {
          value: 0,
          label: "Архив",
        },
      ],
      value: 1,
    };
  },
  async mounted() {
    this.getFirstData("/inbox/discount", "__GET_DISCOUNT");
  },
  methods: {
    async getFirstData(url, dataFunc) {
      if (
        !Object.keys(this.$route.query).includes("page") ||
        !Object.keys(this.$route.query).includes("per_page") ||
        !Object.keys(this.$route.query).includes("status")
      ) {
        await this.$router.replace({
          path: url,
          query: { page: this.params.page, per_page: this.params.pageSize, status: 1 },
        });
      }
      this[dataFunc]();
      this.current = Number(this.$route.query.page);
      this.params.pageSize = Number(this.$route.query.per_page);
    },
    deleteAtribut(obj) {
      this.__DELETE_GLOBAL(
        obj.id,
        "fetchDiscount/deleteDiscount",
        "Успешно удален",
        "__GET_DISCOUNT"
      );
      // this.__PUT_DISCOUNT(obj);
    },
    async __PUT_DISCOUNT(obj) {
      try {
        await this.$store.dispatch("fetchDiscount/editDiscount", {
          id: obj.id,
          data: { ...obj, status: 0 },
        });
        this.notification("Success", "Успешно добавлен", "success");
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
    async __GET_DISCOUNT() {
      try {
        this.loading = true;
        const data = await this.$store.dispatch("fetchDiscount/getDiscount", {
          ...this.$route.query,
        });
        this.loading = false;
        this.totalPage = data.discounts?.total;
        const pageIndex = this.indexPage(
          data?.discounts?.current_page,
          data?.discounts?.per_page
        );
        this.discounts = data.discounts?.data.map((item, index) => {
          return {
            ...item,
            key: index + pageIndex,
          };
        });
      } catch (e) {
        this.statusFunc(e);
      }
    },
    indexPage(current_page, per_page) {
      return (current_page * 1 - 1) * per_page + 1;
    },
    async changeStatus(val) {
      this.status = val;
      await this.$router.replace({
        path: this.$route.path,
        query: { ...this.$route.query, status: val },
      });
      this.__GET_DISCOUNT();
    },
  },

  watch: {
    async current(val) {
      this.changePagination(val, "/inbox/discount", "__GET_DISCOUNT");
    },
  },
  components: {
    SearchInput,
    TitleBlock,
    StatusFilter,
  },
};
// 246
</script>
