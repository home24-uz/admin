<template lang="html">
  <div>
    <TitleBlock
      title="Вопрос и ответы"
      :breadbrumb="['Контент сайта']"
      lastLink="Вопрос и ответы"
    >
      <div
        v-if="checkAccess('faq-categories', 'POST')"
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
          <FormTitle title="Вопрос и ответы" />
        </div>
        <div class="antd_table product_table">
          <a-table
            :columns="columns"
            :data-source="categories"
            :pagination="false"
            :loading="loading"
          >
            <div slot="img" slot-scope="text">
              <img v-if="typeof text == 'string'" class="table-image" :src="text" />
              <img
                v-else
                class="table-image"
                src="../../assets/images/photo_2023-03-04_13-28-58.jpg"
                alt=""
              />
            </div>
            <span
              @click="$router.push('/home/customer-info/123')"
              slot="title"
              slot-scope="text"
            >
              <h6>{{ text?.ru }}</h6>
            </span>
            <div slot="faqs" slot-scope="text" v-html="text?.ru"></div>
            <div slot="faqs" slot-scope="text" align="center" class="option-container">
              <span class="option-items" v-for="(item, index) in text" :key="index">{{
                item.question.ru ? item.question.ru : "-----"
              }}</span>
            </div>
            <span slot="numberId" slot-scope="text">#{{ text }}</span>
            <span slot="customTitle"></span>

            <span slot="id" slot-scope="text">
              <span
                class="action-btn"
                v-if="checkAccess('faq-categories', 'PUT')"
                @click="editPost(text)"
              >
                <img :src="editIcon" alt="" />
              </span>
              <a-popconfirm
                v-if="checkAccess('faq-categories', 'DELETE')"
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
    <!-- <AddModal
      :title="editId ? 'Изменить категорию' : 'Добавить категорию'"
      name="add_faqs"
      btnText="Save"
      :callback="getData"
      :closeModal="closeModal"
      :loadingBtn="loadingBtn"
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

      <el-form
        label-position="top"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
      >
        <div
          v-for="(item, index) in modalTabData"
          :key="index"
          v-if="modalTab == item.index"
        >
          <div class="form-block required">
            <div>
              <label for="faq_category">Category name</label>
            </div>
            <el-form-item prop="title_ru">
              <el-input
                id="faq_category"
                type="text"
                placeholder="Category"
                v-model="ruleForm[`title_${item.index}`]"
              ></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </AddModal> -->
    <a-modal
      v-model="visible"
      :title="editId ? 'Изменить категорию' : 'Добавить категорию'"
      :closable="false"
      @ok="handleOk"
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

      <el-form
        label-position="top"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
      >
        <div
          v-for="(item, index) in modalTabData"
          :key="index"
          v-if="modalTab == item.index"
        >
          <div class="form-block required">
            <div>
              <label for="faq_category">Category name</label>
            </div>
            <el-form-item prop="title_ru">
              <el-input
                id="faq_category"
                type="text"
                placeholder="Category"
                v-model="ruleForm[`title_${item.index}`]"
              ></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <template slot="footer">
        <div class="add_modal-footer d-flex justify-content-end">
          <div
            class="add-btn add-header-btn add-header-btn-padding btn-light-primary mx-3"
            @click="closeModal"
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
import TitleBlock from "../../components/Title-block.vue";
import FormTitle from "../../components/Form-title.vue";
import AddModal from "../../components/modals/Add-modal.vue";
import authAccess from "@/mixins/authAccess";
import global from "../../mixins/global";
export default {
  // middleware: "auth",
  mixins: [authAccess, global],
  data() {
    return {
      visible: false,
      params: {
        page: 1,
      },
      pagination: {
        pageSize: 16,
      },
      loading: true,
      modalTab: "ru",
      editIcon: require("../../assets/svg/components/edit-icon.svg"),
      deleteIcon: require("../../assets/svg/components/delete-icon.svg"),
      addIcon: require("../../assets/svg/components/add-icon.svg?raw"),
      addImgIcon: require("../../assets/svg/components/add-img-icon.svg?raw"),
      loadingBtn: false,
      modalTabData: [
        {
          index: "uz",
          label: "Uzbek",
        },
        {
          index: "ru",
          label: "Русский",
        },
      ],
      ruleForm: {
        title_ru: "",
        title_uz: "",
        title_en: "",
      },
      columns: [
        {
          title: "ID",
          dataIndex: "numberId",
          key: "numberId",
          slots: { title: "customTitle" },
          scopedSlots: { customRender: "numberId" },
          align: "left",
          className: "column-name",
          width: "60px",
        },
        {
          title: "Загаловок",
          dataIndex: "title",
          key: "title",
          slots: { title: "customTitle" },
          scopedSlots: { customRender: "title" },
          align: "left",
          className: "column-name",
          width: "30%",
        },
        {
          title: "ЧаВо",
          dataIndex: "faqs",
          key: "faqs",
          slots: { title: "customTitle" },
          scopedSlots: { customRender: "faqs" },
          className: "column-options",
          //   width: "30%",
        },
        {
          title: "действия",
          key: "id",
          dataIndex: "id",
          scopedSlots: { customRender: "id" },
          className: "column-btns",
          width: "100px",
          align: "right",
        },
      ],

      editId: "",
      faqs: [],
      categories: [],
      rules: {
        title_ru: [
          {
            required: true,
            message: "category nameis required",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    handleOk() {
      this.visible = false;
    },
    show(name) {
      this.visible = true;
    },
    hide(name) {
      this.visible = false;
    },

    getData() {
      const newData = {
        title: {
          ru: this.ruleForm.title_ru,
          uz: this.ruleForm.title_uz,
          en: this.ruleForm.title_en,
        },
      };
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.editId != ""
            ? this.__EDIT_FAQ_CATEGORIES(newData)
            : this.__POST_FAQ_CATEGORIES(newData);
        } else {
          return false;
        }
      });
    },
    cancel(e) {
      // this.$message.error("Click on No");
    },

    openAddModal() {
      this.show("add_faqs");
      this.editId = "";
    },
    editPost(id) {
      this.editId = id;
      const data = this.categories.find((item) => item.id == id);
      this.ruleForm = {
        ...data,
        title_ru: data.title.ru,
        title_uz: data.title.uz,
        title_en: data.title.en,
      };
      this.show("add_faqs");
    },
    closeModal() {
      this.hide("add_faqs");
      this.ruleFormEmpty();
      this.editId = "";
      this.__GET_FAQ_CATEGORIES();
    },
    ruleFormEmpty() {
      this.ruleForm.title_ru = "";
      this.ruleForm.title_uz = "";
      this.ruleForm.title_en = "";
    },
    deletePost(id) {
      this.__DELETE_FAQ_CATEGORIES(id);
    },
    async __DELETE_FAQ_CATEGORIES(id) {
      try {
        await this.$store.dispatch("fetchFaqCategories/deleteFaqsCategories", id);
        await this.$notify({
          title: "Success",
          message: "Категория был успешно удален",
          type: "success",
        });
        this.__GET_FAQ_CATEGORIES();
      } catch (e) {
        this.statusFunc(e.response);
      }
    },

    async __GET_FAQ_CATEGORIES() {
      const data = await this.$store.dispatch("fetchFaqCategories/getFaqsCategories", {
        ...this.$route.query,
      });
      this.loading = false;
      this.totalPage = data.categories?.total;
      this.categories = data.categories?.data;
      this.categories = this.categories.map((item) => {
        return {
          ...item,
          numberId: item.id,
        };
      });
    },
    async __POST_FAQ_CATEGORIES(res) {
      try {
        await this.$store.dispatch("fetchFaqCategories/postFaqsCategories", res);
        await this.$notify({
          title: "Success",
          message: "Категория успешно добавлен",
          type: "success",
        });
        this.hide("add_faqs");
        this.__GET_FAQ_CATEGORIES();
        this.ruleFormEmpty();
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
    statusFunc(res) {
      switch (res.status) {
        case 422:
          this.$notify.error({
            title: "Error",
            message: "Указанные данные недействительны.",
          });
          break;
        case 500:
          this.$notify.error({
            title: "Error",
            message: "Cервер не работает",
          });
          break;
        case 404:
          this.$notify.error({
            title: "Error",
            message: res.data.errors,
          });
          break;
      }
    },
    async __EDIT_FAQ_CATEGORIES(res) {
      try {
        await this.$store.dispatch("fetchFaqCategories/editFaqsCategories", {
          id: this.editId,
          data: res,
        });
        this.$notify({
          title: "Success",
          message: "Пост успешно добавлен",
          type: "success",
        });
        this.hide("add_faqs");
        this.__GET_FAQ_CATEGORIES();
        this.ruleFormEmpty();
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
  },

  async mounted() {
    if (!Object.keys(this.$route.query).includes("page")) {
      await this.$router.replace({
        path: `/contents/faq_categories`,
        query: { page: this.params.page },
      });
    }
    this.pagination.current = this.$route.query.page * 1;
    this.__GET_FAQ_CATEGORIES();
  },
  watch: {
    async current(val) {
      this.changePagination(val, "/contents/faq", "__GET_FAQS");
    },
    visible(val) {
      if (!val) this.ruleFormEmpty();
    },
    "pagination.current"() {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    },
  },
  components: {
    TitleBlock,
    FormTitle,
    AddModal,
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
