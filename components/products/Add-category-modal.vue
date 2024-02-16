<template lang="html">
  <div>
    <AddModal
      title="Новая категория"
      name="add_category_modal"
      btnText="Add Group"
      :callback="categoryPost"
      :loadingBtn="loadingCategory"
      :closeModal="closeModal"
      :visible="visibleCategory"
    >
      <el-form
        label-position="top"
        :model="ruleFormCategory"
        :rules="rulesCategory"
        ref="categoryData"
        label-width="120px"
        class="demo-ruleForm"
      >
        <div class="form-block required">
          <div><label for="">Название категории </label></div>
          <el-form-item prop="name_ru">
            <el-input
              placeholder="Название категории "
              v-model="ruleFormCategory.name_ru"
            ></el-input>
          </el-form-item>
        </div>
        <div class="form-block">
          <div><label for="">Выберите категорию</label></div>
          <el-form-item>
            <el-select
              class="w-100"
              v-model="ruleFormCategory.parent_id"
              filterable
              :loading="brands.length < 1"
              loading-text="Loading..."
              no-data-text="Не найдено"
              no-match-text="Не найдено"
              placeholder="Выберите категорию"
            >
              <el-option
                v-for="item in categories"
                :key="item?.id"
                :label="item?.name?.ru"
                :value="item?.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="form-block required">
          <div><label for="">Информация о категории </label></div>
          <el-form-item prop="desc_ru">
            <el-input
              type="textarea"
              rows="5"
              placeholder="Описание"
              v-model="ruleFormCategory.desc_ru"
            ></el-input>
          </el-form-item>
        </div>
        <div class="d-flex">
          <div class="form-block">
            <div><label for="">Популярный </label></div>
            <div>
              <a-switch
                @change="switchPopular"
                :checked="ruleFormCategory.is_popular == 1"
              />
            </div>
          </div>
          <div class="form-block mx-5">
            <div><label for="">Статус </label></div>
            <a-switch @change="switchActive" />
          </div>
        </div>

        <div class="form-block">
          <div><label for="">Атрибуты</label></div>
          <el-form-item prop="attributes">
            <el-select
              class="w-100"
              v-model="ruleFormCategory.attributes"
              allow-create
              :loading="brands.length < 1"
              loading-text="Loading..."
              no-data-text="Не найдено"
              no-match-text="Не найдено"
              multiple
              placeholder="Atibut"
              @focus="__GET_ATRIBUTES"
            >
              <el-option
                v-for="item in allAtributes"
                :key="item?.id"
                :label="item?.name?.ru"
                :value="item?.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="form-block">
          <div><label for="">Характеристическая группа</label></div>
          <el-form-item prop="group_characteristics">
            <el-select
              class="w-100"
              v-model="ruleFormCategory.group_characteristics"
              allow-create
              :loading="brands.length < 1"
              loading-text="Loading..."
              multiple
              no-data-text="Не найдено"
              no-match-text="Не найдено"
              placeholder="Группа"
              @focus="__GET_GROUPS"
            >
              <el-option
                v-for="item in allGroups"
                :key="item?.id"
                :label="item?.name?.ru"
                :value="item?.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="form-block mb-0">
          <div><label for="">Изображение</label></div>
          <div class="clearfix variant-img pt-0">
            <a-upload
              list-type="picture-card"
              :file-list="fileListCategory"
              @preview="handlePreview"
              @change="handleChangeCategory"
            >
              <div v-if="fileListCategory.length < 1">
                <span v-html="addImgIcon"></span>
                <div class="ant-upload-text">Добавить изображение</div>
              </div>
            </a-upload>
            <a-modal
              :visible="previewVisible"
              :footer="null"
              @cancel="handleCancel"
            >
              <img alt="example" style="width: 100%" :src="previewImage" />
            </a-modal>
          </div>
        </div>
      </el-form>
    </AddModal>
  </div>
</template>
<script>
import AddModal from "../modals/Add-modal.vue";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
export default {
  props: {
    brands: {
      type: Array,
    },
    getCategories: {
      type: Function,
    },
    categories: {
      type: Array,
    },
    visible: {
      type: Boolean,
    },
  },
  data() {
    return {
      loadingCategory: false,
      rulesCategory: {
        desc_ru: [
          {
            required: true,
            message: "Описание обязательна",
            trigger: "change",
          },
        ],
        name_ru: [
          {
            required: true,
            message: "Категория обязательна",
            trigger: "change",
          },
        ],
        attributes: [
          {
            required: true,
            message: "Атрибут обязателен",
            trigger: "change",
          },
        ],
        group_characteristics: [
          {
            required: true,
            message: "Атрибут обязателен",
            trigger: "change",
          },
        ],
      },
      ruleFormCategory: {
        name_ru: "",
        img: null,
        parent_id: "",
        attributes: [],
        group_characteristics: [],
        is_popular: 0,
        is_active: 0,
        desc_ru: "",
      },
      addImgIcon: require("../../assets/svg/components/add-img-icon.svg?raw"),
      fileListCategory: [],
      allAtributes: [],
      allGroups: [],
      previewVisible: false,
      previewImage: "",
      visibleCategory: false,
    };
  },
  methods: {
    handleCancel() {
      this.previewVisible = false;
    },
    handleOk() {
      this.visibleCategory = false;
    },
    execute() {
      if (this.getCategories) {
        this.getCategories();
      }
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    categoryPost() {
      const newData = {
        ...this.ruleFormCategory,
        name: {
          ru: this.ruleFormCategory.name_ru,
        },
        desc: {
          ru: this.ruleFormCategory.desc_ru,
        },
      };
      delete newData["name_ru"];
      delete newData["desc_ru"];
      this.$refs["categoryData"].validate((valid) =>
        valid ? this.__POST_CATEGORY(newData) : false
      );
    },
    handleChangeCategory({ fileList }) {
      this.fileListCategory = fileList;
    },
    switchPopular(checked) {
      checked
        ? (this.ruleFormCategory.is_popular = 1)
        : (this.ruleFormCategory.is_popular = 0);
    },
    switchActive(checked) {
      checked
        ? (this.ruleFormCategory.is_active = 1)
        : (this.ruleFormCategory.is_active = 0);
    },
    notification(title, message, type) {
      this.$notify({
        title: title,
        message: message,
        type: type,
      });
    },
    async __UPLOAD_FILE(formData) {
      try {
        const data = await this.$store.dispatch(
          "uploadFile/uploadFile",
          formData
        );
        return data.path;
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
    async __GET_GROUPS() {
      const data = await this.$store.dispatch("fetchCharacters/getGroups");
      this.allGroups = data?.groups;
    },
    async __GET_ATRIBUTES() {
      const data = await this.$store.dispatch("fetchAtributes/getAtributes");
      this.allAtributes = data.attributes?.data;
    },
    closeModal(name) {
      this.handleOk();
    },
    async __POST_CATEGORY(res) {
      try {
        await this.$store.dispatch("fetchCategories/postCategories", res);
        this.notification("Success", "Категория успешно добавлен", "success");
        this.handleOk();
        this.execute();
        this.ruleFormCategory.name_ru = "";
        this.ruleFormCategory.desc_ru = "";
        this.ruleFormCategory.is_active = 0;
        this.ruleFormCategory.is_popular = 0;
        this.ruleFormCategory.parent_id = null;
        this.fileListCategory = [];
        this.allAtributes = [];
        this.allGroups = [];
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
  },
  watch: {
    async fileListCategory() {
      this.loadingCategory = true;
      let formData = new FormData();
      const newImg = this.fileListCategory;
      if (newImg.length > 0) {
        formData.append("file", newImg[0].originFileObj);
        this.ruleFormCategory.img = await this.__UPLOAD_FILE(formData);
        this.loadingCategory = false;
      }
    },
    visible(val) {
      this.visibleCategory = val;
    },
  },
  components: { AddModal },
};
</script>
<style lang=""></style>
