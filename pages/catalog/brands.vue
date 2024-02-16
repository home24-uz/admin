<template lang="html">
  <div>
    <TitleBlock title="Бренды" :breadbrumb="['Контент сайта']" lastLink="Бренды">
      <div
        v-if="checkAccess('brands', 'POST')"
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
          <div class="prodduct-list-header-grid w-100 align-items-center">
            <SearchInput
              placeholder="Поиск бренда"
              @changeSearch="changeSearch($event, '/catalog/brands', '__GET_BRANDS')"
            />
            <span></span>
            <span></span>
            <a-button
              @click="clearQuery('/catalog/brands', '__GET_BRANDS')"
              type="primary"
              class="d-flex align-items-center justify-content-center"
              style="height: 38px"
              ><a-icon type="reload"
            /></a-button>
          </div>
        </div>
        <div class="antd_table product_table">
          <a-table
            :columns="columnBrand"
            :data-source="brands"
            :pagination="false"
            align="center"
            :loading="loading"
          >
            <a slot="img" slot-scope="text">
              <img v-if="text" class="table-image" :src="text" alt="" />
              <img
                v-else
                class="table-image"
                src="../../assets/images/photo_2023-03-04_13-28-58.jpg"
                alt=""
              />
            </a>
            <span
              @click="$router.push('/home/customer-info/123')"
              slot="title"
              slot-scope="text"
              align="center"
            >
              <h6>{{ text?.ru }}</h6>
            </span>
            <div slot="desc" slot-scope="text" v-html="text?.ru"></div>
            <span slot="key" slot-scope="text">#{{ text }}</span>
            <a slot="price" slot-scope="text">${{ text }}</a>
            <span slot="customTitle"></span>

            <span
              slot="tags"
              slot-scope="tags"
              class="tags-style"
              :class="{
                tag_new: tags == 'Success',
                tag_pending: tags == 'in progress',
                tag_accepted: tags == 'Approved',
                tag_canceled: tags == 'rejected',
              }"
            >
              {{ tags }}
            </span>
            <span slot="id" slot-scope="text">
              <span
                class="action-btn"
                v-if="checkAccess('brands', 'PUT')"
                @click="editPost(text)"
              >
                <img :src="editIcon" alt="" />
              </span>
              <a-popconfirm
                v-if="checkAccess('brands', 'DELETE')"
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
      :title="editId ? 'Изменения бренда' : 'Добавить бренда'"
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
        <div>
          <div class="form-block required">
            <div>
              <label for="">Бренд </label>
            </div>
            <el-form-item prop="name">
              <el-input
                type="text"
                placeholder="Зоговолок"
                v-model="ruleForm.name"
              ></el-input>
            </el-form-item>
          </div>
          <div class="d-flex flex-row form-block mt-3 mb-0">
            <span>
              <a-switch
                :checked="ruleForm.is_top == 1"
                @change="
                  ruleForm.is_top == 1 ? (ruleForm.is_top = 0) : (ruleForm.is_top = 1)
                "
            /></span>
            <label class="mx-3">Популярные бренды </label>
          </div>
          <div class="clearfix variant-img mt-0">
            <a-upload
              action="https://api.home24.uz/api/admin/files/upload"
              list-type="picture-card"
              :headers="headers"
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
import Title from "../../components/Title.vue";
import TitleBlock from "../../components/Title-block.vue";
import FormTitle from "../../components/Form-title.vue";
import global from "../../mixins/global";
import status from "@/mixins/status";
import columns from "../../mixins/columns";
import authAccess from "@/mixins/authAccess";
import SearchInput from "../../components/form/Search-input.vue";

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
  mixins: [global, status, columns, authAccess],
  data() {
    return {
      headers: {
        authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
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
      selectedRowKeys: [], // Check here to configure the default column
      loading: true,
      loadingBtn: false,
      ruleForm: {
        name: "",
        logo: "",
        is_top: 0,
      },
      editImage: "",
      editId: "",
      previewVisible: false,
      previewImage: "",
      fileList: [],
      brands: [],
      formData: {},
      rules: {
        name: [
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
      if (this.fileList.length > 0) {
        if (this.fileList[0].oldImg) {
          this.ruleForm.logo = this.fileList[0].url;
        }
      }
      const data = {
        name: this.ruleForm.name,
        logo: this.ruleForm.logo,
        is_top: this.ruleForm.is_top,
      };
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.editId != "" ? this.__EDIT_BRANDS(data) : this.__POST_BRANDS(data);
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
      const data = this.brands.find((item) => item.id == id);
      this.slug = data.slug;
      this.ruleForm = {
        ...data,
        logo: data.lg_logo,
      };
      this.showModal();
      if (this.ruleForm.lg_logo) {
        this.fileList = [
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            oldImg: true,
            url: this.ruleForm.lg_logo,
          },
        ];
      }
    },
    deletePost(id) {
      this.__DELETE_GLOBAL(
        id,
        "fetchBrands/deleteBrands",
        "Бранд был успешно удален",
        "__GET_BRANDS"
      );
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },

    handleChange({ fileList }) {
      this.fileList = fileList;
      this.loadingBtn = true;
      if (fileList[0]?.response?.path) {
        this.loadingBtn = false;
        this.ruleForm.logo = fileList[0]?.response?.path;
      } else {
        this.ruleForm.logo = "";
      }
      if (fileList.length == 0) {
        this.loadingBtn = false;
      }
    },

    handleCancel() {
      this.previewVisible = false;
    },
    async __GET_BRANDS() {
      this.loading = true;
      const data = await this.$store.dispatch("fetchBrands/getBrands", {
        ...this.$route.query,
      });
      this.brands = data.brands?.data;
      this.loading = false;
      this.totalPage = data.brands?.total;
      const pageIndex = this.indexPage(
        data?.brands?.current_page,
        data?.brands?.per_page
      );
      this.brands = this.brands.map((item, index) => {
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
    async __POST_BRANDS(res) {
      try {
        await this.$store.dispatch("fetchBrands/postBrands", res);
        this.notification("Success", "Бранд успешно добавлен", "success");
        this.handleOk();
        this.__GET_BRANDS();
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
    async __EDIT_BRANDS(res) {
      try {
        await this.$store.dispatch("fetchBrands/editBrands", {
          id: this.editId,
          data: { ...res, slug: this.slug },
        });
        this.notification("Success", "Бранд успешно добавлен", "success");
        this.handleOk();
        this.__GET_BRANDS();
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
    emptyData() {
      this.ruleForm.logo = "";
      this.ruleForm.name = "";
      this.editId = "";
      this.fileList = [];
    },
  },

  async mounted() {
    this.getFirstData("/catalog/brands", "__GET_BRANDS");
  },
  watch: {
    "ruleForm.is_top"(val) {
    },
    async current(val) {
      this.changePagination(val, "/catalog/brands", "__GET_BRANDS");
    },
    visible(val) {
      if (val == false) {
        this.emptyData();
      }
    },
  },
  components: {
    AddBtn,
    Title,
    TitleBlock,
    FormTitle,
    SearchInput,
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
