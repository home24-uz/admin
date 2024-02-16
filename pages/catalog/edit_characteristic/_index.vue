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
      <TitleBlock
        title="Характеристика"
        :breadbrumb="['Каталог']"
        lastLink="Характеристика"
      >
        <div class="d-flex">
          <span class="mx-3">
            <LayoutHeaderBtn name="Отмена" :headerbtnCallback="toBack" :light="true" />
          </span>
          <div
            v-if="checkAccess('characteristics', 'PUT')"
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
                <FormTitle title="Характеристика" />

                <div class="form-block required">
                  <div class="group-grid-2" id="character_group">
                    <el-form-item prop="group" label="Группа">
                      <el-input
                        placeholder="Группа"
                        v-model="ruleForm.group[itemLang.key]"
                      />
                    </el-form-item>
                    <el-form-item label="Ключевые слова">
                      <el-input
                        placeholder="Ключевые слова..."
                        v-model="ruleForm.keywords"
                      />
                    </el-form-item>
                  </div>
                </div>
                <!-- <div class="form-block required">
                  <div class="w-100">
                    <el-form-item prop="keywords" label="Description">
                      <el-input
                        type="text"
                        id="artibut_keyword"
                        v-model="ruleForm.keywords"
                        placeholder="Keywords"
                      ></el-input>
                    </el-form-item>
                  </div>
                </div> -->
                <div class="list">
                  <drop-list
                    :items="ruleForm.attributes"
                    @insert="onInsert"
                    @reorder="$event.apply(ruleForm.attributes)"
                  >
                    <template v-slot:item="{ item }">
                      <drag class="item" :key="item.indexId">
                        <div class="character-input-grid pb-3">
                          <div class="form-block required mb-0">
                            <el-form-item>
                              <el-input
                                v-model="item.name[itemLang.key]"
                                placeholder="Название атрибута"
                              ></el-input>
                            </el-form-item>
                          </div>
                          <div
                            class="form-block mb-0"
                            :class="{
                              'multi-select-required': multiSelectError,
                            }"
                          >
                            <el-form-item label-position="top" prop="options">
                              <el-select
                                class="w-100"
                                v-model="item.options"
                                popper-class="select-popper-hover"
                                filterable
                                multiple
                                allow-create
                                default-first-option
                                no-data-text="No options"
                                placeholder="Название опции"
                              >
                                <el-option
                                  v-for="(option, index) in item.optionsLast"
                                  :key="option.name"
                                  :label="option.name"
                                  :value="option.id"
                                >
                                </el-option>
                              </el-select>
                            </el-form-item>
                          </div>
                          <div class="variant_btns mb-1 mt-0">
                            <div
                              class="variant-btn variant-btn-delete mx-2"
                              @click="deleteElement(item.indexId)"
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
                                :style="{ color: '#3699FF', fontSize: '18px' }"
                              />
                            </div>
                          </div>
                        </div>
                      </drag>
                    </template>
                    <template v-slot:feedback="{ data }">
                      <div class="item feedback" :key="data">{{ data }}</div>
                    </template>
                  </drop-list>
                  <div class="d-flex justify-content-start">
                    <div class="create-inner-variant mt-0" @click="addElement()">
                      <span v-html="addInnerValidatIcon"></span>
                      Добавить характеристику
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
import LayoutHeaderBtn from "../../../components/form/Layout-header-btn.vue";
import TitleBlock from "../../../components/Title-block.vue";
import { Drag, DropList } from "vue-easy-dnd";
import status from "../../../mixins/status";
import authAccess from "@/mixins/authAccess";

export default {
  layout: "toolbar",
  mixins: [status, authAccess],
  data() {
    return {
      activeName: "Русский",
      multiSelectError: true,
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
      options: [
        {
          value: "HTML",
          label: "HTML",
        },
        {
          value: "CSS",
          label: "CSS",
        },
        {
          value: "JavaScript",
          label: "JavaScript",
        },
      ],
      rules: {
        group: [
          {
            required: true,
            message: "Characteristic group is required",
            trigger: "change",
          },
        ],
        name: {
          ru: [
            {
              required: true,
              message: "Characteristic name is required",
              trigger: "change",
            },
          ],
        },
        // options: [
        //   {
        //     required: true,
        //     message: "Characteristic name is required",
        //     trigger: "change",
        //   },
        // ],
        // keywords: [
        //   {
        //     required: true,
        //     message: "Characteristic name is required",
        //     trigger: "change",
        //   },
        // ],
      },
      ruleForm: {
        group: {
          ru: "",
          uz: "",
          en: "",
        },
        keywords: "",
        options: [],
        attributes: [
          {
            indexId: 1,
            name: {
              ru: "",
              uz: "",
              en: "",
            },
            options: [],
          },
        ],
      },
    };
  },
  mounted() {
    this.__GET_CHARACTERISTIC_BY_ID();
  },
  methods: {
    deleteElement(indexId) {
      if (this.ruleForm.attributes.length > 1)
        this.ruleForm.attributes = this.ruleForm.attributes.filter(
          (item) => item.indexId != indexId
        );
    },
    addElement() {
      this.ruleForm.attributes.push({
        name: {
          ru: "",
          uz: "",
          en: "",
        },
        options: [],
        indexId: Math.max(...this.ruleForm.attributes.map((o) => o.indexId)) + 1,
        id: 0,
      });
    },
    submitForm(ruleForm) {
      this.multiSelectError = false;
      const data = {
        ...this.ruleForm,
        attributes: this.ruleForm.attributes.map((item) => {
          return {
            id: item.id,
            name: item.name,
            options: item.options.map((elem) => {
              if (typeof elem == "number") {
                return item.optionsLast.find((findId) => findId.id == elem);
              } else {
                return {
                  id: 0,
                  name: elem,
                };
              }
            }),
          };
        }),
      };
      const { options, ...rest } = data;
      this.$refs[ruleForm].validate((valid) => {
        valid ? this.__EDIT_CHARACTERISTIC(rest) : false;
      });
    },
    async __GET_CHARACTERISTIC_BY_ID() {
      const data = await this.$store.dispatch(
        "fetchCharacters/getCharacteristicsById",
        this.$route.params.index
      );
      this.ruleForm.group = data?.characteristic.name;
      this.ruleForm.keywords = data?.characteristic?.keywords;
      this.ruleForm.attributes = data?.characteristic.characteristics.map(
        (item, index) => {
          return {
            name: item.name,
            id: item.id,
            indexId: index,
            options: item.options.map((elem) => elem.id),
            optionsLast: item.options.map((elem) => {
              return {
                ...elem,
                name: elem.name.ru,
              };
            }),
          };
        }
      );
    },
    async __EDIT_CHARACTERISTIC(data) {
      try {
        await this.$store.dispatch("fetchCharacters/editCharacteristics", {
          id: this.$route.params.index,
          data: data,
        });
        this.notification("Success", "Характеристика успешно изменена", "success");
        this.$router.push("/catalog/characteristic_groups");
      } catch (e) {
        if(e.response.status == 422) {
          this.notification("Error",Object.values(e.response.data.errors)[0][0],"error")
        } else {
          this.statusFunc(e.response);
        }
      }
    },
    toBack() {
      this.$router.push("/catalog/characteristic_groups");
    },
    onInsert(event) {
      this.ruleForm.attributes.splice(event.index, 0, event.data);
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
.group-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 24px;
}
</style>
