<template lang="html">
  <div class="all-orders">
    <TitleBlock
      :title="showcase?.name?.ru"
      :breadbrumb="['Витрины']"
      :lastLink="showcase?.name?.ru"
    >
      <div
        v-if="checkAccess('showcases', 'POST')"
        class="add-btn add-header-btn add-header-btn-padding btn-primary"
        @click="visible = true"
      >
        <span class="svg-icon" v-html="addIcon"></span>
        Добавить
      </div>
    </TitleBlock>
    <a-spin :spinning="spinning" :delay="delayTime">
      <div class="container_xl app-container mb-5">
        <div class="card_block py-5">
          <div class="d-flex align-items-between justify-content-between w-100 pt-4 pb-4">
            <FormTitle :title="showcase?.name?.ru" />
          </div>
          <div class="show-cases-table product_table">
            <div class="show-cases-header ant-table-thead">
              <ul>
                <li class="column-name table-drag">
                  <span v-html="tableDrag"></span>
                </li>
                <li class="column-name">ПРОДУКТЫ</li>
                <li class="column-name">ДЕЙСТВИЯ</li>
              </ul>
            </div>
            <div class="show-cases-body ant-table-tbody">
              <drop-list
                :items="products"
                @insert="onInsert"
                @reorder="$event.apply(products)"
              >
                <template v-slot:item="{ item }">
                  <drag class="item" :key="item.id" @dragend="handleDragEnd">
                    <ul>
                      <li class="column-name table-drag">
                        <span v-html="tableDrag"></span>
                      </li>
                      <li
                        class="column-name"
                        @click="$router.push(`/catalog/edit_products/${item.id}`)"
                      >
                        <span class="drag-img"
                          ><img
                            v-if="item?.images[0]?.sm_img"
                            :src="item?.images[0]?.sm_img"
                            class="table-image"
                            alt="" />
                          <img
                            v-else
                            class="table-image"
                            src="../../../assets/images/photo_2023-03-04_13-28-58.jpg"
                            alt=""
                        /></span>
                        {{ item?.name?.ru }}
                      </li>
                      <li
                        class="column-btns d-flex justify-content-center"
                        v-if="checkAccess('showcases', 'DELETE')"
                      >
                        <span>
                          <a-popconfirm
                            title="Are you sure delete this row?"
                            ok-text="Yes"
                            cancel-text="No"
                            @confirm="tableActions(item.id)"
                            @cancel="cancel"
                          >
                            <span class="action-btn">
                              <img :src="deleteIcon" alt="" />
                            </span>
                          </a-popconfirm>
                        </span>
                      </li>
                    </ul>
                  </drag>
                </template>
                <template v-slot:feedback="{ data }">
                  <div class="item feedback" :key="data">{{ data }}</div>
                </template>
              </drop-list>
            </div>
          </div>
        </div>
      </div>
    </a-spin>
    <a-modal v-model="visible" title="Редактировать" :closable="false" @ok="handleOk">
      <el-form
        label-position="top"
        :model="ruleForm"
        :rules="rules"
        ref="ruleFormShowCase"
        label-width="120px"
        class="demo-ruleForm"
        action=""
      >
        <div class="modal_tab mb-4">
          <span
            v-for="(item, index) in modalTabData"
            :key="index"
            @click="modalTab = item.index"
            :class="{ 'avtive-modalTab': modalTab == item.index }"
          >
            {{ item.label }}
          </span>
        </div>
        <div
          v-for="(item, index) in modalTabData"
          :key="index"
          v-if="modalTab == item.index"
        >
          <div class="form-block required">
            <div>
              <label for="">Заголовок </label>
            </div>
            <el-form-item prop="name.ru">
              <el-input
                type="text"
                v-model="ruleForm.name[item.index]"
                placeholder="Зоговолок..."
              ></el-input>
            </el-form-item>
          </div>
          <div class="form-block w-100">
            <div>
              <label for="">Продукт </label>
            </div>
            <el-form-item class="w-100">
              <a-select
                mode="multiple"
                label-in-value
                :value="value"
                placeholder="Продукты"
                style="width: 100%"
                :filter-option="false"
                :not-found-content="fetching ? undefined : null"
                @search="fetchUser"
                @change="handleChange"
              >
                <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                <a-select-option v-for="d in options" :key="d.id">
                  {{ d.name?.ru }}
                </a-select-option>
              </a-select>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <template slot="footer">
        <div class="add_modal-footer d-flex justify-content-end">
          <div
            class="add-btn add-header-btn add-header-btn-padding btn-light-primary mx-3"
            @click="handleOk"
          >
            Отмена
          </div>
          <a-button
            class="add-btn add-header-btn btn-primary"
            @click="getData"
            type="primary"
          >
            <span class="svg-icon" v-html="addIcon"></span>
            Сохранить
          </a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script>
import AddBtn from "../../../components/form/Add-btn.vue";
import SearchInput from "../../../components/form/Search-input.vue";
import TitleBlock from "../../../components/Title-block.vue";
import { Drag, DropList } from "vue-easy-dnd";
import FormTitle from "../../../components/Form-title.vue";
import status from "@/mixins/status";
import authAccess from "@/mixins/authAccess";
import global from "../../../mixins/global";
import debounce from "lodash/debounce";
export default {
  layout: "toolbar",
  mixins: [status, global, authAccess],
  data() {
    this.lastFetchId = 0;
    this.fetchUser = debounce(this.fetchUser, 800);
    return {
      value: [],
      fetching: false,
      delayTime: 0,
      spinning: false,
      caseId: this.$route.params.index,
      visible: false,
      pageSize: 10,
      deleteIcon: require("../../../assets/svg/components/delete-icon.svg"),
      tableDrag: require("../../../assets/svg/components/table-drag.svg?raw"),
      addIcon: require("../../../assets/svg/components/add-icon.svg?raw"),
      products: [],
      showcase: {},
      ruleForm: {
        name: {
          ru: "",
          en: "",
          uz: "",
        },
        products: [
          {
            id: 1,
            position: 5,
          },
          {
            id: 2,
            position: 3,
          },
        ],
      },
      modalTab: "ru",
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
      modalTabData: [
        {
          index: "uz",
          label: "Uzbek",
        },
        {
          index: "ru",
          label: "Русский",
        },
      ],
      options: [],
      newProduct: {},
      loading: false,
    };
  },
  mounted() {
    this.__GET_SHOWCASES(this.caseId);
  },

  methods: {
    async handleDragEnd(event) {
      await this.products.forEach((item, index) => {
        item.pivot.position = index + 1;
      });
      this.ruleForm.products = await this.products.map((item) => {
        return {
          id: item.pivot.product_id,
          position: item.pivot.position,
        };
      });
      this.__EDIT_SHOWCASES(this.ruleForm);
    },
    getData() {
      this.ruleForm.products = this.value.map((item, index) => {
        return {
          id: item.key,
          position: index + 1,
          name: item?.name,
        };
      });
      this.$refs.ruleFormShowCase.validate((valid) => {
        valid ? this.__EDIT_SHOWCASES(this.ruleForm) : false;
      });
    },
    handleOk(e) {
      this.visible = false;
    },
    async __GET_SHOWCASES(id) {
      try {
        this.spinning = true;
        const data = await this.$store.dispatch("fetchShowCases/getShowCasesById", id);
        this.showcase = { ...data?.showcase };
        this.ruleForm.name = { ...data?.showcase?.name };
        this.products = data?.showcase?.products;
        this.ruleForm.products = this.products.map((item) => {
          return {
            id: item.pivot.product_id,
            position: item.pivot.position,
          };
        });
        this.value = this.products.map((item) => {
          return {
            key: item.pivot.product_id,
            label: item.name.ru,
          };
        });
        this.spinning = false;
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
    async __EDIT_SHOWCASES(dataForm) {
      try {
        const data = await this.$store.dispatch("fetchShowCases/editShowCases", {
          id: this.caseId,
          data: dataForm,
        });
        await this.$store.dispatch(
          "getShowCasesStore",
          !this.$store.state.changeShowcases
        );
        this.__GET_SHOWCASES(this.caseId);

        this.visible = false;
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
    async tableActions(id) {
      this.ruleForm.products = await this.ruleForm.products.filter(
        (item) => item.id != id
      );
      this.__EDIT_SHOWCASES(this.ruleForm);
    },
    onInsert(event) {
      this.products.splice(event.index, 0, event.data);
    },
    async fetchUser(value) {
      this.lastFetchId += 1;
      const fetchId = this.lastFetchId;
      this.options = [];
      if (value.length > 2) {
        this.fetching = true;
        const data = await this.$store.dispatch("fetchProducts/getPShowcaseSearch", {
          search: value,
        });
        this.options = data?.products?.data;
        this.fetching = false;
      }
    },
    handleChange(value) {
      Object.assign(this, {
        value,
        options: [],
        fetching: false,
      });
    },
  },
  watch: {
    newProduct(val) {
    },
    visible(val) {
      if (!val) {
        Object.assign(this, {
          newProduct: {},
          options: [],
        });
      }
    },
  },
  components: { TitleBlock, SearchInput, AddBtn, Drag, DropList, FormTitle },
};
</script>
<style lang="scss">
.show-cases-header li {
  border-bottom: 1px dashed #f4f4f4 !important;
  height: 52px !important;
}
.table-drag {
  cursor: pointer;
}
.drag-img {
  margin-right: 20px;
}
</style>
