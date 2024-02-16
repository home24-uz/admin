<template lang="html">
  <div>
    <AddModal
      title="New group"
      name="add_brand_modal"
      btnText="Add Group"
      :callback="getData"
      :loadingBtn="loadingBrand"
      :closeModal="closeModal"
      :visible="visible"
    >
      <el-form
        label-position="top"
        :model="brandData"
        :rules="rulesModal"
        ref="brandData"
        label-width="120px"
        class="demo-ruleForm"
      >
        <div class="form-block required">
          <div><label for="">Brand </label></div>
          <el-form-item prop="name">
            <el-input
              placeholder="Модель продукта"
              v-model="brandData.name"
            ></el-input>
          </el-form-item>
        </div>
        <div class="clearfix variant-img">
          <a-upload
            list-type="picture-card"
            :file-list="fileListBrand"
            @preview="handlePreview"
            @change="handleChangeBrand"
          >
            <div v-if="fileListBrand.length < 1">
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
    getBrands: {
      type: Function,
    },
    visible: {
      type: Boolean,
    },
  },
  data() {
    return {
      loadingBrand: false,
      fileListBrand: [],
      addImgIcon: require("../../assets/svg/components/add-img-icon.svg?raw"),
      previewVisible: false,
      previewImage: "",
      brandData: {
        name: "",
        logo: "",
      },
      rulesModal: {
        name: [
          {
            required: true,
            message: "Brand name is required",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    execute() {
      if (this.getBrands) {
        this.getBrands();
      }
    },
    getData() {
      this.$refs["brandData"].validate((valid) =>
        valid ? this.__POST_BRAND() : false
      );
    },
    closeModal(name) {
      this.hide("add_brand_modal");
    },

    handleChangeBrand({ fileList }) {
      this.fileListBrand = fileList;
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    show(name) {
      this.$modal.show(name);
      document.body.style.overflowY = "hidden";
      document.body.style.height = "100vh";
    },
    hide(name) {
      this.$modal.hide(name);
      document.body.style.overflowY = "auto";
      document.body.style.height = "auto";
    },
    async __POST_BRAND() {
      try {
        await this.$store.dispatch("fetchBrands/postBrands", this.brandData);
        this.notification("Success", "Бранд успешно добавлен", "success");
    
        this.hide("add_brand_modal");
        this.execute();
        this.brandData.name = "";
      } catch (e) {
        this.statusFunc(e.response);
      }
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
    handleCancel() {
      this.previewVisible = false;
    },
    notification(title, message, type) {
      this.$notify({
        title: title,
        message: message,
        type: type,
      });
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
    async fileListBrand() {
      this.loadingBrand = true;
      let formData = new FormData();
      const newImg = this.fileListBrand;
      if (newImg.length > 0) {
        formData.append("file", newImg[0].originFileObj);
        this.brandData.logo = await this.__UPLOAD_FILE(formData);
        this.loadingBrand = false;
      }
    },
  },
  components: { AddModal },
};
</script>
<style lang=""></style>
