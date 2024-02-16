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
      <TitleBlock title="Параметры" :breadbrumb="['Каталог']" lastLink="Параметры">
        <div class="d-flex">
          <span class="mx-3">
            <LayoutHeaderBtn name="Отмена" :headerbtnCallback="toBack" :light="true" />
          </span>
          <div
            class="add-btn add-header-btn add-header-btn-padding btn-primary"
            type="submit"
            @click="submitForm('ruleForm')"
          >
            <span class="svg-icon"></span>
            Сохранять
          </div>
        </div>
      </TitleBlock>
      <div class="container_xl">
        <div class="card_block-form">
          <div class="form-container form-container-ltr">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div class="prodduct-list-header-grid w-100 align-items-center">
                <SearchInput placeholder="Поиск" @changeSearch="changeSearch" />
                <div class="input status-select w-100"></div>
                <span></span>
                <a-button
                  type="primary"
                  class="d-flex align-items-center justify-content-center"
                  style="height: 38px"
                  @click="clearQuery"
                  ><a-icon type="reload"
                /></a-button>
              </div>
            </div>
            <div class="translate-header character-translate-grid">
              <span class="translate-text d-flex align-items-center">#</span>
              <h5 class="translate-text">ЗНАЧЕНИЕ(RU)</h5>
              <h5 class="translate-text">ЗНАЧЕНИЕ(EN)</h5>
              <h5 class="translate-text">ЗНАЧЕНИЕ(UZ)</h5>
            </div>
            <div class="translate-body" v-if="options.length > 0">
              <div class="loading-data" v-if="loading">
                <a-spin />
              </div>
              <div v-for="(option, index) in options" v-else>
                <p class="ch-product-name" v-if="option?.products?.length > 0">
                 {{option?.products[0]?.name?.ru}}
                </p>
                <div class="character-translate-grid pb-2">
                  <span class="translate-text d-flex align-items-center">{{
                    option.key
                  }}</span>
                  <div class="form-block mb-0">
                    <el-form-item>
                      <el-input
                        v-model="option.name.ru"
                        placeholder="Название атрибута"
                      ></el-input>
                    </el-form-item>
                  </div>
                  <div class="form-block mb-0">
                    <el-form-item label-position="top" prop="options">
                      <el-input
                        v-model="option.name.en"
                        placeholder="Название атрибута"
                      ></el-input>
                    </el-form-item>
                  </div>
                  <div class="form-block mb-0">
                    <el-form-item label-position="top" prop="options">
                      <el-input
                        v-model="option.name.uz"
                        placeholder="Название атрибута"
                      ></el-input>
                    </el-form-item>
                  </div>

                  <!-- <div class="variant_btns mb-1 mt-0">
                  <div class="variant-btn variant-btn-delete mx-2 position-absolute">
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
                </div> -->
                </div>
              </div>
              <!-- <div class="d-flex justify-content-start">
                <div class="create-inner-variant mt-0" @click="addElement()">
                  <span v-html="addInnerValidatIcon"></span>
                  Добавить характеристику
                </div>
              </div> -->
            </div>
            <div v-else class="loading-data">
              <a-empty :description="false">
                <a-button type="primary" @click="clearQuery">Назад </a-button></a-empty
              >
            </div>
            <div class="d-flex justify-content-between mt-4" v-if="options.length > 0">
              <el-select
                v-model="params.pageSize"
                class="table-page-size"
                placeholder="Select"
                @change="
                  ($event) =>
                    changePageSizeGlobal(
                      $event,
                      '/settings/characteristics/options',
                      '__GET_GROUPS'
                    )
                "
              >
                <el-option
                  v-for="item in pageSizes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <a-pagination
                class="table-pagination"
                :simple="false"
                v-model.number="current"
                :total="totalPage"
                :page-size.sync="params.pageSize"
              />
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
import { Drag, DropList } from "vue-easy-dnd";
import status from "../../../mixins/status";
import global from "../../../mixins/global";
import columns from "../../../mixins/columns";
import SearchInput from "../../../components/form/Search-input.vue";
import StatusFilter from "../../../components/form/Status-filter.vue";
export default {
  layout: "toolbar",
  mixins: [status, global, columns],
  data() {
    return {
      activeName: "Русский",
      multiSelectError: true,
      loading: false,
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
      options: [
        {
          id: 1,
          name: {
            ru: "",
            uz: "",
            en: "",
          },
        },
      ],
      ruleForm: {
        group: {
          ru: "",
          uz: "",
          en: "",
        },
        options: [],
        attributes: [
          {
            id: 1,
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
    this.__GET_GROUPS();
    this.getFirstData("/settings/characteristics/options", "__GET_GROUPS");
  },
  methods: {
    deleteElement(id) {
      if (this.ruleForm.attributes.length > 1)
        this.ruleForm.attributes = this.ruleForm.attributes.filter(
          (item) => item.id != id
        );
    },
    async clearQuery(val) {
      const query = { ...this.$route.query, page: 1 };
      this.current = 1;
      delete query.search;
      if (this.$route.query?.search) {
        await this.$router.replace({
          path: "/settings/characteristics/options",
          query: { ...query },
        });
        this.__GET_GROUPS();
      }
    },
    async changeSearch(val) {
      this.searchVal = val.target.value;
      if (val.target.value.length > 2) {
        if (this.$route.query?.search != val.target.value)
          await this.$router.replace({
            path: "/settings/characteristics/options",
            query: { ...this.$route.query, search: val.target.value },
          });
        if (val.target.value == this.$route.query.search) this.__GET_GROUPS();
      } else if (val.target.value.length == 0) {
        this.clearQuery(val);
      }
    },
    changeStatus(val) {
      // this.status = val;
    },
    addElement() {
      this.options.push({
        name: {
          ru: "",
          uz: "",
          en: "",
        },
        id: Math.max(...this.ruleForm.attributes.map((o) => o.id)) + 1,
      });
    },
    submitForm(ruleForm) {
      this.multiSelectError = false;
      this.$refs[ruleForm].validate((valid) => {
        valid ? this.__POST_CHARACTERISTIC({ options: this.options }) : false;
      });
    },
    async __GET_GROUPS() {
      this.loading = await true;
      const data = await this.$store.dispatch("fetchCharacters/getOptions", {
        ...this.$route.query,
      });
      this.loading = false;
      this.totalPage = data.options?.total;
      const pageIndex = this.indexPage(
        data?.options?.current_page,
        data?.options?.per_page
      );
      this.options = data?.options.data.map((item, index) => {
        return {
          name: item.name,
          id: item.id,
          key: index + pageIndex,
          products: item.products
        };
      });
    },
    indexPage(current_page, per_page) {
      return (current_page * 1 - 1) * per_page + 1;
    },
    async __POST_CHARACTERISTIC(data) {
      try {
        await this.$store.dispatch("fetchCharacters/postOptions", data);
        this.notification("Success", "Характеристика успешно добавлен", "success");
        this.$router.push("/settings/characteristics/options");
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
    toBack() {
      this.$router.push("/settings/characteristics/options");
    },
    onInsert(event) {
      this.ruleForm.attributes.splice(event.index, 0, event.data);
    },
  },
  watch: {
    async current(val) {
      this.changePagination(val, "/settings/characteristics/options", "__GET_GROUPS");
    },
  },
  components: {
    TitleBlock,
    LayoutHeaderBtn,
    Drag,
    DropList,
    SearchInput,
    StatusFilter,
  },
};
</script>
<style lang="scss">
@import "../../../assets/scss/custom/page/characteristic.scss";
.ch-product-name {
  font-family: "Inter", sans-serif;
  font-weight: 300;
  font-size: 13px;
  line-height: 21.5px;
  color: #181c32;
  margin-left: 30px;
  margin-bottom: 3px !important;
}
</style>
