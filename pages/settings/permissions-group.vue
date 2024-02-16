<template lang="html">
  <div>
    <TitleBlock
      title="Permission groups"
      :breadbrumb="['настройки']"
      lastLink="Permission groups"
    >
      <div
        v-if="checkAccess('permission-groups', 'POST')"
        class="add-btn add-header-btn add-header-btn-padding btn-primary"
        @click="openAddModal"
      >
        <span class="svg-icon" v-html="addIcon"></span>
        Добавить
      </div>
    </TitleBlock>
    <div class="container_xl app-container">
      <div class="card_block py-5">
        <div class="d-flex justify-content-between align-items-center pt-4">
          <div class="d-flex justify-content-between w-100">
            <FormTitle title="Permission groups" />
          </div>
        </div>
        <div class="antd_table product_table">
          <a-table
            :columns="columnPermissionGroups"
            :data-source="group"
            :pagination="false"
            align="center"
            :loading="loading"
          >
            <span
              @click="$router.push('/home/customer-info/123')"
              slot="title"
              slot-scope="text"
              align="center"
            >
              <h6>{{ text?.ru }}</h6>
            </span>

            <span slot="id" slot-scope="text">
              <span
                class="action-btn"
                v-if="checkAccess('permission-groups', 'PUT')"
                @click="editPost(text)"
              >
                <img :src="editIcon" alt="" />
              </span>
              <a-popconfirm
                v-if="checkAccess('permission-groups', 'DELETE')"
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
            <el-select
              v-model="params.pageSize"
              class="table-page-size"
              placeholder="Select"
              @change="
                changePageSizeGlobal(
                  e,
                  '/settings/permissions-group',
                  '__GET_PERMISSION_GROUPS'
                )
              "
            >
              <el-option
                v-for="item in pageSizes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
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
    <a-modal v-model="visible" title="Добавить" :closable="false" @ok="handleOk">
      <el-form
        label-position="top"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
        action=""
      >
        <div>
          <div class="form-block required">
            <div>
              <label for="">Название </label>
            </div>
            <el-form-item prop="name">
              <el-input
                type="text"
                placeholder="Зоговолок"
                v-model="ruleForm.name"
              ></el-input>
            </el-form-item>
            <el-form-item
              class="form-block align-items-start mt-3"
              prop="name"
              label="Permissions"
            >
              <div class="d-flex align-items-center" style="gap: 16px">
                <a-select
                  show-search
                  v-model="ruleForm.permissions"
                  placeholder="input search text"
                  mode="multiple"
                  style="width: 100%"
                  :default-active-first-option="false"
                  :show-arrow="false"
                  :filter-option="false"
                  :not-found-content="fetching ? undefined : null"
                  @search="handleSearch"
                >
                  <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                  <a-select-opt-group label="Permissions" v-if="permissions.length > 0">
                    <a-select-option v-for="d in permissions" :value="d.id" :key="d.id">
                      {{ d?.name }}
                    </a-select-option>
                  </a-select-opt-group>
                </a-select>
                <div
                  @click="$router.push('/settings/permissions')"
                  class="outline-btn outline-light-blue-btn"
                  v-html="plusCategoryIcon"
                ></div>
              </div>
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
            @click="getData"
            type="primary"
            :loading="loadingBtn"
          >
            <span v-if="!loadingBtn" class="svg-icon" v-html="addIcon"></span>
            Сохранить
          </a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script>
import AddBtn from "../../components/form/Add-btn.vue";
import SearchInput from "../../components/form/Search-input.vue";
import Title from "../../components/Title.vue";
import TitleBlock from "../../components/Title-block.vue";
import FormTitle from "../../components/Form-title.vue";
import global from "../../mixins/global";
import status from "@/mixins/status";
import columns from "../../mixins/columns";
import authAccess from "@/mixins/authAccess";

export default {
  // middleware: "auth",
  mixins: [global, status, columns, authAccess],
  data() {
    return {
      visible: false,
      editIcon: require("../../assets/svg/components/edit-icon.svg"),
      deleteIcon: require("../../assets/svg/components/delete-icon.svg"),
      addIcon: require("../../assets/svg/components/add-icon.svg?raw"),
      plusCategoryIcon: require("../../assets/svg/components/add-category-icon.svg?raw"),
      loading: true,
      loadingBtn: false,
      ruleForm: {
        name: "",
        permissions: [],
      },
      fetching: false,
      permissions: [],
      editId: "",
      group: [],
      rules: {
        name: [
          {
            required: true,
            message: "Это поле обязательна",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    showModal() {
      this.visible = true;
    },
    handleOk(e) {
      this.visible = false;
    },
    getData() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.editId != ""
            ? this.__EDIT_PERMISSION_GROUP(this.ruleForm)
            : this.__POST_PREMISSION_GROUP(this.ruleForm);
        } else {
          return false;
        }
      });
    },
    deleteImg() {
      this.editImage = "";
    },
    openAddModal() {
      this.showModal();
      this.editId = "";
    },
    editPost(id) {
      this.editId = id;
      const data = this.group.find((item) => item.id == id);
      //   this.slug = data.slug;
      this.ruleForm = {
        name: data.name,
        permissions: data.permissions.map((item) => item.id),
      };
      this.showModal();

    },
    deletePost(id) {
      this.__DELETE_GLOBAL(
        id,
        "fetchPermissions/deletePermissionGroups",
        "Успешно удален",
        "__GET_PERMISSION_GROUPS"
      );
    },
    async __GET_PERMISSION_GROUPS() {
      this.loading = true;
      const data = await this.$store.dispatch("fetchPermissions/getPermissionGroups", {
        ...this.$route.query,
      });
      this.group = data.groups?.data;
      this.loading = false;
      this.totalPage = data.groups?.total;
      const pageIndex = this.indexPage(
        data?.groups?.current_page,
        data?.groups?.per_page
      );
      this.group = this.group.map((item, index) => {
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
    async __POST_PREMISSION_GROUP(res) {
      try {
        await this.$store.dispatch("fetchPermissions/postPermissionGroups", res);
        this.notification("Success", "Успешно добавлен", "success");
        this.handleOk();
        this.__GET_PERMISSION_GROUPS();
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
    async __EDIT_PERMISSION_GROUP(res) {
      try {
        await this.$store.dispatch("fetchPermissions/editPermissionGroups", {
          id: this.editId,
          data: res,
        });
        this.notification("Success", "Успешно добавлен", "success");
        this.handleOk();
        this.__GET_PERMISSION_GROUPS();
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
    emptyData() {
      this.ruleForm.name = "";
      this.editId = "";
    },
    async handleSearch(value) {
      this.fetching = true;
      if (value.length > 2) {
        const permissionsData = await this.$store.dispatch(
          "fetchPermissions/getPermissions",
          {
            search: value,
          }
        );
        this.permissions = permissionsData?.permissions;
        this.fetching = false;
      }
    },
    // handleChange(value, id) {
    //   console.log(value);
    //   let obj = this.ruleForm.find((item) => item.indexId == id);
    //   obj.category_id = value;
    //   console.log(obj);
    // },
  },

  async mounted() {
    const permissionsData = await this.$store.dispatch("fetchPermissions/getPermissions");
    this.permissions = permissionsData?.permissions;
    this.getFirstData("/settings/permissions-group", "__GET_PERMISSION_GROUPS");
  },
  watch: {
    async current(val) {
      this.changePagination(
        val,
        "/settings/permissions-group",
        "__GET_PERMISSION_GROUPS"
      );
    },
    visible(val) {
      if (val == false) {
        this.emptyData();
      }
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
<style lang="scss">
.post_img {
  width: 101px;
  height: 101px;
  border: 1px dashed #d9d9d9;
  position: relative;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  div {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    transition: 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      display: none;
      cursor: pointer;
      i {
        font-size: 32px;
        height: 40px;
        width: 40px;
      }
    }
  }
  &:hover {
    div {
      z-index: 100;
      background: rgba(255, 255, 255, 0.5);
      span {
        display: block;
      }
    }
  }
}
</style>
