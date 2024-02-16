<template lang="html">
  <div>
    <TitleBlock title="Топ меню" :breadbrumb="['Контент сайта']" lastLink="Топ меню">
      <div class="d-flex">
        <span class="mx-3">
          <LayoutHeaderBtn name="Отмена" :headerbtnCallback="toBack" :light="true" />
        </span>
        <div
          v-if="checkAccess('top-bars', 'PUT')"
          class="add-btn add-header-btn add-header-btn-padding btn-primary"
          type="submit"
          @click="submitForm('ruleFormBar')"
        >
          <span class="svg-icon" v-html="addIcon"></span>
          Сохранять
        </div>
      </div>
    </TitleBlock>
    <div class="container_xl">
      <div class="card_block-form py-5">
        <div
          class="d-flex justify-content-between align-items-center card_header card_tabs_padding"
        ></div>
        <el-tabs class="form_tabs" v-model="activeName">
          <el-tab-pane
            v-for="(itemLang, index) in lang"
            :label="itemLang.label"
            :name="itemLang.label"
            :key="index"
          >
            <div class="form-container form-container-ltr">
              <FormTitle title="Верхняя панель" />
              <div class="list">
                <drop-list
                  :items="ruleForm"
                  @insert="onInsert"
                  @reorder="$event.apply(ruleForm)"
                >
                  <template v-slot:item="{ item }">
                    <drag :key="item.indexId" @dragend="handleDragEnd">
                      <el-form
                        label-position="top"
                        :model="item"
                        :rules="rulesBar"
                        ref="ruleFormBar"
                        label-width="120px"
                        class="demo-ruleForm"
                      >
                        <div class="top-menu-input-grid pb-3">
                          <el-form-item
                            :prop="`current_id`"
                            class="form-block required mb-0 w-100 align-items-start"
                            label="Категория или акция"
                            style="max-width: 40%"
                          >
                            <a-select
                              show-search
                              v-model="item.current_id"
                              placeholder="input search text"
                              style="width: 100%"
                              :default-active-first-option="false"
                              :show-arrow="false"
                              :filter-option="false"
                              :not-found-content="fetching ? undefined : null"
                              @search="handleSearch"
                              @change="($event) => handleChange($event, item.indexId)"
                            >
                              <a-spin
                                v-if="fetching"
                                slot="notFoundContent"
                                size="small"
                              />
                              <!-- <a-select-option v-for="d in categories" :key="d.id">
                                {{ d.name.ru }}
                              </a-select-option> -->
                              <a-select-opt-group
                                label="Kategoriyalar"
                                v-if="categories.length > 0"
                              >
                                <a-select-option
                                  v-for="d in categories"
                                  :value="d.id"
                                  :key="d.id"
                                >
                                  <span v-if="d?.parent?.parent?.name?.ru">
                                    {{
                                      `${
                                        d?.parent?.parent && d?.parent?.parent?.name?.ru
                                      }/`
                                    }}
                                  </span>
                                  <span v-if="d?.parent && d?.parent?.name?.ru">
                                    {{ `${d?.parent && d?.parent?.name?.ru}/` }}
                                  </span>
                                  <span style="color: #3699ff">{{ d?.name?.ru }}</span>
                                </a-select-option>
                              </a-select-opt-group>
                              <a-select-opt-group
                                label="Aksiyalar"
                                v-if="promotions.length > 0"
                              >
                                <a-select-option
                                  v-for="d in promotions"
                                  :value="d.id"
                                  :key="d.id"
                                >
                                  {{ d.name.ru ? d.name.ru:d.short_name.ru}}
                                </a-select-option>
                              </a-select-opt-group>
                            </a-select>
                          </el-form-item>
                          <el-form-item
                            label="Короткое имя"
                            class="mb-0 form-block required w-100 align-items-start"
                            prop="name.ru"
                          >
                            <el-input
                              v-model="item.name[itemLang.key]"
                              placeholder="Короткое имя..."
                            ></el-input>
                          </el-form-item>
                          <div
                            class="clearfix-img form-block required mb-0 w-100 align-items-start"
                          >
                            <label for="">icon</label>
                            <div class="mb-0">
                              <a-upload
                                class="icon_upload-top"
                                action="https://api.home24.uz/api/admin/files/upload"
                                :headers="headers"
                                list-type="picture-card"
                                :file-list="item?.fileList"
                                @preview="handlePreview"
                                @change="
                                  ($event) => handleChangeImg($event, item.indexId)
                                "
                              >
                                <div
                                  v-if="item?.fileList.length < 1"
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
                          <!-- <el-form-item
                            label="icon"
                            class="form-block required mb-0 w-100 align-items-start"
                          >
                  
                            
                          </el-form-item> -->
                          <div class="mb-0 form-block" style="line-height: 40px">
                            <label for="">Цвет 1</label>
                            <el-color-picker
                              popper-class="badges-color-picker"
                              v-model="item.color1"
                            ></el-color-picker>
                          </div>
                          <div class="mb-0 form-block" style="line-height: 40px">
                            <label for="">Цвет 2</label>
                            <el-color-picker
                              popper-class="badges-color-picker"
                              v-model="item.color2"
                            ></el-color-picker>
                          </div>
                          <div class="mb-0 form-block" style="line-height: 40px">
                            <label for="">Цвет текста</label>
                            <el-color-picker
                              popper-class="badges-color-picker"
                              v-model="item.text_color"
                            ></el-color-picker>
                          </div>

                          <div class="d-flex align-items-center mb-1 mt-0">
                            <div
                              v-if="checkAccess('top-bars', 'DELETE')"
                              class="variant-btn variant-btn-delete mx-2"
                              @click="deleteElement(item)"
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
                              class="variant-btn variant-btn-check cursor_drag item dnd-drag drag-no-handle"
                            >
                              <a-icon
                                type="drag"
                                :style="{ color: '#3699FF', fontSize: '18px' }"
                              />
                            </div>
                          </div>
                        </div>
                      </el-form>
                    </drag>
                  </template>
                  <template v-slot:feedback="{ data }">
                    <div class="item feedback" :key="data">{{ data }}</div>
                  </template>
                </drop-list>
                <div class="d-flex justify-content-start">
                  <div class="create-inner-variant mt-0" @click="addElement()">
                    <span v-html="addInnerValidatIcon"></span>
                    Добавить
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import LayoutHeaderBtn from "../../../components/form/Layout-header-btn.vue";
import TitleBlock from "../../../components/Title-block.vue";
import { Drag, DropList } from "vue-easy-dnd";
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
      previewVisible: false,
      previewImage: "",
      activeName: "Русский",
      multiSelectError: true,
      fetching: false,
      categories: [],
      promotions: [],
      data: [],
      addImgIcon: require("../../../assets/svg/components/add-img-icon.svg?raw"),
      addIcon: require("../../../assets/svg/components/add-icon.svg?raw"),
      addInnerValidatIcon: require("../../../assets/svg/components/add-inner-validat-icon.svg?raw"),
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
      options: [],
      rules: {
        // group: [
        //   {
        //     required: true,
        //     message: "Characteristic group is required",
        //     trigger: "change",
        //   },
        // ],
        // name: {
        //   ru: [
        //     {
        //       required: true,
        //       message: "Characteristic name is required",
        //       trigger: "change",
        //     },
        //   ],
        // },
        // options: [
        //   {
        //     required: true,
        //     message: "Characteristic name is required",
        //     trigger: "change",
        //   },
        // ],
      },
      ruleForm1: {},
      rulesBar: {
        name: {
          ru: [
            {
              required: true,
              message: "This is required",
              trigger: "change",
            },
          ],
        },
        current_id: [
          {
            required: true,
            message: "This is required",
            trigger: "change",
          },
        ],
      },

      ruleForm: [
        {
          indexId: 1,
          name: {
            ru: "",
            uz: "",
            en: "",
          },
          fileList: [],
          current_id: null,
          promotion_id: null,
          category_id: null,
          icon: null,
          icon_svg: "",
          text_color: "#000000",
          color1: "#F6F7F9",
          color2: "#F6F7F9",
          position: 1,
        },
      ],
    };
  },
  mounted() {
    this.__GET_TOP_MENU();
  },
  methods: {
    async handleDragEnd(event) {
      this.ruleForm = await this.ruleForm.map((item, index) => {
        return {
          ...item,
          position: index + 1,
        };
      });
      const data = {
        bars: this.ruleForm.map((item) => {
          const { indexId, ...rest } = item;
          return rest;
        }),
      };
      // this.__POST_TOP_MENU(data);
    },
    async deleteElement(item) {
      if (item?.id) {
        try {
          await this.$store.dispatch("fetchTopBars/deleteTopBars", item.id);
          this.notification("Success", "Успешно удален", "success");
          this.__GET_TOP_MENU();
        } catch (e) {}
      } else {
        if (this.ruleForm.length > 1)
          this.ruleForm = this.ruleForm.filter((elem) => elem.indexId != item.indexId);
      }
    },
    addElement() {
      this.ruleForm.push({
        name: {
          ru: "",
          uz: "",
          en: "",
        },
        fileList: [],
        promotion_id: null,
        category_id: null,
        icon: null,
        icon_svg: "",
        text_color: "#000000",
        color1: "#F6F7F9",
        color2: "#F6F7F9",
        id: 0,
        position:
          this.ruleForm.length > 0
            ? Math.max(...this.ruleForm.map((o) => o.position)) + 1
            : 1,
        indexId:
          this.ruleForm.length > 0
            ? Math.max(...this.ruleForm.map((o) => o.indexId)) + 1
            : 1,
      });
    },
    submitForm(ruleForm) {
      const data = {
        bars: this.ruleForm.map((item) => {
          const { indexId, ...rest } = item;
          if (item.current_id) {
            if (item.current_id.includes("cat")) {
              return {
                ...rest,
                category_id: Number(item.current_id.split("_")[1]),
              };
            } else if (item.current_id.includes("promo")) {
              return {
                ...rest,
                category_id: null,
                promotion_id: Number(item.current_id.split("_")[1]),
              };
            }
          }
        }),
      };
      let arr = [];
      this.$refs[ruleForm].forEach((item) => {
        item.validate((valid) => {
          if (!valid) return false;
          arr.push(1);
        });
      });
      if (arr.length == this.$refs[ruleForm].length) {
        this.__POST_TOP_MENU(data);
      }
      // const data = {
      //   bars: this.ruleForm.map((item) => {
      //     const { indexId, ...rest } = item;
      //     return rest;
      //   }),
      // };
      // this.$refs[ruleForm].validate((valid) => {
      //   valid ? this.__POST_TOP_MENU(data) : false;
      // });
    },
    async handleSearch(value) {
      this.fetching = true;
      if (value.length > 2) {
        const categoriesData = await this.$store.dispatch(
          "fetchTopBars/getTopBarsSearch",
          {
            search: value,
          }
        );
        this.categories = categoriesData?.categories.map((item) => {
          return { ...item, id: `cat_${item.id}` };
        });
        this.promotions = categoriesData?.promotions.map((item) => {
          return { ...item, id: `promo_${item.id}` };
        });
        this.fetching = false;
      }
    },
    handleChange(value, id) {
      let obj = this.ruleForm.find((item) => item.indexId == id);
      obj.category_id = value;
    },
    async __POST_TOP_MENU(data) {
      try {
        await this.$store.dispatch("fetchTopBars/postTopBars", data);
        this.notification("Success", "Успешно добавлен", "success");
        this.$router.push("/contents/top-menu");
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
    async __GET_TOP_MENU() {
      try {
        const data = await this.$store.dispatch("fetchTopBars/getTopBars");
        this.ruleForm = data?.bars?.data.map((item, index) => {
          return {
            ...item,
            indexId: index + 1,
            position: index + 1,
            fileList: [],
            current_id: item.category_id
              ? `cat_${item.category_id}`
              : `promo_${item.promotion_id}`,
          };
        });
        this.ruleForm = this.ruleForm.map((item, index) => {
          if (item.icon_svg) {
            return {
              ...item,
              fileList: [
                {
                  uid: "-1",
                  name: "image.png",
                  status: "done",
                  oldImg: true,
                  url: item.icon_svg,
                },
              ],
            };
          } else {
            return item;
          }
        });
        this.categories = data?.bars?.data
          .filter((elem) => elem.category_id && elem.category)
          .map((item, index) => {
            return {
              ...item.category,
              id: `cat_${item.category?.id}`,
            };
          })
          .filter((elem) => elem);
        const unique = this.categories.filter(
          (obj, index) =>
            this.categories.findIndex((item) => item.id === obj.id) === index
        );
        this.categories = [...unique];

        this.promotions = data?.bars?.data
          .filter((elem) => elem.promotion_id && elem.promotion)
          .map((item, index) => {
            return {
              ...item.promotion,
              id: `promo_${item.promotion?.id}`,
            };
          })
          .filter((elem) => elem);
        const unique1 = this.promotions.filter(
          (obj, index) =>
            this.promotions.findIndex((item) => item.id === obj.id) === index
        );
        this.promotions = [...unique1];
        this.topBarRules();
        this.addDefaultForms();
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
    addDefaultForms() {
      if (this.ruleForm.length < 4) {
        let fromLength = 4 - this.ruleForm.length;
        for (let i = 1; i < fromLength; i++) {
          this.addElement();
        }
      }
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
    async handleChangeImg({ fileList }, id) {
      let currentObj = this.ruleForm.find((item) => item.indexId == id);
      currentObj.fileList = fileList;
      if (fileList[0]?.response?.path) {
        currentObj.icon_svg = fileList[0]?.response?.path;
      } else {
        currentObj.icon_svg = "";
      }
    },
    toBack() {
      this.$router.push("/contents/top-menu");
    },
    onInsert(event) {
      this.ruleForm.splice(event.index, 0, event.data);
    },
    topBarRules() {
      this.ruleForm.forEach((item) => {
        this.rulesBar.name.ru = [
          {
            required: true,
            message: "Brand name is required",
            trigger: "change",
          },
        ];
      });
    },
  },
  watch: {
    "ruleForm.length"() {
      this.topBarRules();
    },
  },
  components: {
    TitleBlock,
    LayoutHeaderBtn,
    Drag,
    DropList,
  },
};
</script>
<style lang="scss">
@import "../../../assets/scss/custom/page/characteristic.scss";
.top-menu-input-grid {
  display: flex;
  gap: 8px;
}
.item {
  pointer-events: painted;
}
.icon_upload-top .ant-upload-list-picture-card-container {
  height: 40px;
}
.icon_upload-top .ant-upload-select-picture-card,
.icon_upload-top .ant-upload-list-picture-card .ant-upload-list-item {
  height: 40px;
}
.clearfix-img {
  max-width: 104px;
}
</style>
