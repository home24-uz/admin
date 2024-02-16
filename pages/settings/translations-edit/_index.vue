<template>
  <div class="">
    <TitleBlock title="Переводы" :breadbrumb="['Настройки сайта']" lastLink="Переводы">
      <div class="d-flex">
        <div
          class="add-btn add-header-btn add-header-btn-padding btn-light-primary mx-3"
          @click="$router.push(`/settings/translations-group/${$route.params.index}`)"
        >
          Отмена
        </div>
        <a-button
          v-if="checkAccess('translations', 'PUT')"
          class="add-btn add-header-btn btn-primary d-flex align-items-center"
          type="primary"
          @click="saveTranslations"
        >
          Сохранять
        </a-button>
      </div>
    </TitleBlock>
    <div class="container_xl app-container pb-5 pt-5">
      <div class="card_block main-table px-4 pb-4">
        <div class="d-flex justify-content-between align-items-center card_header">
          <div class="prodduct-list-header-grid w-100 align-items-center">
            <SearchInput
              placeholder="Поиск"
              @changeSearch="
                ($event) =>
                  changeSearch(
                    $event,
                    `/settings/translations-edit/${$route.params.index}`,
                    '__GET_TRANSLATIONS'
                  )
              "
            />
            <div></div>
            <a-button
              @click="
                clearQuery(
                  `/settings/translations-edit/${$route.params.index}`,
                  '__GET_TRANSLATIONS'
                )
              "
              type="primary"
              class="d-flex align-items-center justify-content-center"
              style="height: 38px"
              ><a-icon type="reload"
            /></a-button>
          </div>
        </div>
        <a-table
          :columns="columns"
          :pagination="false"
          :data-source="form"
          :loading="loading"
        >
          <span slot="indexId" slot-scope="text">#{{ text }}</span>
          <span slot="keyIndex" slot-scope="text">
            <div class="ant-input">
              <span>{{ groupKey }}.</span>
              <a-input v-model="text.keyIndex" placeholder="ключ..."></a-input>
            </div>
          </span>

          <span slot="valRu" slot-scope="text">
            <a-input v-model="text.val.ru" placeholder="ru..."></a-input>
          </span>
          <span slot="valEn" slot-scope="text">
            <a-input v-model="text.val.en" placeholder="en..."></a-input>
          </span>
          <span slot="valUz" slot-scope="text">
            <a-input v-model="text.val.uz" placeholder="uz..."></a-input>
          </span>

          <span slot="id" slot-scope="text">
            <a-popconfirm
              v-if="checkAccess('translations', 'DELETE')"
              title="Are you sure delete this row?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="deleteAction(text)"
            >
              <span class="action-btn" v-html="deleteIcon"> </span>
            </a-popconfirm>
          </span>
        </a-table>
        <div class="create-inner-variant" @click="addTranslate">Добавить</div>
        <div class="d-flex justify-content-between mt-4">
          <a-select
            v-model="params.pageSize"
            class="table-page-size"
            style="width: 120px"
            @change="
              ($event) =>
                changePageSizeGlobal(
                  $event,
                  `/translations-edit/${$route.params.index}`,
                  '__GET_TRANSLATIONS'
                )
            "
          >
            <a-select-option
              v-for="item in pageSizes"
              :key="item?.value"
              :label="item.label"
              :value="item.value"
              >{{ item.label }}
            </a-select-option>
          </a-select>
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
</template>

<script>
import SearchInput from "../../../components/form/Search-input.vue";
import TitleBlock from "../../../components/Title-block.vue";
import status from "@/mixins/status";
import global from "../../../mixins/global";
import authAccess from "../../../mixins/authAccess";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
const columns = [
  {
    title: "№",
    key: "indexId",
    dataIndex: "indexId",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "indexId" },
    className: "column-service",
    align: "left",
    width: 50,
  },
  {
    title: "КЛЮЧ",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "keyIndex" },
    className: "column-name",
    width: "20%",
  },
  {
    title: "ЗНАЧЕНИЕ(RU)",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "valRu" },
    className: "column-name",
    align: "left",
    width: "30%",
  },
  {
    title: "ЗНАЧЕНИЕ(EN)",

    slots: { title: "customTitle" },
    scopedSlots: { customRender: "valEn" },
    className: "column-name",
  },
  {
    title: "ЗНАЧЕНИЕ(UZ)",

    slots: { title: "customTitle" },
    scopedSlots: { customRender: "valUz" },
    className: "column-name",
  },
  {
    title: "ДЕЙСТВИЯ",
    className: "column-btns",
    align: "right",
    scopedSlots: { customRender: "id" },
    width: 100,
  },
];

export default {
  name: "IndexPage",
  mixins: [status, global, authAccess],
  layout: "toolbar",
  head: {
    title: "Переводы",
  },
  data() {
    return {
      groupKey: "",
      editIcon: require("../../../assets/svg/components/edit-icon.svg?raw"),
      deleteIcon: require("../../../assets/svg/components/delete-icon.svg?raw"),
      addIcon: require("../../../assets/svg/components/add-icon.svg?raw?raw"),
      loading: false,
      search: "",
      columns,
      rules: {
        sub_text: [
          { required: true, message: "This field is required", trigger: "change" },
        ],
        title: {
          ru: [{ required: true, message: "This field is required", trigger: "change" }],
        },
      },
      form: [],
      formTranlate: {
        translate_group_id: 1,
        translates: {
          id: 0,
          key: "",
          val: {
            ru: "",
            uz: "",
            en: "",
          },
        },
      },
    };
  },
  async mounted() {
    this.getFirstData(
      `/settings/translations-edit/${this.$route.params.index}`,
      "__GET_TRANSLATIONS"
    );
  },
  methods: {
    changeSearch(val) {
      this.search = val.target.value;
    },
    postGroup() {
      this.$refs["ruleFormFaq"].validate((valid) => {
        if (valid) {
          this.__POST_TRANSLATIONS(this.form);
        } else {
          return false;
        }
      });
    },
    deleteAction(obj) {
      if (obj.id == 0) {
        if (this.form.length > 1)
          this.form = this.form.filter((item) => item.indexId != obj.indexId);
      } else {
        this.__DELETE_GLOBAL(
          obj.id,
          "fetchTranslations/deleteTranslations",
          "Услуга был успешно удален",
          "__GET_TRANSLATIONS"
        );
      }
    },

    addTranslate() {
      this.form.push({
        keyIndex: "",
        indexId: this.form.length > 0 ? Math.max(...this.form.map((o) => o.key)) + 1 : 1,
        key: this.form.length > 0 ? Math.max(...this.form.map((o) => o.key)) + 1 : 1,
        val: {
          ru: "",
          uz: "",
          en: "",
        },
        id: 0,
      });
    },
    async __GET_TRANSLATIONS() {
      this.loading = true;
      const data = await this.$store.dispatch("fetchTranslations/getTranslateGruop", {
        ...this.$route.query,
      });
      this.loading = false;
      const pageIndex = this.indexPage(
        data?.groups?.current_page,
        data?.groups?.per_page
      );
      const translate = data?.groups?.data.find(
        (item) => item.id == this.$route.params.index
      );
      this.groupKey = translate.sub_text;
      this.form = translate.translates.map((item, index) => {
        return {
          indexId: index + pageIndex,
          keyIndex: item.key,
          key: index + pageIndex,
          val: item.val,
          id: item.id,
        };
      });
      this.totalPage = data?.groups?.total;
    },

    indexPage(current_page, per_page) {
      return (current_page * 1 - 1) * per_page + 1;
    },
    saveTranslations() {
      const data = {
        translate_group_id: this.$route.params.index,
        translates: this.form.map((item) => {
          return {
            id: item.id,
            key: item.keyIndex,
            val: item.val,
          };
        }),
      };
      this.__POST_TRANSLATIONS(data);
    },
    async __POST_TRANSLATIONS(data) {
      try {
        await this.$store.dispatch("fetchTranslations/postUpdateTranslations", data);
        this.notification("success", "success", "Успешно добавлен");
        this.$router.push(`/settings/translations-group/${this.$route.params.index}`);
      } catch (e) {
        this.statusFunc(e);
      }
    },
  },
  watch: {
    async current(val) {
      this.changePagination(
        val,
        `/translations-edit/${$route.params.index}`,
        "__GET_TRANSLATIONS"
      );
    },
  },
  components: { TitleBlock, SearchInput },
};
</script>
<style lang="css">
.card_header {
  padding: 16.25px 0;
}
.ant-input input {
  border: 1px solid transparent !important;
  padding-left: 0;
  height: 30px;
}
.ant-input input:focus {
  box-shadow: none;
}
.ant-input {
  display: flex;
  align-items: center;
}
.ant-input span {
  white-space: nowrap;
  color: rgba(0, 0, 0, 0.4);
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: -2px;
}
</style>
