<template lang="html">
  <div>
    <TitleBlock title="Категории" :breadbrumb="['Каталог']" lastLink="Категории">
      <div class="d-flex">
        <span class="mx-3">
          <LayoutHeaderBtn
            name="Отмена"
            :headerbtnCallback="toBack"
            :light="true"
          /> </span
        ><a-button
          class="add-btn add-header-btn btn-primary d-flex align-items-center"
          type="primary"
          @click="submitForm('ruleForm')"
          :loading="uploadLoading"
        >
          <span class="svg-icon" v-if="!uploadLoading" v-html="addIcon"></span>
          Добавить категорию
        </a-button>
      </div>
    </TitleBlock>
    <div class="container_xl">
      <div class="card_block-form py-5">
        <div class="category-from-grid">
          <el-form
            label-position="top"
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="120px"
            class="demo-ruleForm"
            action=""
          >
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
                      <FormTitle title="Добавить категорию" />
                    </div>

                    <div class="category-input-grid">
                      <div class="form-block required mb-0">
                        <el-form-item :prop="`name.ru`" label="Название категории">
                          <el-input
                            v-model="ruleForm.name[item.key]"
                            placeholder="Название категории..."
                          ></el-input>
                        </el-form-item>
                      </div>
                      <div class="form-block required">
                        <el-form-item prop="choose_category" label="Выберите категорию">
                          <el-select
                            v-model="ruleForm.parent_id"
                            class="w-100"
                            filterable
                            popper-class="select-popper-hover"
                            placeholder="Выберите атрибут"
                            loading-text="Loading..."
                            no-match-text="no category"
                            no-data-text="No Category"
                            default-first-option
                          >
                            <el-option
                              v-for="item in categories"
                              :key="item.id"
                              :label="item.name?.ru"
                              :value="item.id"
                            >
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </div>
                    </div>
                    <div class="form-block">
                      <div><label for="">Информация о категории</label></div>
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

              <div class="category-character-grid">
                <div class="form-container">
                  <div>
                    <div class="form-block required">
                      <div><label>Атрибуты</label></div>
                    </div>
                    <drop-list
                      :items="attributes"
                      @insert="($event) => onInsert($event, 'attributes')"
                      @reorder="$event.apply(attributes)"
                    >
                      <template v-slot:item="{ item }">
                        <drag class="item d-flex mb-3" :key="item.id">
                          <div class="form-block required w-100 mb-0">
                            <el-form-item>
                              <!-- <el-select
                                v-model="item.name"
                                class="w-100"
                                @change="filterElement('attributes')"
                                popper-class="select-popper-hover"
                                default-first-option
                                no-data-text="No atribut"
                                placeholder="Выберите атрибут"
                              >
                                <el-option
                                  v-for="item in atributes"
                                  :key="item.id"
                                  :label="item.name.ru"
                                  :value="item.id"
                                >
                                </el-option>
                              </el-select> -->
                              <el-select
                                v-model="item.name.ru"
                                v-if="item.id == 1"
                                :disabled="item.id == 1"
                                class="w-100"
                                @change="filterElement('attributes')"
                                popper-class="select-popper-hover"
                                default-first-option
                                no-data-text="No atribut"
                                placeholder="Выберите атрибут"
                              >
                                <el-option
                                  v-for="item in atributes"
                                  :key="item.id"
                                  :label="item.name.ru"
                                  :value="item.id"
                                >
                                </el-option>
                              </el-select>
                              <el-select
                                v-model="item.name"
                                class="w-100"
                                v-else
                                @change="filterElement('attributes')"
                                popper-class="select-popper-hover"
                                default-first-option
                                no-data-text="No atribut"
                                placeholder="Выберите атрибут"
                              >
                                <el-option
                                  v-for="item in [
                                    ...atributes.filter((item) => item.id != 1),
                                  ]"
                                  :key="item.id"
                                  :label="item.name.ru"
                                  :value="item.id"
                                >
                                </el-option>
                              </el-select>
                            </el-form-item>
                          </div>
                          <div class="variant_btns mb-1 mt-0">
                            <div
                              v-if="item.id != 1"
                              class="variant-btn variant-btn-delete mx-2"
                              @click="deleteElement('attributes', item.id)"
                            >
                              <svg
                                width="30"
                                height="30"
                                viewBox="0 0 30 30"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M20.3029 9.69684L9.69629 20.3034M20.3029 20.3034L9.69629 9.69678"
                                  stroke="#F65160"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            </div>
                            <div
                              v-if="item.id != 1"
                              class="variant-btn variant-btn-check cursor_drag"
                              draggable="true"
                            >
                              <a-icon
                                type="drag"
                                :style="{ color: '#3699FF', fontSize: '18px' }"
                              />
                              <!-- <a-radio :checked="item.is_default == 1"></a-radio> -->
                            </div>
                          </div>
                        </drag>
                      </template>
                      <template v-slot:feedback="{ data }">
                        <div class="item feedback" :key="data">{{ data }}</div>
                      </template>
                    </drop-list>
                    <div class="d-flex justify-content-start">
                      <div
                        class="create-inner-variant mt-0"
                        @click="addElement('attributes')"
                      >
                        <span v-html="addInnerValidatIcon"></span>
                        Добавить атрибут
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-container">
                  <div>
                    <div class="form-block required">
                      <div><label>Характеристическая группа</label></div>
                    </div>
                    <drop-list
                      :items="group_characteristics"
                      @insert="($event) => onInsert($event, 'group_characteristics')"
                      @reorder="$event.apply(group_characteristics)"
                    >
                      <template v-slot:item="{ item }">
                        <drag class="item d-flex mb-3" :key="item.id">
                          <div class="form-block required mb-0 w-100">
                            <el-form-item>
                              <el-select
                                v-model="item.name"
                                class="w-100"
                                popper-class="select-popper-hover"
                                @change="filterElement('group_characteristics')"
                                default-first-option
                                no-data-text="No characteristics"
                                placeholder="Выберите характерическую группу"
                              >
                                <el-option
                                  v-for="item in groups"
                                  :key="item.id"
                                  :label="item.name.ru"
                                  :value="item.id"
                                >
                                </el-option>
                              </el-select>
                            </el-form-item>
                          </div>
                          <div class="variant_btns mb-1 mt-0">
                            <div
                              class="variant-btn variant-btn-delete mx-2"
                              @click="deleteElement('group_characteristics', item.id)"
                            >
                              <svg
                                width="30"
                                height="30"
                                viewBox="0 0 30 30"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M20.3029 9.69684L9.69629 20.3034M20.3029 20.3034L9.69629 9.69678"
                                  stroke="#F65160"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            </div>
                            <div
                              class="variant-btn variant-btn-check cursor_drag"
                              draggable="true"
                            >
                              <a-icon
                                type="drag"
                                :style="{ color: '#3699FF', fontSize: '18px' }"
                              />
                              <!-- <a-radio :checked="item.is_default == 1"></a-radio> -->
                            </div>
                          </div>
                        </drag>
                      </template>
                      <template v-slot:feedback="{ data }">
                        <div class="item feedback" :key="data">{{ data }}</div>
                      </template>
                    </drop-list>
                    <div class="d-flex justify-content-start">
                      <div
                        class="create-inner-variant mt-0"
                        @click="addElement('group_characteristics')"
                      >
                        <span v-html="addInnerValidatIcon"></span>
                        Добавить группу
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-container">
                <div class="d-flex justify-content-between">
                  <FormTitle title="SEO" />
                </div>
                <div class="form-block required">
                  <el-form-item label="Slug">
                    <el-input
                      v-model="ruleForm.slug"
                      placeholder="Слаг-аддрес"
                    ></el-input>
                  </el-form-item>
                </div>
                <div class="form-block required">
                  <el-form-item label="Ключ-слова">
                    <el-input
                      type="textarea"
                      rows="5"
                      v-model="ruleForm.slug"
                      placeholder="Ключ-слова"
                    ></el-input>
                  </el-form-item>
                </div>
                <div class="form-block required mb-0">
                  <el-form-item label="Мета описание">
                    <el-input
                      type="textarea"
                      rows="5"
                      v-model="ruleForm.slug"
                      placeholder="Модель продукта"
                    ></el-input>
                  </el-form-item>
                </div>
              </div>
            </div>
          </el-form>
          <div class="category-img-grid">
            <div class="form-container">
              <FormTitle title="Параметры" />
              <div
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
              </div>
              <div class="form-block">
                <div><label>Порядок</label></div>
                <el-input
                  v-model="ruleForm.position"
                  placeholder="Позиция"
                  type="number"
                ></el-input>
              </div>
              <div class="switch-text form-block d-flex flex-row align-items-center">
                <a-switch @change="onChange" />
                <label class="mx-3 mb-0">Популярный</label>
              </div>
              <div class="form-block">
                <div><label for="">Добавить изображения категории</label></div>
                <div class="clearfix">
                  <a-upload
                    list-type="picture-card"
                    action="https://api.home24.uz/api/admin/files/upload"
                    :headers="headers"
                    :file-list="fileList.img"
                    @preview="handlePreview"
                    @change="($event) => handleChange($event, 'img')"
                  >
                    <div v-if="fileList.img.length < 1">
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
              <div class="form-block">
                <div><label>Svg</label></div>
                <el-input v-model="ruleForm.icon_svg" placeholder="Svg"></el-input>
              </div>
              <div class="form-block">
                <div><label for="">Добавить значок продукта</label></div>
                <div class="clearfix">
                  <a-upload
                    action="https://api.home24.uz/api/admin/files/upload"
                    list-type="picture-card"
                    :headers="headers"
                    :file-list="fileList.icon"
                    @preview="handlePreview"
                    @change="($event) => handleChange($event, 'icon')"
                  >
                    <div v-if="fileList.icon.length < 1">
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
      </div>
    </div>
  </div>
</template>
<script>
import FormTitle from "../../components/Form-title.vue";
import TitleBlock from "../../components/Title-block.vue";
import LayoutHeaderBtn from "../../components/form/Layout-header-btn.vue";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import InputBlock from "../../components/form/Input-block.vue";
import { Drag, DropList } from "vue-easy-dnd";
import status from "@/mixins/status";

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
  mixins: [status],
  data() {
    return {
      headers: {
        authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      over: {},
      startLoc: 0,
      dragging: false,
      dragFrom: {},
      activeName: "Русский",
      addIcon: require("../../assets/svg/components/add-icon.svg?raw"),
      addImgIcon: require("../../assets/svg/components/add-img-icon.svg?raw"),
      addInnerValidatIcon: require("../../assets/svg/components/add-inner-validat-icon.svg?raw"),
      atributes: [],
      categories: [
        {
          name: {
            ru: "Главная категория ",
          },
          id: null,
        },
      ],
      allAtributes: [],
      allGroups: [],
      groups: [],
      fileList: {
        img: [],
        icon: [],
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
              message: "Название категории обязательна",
              trigger: "change",
            },
          ],
        },
        attributes: [
          {
            required: true,
            message: "Атрибуты обязательны",
            trigger: "change",
          },
        ],
        group_characteristics: [
          {
            required: true,
            message: "Группа характеристик обязательна",
            trigger: "change",
          },
        ],
      },
      ruleForm: {
        parent_id: null,
        is_popular: 0,
        status: "active",
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
        icon: "",
        img: "",
        attributes: [],
        group_characteristics: [],
        position: null,
        is_active: 1,
        icon_svg: "",
      },
      attributes: [],
      group_characteristics: [{ name: "", id: 1 }],
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
    onInsert(event, elem) {
      this[elem].splice(event.index, 0, event.data);
    },
    submitForm(ruleForm) {
      console.log(this.attributes);
      const data = {
        ...this.ruleForm,
        attributes: this.attributes.map((item) =>
          typeof item.name == "number" ? item.name : item.id
        ),
        group_characteristics: this.group_characteristics
          .map((item) => item.name)
          .filter((elem) => elem),
      };

      delete data["status"];
      this.$refs[ruleForm].validate((valid) => {
        if (!valid) return false;
        // console.log(data);
        this.__POST_CATEGORIES(data);
        // if (valid) {
        //   if (!this.attributes[0].name || !this.group_characteristics[0].name) {
        //     !this.attributes[0].name
        //       ? this.notificationError("Error", "Вы не добавили атрибут")
        //       : this.notificationError("Error", "Вы не добавили группу");
        //   } else {
        //     this.__POST_CATEGORIES(data);
        //   }
        // } else {
        //   return false;
        // }
      });
    },
    addElement(type) {
      this[type].push({
        name: "",
        id: this[type].length > 0 ? Math.max(...this[type].map((o) => o.id)) + 1 : 1,
      });
    },

    filterElement(typeName) {
      let allArt = this.allAtributes;
      let allGr = this.allGroups;
      this[typeName].forEach((elem) => {
        if (typeName == "attributes") {
          allArt = allArt.filter((item) => item.id != elem.name);
        } else {
          allGr = allGr.filter((item) => item.id != elem.name);
        }
      });
      this.atributes = allArt;
      this.groups = allGr;
    },
    deleteElement(type, id) {
   this[type] = this[type].filter((item) => item.id != id);
      this.filterElement(type);
    },

    handleCancel() {
      this.previewVisible = false;
    },
    headerbtnCallback() {
      this.$router.push("/catalog/add_products");
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
    onChange(checked) {
      checked ? (this.ruleForm.is_popular = 1) : (this.ruleForm.is_popular = 0);
    },
    toBack() {
      this.$router.push("/catalog/categories");
    },
    async __GET_CATEGORIES() {
      const data = await this.$store.dispatch("fetchCategories/getCategories");
      function flattenCategories(category) {
        let result = [category];
        if (category.children && category.children.length > 0) {
          category.children.forEach((child) => {
            result = result.concat(flattenCategories(child));
          });
        }

        return result;
      }

      data.categories?.data.forEach((item) => {
        this.categories = this.categories.concat(flattenCategories(item));
      });
      // data.categories?.data.forEach((item) => {
      //   if (item.children.length > 0) {
      //     this.categories = [...this.categories, item, ...item.children];
      //   } else {
      //     this.categories = [...this.categories, item];
      //   }
      // });
    },
    async __GET_ATRIBUTES() {
      const data = await this.$store.dispatch("fetchAtributes/getAtributes");
      this.atributes = data.attributes?.data;
      this.allAtributes = data.attributes?.data;
      this.attributes.push(data.attributes?.data.find((elem) => elem.id == 1));
    },
    async __GET_GROUPS() {
      const data = await this.$store.dispatch("fetchCharacters/getGroups");
      this.groups = data?.groups;
      this.allGroups = data?.groups;
    },
    async __POST_CATEGORIES(res) {
      try {
        await this.$store.dispatch("fetchCategories/postCategories", res);
        this.notification("Success", "Категория успешно добавлен", "success");
        this.$router.push("/catalog/categories");
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
  },
  mounted() {
    this.__GET_CATEGORIES();
    this.__GET_ATRIBUTES();
    this.__GET_GROUPS();
  },
  components: {
    FormTitle,
    TitleBlock,
    LayoutHeaderBtn,
    InputBlock,
    Drag,
    DropList,
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

.list > div {
  display: flex;
  flex-direction: column;
}

.flip-list {
  transition: all 0.4s;
  display: grid;
  grid-gap: 24px;
}
.flip-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.flip-list-enter {
  opacity: 0;
  transform: translateY(-30px);
}
.flip-list-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.item {
  transition: transform 0.2s;
}

.over {
  opacity: 0.6;
}
// 820
</style>
