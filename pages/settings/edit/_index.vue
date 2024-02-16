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
        title="Регионы"
        :breadbrumb="['Настройки']"
        lastLink="Регионы"
      >
        <div class="d-flex">
          <span class="mx-3">
            <LayoutHeaderBtn
              name="Отмена"
              :headerbtnCallback="toBack"
              :light="true"
            />
          </span>
          <div
            class="add-btn add-header-btn add-header-btn-padding btn-primary"
            type="submit"
            @click="submitForm('ruleForm')"
          >
            <span class="svg-icon" v-html="addIcon"></span>
            Добавить
          </div>
        </div>
      </TitleBlock>
      <a-spin :spinning="spinning" :delay="delayTime">
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
                  <FormTitle title="Регионь" />

                  <div class="form-block required">
                    <div class="group-grid1" id="character_group">
                      <el-form-item prop="group" label="Группа">
                        <el-input
                          placeholder="Группа"
                          v-model="ruleForm.name[itemLang.key]"
                        />
                      </el-form-item>
                    </div>
                  </div>
                  <FormTitle
                    title="Районы"
                    v-if="ruleForm.districts.length > 0"
                  />

                  <div class="d-flex flex-column">
                    <div
                      class="list-districts d-flex flex-row"
                      v-for="dists in ruleForm.districts"
                    >
                      <el-form-item class="w-100">
                        <el-input
                          v-model="dists.name[itemLang.key]"
                          placeholder="Название атрибута"
                        ></el-input>
                      </el-form-item>
                      <div
                        class="variant-btn variant-btn-delete mx-2"
                        @click="deleteElement(dists.indexId)"
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

                    <div class="d-flex justify-content-start">
                      <div
                        class="create-inner-variant mt-0"
                        @click="addElement()"
                      >
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
      </a-spin>
    </el-form>
  </div>
</template>
<script>
import LayoutHeaderBtn from "../../../components/form/Layout-header-btn.vue";
import TitleBlock from "../../../components/Title-block.vue";
import status from "../../../mixins/status";
export default {
  layout: "toolbar",
  mixins: [status],
  data() {
    return {
      delayTime: 0,
      spinning: false,
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
      options: [],
      rules: {
        name: {
          ru: [
            {
              required: true,
              message: "Это поле обязательна",
              trigger: "change",
            },
          ],
        },
      },
      ruleForm: {
        name: {
          ru: "",
          uz: "",
          en: "",
        },
        districts: [
          {
            indexId: 1,
            name: {
              ru: "",
              uz: "",
              en: "",
            },
          },
        ],
      },
    };
  },
  mounted() {
    this.__GET_REGIONS_BY_ID(this.$route.params.index);
  },
  methods: {
    deleteElement(id) {
      if (this.ruleForm.districts.length > 1)
        this.ruleForm.districts = this.ruleForm.districts.filter(
          (item) => item.indexId != id
        );
    },
    addElement() {
      this.ruleForm.districts.push({
        name: {
          ru: "",
          uz: "",
          en: "",
        },
        id: 0,
        indexId:
          this.ruleForm.districts.length > 0
            ? Math.max(...this.ruleForm.districts.map((o) => o.indexId)) + 1
            : 1,
      });
    },
    submitForm(ruleForm) {
      this.ruleForm.districts = this.ruleForm.districts.filter(
        (item) => item.name.ru
      );
      this.$refs[ruleForm].validate((valid) => {
        valid ? this.__PUT_REGIONS(this.ruleForm) : false;
      });
    },
    async __GET_REGIONS_BY_ID(id) {
      try {
        this.spinning = true;
        const data = await this.$store.dispatch(
          "fetchRegions/getRegionsById",
          id
        );
        this.ruleForm.name = data?.region?.name;
        this.ruleForm.districts = data?.region?.districts.map((item, index) => {
          return {
            ...item,
            indexId: index + 1,
          };
        });
        this.spinning = false;
      } catch (e) {
        this.statusFunc(e.response);
        this.spinning = false;
      }
    },
    async __PUT_REGIONS(data) {
      try {
        await this.$store.dispatch("fetchRegions/editRegions", {
          id: this.$route.params.index,
          data: data,
        });
        this.notification("Success", "Успешное изменение", "success");
        this.$router.go(-1);
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
    toBack() {
      this.$router.go(-1);
    },
  },
  components: {
    TitleBlock,
    LayoutHeaderBtn,
  },
};
</script>
<style lang="css"></style>
