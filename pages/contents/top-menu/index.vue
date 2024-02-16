<template lang="html">
  <div>
    <TitleBlock title="Топ меню" :breadbrumb="['Контент сайта']" lastLink="Топ меню">
      <div
        v-if="checkAccess('top-bars', 'PUT')"
        class="add-btn add-header-btn add-header-btn-padding btn-primary"
        @click="$router.push('/contents/top-menu/add')"
      >
        <span class="svg-icon" v-html="addIcon"></span>
        Изменять
      </div>
    </TitleBlock>
    <div class="container_xl app-container">
      <div class="card_block py-5">
        <div class="d-flex justify-content-between align-items-center pt-4">
          <div class="d-flex justify-content-between w-100">
            <FormTitle title="Топ меню" />
          </div>
        </div>
        <div class="antd_table product_table">
          <a-table
            :columns="columnTopBar"
            :data-source="groups"
            :pagination="false"
            align="center"
            :loading="loading"
          >
            <span slot="name" slot-scope="text">
              <h6>{{ text?.ru }}</h6>
            </span>
            <span slot="category" slot-scope="text">
              <h6>{{ text?.name?.ru ? text?.name?.ru : "----" }}</h6>
            </span>
            <span slot="promotion" slot-scope="text">
              <h6>{{ text?.name?.ru ? text?.name?.ru : "----" }}</h6>
            </span>
            <span slot="key" slot-scope="text">#{{ text }}</span>
            <span slot="customTitle"></span>

            <span slot="id" slot-scope="text">
              <!-- <span class="action-btn" @click="editAction(text)">
                <img :src="editIcon" alt="" />
              </span> -->
              <a-popconfirm
                v-if="checkAccess('top-bars', 'DELETE')"
                title="Are you sure delete this group?"
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
          path: `/contents/top-menu`,
          query: {
            page: this.current,
            per_page: e,
          },
        });
        this.__GET_GROUPS();
      }
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    },

    cancel(e) {
      // this.$message.error("Click on No");
    },
    deletePost(id) {
      this.__DELETE_CHARACTER_GROUP(id);
    },

    async __DELETE_CHARACTER_GROUP(id) {
      try {
        const data = await this.$store.dispatch("fetchCharacters/deleteGroups", id);
        await this.$notify({
          title: "Success",
          message: "Группа был успешно удален",
          type: "success",
        });
        this.__GET_GROUPS();
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
    async __GET_GROUPS() {
      this.loading = true;
      const data = await this.$store.dispatch("fetchTopBars/getTopBars", {
        ...this.$route.query,
      });
      this.loading = false;
      this.totalPage = data.bars?.total;
      const pageIndex = this.indexPage(data?.bars?.current_page, data?.bars?.per_page);
      // console.log(data?.groups?.current_page);
      // console.log(data?.groups?.per_page);
      this.groups = data?.bars.data.map((item, index) => {
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
    this.getFirstData("/contents/top-menu", "__GET_GROUPS");
  },
  watch: {
    async current(val) {
      this.changePagination(val, "/contents/top-menu", "__GET_GROUPS");
    },
  },
  components: {
    TitleBlock,
    FormTitle,
  },
  layout: "toolbar",
};
</script>
