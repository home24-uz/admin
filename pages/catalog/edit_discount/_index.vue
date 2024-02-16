<template lang="html">
  <div>
    <el-form
      label-position="top"
      :model="ruleForm"
      :rules="rules"
      ref="ruleFormDiscount"
      label-width="120px"
      class="demo-ruleForm"
      action=""
    >
      <TitleBlock title="Скидка" :breadbrumb="['Каталог']" lastLink="Скидка">
        <div class="d-flex">
          <span class="mx-3">
            <LayoutHeaderBtn
              name="Отмена"
              :headerbtnCallback="headerbtnCallback"
              :light="true"
            />
          </span>
          <div
            class="add-btn add-header-btn add-header-btn-padding btn-primary"
            type="submit"
            @click="submitForm('ruleFormDiscount')"
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
          <div class="category-from-grid">
            <div class="category-select-grid">
              <el-tabs class="form_tabs" v-model="activeName">
                <el-tab-pane
                  v-for="(item, index) in lang"
                  :label="item.label"
                  :name="item.label"
                  :key="index"
                >
                  <div class="form-container form-container-ltr">
                    <div class="d-flex justify-content-between">
                      <FormTitle title="Изменить скидку" />
                    </div>
                    <div class="form-block required">
                      <el-form-item label="Заголовок" prop="title.ru">
                        <el-input
                          v-model="ruleForm.title[item.key]"
                          placeholder="Заголовок..."
                        ></el-input>
                      </el-form-item>
                    </div>
                    <div class="form-block required">
                      <el-form-item label="Описание" prop="desc.ru">
                        <el-input
                          type="textarea"
                          rows="5"
                          v-model="ruleForm.desc[item.key]"
                          placeholder="Описание..."
                        ></el-input>
                      </el-form-item>
                    </div>
                    <div class="discount-grid-input">
                      <div class="form-block required mb-0">
                        <el-form-item label="Процент">
                          <el-input
                            v-model="ruleForm.percent"
                            placeholder="Процент..."
                          ></el-input>
                        </el-form-item>
                      </div>
                      <div class="form-block required mb-0">
                        <el-form-item label="Количество">
                          <el-input
                            v-model="ruleForm.amount"
                            placeholder="Количество..."
                          ></el-input>
                        </el-form-item>
                      </div>
                    </div>
                    <div class="form-block mt-3">
                      <el-form-item
                        :label="
                          ruleForm.type == 'product' ? 'Продукты' : 'Бренды'
                        "
                        prop="ids"
                      >
                        <a-select
                          mode="multiple"
                          label-in-value
                          :value="value"
                          :placeholder="
                            ruleForm.type == 'product'
                              ? 'Продукты...'
                              : 'Бренды...'
                          "
                          style="width: 100%"
                          :filter-option="false"
                          :not-found-content="fetching ? undefined : null"
                          @search="fetchUser"
                          @change="handleChange"
                        >
                          <a-spin
                            v-if="fetching"
                            slot="notFoundContent"
                            size="small"
                          />
                          <a-select-option v-for="d in data" :key="d.id">
                            {{ d.name.ru }}
                          </a-select-option>
                        </a-select>
                      </el-form-item>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
              <div class="category-character-grid"></div>
            </div>
            <div class="category-img-grid">
              <div class="form-container">
                <FormTitle title="Параметры" />
                <div
                  class="form-block status-style"
                  :class="[
                    ruleForm.status == 1 ? 'status-active' : 'status-inactive',
                  ]"
                >
                  <div><label>Статус</label></div>
                  <el-select
                    class="w-100"
                    placeholder="Status"
                    default-first-option
                    v-model="ruleForm.status"
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
                  <div><label>Тип скидки</label></div>
                  <el-select
                    class="w-100"
                    placeholder="Status"
                    default-first-option
                    v-model="ruleForm.type"
                  >
                    <el-option
                      v-for="item in discountType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div class="form-block">
                  <el-form-item
                    label="Дата"
                    prop="start"
                    v-if="ruleForm.start != ''"
                  >
                    <a-range-picker
                      :default-value="[
                        moment(ruleForm.start, dateFormat),
                        moment(ruleForm.end, dateFormat),
                      ]"
                      :format="dateFormat"
                      @change="onChange"
                    />
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script lang="js">

import FormTitle from "../../../components/Form-title.vue";
import TitleBlock from "../../../components/Title-block.vue";
import LayoutHeaderBtn from "../../../components/form/Layout-header-btn.vue";
import { Drag, DropList } from "vue-easy-dnd";
import status from "../../../mixins/status";
import debounce from "lodash/debounce";
import moment from "moment"
export default {
  layout: "toolbar",
  mixins: [status],
  data() {
    this.lastFetchId = 0;
    this.fetchUser = debounce(this.fetchUser, 800);
    return {
        dateFormat: 'YYYY-MM-DD',
      value: [],
      data: [],
      fetching: false,
      activeName: "Русский",
      addIcon: require("../../../assets/svg/components/add-icon.svg?raw"),
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
      discountType: [
        {
          value: 'product',
          label: "Product",
        },
        {
          value: 'brand',
          label: "Brand",
        },
      ],
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
        name: [
          {
            required: true,
            message: "Поле обязательна к заполнению",
            trigger: "change",
          },
        ],
        title: {
          ru: [
          {
            required: true,
            message: "Поле обязательна к заполнению",
            trigger: "change",
          },
        ]
        },
        start: [
          {
            required: true,
            message: "Поле обязательна к заполнению",
            trigger: "change",
          },
        ],
        ids:  [
          {
            required: true,
            message: "Поле обязательна к заполнению",
            trigger: "change",
          },
        ],
        desc: {
          ru: [
          {
            required: true,
            message: "Это поле обязательна",
            trigger: "change",
          },
        ],
        }
      },
      ruleForm: {
        title: {
          ru: "",
          uz: "",
          en: ""
      },
      desc: {
        ru: "",
        uz: "",
        en: ""
    },
    percent: null,
    amount: null,
    type: "product",
    ids: [],
    start: "",
    end: "",
    status: 1
      },
    };
  },
mounted() {
    this.__Show_DISCOUNT();
},
  methods: {
    moment,
    onChange(date, dateString) {
      if(dateString[0] == dateString[1]) {
        this.ruleForm.start = dateString[0]
        this.ruleForm.end = null
      } else {
        this.ruleForm.start = dateString[0]
        this.ruleForm.end = dateString[1]
      }
    },
    submitForm(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          this.__EDIT_DISCOUNT(this.ruleForm);
        } else {
          return false;
        }
      });
    },
    headerbtnCallback() {
      this.$router.push("/catalog/atributs");
    },
    async __EDIT_DISCOUNT(data) {
      try {
        await this.$store.dispatch("fetchDiscount/editDiscount", {data: data,id: this.$route.params.index});
        this.notification("Success","Успешно изменено","success")
        this.$router.push("/catalog/discount");
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
    async fetchUser(value) {
      this.lastFetchId += 1;
      const fetchId = this.lastFetchId;
      this.data = [];
      this.fetching = true;
      if(this.ruleForm.type == "product") {
        const data = await this.$store.dispatch("fetchProducts/getProducts", {
          search: value,
        });
      this.data = data?.products?.data;

      } else {
        const data = await this.$store.dispatch("fetchBrands/getBrands", {
          search: value,
        });
      this.data = data?.products?.data;

      }
      this.fetching = false;
    },
    handleChange(value) {
      this.ruleForm.ids = value.map((item) => item.key);
      Object.assign(this, {
        value,
        data: [],
        fetching: false,
      });
    },
    async __Show_DISCOUNT() {
      const data = await this.$store.dispatch(
        "fetchDiscount/showDiscount",
        this.$route.params.index
      );
      this.ruleForm.title = data?.discount?.title
      this.ruleForm.desc = data?.discount?.desc
      this.ruleForm.ids = data?.discount?.ids
      this.value = data?.discount?.products.map(item => {
        return {
            key: item.id,
            label: item.slug
        }
      })
      this.ruleForm.end = data?.discount?.end
      this.ruleForm.start = data?.discount?.start
      this.ruleForm.status = data?.discount?.status
      this.ruleForm.type = data?.discount?.type
      this.ruleForm.percent = data?.discount?.percent
      this.ruleForm.amount = data?.discount?.amount
    },
  },
watch: {
  'ruleForm.percent'(val) {
    if(val)
    this.ruleForm.amount = null
  },
  'ruleForm.amount'(val) {
    if(val)
    this.ruleForm.percent = null
  },
  'ruleForm.type'() {
    this.ruleForm.ids = []
    this.value = []
  }
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
.discount-grid-input {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
}
</style>
