<template lang="html">
  <div>
    <el-form
      label-position="top"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
      action=""
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
            v-if="checkAccess('attributes', 'POST')"
            class="add-btn add-header-btn add-header-btn-padding btn-primary"
            type="submit"
            @click="submitForm('ruleForm')"
          >
            <span class="svg-icon" v-html="addIcon"></span>
            Добавить атрибут
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
                  <div class="w-100">
                    <el-form-item prop="keywords" label="Описание">
                      <el-input
                        type="text"
                        id="artibut_keyword"
                        v-model="ruleForm.keywords"
                        placeholder="Описание"
                      ></el-input>
                    </el-form-item>
                  </div>
                </div>
                <div class="atribut-input-grid">
                  <div class="form-block required">
                    <el-form-item prop="name.ru" label="Имя атрибута">
                      <el-input
                        v-model="ruleForm.name[itemLang.key]"
                        placeholder="Название атрибута"
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
                            <drag class="item" :key="item.id">
                              <div class="d-flex align-items-center">
                                <el-input
                                  class="w-100 mb-2"
                                  v-model="item.name[itemLang.key]"
                                  placeholder="Имя опции"
                                />
                                <div class="variant_btns mb-1 mt-0">
                                  <div
                                    class="variant-btn variant-btn-delete mx-2"
                                    @click="deleteElement(item.id)"
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
                              <drag class="item" :key="item.id">
                                <div class="d-flex align-items-center color_picker">
                                  <el-color-picker
                                    popper-class="badges-color-picker"
                                    v-model="item.name[itemLang.key]"
                                  ></el-color-picker>
                                  <div
                                    class="variant-btn variant-btn-delete color_picker_delete mx-2"
                                    @click="deleteElement(item.id)"
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
                      <span class="bottom_text">
                        <a-checkbox
                          @change="colorPickerHide = !colorPickerHide"
                          :checked="!colorPickerHide"
                          >Атрибуты цвета</a-checkbox
                        >
                      </span>
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
<script lang="js">

import FormTitle from "../../components/Form-title.vue";
import TitleBlock from "../../components/Title-block.vue";
import LayoutHeaderBtn from "../../components/form/Layout-header-btn.vue";
import { Drag, DropList } from "vue-easy-dnd";
import status from "@/mixins/status";
import authAccess from "@/mixins/authAccess";

export default {
  layout: "toolbar",
  mixins: [status,authAccess],
  data() {
    return {
      colorPickerHide: true,
      activeName: "Русский",
      multiSelectError: true,
      addIcon: require("../../assets/svg/components/add-icon.svg?raw"),
      addImgIcon: require("../../assets/svg/components/add-img-icon.svg?raw"),
      addInnerValidatIcon: require("../../assets/svg/components/add-inner-validat-icon.svg?raw"),
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
        options: [
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
          en: ""
        },
        options: [],
        optionsName: [{
          name: {
                ru: "",
                uz: "",
                en: ""
            },
            position: 1,
          id: 1
        }]
      },
    };
  },

  methods: {
    onInsert(event) {
      this.ruleForm.optionsName.splice(event.index, 0, event.data);
    },
    addElement() {
      this.ruleForm.optionsName.push({
        name: {
                ru: "",
                uz: "",
                en: ""
            },
            position: 1,
        id: Math.max(...this.ruleForm.optionsName.map((o) => o.id)) + 1,
      });
    },
    deleteElement(id) {
      if (this.ruleForm.optionsName.length > 1)
        this.ruleForm.optionsName = this.ruleForm.optionsName.filter(
          (item) => item.id != id
        );
    },
    submitForm(ruleForm) {
      this.multiSelectError = false;
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          if(this.ruleForm.optionsName[0].name) {
            const data = {
              ...this.ruleForm,
              options: this.ruleForm.optionsName.map((item,index) => {
                return {
                  position: index + 1,
                  name: item.name
                }
              })
            };
            delete data["optionsName"];
            this.__POST_ATRIBUTES(data);
          } else {
            this.notificationError("Error","Нет опции")
          }
        } else {
          return false;
        }
      });
    },
    headerbtnCallback() {
      this.$router.push("/catalog/atributs");
    },
    async __POST_ATRIBUTES(data) {
      try {
        await this.$store.dispatch("fetchAtributes/postAtributes", data);
        this.notification("Success","Атрибут успешно добавлен","success")
        this.$router.push("/catalog/atributs");
      } catch (e) {
        if(e.response.status == 422) {
          this.notification("Error",Object.values(e.response.data.errors)[0][0],"error")
        } else {
          this.statusFunc(e.response);
        }

      }
    },
  },
  watch: {
    colorPickerHide() {
      this.ruleForm.optionsName = [{
          name: {
                ru: "",
                uz: "",
                en: ""
            },
            position: 1,
          id: 1
        }]
    },
  },
  components: {
    FormTitle,
    TitleBlock,
    LayoutHeaderBtn,
    Drag,
    DropList
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
