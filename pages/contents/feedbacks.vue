<template lang="html">
  <div>
    <TitleBlock title="Отзывы" :breadbrumb="['Контент сайта']" lastLink="Отзывы">
      <div
        v-if="checkAccess('feedbacks', 'POST')"
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
          <FormTitle title="Отзывы" />
        </div>
        <div class="antd_table product_table">
          <a-table
            :columns="columns"
            :data-source="feedbacks"
            :pagination="false"
            :loading="loading"
          >
            <div slot="img" slot-scope="text">
              <img
                v-if="text[0]?.lg_img"
                class="table-image"
                :src="text[0]?.lg_img"
                alt=""
              />
              <img
                v-else
                class="table-image"
                src="../../assets/images/photo_2023-03-04_13-28-58.jpg"
                alt=""
              />
            </div>

            <div slot="feedback" slot-scope="text" v-html="text?.ru"></div>
            <span slot="numberId" slot-scope="text">#{{ text }}</span>
            <span slot="customTitle"></span>

            <span slot="id" slot-scope="text">
              <span
                class="action-btn"
                v-if="checkAccess('feedbacks', 'PUT')"
                @click="editPost(text)"
              >
                <img :src="editIcon" alt="" />
              </span>
              <a-popconfirm
                v-if="checkAccess('feedbacks', 'DELETE')"
                title="Are you sure delete this banner?"
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
import authAccess from "@/mixins/authAccess";
import global from "../../mixins/global";
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
export default {
  mixins: [authAccess, global],
  // middleware: "auth",
  data() {
    return {
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
      selectedRowKeys: [], // Check here to configure the default column
      loadingBtn: false,
      ruleForm: {
        img: {
          ru: "",
          en: "",
          uz: "",
        },
        type: "",
        link_ru: "",
        link_uz: "",
        link_en: "",
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
          title: "Картинка",
          dataIndex: "images",
          key: "images",
          slots: { title: "customTitle" },
          scopedSlots: { customRender: "img" },
          align: "left",
          className: "column-img",
        },
        {
          title: "Компания",
          dataIndex: "company",
          key: "company",
          slots: { title: "customTitle" },
          scopedSlots: { customRender: "company" },
          className: "column-name",
          width: "30%",
          align: "center",
        },
        {
          title: "Ссылка",
          dataIndex: "feedback",
          key: "feedback",
          slots: { title: "customTitle" },
          scopedSlots: { customRender: "feedback" },
          className: "column-name",
          width: "30%",
          align: "center",
        },

        {
          title: "действия",
          key: "id",
          dataIndex: "id",
          scopedSlots: { customRender: "id" },
          className: "column-btns",
          // width: "100px",
          align: "right",
        },
      ],

      editId: "",
      previewVisible: false,
      previewImage: "",
      fileList: [],
      feedbacks: [],
      types: {},
      rules: {
        link_ru: [
          {
            required: true,
            message: "Banner link is required",
            trigger: "change",
          },
        ],

        type: [
          {
            required: true,
            message: "Banner type desc is required",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    show(name) {
      this.$modal.show(name);
    },
    hide(name) {
      this.$modal.hide(name);
    },

    getData() {
      const newData = {
        ...this.ruleForm,
        link: {
          ru: this.ruleForm.link_ru,
          uz: this.ruleForm.link_uz,
          en: this.ruleForm.link_en,
        },
      };
      delete newData["link_ru"];
      delete newData["link_uz"];
      delete newData["link_en"];
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.editId != "" ? this.__EDIT_BANNERS(newData) : this.__POST_BANNERS(newData);
        } else {
          return false;
        }
      });
    },
    cancel(e) {
      // this.$message.error("Click on No");
    },
    openAddModal() {
      this.fileList = [];
      this.editId = "";
      this.ruleForm.type = "";
      this.$router.push("/contents/add_feedbacks");
    },
    editPost(id) {
      this.$router.push(`/contents/edit_feedbacks/${id}`);
    },
    closeModal() {
      this.hide("add_feedbacks");
      this.ruleFormEmpty();
      this.editId = "";
      this.__GET_FEEDBACKS();
    },
    ruleFormEmpty() {
      this.ruleForm.img = {
        ru: "",
        uz: "",
        en: "",
      };
      this.ruleForm.link_ru = "";
      this.ruleForm.link_uz = "";
      this.ruleForm.link_en = "";
    },
    deletePost(id) {
      this.__DELETE_FEEDBACKS(id);
    },

    async __DELETE_FEEDBACKS(id) {
      try {
        await this.$store.dispatch("fetchFeedbacks/deleteFeedbacks", id);
        await this.$notify({
          title: "Success",
          message: "Баннер был успешно удален",
          type: "success",
        });
        this.__GET_FEEDBACKS();
      } catch (e) {
        this.statusFunc(e.response);
      }
    },

    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    async handleChange({ fileList }) {
      this.loadingBtn = true;
      this.fileList = fileList;
      let formData = new FormData();
      const newImg = fileList;
      if (newImg.length > 0) {
        formData.append("file", newImg[0].originFileObj);
        this.ruleForm.img.ru = await this.__UPLOAD_FILE(formData);
        this.loadingBtn = false;
      }
    },
    async __UPLOAD_FILE(formData) {
      try {
        const data = await this.$store.dispatch("uploadFile/uploadFile", formData);
        return data.path;
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
    handleCancel() {
      this.previewVisible = false;
    },
    async __GET_FEEDBACKS() {
      const data = await this.$store.dispatch("fetchFeedbacks/getFeedbacks", {
        ...this.$route.query,
      });

      this.loading = false;
      this.totalPage = data.feedbacks?.total;
      this.feedbacks = data.feedbacks?.data;
      this.feedbacks = this.feedbacks.map((item) => {
        return {
          ...item,
          numberId: item.id,
        };
      });
    },
    async __POST_BANNERS(res) {
      try {
        await this.$store.dispatch("fetchBanners/postBanners", res);
        await this.$notify({
          title: "Success",
          message: "Атрибут успешно добавлен",
          type: "success",
        });
        this.hide("add_feedbacks");
        this.__GET_FEEDBACKS();
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
    async __EDIT_BANNERS(res) {
      try {
        await this.$store.dispatch("fetchBanners/editBanners", {
          id: this.editId,
          data: res,
        });
        this.$notify({
          title: "Success",
          message: "Пост успешно добавлен",
          type: "success",
        });
        this.hide("add_feedbacks");
        this.__GET_FEEDBACKS();
        this.ruleFormEmpty();
        this.ruleForm.type = "";
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
  },

  async mounted() {
    if (!Object.keys(this.$route.query).includes("page")) {
      await this.$router.replace({
        path: `/contents/feedbacks`,
        query: { page: this.params.page },
      });
    }
    this.pagination.current = this.$route.query.page * 1;
    this.__GET_FEEDBACKS();
    // this.__GET_FEEDBACKS_TYPES();
  },
  watch: {
    async current(val) {
      this.changePagination(val, "/contents/faq", "__GET_FAQS");
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
