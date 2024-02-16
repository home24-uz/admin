<template lang="html">
  <div>
    <el-form
      label-position="top"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <TitleBlock title="Feedback" :breadbrumb="['Контент сайта']" lastLink="Feedback">
        <div class="d-flex">
          <span class="mx-3">
            <LayoutHeaderBtn name="Отмена" :headerbtnCallback="toBack" :light="true" />
          </span>
          <a-button
            v-if="checkAccess('feedbacks', 'PUT')"
            class="add-btn add-header-btn btn-primary d-flex align-items-center"
            type="primary"
            @click="submitForm('ruleForm')"
            :loading="uploadLoading"
          >
            <span class="svg-icon" v-html="addIcon" v-if="!uploadLoading"></span>
            Сохранить изменение
          </a-button>
        </div>
      </TitleBlock>
      <div class="container_xl">
        <div class="card_block-form py-5">
          <div
            class="d-flex justify-content-between align-items-center card_header card_tabs_padding"
          ></div>

          <div class="form-container form-container-ltr">
            <FormTitle title="Feedback" />

            <div class="form-block required">
              <el-form-item prop="company" label="Company">
                <el-input
                  type="text"
                  v-model="ruleForm.company"
                  placeholder="Company..."
                />
              </el-form-item>
            </div>
            <div class="form-block required">
              <el-form-item prop="feedback" label="feedback">
                <el-input
                  v-model="ruleForm.feedback"
                  placeholder="Название атрибута "
                  type="textarea"
                  rows="5"
                ></el-input>
              </el-form-item>
            </div>
            <div class="form-block required">
              <div><label for="">Logo</label></div>
              <div class="clearfix variant-img">
                <a-upload
                  action="https://api.home24.uz/api/admin/files/upload"
                  :headers="headers"
                  list-type="picture-card"
                  :file-list="fileList1"
                  @preview="handlePreview"
                  @change="($event) => handleChange($event, 'logo')"
                >
                  <div v-if="fileList1.length < 1">
                    <span v-html="addImgIcon"></span>
                    <div class="ant-upload-text">Добавить изображение</div>
                  </div>
                </a-upload>
                <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                  <img alt="example" style="width: 100%" :src="previewImage" />
                </a-modal>
              </div>
            </div>
            <div class="form-block required">
              <div><label for="">Изображение</label></div>
              <div class="clearfix variant-img">
                <a-upload
                  action="https://api.home24.uz/api/admin/files/upload"
                  :headers="headers"
                  list-type="picture-card"
                  :file-list="fileList"
                  :multiple="true"
                  @preview="handlePreview"
                  @change="($event) => handleChange($event, 'images')"
                >
                  <div v-if="fileList.length < 50">
                    <span v-html="addImgIcon"></span>
                    <div class="ant-upload-text">Добавить изображение</div>
                  </div>
                </a-upload>
                <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                  <img alt="example" style="width: 100%" :src="previewImage" />
                </a-modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
import LayoutHeaderBtn from "../../../components/form/Layout-header-btn.vue";
import TitleBlock from "../../../components/Title-block.vue";
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
  layout: "toolbar",
  mixins: [authAccess],
  data() {
    return {
      headers: {
        authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      addIcon: require("../../../assets/svg/components/add-icon.svg?raw"),
      addImgIcon: require("../../../assets/svg/components/add-img-icon.svg?raw"),
      fileList1: [],
      fileList: [],
      uploadLoading: false,
      rules: {
        company: [
          {
            required: true,
            message: "company name is required",
            trigger: "change",
          },
        ],

        feedback: [
          {
            required: true,
            message: "feedback is required",
            trigger: "change",
          },
        ],
      },
      previewVisible: false,
      previewImage: "",
      ruleForm: {
        feedback: null,
        company: "",
        logo: "",
        images: [],
      },
    };
  },
  mounted() {
    this.__GET_ATRIBUT_BY_ID();
  },
  methods: {
    submitForm(ruleForm) {
      this.$refs[ruleForm].validate((valid) =>
        valid ? this.__PUT_FEEDBACK(this.ruleForm) : false
      );
    },
    handleCancel() {
      this.previewVisible = false;
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    handleChange({ fileList }, type) {
      if (fileList[fileList.length - 1]?.response?.path && type == "images") {
        this.ruleForm.images = [...fileList].map((item) => {
          if (item.id) {
            return {
              id: item.id,
            };
          } else {
            return {
              id: 0,
              img: item.response?.path,
            };
          }
        });
      } else if (type == "images") {
        this.ruleForm.images = [...fileList].map((item) => {
          if (item.id) {
            return {
              id: item.id,
            };
          } else {
            return {
              id: 0,
              img: item.response?.path,
            };
          }
        });
      }

      if (fileList[fileList.length - 1]?.response?.path && type == "logo") {
        this.ruleForm.logo = fileList[0]?.response?.path;
      } else if (type == "logo") {
        this.ruleForm.logo = "";
      }
      this[type == "images" ? `fileList` : `fileList1`] = fileList;
    },
    handleCancel() {
      this.previewVisible = false;
    },
    async __PUT_FEEDBACK(data) {
      try {
        await this.$store.dispatch("fetchFeedbacks/editFeedbacks", {
          id: this.$route.params.index,
          data: data,
        });
        await this.$notify({
          title: "Success",
          message: "Упешно изменен",
          type: "success",
        });
        this.$router.push("/contents/feedbacks");
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
    async __GET_ATRIBUT_BY_ID() {
      const data = await this.$store.dispatch(
        "fetchFeedbacks/getFeedbacksById",
        this.$route.params.index
      );
      const { created_at, updated_at, id, ...rest } = data?.feedback;
      this.ruleForm = { ...rest };
      this.ruleForm.images = rest?.images.map((item) => {
        return {
          id: item.id,
        };
      });
      if (rest.images.length > 0)
        this.fileList = rest.images.map((item, index) => {
          return {
            id: item.id,
            uid: `-${index + 1}`,
            name: "image.png",
            status: "done",
            oldImg: true,
            url: item.lg_img,
          };
        });
      if (rest.logo) {
        this.fileList1 = [
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            oldImg: true,
            url: rest.logo,
          },
        ];
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

    toBack() {
      this.$router.push("/contents/feedbacks");
    },
  },

  components: {
    TitleBlock,
    LayoutHeaderBtn,
  },
};
</script>
