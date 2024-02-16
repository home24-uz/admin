<template lang="html">
  <div>
    <TitleBlock
      title="Характеристика"
      :breadbrumb="['Каталог']"
      lastLink="Характеристика"
    >
      <div
        class="add-btn add-header-btn add-header-btn-padding btn-primary"
        @click="$router.push('/catalog/add_characteristic')"
      >
        <span class="svg-icon" v-html="addIcon"></span>
        Добавить характеристику
      </div>
    </TitleBlock>
    <div class="container_xl app-container">
      <div class="card_block py-5">
        <div class="d-flex justify-content-between align-items-center card_header">
          <div class="d-flex align-items-between justify-content-between w-100">
            <SearchInput placeholder="Характеристики поиска" />
            <div class="d-flex align-items-center"></div>
          </div>
        </div>
        <div class="antd_table product_table">
          <a-table
            :columns="columns"
            :data-source="atributes"
            :pagination="pagination"
            align="center"
            :loading="loading"
            @change="handleTableChange"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
              columnWidth: '40px',
              align: 'right',
            }"
          >
            <a slot="name" slot-scope="text">
              <h6>{{ text?.ru }}</h6>
              <span>{{ text.subtitle }}</span>
            </a>
            <div slot="options" slot-scope="text" align="center" class="option-container">
              <!-- <span v-for="item in text" class="option-items">{{ item }}</span> -->
              <span class="option-items" v-for="(item,index) in text" :key="index">{{
                item?.name?.ru ? item?.name?.ru : "-----"
              }}</span>
            </div>
            <span slot="customTitle"></span>

            <span slot="id" slot-scope="text">
              <span
                class="action-btn"
                @click="$router.push(`/catalog/edit_characteristic/${text}`)"
              >
                <img :src="editIcon" alt="" />
              </span>

              <a-popconfirm
                title="Are you sure delete this characteristic?"
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
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SearchInput from "../../components/form/Search-input.vue";
import TitleBlock from "../../components/Title-block.vue";
import Title from "../../components/Title.vue";
import global from "../../mixins/global";
export default {
  layout: "toolbar",
  data() {
    return {
      params: {
        page: 1,
      },
      pagination: {
        pageSize: 16,
      },
      loading: true,
      editIcon: require("../../assets/svg/components/edit-icon.svg"),
      deleteIcon: require("../../assets/svg/components/delete-icon.svg"),
      addIcon: require("../../assets/svg/components/add-icon.svg?raw"),

      selectedRowKeys: [], // Check here to configure the default column
      atributes: [],
      columns: [
        {
          title: "характеристики",
          dataIndex: "name",
          key: "name",
          slots: { title: "customTitle" },
          scopedSlots: { customRender: "name" },
          className: "column-name",
          width: "30%",
        },
        {
          title: "ПАРАМЕТРЫ",
          dataIndex: "options",
          scopedSlots: { customRender: "options" },
          className: "column-options",
          key: "options",
        },

        {
          title: "ДЕЙСТВИЯ",
          key: "id",
          dataIndex: "id",
          scopedSlots: { customRender: "id" },
          className: "column-btns",
          width: "100px",
          align: "right",
        },
      ],
      data: [],
    };
  },
  async mounted() {
    this.getFirstData("/catalog/characteristic", "__GET_CHARACTERISTIC");
  },
  methods: {
    async handleTableChange(pagination, filters, sorter) {
      this.params.page = pagination.current;
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      if (this.$route.query.page != pagination.current) {
        await this.$router.replace({
          path: `/catalog/characteristic`,
          query: {
            page: pagination.current,
          },
        });
      }
      this.loading = true;
      this.__GET_CHARACTERISTIC();
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    deleteAtribut(id) {
      this.__DELETE_CHARACTERISTIC(id);
    },
    cancel(e) {
      // this.$message.error("Click on No");
    },
    async __DELETE_CHARACTERISTIC(id) {
      try {
        await this.$store.dispatch("fetchCharacters/deleteCharacteristics", id);
        await this.$notify({
          title: "Success",
          message: "Характеристика был успешно удален",
          type: "success",
        });
        this.__GET_CHARACTERISTIC();
      } catch (e) {
        this.statusFunc(e.response);
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
    async __GET_CHARACTERISTIC() {
      const data = await this.$store.dispatch("fetchCharacters/getCharacteristics", {
        ...this.$route.query,
      });
      this.loading = false;
      const pagination = { ...this.pagination };
      this.pagination = pagination;
      pagination.total = data.characteristics?.total;
      this.atributes = data.characteristics?.data;
    },
  },
  watch: {
    "pagination.current"() {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    },
  },
  components: { Title, TitleBlock, SearchInput },
};
</script>
<style lang=""></style>
