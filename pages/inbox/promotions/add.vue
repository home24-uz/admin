<template lang="html">
  <div>
    <TitleBlock title="Aкции" :breadbrumb="['Маркетинг']" lastLink="Aкции">
      <div class="d-flex">
        <span class="mx-3">
          <LayoutHeaderBtn
            name="Отмена"
            :headerbtnCallback="toBack"
            :light="true"
          /> </span
        ><a-button
          v-if="checkAccess('promotions', 'POST')"
          class="add-btn add-header-btn btn-primary d-flex align-items-center"
          type="primary"
          @click="submitForm('ruleForm')"
          :loading="uploadLoading"
        >
          <span class="svg-icon" v-if="!uploadLoading" v-html="addIcon"></span>
          Добавить акцию
        </a-button>
      </div>
    </TitleBlock>
    <div class="container_xl">
      <div class="card_block-form py-5">
        <el-form
          label-position="top"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="120px"
          class="demo-ruleForm"
          action=""
        >
          <div class="category-from-grid">
            <div class="category-select-grid">
              <el-tabs class="form_tabs" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane
                  v-for="(item, index) in lang"
                  :label="item.label"
                  :name="item.label"
                  :key="index"
                >
                  <div class="form-container form-container-ltr">
                    <div class="d-flex justify-content-between">
                      <FormTitle title="Этикетка" />
                      <div
                        class="test_label"
                        v-if="ruleForm.short_name[item.key].length > 0"
                      >
                        <div
                          :style="`background: linear-gradient(250deg, ${ruleForm.short_name_last_color} 0%, ${ruleForm.short_name_first_color} 100%);color: ${ruleForm.short_name_text_color}`"
                        >
                          <span v-html="ruleForm.short_name_icon_svg"></span
                          >{{ ruleForm.short_name[item.key] }}
                        </div>
                      </div>
                    </div>

                    <div class="category-input-grid">
                      <div class="d-flex" style="gap: 10px">
                        <el-form-item
                          class="form-block w-100 align-items-start"
                          prop="short_name.ru"
                          style="max-width: 400px"
                          label="Короткое название"
                        >
                          <el-input
                            maxlength="30"
                            v-model="ruleForm.short_name[item.key]"
                            placeholder="Короткое название..."
                          ></el-input>
                        </el-form-item>
                        <div class="form-block mb-2" style="min-width: 300px">
                          <div><label>Svg</label></div>
                          <el-input
                            v-model="ruleForm.short_name_icon_svg"
                            placeholder="Svg"
                          ></el-input>
                        </div>
                        <div class="d-flex">
                          <el-form-item class="mb-0 form-block" label="Цвет 1">
                            <el-color-picker
                              popper-class="badges-color-picker"
                              v-model="ruleForm.short_name_first_color"
                            ></el-color-picker>
                          </el-form-item>
                          <el-form-item class="mb-0 form-block mx-3" label="Цвет 2">
                            <el-color-picker
                              popper-class="badges-color-picker"
                              v-model="ruleForm.short_name_last_color"
                            ></el-color-picker>
                          </el-form-item>
                          <el-form-item class="mb-0 form-block" label="Цвет для текста">
                            <el-color-picker
                              popper-class="badges-color-picker"
                              v-model="ruleForm.short_name_text_color"
                            ></el-color-picker>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                    <div class="d-flex justify-content-between">
                      <FormTitle title="Этикетка для продуктов" />
                    </div>

                    <div class="category-input-grid">
                      <el-tabs class="desc_tab" v-model="activeLabelType">
                        <el-tab-pane label="С текстом" name="input">
                          <div class="d-flex" v-if="activeLabelType == 'input'">
                            <el-form-item
                              class="form-block w-100 align-items-start"
                              prop="name.ru"
                              style="max-width: 400px"
                              label="Короткое название"
                            >
                              <el-input
                                v-model="ruleForm.name[item.key]"
                                placeholder="Короткое название..."
                              ></el-input>
                            </el-form-item>
                            <div class="d-flex">
                              <el-form-item
                                class="mb-0 form-block mx-3"
                                label="Цвет для фона"
                              >
                                <el-color-picker
                                  popper-class="badges-color-picker"
                                  v-model="ruleForm.product_card_back_color"
                                ></el-color-picker>
                              </el-form-item>
                              <el-form-item
                                class="mb-0 form-block"
                                label="Цвет для текста"
                              >
                                <el-color-picker
                                  popper-class="badges-color-picker"
                                  v-model="ruleForm.product_card_text_color"
                                ></el-color-picker>
                              </el-form-item>
                            </div></div
                        ></el-tab-pane>
                        <el-tab-pane label="С значком" name="upload">
                          <div class="d-flex">
                            <div
                              class="form-block mb-2"
                              style="min-width: 300px"
                              v-if="iconType"
                            >
                              <div><label>Svg</label></div>
                              <el-input
                                v-model="ruleForm.sticker_svg"
                                placeholder="Svg"
                              ></el-input>
                            </div>
                            <div class="form-block mb-0" v-else>
                              <div><label>Добавить значок</label></div>
                              <div class="clearfix mb-0">
                                <a-upload
                                  class="icon_upload"
                                  action="https://api.home24.uz/api/admin/files/upload"
                                  :headers="headers"
                                  list-type="picture-card"
                                  :file-list="fileList.sticker"
                                  @preview="handlePreview"
                                  @change="($event) => handleChange($event, 'sticker')"
                                >
                                  <div
                                    v-if="fileList.sticker.length < 1"
                                    class="d-flex align-items-center"
                                  >
                                    <span v-html="addImgIcon"></span>
                                    <div class="ant-upload-text mx-2 mt-0">Icon</div>
                                  </div>
                                </a-upload>
                                <a-modal
                                  :visible="previewVisible"
                                  :footer="null"
                                  @cancel="handleCancel"
                                >
                                  <img
                                    alt="example"
                                    style="width: 100%"
                                    :src="previewImage"
                                  />
                                </a-modal>
                              </div>
                            </div>
                          </div>
                          <a-switch
                            checked-children="Svg"
                            un-checked-children="Icon"
                            @change="($event) => (iconType = $event)"
                            v-model="iconType"
                          />
                        </el-tab-pane>
                      </el-tabs>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
              <el-tabs class="form_tabs" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane
                  v-for="(item, index) in lang"
                  :label="item.label"
                  :name="item.label"
                  :key="index"
                >
                  <div class="form-container form-container-ltr">
                    <div class="d-flex justify-content-between">
                      <FormTitle title="Полная информация" />
                    </div>

                    <div class="category-input-grid">
                      <div class="form-block">
                        <el-form-item label="Полное название">
                          <el-input
                            v-model="ruleForm.product_card_text[item.key]"
                            placeholder="Полное название..."
                          ></el-input>
                        </el-form-item>
                      </div>
                    </div>
                    <div class="form-block">
                      <div><label for="">Информация</label></div>
                      <quill-editor
                        style="min-height: 250px"
                        :options="editorOption"
                        :value="ruleForm.desc[item.key]"
                        v-model="ruleForm.desc[item.key]"
                      />
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>

            <div class="category-img-grid">
              <div class="form-container">
                <FormTitle title="Параметры" />
                <!-- <div
                  class="form-block status-style"
                  :class="[ruleForm.is_active == 1 ? 'status-active' : 'status-inactive']"
                >
                  <div><label>Статус</label></div>
                  <el-select
                    class="w-100"
                    popper-class="select-popper-hover"
                    placeholder="Status"
                    default-first-option
                    v-model="ruleForm.is_active"
                  >
                    <el-option
                      v-for="item in status"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </div> -->

                <el-form-item
                  class="form-block align-items-start"
                  label="Дата"
                  prop="start_date"
                >
                  <a-range-picker @change="onChangeDate" />
                </el-form-item>
                <div class="form-block">
                  <div><label for="">Добавить изображения</label></div>
                  <div class="clearfix">
                    <a-upload
                      list-type="picture-card"
                      action="https://api.home24.uz/api/admin/files/upload"
                      :headers="headers"
                      :file-list="fileList.banner"
                      @preview="handlePreview"
                      @change="($event) => handleChange($event, 'banner')"
                    >
                      <div v-if="fileList.banner.length < 1">
                        <span v-html="addImgIcon"></span>
                        <div class="ant-upload-text">Добавить изображение</div>
                        <span class="upload-resize">(678 x 784)</span>
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
              </div>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import FormTitle from "../../../components/Form-title.vue";
import TitleBlock from "../../../components/Title-block.vue";
import LayoutHeaderBtn from "../../../components/form/Layout-header-btn.vue";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import status from "@/mixins/status";
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
  mixins: [status, authAccess],
  data() {
    return {
      headers: {
        authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      iconType: false,
      activeLabelType: "input",
      activeName: "Русский",
      addIcon: require("../../../assets/svg/components/add-icon.svg?raw"),
      addImgIcon: require("../../../assets/svg/components/add-img-icon.svg?raw"),
      fileList: {
        banner: [],
        sticker: [],
      },
      lang: [
          {
          key: "uz",
          label: "Uzbek",
        },
        {
          key: "ru",
          label: "Русский",
        },
      ],
      status: [
        {
          value: 1,
          label: "Активный",
        },
        {
          value: 0,
          label: "Неактивный",
        },
      ],
      rules: {
        name: {
          ru: [
            {
              required: true,
              message: "This field is required",
              trigger: "change",
            },
          ],
        },
        short_name: {
          ru: [
            {
              required: true,
              message: "This field is required",
              trigger: "change",
            },
          ],
        },
        start_date: [
          {
            required: true,
            message: "This field is required",
            trigger: "change",
          },
        ],
        product_card_text: {
          ru: [
            {
              required: true,
              message: "This field is required",
              trigger: "change",
            },
          ],
        },
      },
      ruleForm: {
        desc: {
          ru: "",
          uz: "",
          en: "",
        },
        name: {
          ru: "",
          uz: "",
          en: "",
        },
        short_name: {
          ru: "",
          uz: "",
          en: "",
        },
        product_card_text: {
          ru: "",
          uz: "",
          en: "",
        },
        short_name_icon: null,
        short_name_icon_svg: "",
        short_name_first_color: "",
        short_name_last_color: "",
        short_name_text_color: "",
        banner: "",
        start_date: "",
        end_date: "",
        sticker: null,
        sticker_svg: null,
        product_card_text_color: "#FFFFFF",
        product_card_back_color: "#000000",
        is_active: 0,
      },
      previewVisible: false,
      previewImage: "",
      editorOption: {
        theme: "snow",
        modules: {
          toolbar: [
            [
              {
                size: [],
              },
            ],
            ["bold", "italic", "underline", "strike"],

            ["image"],
            ["code-block"],
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
      uploadLoading: false,
    };
  },
  methods: {
    submitForm(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        valid ? this.__POST_PROMOTIONS(this.ruleForm) : false;
      });
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
    async handleChange({ fileList }, type) {
      this.fileList[type] = fileList;
      if (fileList[0]?.response?.path) this.ruleForm[type] = fileList[0]?.response?.path;
    },
    handleClick(tab, event) {
      this.formVal = "";
    },
    onChangeDate(date, dateString) {
      if (dateString[0] == dateString[1]) {
        this.ruleForm.start_date = dateString[0];
        this.ruleForm.end_date = null;
      } else {
        this.ruleForm.start_date = dateString[0];
        this.ruleForm.end_date = dateString[1];
      }
    },
    toBack() {
      this.$router.push("/inbox/promotions");
    },

    async __POST_PROMOTIONS(res) {
      try {
        await this.$store.dispatch("fetchPromotions/postPromotions", res);
        this.notification("Success", "Успешно добавлен", "success");
        this.$router.push("/inbox/promotions");
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
  },
  watch: {
    iconType(val) {
      if (val) {
        this.ruleForm.sticker_svg = null;
      } else {
        this.ruleForm.sticker = null;
        this.fileList.sticker = [];
      }
    },
    activeLabelType(val) {
      if (val == "input") {
        this.ruleForm.sticker = null;
        this.fileList.sticker = [];
        this.ruleForm.sticker_svg = null;
      } else {
        this.ruleForm.name.ru = null;
      }
    },
    activeLabelType(val) {
      if (val == "upload") {
        this.ruleForm.name = {
          ru: "",
          uz: "",
          en: "",
        };
      } else {
        this.ruleForm.sticker_svg = "";
        this.ruleForm.sticker = "";
      }
    },
  },
  components: {
    FormTitle,
    TitleBlock,
    LayoutHeaderBtn,
  },
};
</script>
<style lang="scss">
.category-img-grid {
  .ant-upload.ant-upload-select-picture-card {
    background: #f3f6f9;
  }
  .ant-upload-list-picture-card .ant-upload-list-item-info::before {
    background-color: rgba(255, 255, 255, 0.5);
  }
  .ant-upload-list-picture-card .ant-upload-list-item-actions .anticon-eye-o,
  .ant-upload-list-picture-card .ant-upload-list-item-actions .anticon-download,
  .ant-upload-list-picture-card .ant-upload-list-item-actions .anticon-delete {
    color: #000;
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
  .ant-upload-list-picture-card .ant-upload-list-item {
    width: 100% !important;
    height: 100%;
  }
  .ant-upload-list-picture-card-container {
    width: 100% !important;
    height: 218px;
  }
  .ant-upload.ant-upload-select-picture-card {
    width: 100% !important;
    height: 218px;
    background-color: #fff;
  }
  .upload-resize,
  .ant-upload-text {
    font-family: "TT Interfaces";
    font-style: normal;
  }
  .ant-upload-text {
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    color: #181c32;
  }
  .upload-resize {
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    text-transform: uppercase;
    margin-top: 4px;
    color: #a1a5bf;
  }
  @media (max-width: 1440px) {
    .ant-upload.ant-upload-select-picture-card {
      height: 160px;
    }
  }
}

.icon_upload .ant-upload-select-picture-card {
  height: 30px;
}
.test_label div {
  display: flex;
  border-radius: 5px;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  clip-path: polygon(10% 0, 100% 1%, 90% 100%, 0% 100%);
  padding: 1px 20px;
  line-height: 17.089px; /* 142.407% */
  align-items: center;
  max-height: 20px;
}
.test_label span svg {
  margin-right: 6px;
}

// 820
</style>
