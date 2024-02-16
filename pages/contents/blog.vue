<template lang="html">
  <div>
    <TitleBlock title="Блог" :breadbrumb="['Контент сайта']" lastLink="Блог">
      <div
        v-if="checkAccess('posts', 'POST')"
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
          <FormTitle title="Блог" />
        </div>
        <div class="antd_table product_table">
          <a-table
            :columns="columns"
            :data-source="posts"
            :pagination="false"
            :loading="loading"
          >
            <span slot="created_at" slot-scope="text">{{text ?
              moment(text).format("DD/MM/YYYY"):'----'
            }}</span>
            <div slot="img" slot-scope="text">
              <img
                v-if="typeof text == 'string'"
                class="table-image"
                :src="text"
                alt=""
              />
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
            <div slot="desc" slot-scope="text" v-html="text?.ru"></div>
            <span slot="numberId" slot-scope="text">#{{ text }}</span>
            <span slot="customTitle"></span>
            <span slot="id" slot-scope="text">
              <span
                class="action-btn"
                v-if="checkAccess('posts', 'PUT')"
                @click="editPost(text)"
              >
                <img :src="editIcon" alt="" />
              </span>
              <a-popconfirm
                v-if="checkAccess('posts', 'DELETE')"
                title="Are you sure delete this blog?"
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
      :dialog-style="{ top: '5px' }"
      :title="editId ? 'Изменить блога' : 'Добавить блога'"
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
              <label for="">Зоговолок</label>
            </div>
            <el-form-item prop="title_ru">
              <el-input
                type="text"
                placeholder="Зоговолок"
                v-model="ruleForm[`title_${item.index}`]"
              ></el-input>
            </el-form-item>
          </div>
          <div class="form-block">
            <div><label for="">Описание </label></div>
            <el-form-item prop="desc_ru">
              <quill-editor
                class="product-editor mt-1"
                :options="editorOption"
                :value="ruleForm[`desc_${item.index}`]"
                v-model="ruleForm[`desc_${item.index}`]"
              />
            </el-form-item>
          </div>

          <div class="clearfix variant-img">
            <a-upload
              action="https://api.home24.uz/api/admin/files/upload"
              :headers="headers"
              list-type="picture-card"
              :file-list="fileList"
              @preview="handlePreview"
              @change="handleChange"
            >
              <div v-if="fileList.length < 1">
                <span v-html="addImgIcon"></span>
                <div class="ant-upload-text">Добавить изображение</div>
              </div>
            </a-upload>
            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
              <img alt="example" style="width: 100%" :src="previewImage" />
            </a-modal>
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
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import authAccess from "@/mixins/authAccess";
import moment from "moment"
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
  mixins: [authAccess],
  data() {
    return {
      headers: {
        authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      page: 1,
      current: 1,
      pageSizes: [
        {
          value: 10,
          label: "10",
        },
        {
          value: 25,
          label: "25",
        },
        {
          value: 50,
          label: "50",
        },
        {
          value: 100,
          label: "100",
        },
      ],
      totalPage: 1,
      params: {
        page: 1,
        pageSize: 10,
      },
      visible: false,
      loading: true,
      modalTab: "ru",
      editIcon: require("../../assets/svg/components/edit-icon.svg"),
      deleteIcon: require("../../assets/svg/components/delete-icon.svg"),
      addIcon: require("../../assets/svg/components/add-icon.svg?raw"),
      addImgIcon: require("../../assets/svg/components/add-img-icon.svg?raw"),
      loadingBtn: false,
      editorOption: {
        theme: "snow",
        modules: {
          toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ 'header': 1 }, { 'header': 2 }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'script': 'sub' }, { 'script': 'super' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'direction': 'rtl' }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'font': [] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'align': [] }],
              ['clean'],
              ['link', 'image', 'video']
            ],
        },
      },
      option: {
        theme: "bubble",
        modules: {
          toolbar: [
            ["bold", "italic", "link"],
            [
              {
                header: 1,
              },
              {
                header: 2,
              },
              "blockquote",
            ],
          ],
        },
      },
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
        desc_ru: "",
        desc_uz: "",
        desc_en: "",
        img: "",
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
          title: "Зоговолок",
          dataIndex: "sm_img",
          key: "sm_img",
          slots: { title: "customTitle" },
          scopedSlots: { customRender: "img" },
          align: "left",
          className: "column-img",
          colSpan: 2,
          width: "45px",
        },
        {
          dataIndex: "title",
          key: "title",
          slots: { title: "customTitle" },
          scopedSlots: { customRender: "title" },
          className: "column-name",
          width: "30%",
          colSpan: 0,
        },
        {
          title: "Дата",
          dataIndex: "created_at",
          key: "created_at",
          align: "center",
          scopedSlots: { customRender: "created_at" },
          className: "column-date",
        },
        // {
        //   title: "Slug",
        //   dataIndex: "slug",
        //   className: "column-qty",
        //   key: "slug",
        //   align: "center",
        // },

        {
          title: "действия",
          key: "id",
          dataIndex: "id",
          scopedSlots: { customRender: "id" },
          className: "column-btns",
          //   width: "10%",
          align: "right",
        },
      ],

      editId: "",
      previewVisible: false,
      previewImage: "",
      fileList: [],
      posts: [],
      rules: {
        title_ru: [
          {
            required: true,
            message: "Blog title is required",
            trigger: "blur",
          },
        ],

        desc_ru: [
          {
            required: true,
            message: "Blog desc is required",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    moment,
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
          path: `/contents/blog`,
          query: {
            page: this.current,
            per_page: e,
          },
        });
        this.__GET_POSTS();
      }
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    },

    getData() {
      const newData = {
        img: this.ruleForm.img,
        title: {
          ru: this.ruleForm.title_ru,
          uz: this.ruleForm.title_uz,
          en: this.ruleForm.title_en,
        },
        desc: {
          ru: this.ruleForm.desc_ru,
          uz: this.ruleForm.desc_uz,
          en: this.ruleForm.desc_en,
        },
      };
      if (this.editId != "") {
        if (this.fileList.lenth > 0) {
          if (this.fileList[0].oldImg) {
            newData.img = this.fileList[0].url;
          }
        }
      }
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.editId != "" ? this.__EDIT_POSTS(newData) : this.__POST_POSTS(newData);
        } else {
          return false;
        }
      });
    },
    cancel(e) {
    },
    openAddModal() {
      this.fileList = [];
      this.editId = "";
      this.showModal();
    },
    editPost(id) {
      this.editId = id;
      const data = this.posts.find((item) => item.id == id);
      this.ruleForm = {
        ...data,
        title_ru: data.title.ru,
        title_uz: data.title.uz,
        title_en: data.title.en,
        desc_ru: data.desc.ru,
        desc_uz: data.desc.uz,
        desc_en: data.desc.en,
      };
      this.fileList = [
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          oldImg: true,
          url: this.ruleForm.sm_img,
        },
      ];
      this.showModal();
    },
    closeModal() {
      this.handleOk();
      this.ruleFormEmpty();
      this.editId = "";
      this.editImage = "";
      this.__GET_POSTS();
    },
    ruleFormEmpty() {
      this.ruleForm.title_ru = "";
      this.ruleForm.title_uz = "";
      this.ruleForm.title_en = "";
      this.ruleForm.desc_ru = "";
      this.ruleForm.desc_uz = "";
      this.ruleForm.desc_en = "";
      this.ruleForm.img = "";
    },
    deletePost(id) {
      this.__DELETE_POSTS(id);
    },
    async __DELETE_POSTS(id) {
      try {
        await this.$store.dispatch("fetchPosts/deletePosts", id);
        await this.$notify({
          title: "Success",
          message: "Пост был успешно удален",
          type: "success",
        });
        this.__GET_POSTS();
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
      this.fileList = fileList;
      this.loadingBtn = true;
      if (fileList[0]?.response?.path) {
        this.ruleForm.img = fileList[0].response.path;
        this.loadingBtn = false;
      } else if (fileList.length == 0) {
        this.loadingBtn = false;
      }
    },

    handleCancel() {
      this.previewVisible = false;
    },
    async __GET_POSTS() {
      this.loading = true;
      const data = await this.$store.dispatch("fetchPosts/getPosts", {
        ...this.$route.query,
      });
      this.loading = false;
      this.totalPage = data.posts?.total;
      this.posts = data.posts?.data;
      const pageIndex = this.indexPage(data?.posts?.current_page, data?.posts?.per_page);
      this.posts = this.posts.map((item, index) => {
        return {
          ...item,
          numberId: index + pageIndex,
        };
      });
    },
    indexPage(current_page, per_page) {
      return (current_page * 1 - 1) * per_page + 1;
    },
    async __POST_POSTS(res) {
      try {
        await this.$store.dispatch("fetchPosts/postPosts", res);
        await this.$notify({
          title: "Success",
          message: "Атрибут успешно добавлен",
          type: "success",
        });
        this.handleOk();
        this.__GET_POSTS();
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
    async __EDIT_POSTS(res) {
      try {
        await this.$store.dispatch("fetchPosts/editPosts", {
          id: this.editId,
          data: res,
        });
        this.$notify({
          title: "Success",
          message: "Пост успешно добавлен",
          type: "success",
        });
        this.handleOk();
        this.__GET_POSTS();
        this.ruleFormEmpty();
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
        path: `/contents/blog`,
        query: { page: this.params.page, per_page: this.params.pageSize },
      });
    }
    this.__GET_POSTS();
    this.current = Number(this.$route.query.page);
    this.params.pageSize = Number(this.$route.query.per_page);
  },
  watch: {
    visible(val) {
      if (!val) {
        this.ruleFormEmpty();
      }
    },
    async current(val) {
      if (this.$route.query.page != val) {
        await this.$router.replace({
          path: `/contents/blog`,
          query: {
            page: val,
            per_page: this.params.pageSize,
          },
        });
        this.__GET_POSTS();
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
