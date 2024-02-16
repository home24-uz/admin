<template lang="html">
  <div>
    <TitleBlock title="Пользователи" :breadbrumb="['настройки']" lastLink="Пользователи">
      <div
        v-if="checkAccess('users', 'POST')"
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
            <FormTitle title="Пользователи" />
          </div>
        </div>
        <div class="antd_table product_table">
          <a-table
            :columns="columnUsers"
            :data-source="group"
            :pagination="false"
            align="center"
            :loading="loading"
          >
            <span slot="key" slot-scope="text">#{{ text }}</span>
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
                v-if="checkAccess('users', 'PUT')"
                @click="editPost(text)"
              >
                <img :src="editIcon" alt="" />
              </span>
              <a-popconfirm
                v-if="checkAccess('users', 'DELETE')"
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
          <el-form-item
            prop="username"
            label="Имя"
            class="form-block required align-items-start"
          >
            <el-input
              type="text"
              placeholder="Имя..."
              v-model="ruleForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item
            prop="password"
            label="Пароль"
            class="form-block required align-items-start"
          >
            <el-input
              type="text"
              placeholder="Пароль..."
              v-model="ruleForm.password"
            ></el-input>
          </el-form-item>
          <el-form-item
            class="form-block align-items-start mt-3"
            prop="role_id"
            label="Роли"
          >
            <div class="d-flex align-items-center" style="gap: 16px">
              <a-select
                v-model="ruleForm.role_id"
                placeholder="Роли..."
                style="width: 100%"
              >
                <a-select-opt-group label="Роли" v-if="roles.length > 0">
                  <a-select-option v-for="d in roles" :value="d.id" :key="d.id">
                    {{ d?.name }}
                  </a-select-option>
                </a-select-opt-group>
              </a-select>
              <div
                @click="$router.push('/settings/roles')"
                class="outline-btn outline-light-blue-btn"
                v-html="plusCategoryIcon"
              ></div>
            </div>
          </el-form-item>
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
import AddBtn from "../../../components/form/Add-btn.vue";
import SearchInput from "../../../components/form/Search-input.vue";
import Title from "../../../components/Title.vue";
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
      visible: false,
      editIcon: require("../../../assets/svg/components/edit-icon.svg"),
      deleteIcon: require("../../../assets/svg/components/delete-icon.svg"),
      addIcon: require("../../../assets/svg/components/add-icon.svg?raw"),
      plusCategoryIcon: require("../../../assets/svg/components/add-category-icon.svg?raw"),
      loading: true,
      loadingBtn: false,
      ruleForm: {
        username: "",
        password: "",
        role_id: [],
      },
      fetching: false,
      roles: [],
      editId: "",
      group: [],
      rules: {
        username: [
          {
            required: true,
            message: "Это поле обязательна",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "Это поле обязательна",
            trigger: "blur",
          },
        ],
        role_id: [
          {
            required: true,
            message: "Это поле обязательна",
            trigger: "blur",
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
            ? this.__EDIT_USER(this.ruleForm)
            : this.__POST_USER(this.ruleForm);
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
    async __GET_ADMINS_BY_ID(res) {
      const data = await this.$store.dispatch("fetchAdmins/getAdminsById", res);
      const { id, created_at, updated_at, ...rest } = data?.user;
      this.ruleForm = { ...rest };
      this.showModal();
    },
    editPost(id) {
      this.editId = id;
      this.__GET_ADMINS_BY_ID(id);
    },
    deletePost(id) {
      this.__DELETE_GLOBAL(
        id,
        "fetchAdmins/deleteAdmins",
        "Успешно удален",
        "__GET_USERS"
      );
    },
    async __GET_USERS() {
      this.loading = true;
      const data = await this.$store.dispatch("fetchAdmins/getAdmins", {
        ...this.$route.query,
      });
      this.group = data.users;
      this.loading = false;
      this.group = this.group.map((item, index) => {
        return {
          ...item,
          numberId: item.id,
          key: index + 1,
        };
      });
    },
    indexPage(current_page, per_page) {
      return (current_page * 1 - 1) * per_page + 1;
    },
    async __POST_USER(res) {
      try {
        await this.$store.dispatch("fetchAdmins/postAdmins", res);
        this.notification("Success", "Успешно добавлен", "success");
        this.handleOk();
        this.__GET_USERS();
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
    async __EDIT_USER(res) {
      try {
        await this.$store.dispatch("fetchAdmins/editAdmins", {
          id: this.editId,
          data: res,
        });
        this.notification("Success", "Успешно добавлен", "success");
        this.handleOk();
        this.__GET_USERS();
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
    emptyData() {
      this.ruleForm = {
        username: "",
        password: "",
        role_id: [],
      };
      this.editId = "";
    },
  },

  async mounted() {
    const rolesData = await this.$store.dispatch("fetchRoles/getRoles");
    this.roles = rolesData?.roles;
    this.getFirstData("/settings/users", "__GET_USERS");
  },
  watch: {
    async current(val) {
      this.changePagination(val, "/settings/users", "__GET_USERS");
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
