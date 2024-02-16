<template lang="html">
  <div>
    <TitleBlock title="Атрибуты" :breadbrumb="['Каталог']" lastLink="Атрибуты">
      <div
        v-if="checkAccess('attributes', 'POST')"
        class="add-btn add-header-btn add-header-btn-padding btn-primary"
        @click="$router.push('/catalog/add_atributs')"
      >
        <span class="svg-icon" v-html="addIcon"></span>
        Добавить атрибуты
      </div>
    </TitleBlock>
    <div class="container_xl app-container">
      <div class="card_block py-5">
        <div class="d-flex justify-content-between align-items-center card_header">
          <div
            class="prodduct-list-header-grid w-100 align-items-center"
            style="grid-gap: 1.25rem"
          >
            <!-- <div> -->
            <SearchInput
              placeholder="Атрибуты поиска"
              @changeSearch="changeSearch($event, '/catalog/atributs', '__GET_ATRIBUTES')"
            />
            <!-- </div> -->
            <span></span>
            <span></span>
            <a-button
              @click="clearQuery('/catalog/atributs', '__GET_ATRIBUTES')"
              type="primary"
              class="d-flex align-items-center justify-content-center"
              style="height: 38px"
              ><a-icon type="reload"
            /></a-button>
          </div>
        </div>
        <div class="antd_table product_table">
          <a-table
            :columns="columnAtribut"
            :data-source="atributes"
            :pagination="false"
            :loading="loading"
          >
            <a slot="info" slot-scope="text">
              <h6>{{ text?.name.ru }}</h6>
              <span>{{ text.keywords }}</span>
            </a>
            <div slot="options" slot-scope="text" align="center" class="option-container">
              <span class="option-items" v-for="(item, index) in text" :key="index">{{
                item.name.ru ? item.name.ru : "-----"
              }}</span>
            </div>
            <div
              slot="categories"
              slot-scope="text"
              align="center"
              class="option-container cursor_pointer"
              :class="{ maxHeigth: activeOptions == text?.id }"
              @click="activeCat(text?.id)"
            >
              <span
                class="option-items"
                v-for="(item, index) in text?.categories"
                :key="index"
                >{{ item.name.ru ? item.name.ru : "-----" }}</span
              >
            </div>
            <span slot="customTitle"></span>
            <span slot="id" slot-scope="text">
              <span
                v-if="checkAccess('attributes', 'PUT')"
                class="action-btn"
                @click="$router.push(`/catalog/edit_atributs/${text}`)"
              >
                <img :src="editIcon" alt="" />
              </span>
              <a-popconfirm
                v-if="checkAccess('attributes', 'DELETE') && text != 1"
                title="Are you sure delete this atribut?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="deleteAtribut(text)"
                @cancel="cancel"
              >
                <span class="action-btn">
                  <img :src="deleteIcon" alt="" />
                </span>
              </a-popconfirm>
            </span>
          </a-table>
          <div class="d-flex justify-content-end mt-4">
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
  </div>
</template>
<script>
import AddBtn from "../../components/form/Add-btn.vue";
import HeaderBtn from "../../components/form/Header-btn.vue";
import TitleBlock from "../../components/Title-block.vue";
import Title from "../../components/Title.vue";
import SearchInput from "../../components/form/Search-input.vue";
import global from "../../mixins/global";
import status from "@/mixins/status";
import columns from "../../mixins/columns";
import authAccess from "@/mixins/authAccess";

export default {
  layout: "toolbar",
  mixins: [global, status, columns, authAccess],
  data() {
    return {
      activeOptions: null,
      loading: true,
      editIcon: require("../../assets/svg/components/edit-icon.svg"),
      deleteIcon: require("../../assets/svg/components/delete-icon.svg"),
      addIcon: require("../../assets/svg/components/add-icon.svg?raw"),
      selectedRowKeys: [],
      atributes: [],
      data: [],
    };
  },

  methods: {
    activeCat(id) {
      if (this.activeOptions != id) {
        this.activeOptions = id;
      } else {
        this.activeOptions = null;
      }
    },
    deleteAtribut(id) {
      this.__DELETE_GLOBAL(
        id,
        "fetchAtributes/deleteAtributes",
        "Атрибут был успешно удален",
        "__GET_ATRIBUTES"
      );
    },
    async __GET_ATRIBUTES() {
      try {
        this.loading = true;
        const data = await this.$store.dispatch("fetchAtributes/getAtributes", {
          ...this.$route.query,
        });
        this.loading = false;
        this.totalPage = data.attributes?.total;
        this.atributes = data.attributes?.data.map((item) => {
          return {
            ...item,
            key: item.id,
            info: {
              name: item.name,
              keywords: item.keywords,
            },
          };
        });
      } catch (e) {
        this.statusFunc(e);
      }
    },
  },
  async mounted() {
    this.getFirstData("/catalog/atributs", "__GET_ATRIBUTES");
  },
  watch: {
    async current(val) {
      this.changePagination(val, "/catalog/atributs", "__GET_ATRIBUTES");
    },
  },
  components: {
    AddBtn,
    Title,
    SearchInput,
    HeaderBtn,
    TitleBlock,
  },
};
// 246
</script>
<style lang="css">
.maxHeigth {
  max-height: 1000px !important;
}
</style>
