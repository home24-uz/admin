<template lang="html">
  <div>
    <TitleBlock
      title="Группа характеристик"
      :breadbrumb="['Каталог']"
      lastLink="Группа характеристик"
    >
      <div
        v-if="checkAccess('characteristics', 'POST')"
        class="add-btn add-header-btn add-header-btn-padding btn-primary"
        @click="$router.push('/catalog/add_characteristic')"
      >
        <span class="svg-icon" v-html="addIcon"></span>
        Добавить
      </div>
    </TitleBlock>
    <div class="container_xl app-container">
      <div class="card_block py-5">
        <div class="d-flex justify-content-between align-items-center card_header">
          <div class="prodduct-list-header-grid w-100 align-items-center">
            <SearchInput
              placeholder="Группа характеристик"
              @changeSearch="
                changeSearch($event, '/catalog/characteristic_groups', '__GET_GROUPS')
              "
            />
            <span></span>
            <span></span>
            <a-button
              @click="clearQuery('/catalog/characteristic_groups', '__GET_GROUPS')"
              type="primary"
              class="d-flex align-items-center justify-content-center"
              style="height: 38px"
              ><a-icon type="reload"
            /></a-button>
          </div>
        </div>
        <div class="antd_table product_table">
          <a-table
            :columns="columnCharacteristic"
            :data-source="groups"
            :pagination="false"
            align="center"
            :loading="loading"
          >
            <span slot="name" slot-scope="text">
              <h6>{{ text?.ru }}</h6>
            </span>

            <span slot="key" slot-scope="text">#{{ text }}</span>
            <span slot="customTitle"></span>

            <span slot="id" slot-scope="text">
              <span
                class="action-btn"
                v-if="checkAccess('characteristics', 'PUT')"
                @click="editAction(text)"
              >
                <img :src="editIcon" alt="" />
              </span>
              <a-popconfirm
                v-if="checkAccess('characteristics', 'DELETE')"
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
import TitleBlock from "../../components/Title-block.vue";
import FormTitle from "../../components/Form-title.vue";
import AddModal from "../../components/modals/Add-modal.vue";
import global from "../../mixins/global";
import status from "@/mixins/status";
import columns from "../../mixins/columns";
import authAccess from "@/mixins/authAccess";
import SearchInput from "../../components/form/Search-input.vue";

export default {
  // middleware: "auth",
  mixins: [global, status, columns, authAccess],
  data() {
    return {
      loading: true,
      editIcon: require("../../assets/svg/components/edit-icon.svg"),
      deleteIcon: require("../../assets/svg/components/delete-icon.svg"),
      addIcon: require("../../assets/svg/components/add-icon.svg?raw"),
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
    editAction(id) {
      this.$router.push(`/catalog/edit_characteristic/${id}`);
    },
    async __DELETE_CHARACTER_GROUP(id) {
      try {
        const data = await this.$store.dispatch("fetchCharacters/deleteGroups", id);
        await this.$notify({
          title: "Success",
          message: "Группа был успешно удалена",
          type: "success",
        });
        this.__GET_GROUPS();
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
    async __GET_GROUPS() {
      this.loading = true;
      const data = await this.$store.dispatch("fetchCharacters/getCharacteristics", {
        ...this.$route.query,
      });
      this.loading = false;
      this.totalPage = data.characteristics?.total;
      const pageIndex = this.indexPage(
        data?.characteristics?.current_page,
        data?.characteristics?.per_page
      );
      this.groups = data?.characteristics.data.map((item, index) => {
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
    this.getFirstData("/catalog/characteristic_groups", "__GET_GROUPS");
  },
  watch: {
    async current(val) {
      this.changePagination(val, "/catalog/characteristic_groups", "__GET_GROUPS");
    },
  },
  components: {
    TitleBlock,
    FormTitle,
    AddModal,
    SearchInput,
  },
  layout: "toolbar",
};
</script>
