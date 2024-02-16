<template lang="html">
  <div>
    <TitleBlock title="Баннеры" :breadbrumb="['Контент сайта']" lastLink="Баннеры">
      <div
        v-if="checkAccess('banners', 'POST')"
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
          <FormTitle title="Баннеры" />
        </div>
        <div class="antd_table product_table">
          <a-table
            :columns="columns"
            :data-source="banners"
            :pagination="false"
            :loading="loading"
          >
            <div slot="img" slot-scope="text">
              <img v-if="text?.ru" class="table-image" :src="text?.ru" alt="" />
              <img
                v-else
                class="table-image"
                src="../../assets/images/photo_2023-03-04_13-28-58.jpg"
                alt=""
              />
            </div>

            <div slot="link" slot-scope="text" v-html="text?.ru"></div>
            <div slot="type" slot-scope="text">{{ typeNames[text] }}</div>
            <span slot="numberId" slot-scope="text">#{{ text }}</span>
            <span slot="customTitle"></span>

            <span slot="id" slot-scope="text">
              <span
                class="action-btn"
                v-if="checkAccess('banners', 'PUT')"
                @click="editPost(text)"
              >
                <img :src="editIcon" alt="" />
              </span>
              <a-popconfirm
                v-if="checkAccess('banners', 'DELETE')"
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
    <a-modal
      v-model="visible"
      :title="editId ? 'Изменить баннера' : 'Добавить баннера'"
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
            <el-form-item prop="link.ru" label="Ссылка">
              <el-input
                id="banner_link"
                type="text"
                placeholder="Ссылка"
                v-model="ruleForm.link[item.index]"
              ></el-input>
            </el-form-item>
          </div>
          <div class="form-block required mb-0">
            <el-form-item prop="type" label="Тип">
              <el-select
                v-model="ruleForm.type"
                class="w-100"
                filterable
                placeholder="Тип баннера"
                loading-text="Loading..."
                no-match-text="no category"
                no-data-text="No Category"
                default-first-option
              >
                <el-option
                  v-for="item in types"
                  :key="item"
                  :label="typeNames[item]"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="modal_tab mt-3">
            <span
              v-for="(itemImg, indexImg) in imageSizes"
              :key="indexImg"
              @click="imageSize = itemImg.index"
              :class="{ 'avtive-modalTab': imageSize == itemImg.index }"
            >
              {{ itemImg.label }}
            </span>
          </div>
          <div
            v-for="(itemImg, indexImg) in imageSizes"
            :key="indexImg"
            v-if="imageSize == itemImg.index"
          >
            <div
              class="clearfix variant-img"
              :class="{ 'reqired-error': bannerRequired == imageSize }"
            >
              <a-upload
                action="https://api.home24.uz/api/admin/files/upload"
                :headers="headers"
                list-type="picture-card"
                :file-list="fileList[imageSize][item.index]"
                @preview="handlePreview"
                @change="($event) => handleChange($event, item.index, imageSize)"
              >
                <div v-if="fileList[imageSize][item.index]?.length < 1">
                  <span v-html="addImgIcon"></span>
                  <div class="ant-upload-text">Добавить изображение</div>
                </div>
              </a-upload>
              <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                <img alt="example" style="width: 100%" :src="previewImage" />
              </a-modal>
            </div>
          </div>
          <p class="variant-img-text">
            Изображение
            <span :class="{ error: sizeError }"
              >Максимальный размер загрузки — 1 МБ..</span
            >
          </p>
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
import global from "../../mixins/global";
import authAccess from "@/mixins/authAccess";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
export default {
  // middleware: "auth",
  mixins: [global, authAccess],
  data() {
    return {
      typeNames: {
        main: "Главный баннер 1",
        product_of_the_day: "Главный баннер 2",
        type1: "Баннер категории",
        type2: "Баннер (скидка)",
        promo: "Promo",
        top: "Top",
        small: "Small",
        medium: "Medium",
        bottom: "Bottom",
      },
      headers: {
        authorization: `Bearer ${localStorage.getItem("auth_token")}`,
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
      imageSizes: [
        {
          index: "img",
          label: "Баннер",
        },
        {
          index: "m_img",
          label: "Баннер ( Мобильный )",
        },
      ],
      imageSize: "img",
      ruleForm: {
        img: {
          ru: "",
          en: "",
          uz: "",
        },
        m_img: {
          ru: "",
          en: "",
          uz: "",
        },
        type: "",
        link: {
          ru: "",
          en: "",
          uz: "",
        },
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
          title: "Рисунок",
          dataIndex: "sm_img",
          key: "sm_img",
          slots: { title: "customTitle" },
          scopedSlots: { customRender: "img" },
          align: "left",
          className: "column-img",
        },
        {
          title: "Ссылка",
          dataIndex: "link",
          key: "link",
          slots: { title: "customTitle" },
          scopedSlots: { customRender: "link" },
          className: "column-name",
          width: "30%",
          align: "center",
        },
        {
          title: "Тип",
          dataIndex: "type",
          key: "type",
          slots: { title: "customTitle" },
          scopedSlots: { customRender: "type" },
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
      fileList: {
        img: { ru: [], en: [], uz: [] },
        m_img: { ru: [], en: [], uz: [] },
      },
      banners: [],
      types: {},
      rules: {
        link: {
          ru: [
            {
              required: true,
              message: "Banner link is required",
              trigger: "blur",
            },
          ],
        },
        type: [
          {
            required: true,
            message: "Banner type desc is required",
            trigger: "blur",
          },
        ],
      },
      visible: false,
      sizeError: false,
      bannerRequired: null,
    };
  },
  methods: {
    showModal() {
      this.visible = true;
    },
    handleOk() {
      this.visible = false;
    },
    async changePageSize(e) {
      this.current = 1;
      if (this.$route.query.per_page != e) {
        await this.$router.replace({
          path: `/contents/banners`,
          query: {
            page: this.current,
            per_page: e,
          },
        });
        this.__GET_BANNERS();
      }
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    },

    getData() {
      this.$refs["ruleForm"].validate((valid) => {
        if (this.ruleForm.img.ru == "") {
          this.$notify.error({
            title: "Error",
            message: "Banner img is required",
          });
          this.bannerRequired = "img";
          this.imageSize = "img";

          return false;
        }
        if (this.ruleForm.m_img.ru == "") {
          this.$notify.error({
            title: "Error",
            message: "Mobile banner img is required",
          });
          this.bannerRequired = "m_img";
          this.imageSize = "m_img";

          return false;
        }
        if (valid) {
          this.bannerRequired = null;
          this.editId != ""
            ? this.__EDIT_BANNERS(this.ruleForm)
            : this.__POST_BANNERS(this.ruleForm);
        } else {
          return false;
        }
      });
    },
    cancel(e) {
      // this.$message.error("Click on No");
    },
    openAddModal() {
      this.fileList = {
        img: { ru: [], en: [], uz: [] },
        m_img: { ru: [], en: [], uz: [] },
      };
      this.editId = "";
      this.ruleForm.type = "";
      this.showModal();
    },
    editPost(id) {
      this.editId = id;
      const data = this.banners.find((item) => item.id == id);
      this.ruleForm = {
        img: data.sm_img
          ? data.sm_img
          : {
              ru: "",
              en: "",
              uz: "",
            },
        m_img: data.sm_m_img
          ? data.sm_m_img
          : {
              ru: "",
              en: "",
              uz: "",
            },
        link: data.link,
        type: data.type,
      };
      Object.keys(this.fileList).forEach((elem) => {
        this.fileList[elem].ru = this.ruleForm[elem]?.ru
          ? [
              {
                uid: "-1",
                name: "image.png",
                status: "done",
                url: this.ruleForm[elem]?.ru,
              },
            ]
          : [];
        this.fileList[elem].uz = this.ruleForm[elem]?.uz
          ? [
              {
                uid: "-1",
                name: "image.png",
                status: "done",
                url: this.ruleForm[elem].uz,
              },
            ]
          : [];
        // this.fileList[elem].en = this.ruleForm.img?.en
        //   ? [
        //       {
        //         uid: "-1",
        //         name: "image.png",
        //         status: "done",
        //         url: this.ruleForm.img.en,
        //       },
        //     ]
        //   : [];
      });
      delete this.ruleForm.m_img.en;
      this.showModal();
    },
    closeModal() {
      this.handleOk();
      this.ruleFormEmpty();
      this.editId = "";
      this.__GET_BANNERS();
    },
    ruleFormEmpty() {
      this.ruleForm.img = {
        ru: "",
        uz: "",
        en: "",
      };
      this.ruleForm.m_img = {
        ru: "",
        uz: "",
        en: "",
      };
      this.ruleForm.link.ru = "";
      this.ruleForm.link.uz = "";
      this.ruleForm.link.en = "";
    },
    deletePost(id) {
      this.__DELETE_BANNERS(id);
    },
    async __GET_BANNERS_TYPES() {
      const types = await this.$store.dispatch("fetchBanners/getBannerType");
      this.types = Object.values(types.types);
    },
    async __DELETE_BANNERS(id) {
      try {
        await this.$store.dispatch("fetchBanners/deleteBanners", id);
        await this.$notify({
          title: "Success",
          message: "Баннер был успешно удален",
          type: "success",
        });
        this.__GET_BANNERS();
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
    async handleChange({ fileList }, lang, imgType) {
      this.loadingBtn = true;
      this.fileList[imgType][lang] = fileList;
      if (fileList[0]?.response?.path) {
        this.ruleForm[imgType][lang] = fileList[0]?.response?.path;
        this.loadingBtn = false;
      } else if (fileList.length == 0) {
        this.ruleForm[imgType][lang] = "";
        this.loadingBtn = false;
      }
      if (!fileList?.response) {
        this.sizeError = true;
      }
    },

    handleCancel() {
      this.previewVisible = false;
    },
    async __GET_BANNERS() {
      this.loading = true;
      const data = await this.$store.dispatch("fetchBanners/getBanners", {
        ...this.$route.query,
      });
      this.loading = false;
      this.totalPage = data.banners?.total;
      this.banners = data.banners?.data;
      this.banners = this.banners.map((item) => {
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
        this.sizeError = false;
        this.handleOk();
        this.__GET_BANNERS();
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
        this.handleOk();
        this.__GET_BANNERS();
        this.ruleFormEmpty();
        this.ruleForm.type = "";
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
  },

  async mounted() {
    if (
      !Object.keys(this.$route.query).includes("page") ||
      !Object.keys(this.$route.query).includes("per_page")
    ) {
      await this.$router.replace({
        path: `/contents/banners`,
        query: { page: this.params.page, per_page: this.params.pageSize },
      });
    }
    this.__GET_BANNERS();
    this.__GET_BANNERS_TYPES();
    this.current = Number(this.$route.query.page);
    this.params.pageSize = Number(this.$route.query.per_page);
  },
  watch: {
    visible(val) {
      if (!val) this.ruleFormEmpty();
    },
    async current(val) {
      if (this.$route.query.page != val) {
        await this.$router.replace({
          path: `/contents/banners`,
          query: {
            page: val,
            per_page: this.params.pageSize,
          },
        });
        this.__GET_BANNERS();
      }
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
.reqired-error .ant-upload.ant-upload-select-picture-card {
  border-color: red;
}
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
.error {
  color: red !important;
}
</style>
