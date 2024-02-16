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
      <TitleBlock title="Атрибуты" :breadbrumb="['Каталог']" lastLink="Атрибуты">
        <div class="d-flex">
          <span class="mx-3">
            <LayoutHeaderBtn
              name="Отмена"
              :headerbtnCallback="headerbtnCallback"
              :light="true"
            />
          </span>
          <div
            v-if="checkAccess('attributes', 'PUT')"
            class="add-btn add-header-btn add-header-btn-padding btn-primary"
            type="submit"
            @click="submitForm('ruleForm')"
          >
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
                <FormTitle title="Атрибут" />
                <div class="form-block required">
                  <el-form-item prop="keywords" label="Описание">
                    <el-input
                      type="text"
                      v-model="ruleForm.keywords"
                      placeholder="Keywords"
                    ></el-input>
                  </el-form-item>
                </div>
                <div class="atribut-input-grid">
                  <div class="form-block required">
                    <el-form-item prop="name.ru" label="Имя атрибута">
                      <el-input
                        v-model="ruleForm.name[itemLang.key]"
                        placeholder="Имя атрибута"
                      ></el-input>
                    </el-form-item>
                    <span class="bottom_text"
                      >Имя атрибута является обязательным и рекомендуется
                      уникальный.</span
                    >
                  </div>
                  <div class="d-flex flex-column">
                    <div
                      class="form-block required"
                      :class="{ 'multi-select-required': multiSelectError }"
                    >
                      <el-form-item
                        label-position="top"
                        label="Имя опции"
                        v-if="colorPickerHide"
                      >
                        <drop-list
                          :items="ruleForm.optionsName"
                          @insert="onInsert"
                          @reorder="$event.apply(ruleForm.optionsName)"
                        >
                          <template v-slot:item="{ item }">
                            <drag class="item" :key="item.elemId">
                              <div class="d-flex align-items-center">
                                <el-input
                                  class="w-100 mb-2"
                                  v-model="item.name"
                                  placeholder="Название опции"
                                />
                                <div class="variant_btns mb-1 mt-0">
                                  <div
                                    class="variant-btn variant-btn-delete mx-2"
                                    @click="deleteElement(item.elemId)"
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
                                  <div class="variant-btn variant-btn-check cursor_drag">
                                    <a-icon
                                      type="drag"
                                      :style="{
                                        color: '#3699FF',
                                        fontSize: '18px',
                                      }"
                                    />
                                  </div>
                                </div>
                              </div>
                            </drag>
                          </template>
                          <template v-slot:feedback="{ data }">
                            <div class="item feedback" :key="data">
                              {{ data }}
                            </div>
                          </template>
                        </drop-list>
                      </el-form-item>
                      <div class="d-flex color" v-else>
                        <el-form-item
                          label-position="top"
                          label="Имя цветa"
                          style="width: auto"
                        >
                          <drop-list
                            :items="ruleForm.optionsName"
                            @insert="onInsert"
                            @reorder="$event.apply(ruleForm.optionsName)"
                            class="drop__list"
                          >
                            <template v-slot:item="{ item }">
                              <drag class="item" :key="item.elemId">
                                <div class="d-flex align-items-center color_picker">
                                  <el-color-picker
                                    popper-class="badges-color-picker"
                                    v-model="item.name"
                                  ></el-color-picker>
                                  <div
                                    class="variant-btn variant-btn-delete color_picker_delete mx-2"
                                    @click="deleteElement(item.elemId)"
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
                                </div>
                              </drag>
                            </template>
                            <template v-slot:feedback="{ data }">
                              <div class="item feedback" :key="data">
                                {{ data }}
                              </div>
                            </template>
                          </drop-list>
                        </el-form-item>
                        <div class="variant_btns mb-1 mt-0" @click="addElement()">
                          <div class="variant-btn variant-btn-check">
                            <span v-html="addInnerValidatIcon"></span>
                          </div>
                        </div>
                      </div>
                      <div class="d-flex justify-content-start" v-if="colorPickerHide">
                        <div class="create-inner-variant mt-0" @click="addElement()">
                          <span v-html="addInnerValidatIcon"></span>
                          Добавить опции
                        </div>
                      </div>
                      <span class="bottom_text"
                        >Установите список ключевых слов, с которыми связана категория.
                        Разделяйте ключевые слова, добавляя запятую между каждым ключевое
                        слово.</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
import FormTitle from "../../../components/Form-title.vue";
import TitleBlock from "../../../components/Title-block.vue";
import LayoutHeaderBtn from "../../../components/form/Layout-header-btn.vue";
import { Drag, DropList } from "vue-easy-dnd";
import authAccess from "@/mixins/authAccess";
import status from "@/mixins/status";

export default {
  layout: "toolbar",
  mixins: [authAccess,status],
  data() {
    return {
      colorPickerHide: true,
      activeName: "Русский",
      multiSelectError: true,
      addIcon: require("../../../assets/svg/components/add-icon.svg?raw"),
      addInnerValidatIcon: require("../../../assets/svg/components/add-inner-validat-icon.svg?raw"),
      options: [],
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
      rules: {
        group_id: [
          {
            required: true,
            message: "Группа атрибутов обязательна",
            trigger: "change",
          },
        ],

        name: {
          ru: [
            {
              required: true,
              message: "Название атрибута обзятелен",
              trigger: "change",
            },
          ],
        },
        options_option: [
          {
            required: true,
            message: "Название атрибута обзятелен",
            trigger: "change",
          },
        ],
      },
      ruleForm: {
        keywords: "",
        name: {
          ru: "",
          uz: "",
          en: "",
        },
        options: [],
        optionsName: [
          {
            name: "",
            elemId: 1,
          },
        ],
      },
    };
  },

  methods: {
    onInsert(event) {
      this.ruleForm.optionsName.splice(event.index, 0, event.data);
    },
    addElement() {
      this.ruleForm.optionsName.push({
        name: "",
        elemId: Math.max(...this.ruleForm.optionsName.map((o) => o.elemId)) + 1,
      });
    },
    deleteElement(id) {
      if (this.ruleForm.optionsName.length > 1)
        this.ruleForm.optionsName = this.ruleForm.optionsName.filter(
          (item) => item.elemId != id
        );
    },
    submitForm(ruleForm) {
      this.multiSelectError = false;
      this.$refs[ruleForm].validate((valid) => {
        valid ? this.dataEditEnd() : false;
      });
    },

    dataEditEnd() {
      if (typeof this.ruleForm.group_id == "string") {
        this.ruleForm.group_id = this.group_id;
      }
      const newOptionsNames = this.options.map((item) => (item.name = item.name.ru));
      const newOptions = this.ruleForm.optionsName.map((item, index) => {
        if (newOptionsNames.includes(item.name)) {
          let opt = this.options.find((item2) => item2.name == item.name);
          return {
            ...opt,
            name: {
              ru: opt.name,
            },
          };
        } else {
          return {
            id: 0,
            name: {
              ru: item.name,
            },
            position: index + 1,
          };
        }
      });
      const data = {
        ...this.ruleForm,
        options: newOptions,
      };
      delete data["optionsName"];
      this.__EDIT_ATRIBUTES(data);
    },
    headerbtnCallback() {
      this.$router.push("/catalog/atributs");
    },

    async __GET_ATRIBUT_BY_ID() {
      const data = await this.$store.dispatch(
        "fetchAtributes/getAtributesById",
        this.$route.params.index
      );
      this.dataEditStart(data);
    },
    dataEditStart(data) {
      this.ruleForm.name = data.attribute.name;
      this.ruleForm.keywords = data.attribute.keywords;
      this.atribut_id = data.attribute.id;
      this.options = data.attribute.options;
      this.ruleForm.options = data.attribute.options.map((item) => item.name.ru);
      this.ruleForm.optionsName = data.attribute.options.map((item, index) => {
        return {
          name: item.name.ru,
          elemId: index + 1,
        };
      });
      this.colorPickerHide = !data.attribute.name.ru.toUpperCase().includes("ЦВЕТ");
    },
    async __EDIT_ATRIBUTES(data) {
      try {
        await this.$store.dispatch("fetchAtributes/editAtributes", {
          id: this.atribut_id,
          data: data,
        });
        await this.successNotify("Атрибут успешно изменена");
        this.$router.push("/catalog/atributs");
      } catch (e) {
        if(e.response.status == 422) {
          this.notification("Error",Object.values(e.response.data.errors)[0][0],"error")
        } else {
          this.statusFunc(e.response);
        }
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

    successNotify(message) {
      this.$notify({
        title: "Success",
        message: message,
        type: "success",
      });
    },
  },
  mounted() {
    this.__GET_ATRIBUT_BY_ID();
  },
  watch: {
    // colorPickerHide() {
    //   this.ruleForm.optionsName = [
    //     {
    //       name: {
    //         ru: "",
    //         uz: "",
    //         en: "",
    //       },
    //       position: 1,
    //       id: 1,
    //     },
    //   ];
    // },
  },
  components: {
    FormTitle,
    TitleBlock,
    LayoutHeaderBtn,
    Drag,
    DropList,
  },
};
</script>
<style lang="css">
.color_picker_delete {
  position: absolute;
  width: 20px !important;
  height: 20px;
  border-radius: 4px;
  top: -10px;
  right: -17px;
  display: none;
}
.color_picker {
  width: 40px;
  position: relative;
}
.color_picker:hover .color_picker_delete {
  display: flex;
}
.drop__list {
  display: flex;
  margin-right: 10px;
  gap: 10px;
}
.bottom_text label::after {
  display: none;
}
</style>
