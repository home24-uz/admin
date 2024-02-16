<template lang="html">
  <div>
    <TitleBlock title="Aкции" :breadbrumb="['Маркетинг']" lastLink="Aкции">
      <div
        v-if="checkAccess('promotions', 'POST')"
        class="add-btn add-header-btn add-header-btn-padding btn-primary"
        @click="$router.push('/inbox/promotions/add')"
      >
        <span class="svg-icon" v-html="addIcon"></span>
        Добавить
      </div>
    </TitleBlock>
    <div class="container_xl app-container">
      <div class="card_block py-5">
        <div class="d-flex justify-content-between align-items-center pt-4">
          <div class="d-flex justify-content-between w-100">
            <FormTitle title="Aкции" />
          </div>
        </div>
        <div class="antd_table product_table">
          <a-table
            :columns="columnPromotions"
            :data-source="groups"
            :pagination="false"
            align="center"
            :loading="loading"
          >
            <span slot="banner" slot-scope="text">
              <img v-if="text" class="table-image" :src="text" alt="text" />
              <img
                v-else
                class="table-image"
                src="../../../assets/images/photo_2023-03-04_13-28-58.jpg"
                alt="text"
              />
            </span>
            <span slot="name" slot-scope="text">
              <h6>{{ text?.ru }}</h6>
            </span>
            <span slot="key" slot-scope="text">#{{ text }}</span>

            <span slot="id" slot-scope="text">
              <span
                class="action-btn"
                v-if="checkAccess('promotions', 'PUT')"
                @click="editAction(text)"
              >
                <img :src="editIcon" alt="" />
              </span>
              <a-popconfirm
                v-if="checkAccess('promotions', 'DELETE')"
                title="Are you sure delete this row?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="deletePost(text)"
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
              @change="changePageSize"
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
import FormTitle from "../../../components/Form-title.vue";
import global from "../../../mixins/global";
import status from "@/mixins/status";
import authAccess from "@/mixins/authAccess";
import columns from "../../../mixins/columns";

export default {
  // middleware: "auth",
  mixins: [global, status, columns, authAccess],
  data() {
    return {
      loading: true,
      editIcon: require("../../../assets/svg/components/edit-icon.svg"),
      deleteIcon: require("../../../assets/svg/components/delete-icon.svg"),
      addIcon: require("../../../assets/svg/components/add-icon.svg?raw"),
      groups: [],
      rules: {
        name_ru: [
          {
            required: true,
            message: "category nameis required",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    async changePageSize(e) {
      this.current = 1;
      if (this.$route.query.per_page != e) {
        await this.$router.replace({
          path: `/catalog/characteristic_groups`,
          query: {
            page: this.current,
            per_page: e,
          },
        });
        this.__GET_PROMOTIONS();
      }
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    },

    cancel(e) {
      // this.$message.error("Click on No");
    },
    deletePost(id) {
      this.__DELETE_PROMOTIONS(id);
    },
    editAction(id) {
      this.$router.push(`/inbox/promotions/${id}`);
    },
    async __DELETE_PROMOTIONS(id) {
      try {
        const data = await this.$store.dispatch("fetchPromotions/deletePromotions", id);
        await this.$notify({
          title: "Success",
          message: "Успешно удален",
          type: "success",
        });
        this.__GET_PROMOTIONS();
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
    async __GET_PROMOTIONS() {
      this.loading = true;
      const data = await this.$store.dispatch("fetchPromotions/getPromotions", {
        ...this.$route.query,
      });
      this.loading = false;
      this.totalPage = data.promotions?.total;
      const pageIndex = this.indexPage(
        data?.promotions?.current_page,
        data?.promotions?.per_page
      );
      this.groups = data?.promotions.data.map((item, index) => {
        return {
          ...item,
          numberId: item.id,
          key: index + pageIndex,
        };
      });
    },
    indexPage(current_page, per_page) {
      return (current_page * 1 - 1) * per_page + 1;
    },
  },

  async mounted() {
    this.getFirstData("/inbox/promotions", "__GET_PROMOTIONS");
  },
  watch: {
    async current(val) {
      this.changePagination(val, "/catalog/characteristic_groups", "__GET_PROMOTIONS");
    },
  },
  components: {
    TitleBlock,
    FormTitle,
  },
  layout: "toolbar",
};
</script>
