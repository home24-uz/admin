<template lang="html">
  <div>
    <TitleBlock title="Роли" :breadbrumb="['Настройки']" lastLink="Роли">
      <div
        v-if="checkAccess('roles', 'POST')"
        class="add-btn add-header-btn add-header-btn-padding btn-primary"
        @click="$router.push('/settings/roles/add')"
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
              @changeSearch="changeSearch($event, '/settings/roles', '__GET_ROLES')"
            />
            <span></span>
            <span></span>
            <a-button
              @click="clearQuery('/settings/roles', '__GET_ROLES')"
              type="primary"
              class="d-flex align-items-center justify-content-center"
              style="height: 38px"
              ><a-icon type="reload"
            /></a-button>
          </div>
        </div>
        <div class="antd_table product_table">
          <a-table
            :columns="columnRoles"
            :data-source="roles"
            :pagination="false"
            :loading="loading"
            align="center"
          >
            <span slot="key" slot-scope="text">#{{ text }}</span>
            <span slot="name" slot-scope="text">
              <h6>{{ text }}</h6>
            </span>

            <span slot="id" slot-scope="text">
              <span
                v-if="checkAccess('roles', 'PUT')"
                class="action-btn"
                @click="$router.push(`/settings/roles/${text}`)"
              >
                <img :src="editIcon" alt="" />
              </span>
              <a-popconfirm
                v-if="checkAccess('roles', 'DELETE')"
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

export default {
  layout: "toolbar",
  mixins: [global, status, columns, authAccess],
  data() {
    return {
      loading: false,
      editIcon: require("../../../assets/svg/components/edit-icon.svg"),
      deleteIcon: require("../../../assets/svg/components/delete-icon.svg"),
      addIcon: require("../../../assets/svg/components/add-icon.svg?raw"),
      selectedRowKeys: [],
      roles: [],
      data: [],
    };
  },
  async mounted() {
    this.getFirstData("/settings/roles", "__GET_ROLES");
  },
  methods: {
    deleteAtribut(id) {
      this.__DELETE_GLOBAL(id, "fetchRoles/deleteRoles", "Успешно удален", "__GET_ROLES");
    },
    async __GET_ROLES() {
      try {
        this.loading = true;
        const data = await this.$store.dispatch("fetchRoles/getRoles", {
          ...this.$route.query,
        });
        this.loading = false;
        this.roles = data.roles.map((item, index) => {
          return {
            ...item,
            numberId: item.id,
            key: index + 1,
          };
        });
      } catch (e) {
        this.statusFunc(e);
      }
    },
  },

  watch: {
    async current(val) {
      this.changePagination(val, "/settings/roles", "__GET_ROLES");
    },
  },
  components: {
    SearchInput,
    TitleBlock,
  },
};
// 246
</script>
