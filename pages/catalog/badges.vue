<template lang="html">
  <div>
    <TitleBlock title="Значки" :breadbrumb="['Контент сайта']" lastLink="Значки">
      <div
        v-if="checkAccess('badges', 'POST')"
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
            <FormTitle title="Значки" />
          </div>
        </div>
        <div class="antd_table product_table">
          <a-table
            :columns="columnBadges"
            :data-source="badges"
            :pagination="false"
            align="center"
            :loading="loading"
          >
            <span slot="name" slot-scope="text" align="center">
              <h6>{{ text?.ru }}</h6>
            </span>
            <span slot="key" slot-scope="text">#{{ text }}</span>
            <span slot="created_at" slot-scope="text">{{ text }}</span>

            <span slot="id" slot-scope="text">
              <span
                class="action-btn"
                v-if="checkAccess('badges', 'PUT')"
                @click="editPost(text)"
              >
                <img :src="editIcon" alt="" />
              </span>
              <a-popconfirm
                v-if="checkAccess('badges', 'DELETE')"
                title="Are you sure delete this brand?"
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
              @change="changePageSizeGlobal(e, '/catalog/badges', '__GET_BADGES')"
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

    <a-modal
      v-model="visible"
      :title="editId ? 'Изменения' : 'Добавить'"
      :closable="false"
      @ok="handleOk"
    >
      <el-form
        label-position="top"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
        action=""
      >
        <div class="modal_tab mb-4">
          <span
            v-for="(item, index) in modalTabData"
            :key="index"
            @click="modalTab = item.index"
            :class="{ 'avtive-modalTab': modalTab == item.index }"
          >
            {{ item.label }}
          </span>
        </div>
        <div
          v-for="(item, index) in modalTabData"
          :key="index"
          v-if="modalTab == item.index"
        >
          <div class="form-block required">
            <div>
              <label for="">Значок </label>
            </div>
            <el-form-item prop="name.ru">
              <el-input
                type="text"
                placeholder="Зоговолок"
                v-model="ruleForm.name[item.index]"
              ></el-input>
            </el-form-item>
          </div>
          <div class="form-block required" v-if="editId">
            <div>
              <label for="">Продукты </label>
            </div>
            <el-form-item>
              <a-select
                mode="multiple"
                label-in-value
                :value="value"
                placeholder="Продукты"
                style="width: 100%"
                :filter-option="false"
                :not-found-content="fetching ? undefined : null"
                @search="fetchUser"
                @change="handleChange"
              >
                <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                <a-select-option v-for="d in data" :key="d.id">
                  {{ d.name.ru }}
                </a-select-option>
              </a-select>
            </el-form-item>
          </div>
          <div class="d-flex">
            <div class="form-block">
              <div>
                <label for="">Цвет фона </label>
              </div>
              <el-color-picker
                popper-class="badges-color-picker"
                v-model="ruleForm.background_color"
              ></el-color-picker>
            </div>
            <div class="form-block mx-5">
              <div>
                <label for="">Цвет текста </label>
              </div>
              <el-color-picker
                popper-class="badges-color-picker"
                v-model="ruleForm.text_color"
              ></el-color-picker>
            </div>
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
          >
            <span class="svg-icon" v-html="addIcon"></span>
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
import debounce from "lodash/debounce";
import authAccess from "@/mixins/authAccess";

export default {
  // middleware: "auth",
  mixins: [global, status, columns, authAccess],
  data() {
    this.lastFetchId = 0;
    this.fetchUser = debounce(this.fetchUser, 800);
    return {
      data: [],
      color1: "#409EFF",
      value: [],
      fetching: false,
      mockData: [],
      targetKeys: [],
      visible: false,
      modalTab: "ru",
      modalTabData: [
        {
          key: "uz",
          label: "Uzbek",
        },
        {
          key: "ru",
          label: "Русский",
        },
      ],
      editIcon: require("../../assets/svg/components/edit-icon.svg"),
      deleteIcon: require("../../assets/svg/components/delete-icon.svg"),
      addImgIcon: require("../../assets/svg/components/add-img-icon.svg?raw"),
      addIcon: require("../../assets/svg/components/add-icon.svg?raw"),
      loading: true,
      ruleForm: {
        name: {
          ru: "",
          uz: "",
          en: "",
        },
        products: [],
        background_color: "#1F8A70",
        text_color: "#ffffff",
      },
      editId: "",
      badges: [],
      formData: {},
      rules: {
        name: {
          ru: [
            {
              required: true,
              message: "Это поле обязательна",
              trigger: "change",
            },
          ],
        },
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
      const data = {
        ...this.ruleForm,
        background_color: this.ruleForm.background_color
          ? this.ruleForm.background_color
          : "#1F8A70",
        text_color: this.ruleForm.text_color ? this.ruleForm.text_color : "#ffffff",
      };
      if (!this.editId) {
        delete data.products;
        delete data.text_color;
        delete data.background_color;
      }
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.editId != ""
            ? this.__EDIT_BADGES(this.ruleForm)
            : this.__POST_BADGES(this.ruleForm);
        } else {
          return false;
        }
      });
    },
    openAddModal() {
      this.showModal();
      this.editId = "";
    },
    async editPost(id) {
      this.editId = id;
      const data = this.badges.find((item) => item.id == id);
      await this.__SHOW_BADGES(id);
      this.showModal();
    },
    deletePost(id) {
      this.__DELETE_GLOBAL(
        id,
        "fetchBadges/deleteBadges",
        "Бранд был успешно удален",
        "__GET_BADGES"
      );
    },
    async __SHOW_BADGES(id) {
      this.loading = true;
      const data = await this.$store.dispatch("fetchBadges/showBadges", id);
      this.ruleForm.name = data?.badge?.name;
      this.loading = false;
      this.ruleForm.background_color = data?.badge?.background_color;
      this.ruleForm.text_color = data?.badge?.text_color;
      // this.ruleForm.products = data?.badge?.products.map((item) => item.id);
      // this.value = data?.badge?.products.map((item) => {
      //   return {
      //     key: item.id,
      //     label: item.info.name.ru,
      //   };
      // });
    },
    async __GET_BADGES() {
      this.loading = true;
      const data = await this.$store.dispatch("fetchBadges/getBadges", {
        ...this.$route.query,
      });
      this.badges = data.badges?.data;
      this.totalPage = data.badges?.total;
      const pageIndex = this.indexPage(
        data?.badges?.current_page,
        data?.badges?.per_page
      );
      this.loading = false;
      this.badges = this.badges.map((item, index) => {
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
    async __POST_BADGES(res) {
      try {
        await this.$store.dispatch("fetchBadges/postBadges", res);
        this.notification("Success", "Успешно добавлен", "success");
        this.handleOk();
        this.__GET_BADGES();
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
    async __EDIT_BADGES(res) {
      try {
        await this.$store.dispatch("fetchBadges/editBadges", {
          id: this.editId,
          data: { ...res, slug: this.slug },
        });
        this.notification("Success", "Успешно добавлен", "success");
        this.handleOk();
        this.__GET_BADGES();
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
    emptyData() {
      (this.ruleForm.name = {
        ru: "",
        uz: "",
        en: "",
      }),
        (this.ruleForm.products = []),
        (this.editId = "");
    },

    async fetchUser(value) {
      this.lastFetchId += 1;
      const fetchId = this.lastFetchId;
      this.data = [];
      this.fetching = true;
      const data = await this.$store.dispatch("fetchProducts/getProducts", {
        search: value,
      });
      this.data = data?.products?.data;
      this.fetching = false;
    },
    handleChange(value) {
      this.ruleForm.products = value.map((item) => item.key);
      Object.assign(this, {
        value,
        data: [],
        fetching: false,
      });
    },
  },

  async mounted() {
    this.getFirstData("/catalog/badges", "__GET_BADGES");
  },
  watch: {
    async current(val) {
      this.changePagination(val, "/catalog/badges", "__GET_BADGES");
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
