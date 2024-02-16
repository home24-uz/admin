<template lang="html">
  <div>
    <TitleBlock title="Продукты" :breadbrumb="['Каталог']" lastLink="Продукты">
      <div class="d-flex">
        <div
          class="add-btn add-header-btn add-header-btn-padding btn-primary"
          @click="$router.push('/catalog/add_products')"
        >
          <span class="svg-icon" v-html="addIcon"></span>
          Добавить продукт
        </div>
      </div>
    </TitleBlock>
    <div class="container_xl app-container">
      <div class="card_block py-5">
        <div class="d-flex justify-content-between align-items-center card_header">
          <div class="prodduct-filter-grid w-100 align-items-center">
            <SearchInput
              placeholder="Поиск продукта"
              @changeSearch="
                ($event) => changeSearch($event, '/catalog/products', '__GET_PRODUCTS')
              "
            />
            <a-select
              class="search-categories"
              show-search
              placeholder="Фильтр по категориям"
              style="width: 100%"
              :default-active-first-option="false"
              :show-arrow="false"
              :filter-option="false"
              :not-found-content="fetching ? undefined : null"
              @search="handleSearch"
              :default-value="val"
              @change="($event) => handleChange($event)"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small" />

              <a-select-opt-group label="Категории" v-if="categories.length > 0">
                <a-select-option v-for="d in categories" :value="d.id" :key="d.id">
                  <span v-if="d?.parent?.parent?.name?.ru">
                    {{ `${d?.parent?.parent && d?.parent?.parent?.name?.ru}/` }}
                  </span>
                  <span v-if="d?.parent && d?.parent?.name?.ru">
                    {{ `${d?.parent && d?.parent?.name?.ru}/` }}
                  </span>
                  <span style="color: #3699ff">{{ d?.name?.ru }}</span>
                </a-select-option>
              </a-select-opt-group>
            </a-select>
            <div class="input status-select w-100">
              <StatusFilter
                @changeStatus="($event) => changeStatus($event, 'stock')"
                propName="stock"
                :propOptions="optionsInStock"
                propPlaceholder="В наличии"
              />
            </div>
            <StatusFilter
              @changeStatus="($event) => changeStatus($event, 'status')"
              propName="status"
              :propOptions="optionsStatus"
            />
            <a-button
              @click="clearQuery('/catalog/products', '__GET_PRODUCTS')"
              type="primary"
              class="d-flex align-items-center justify-content-center"
              style="height: 38px"
              ><a-icon type="reload"
            /></a-button>
          </div>
        </div>
        <a-table
          :columns="columnProduct"
          :data-source="data"
          :loading="loading"
          :pagination="false"
          :page-size="params.pageSize"
          align="center"
        >
          <!-- <span slot="key" slot-scope="text">#{{ text }}</span> -->
          <span slot="indexId" slot-scope="text">#{{ text }}</span>
          <span slot="img" slot-scope="text">
            <img v-if="text" class="table-image" :src="text" alt="text" />
            <img
              v-else
              class="table-image"
              src="../../assets/images/photo_2023-03-04_13-28-58.jpg"
              alt="text"
            />
            <!-- <img v-if="text != null" class="table-image" :src="text" /> -->
            <!-- <img
              v-else
              class="table-image"
              src="../../assets/images/photo_2023-03-04_13-28-58.jpg"
            /> -->
          </span>
          <div slot="name" slot-scope="text">
            <h6>{{ text?.name?.ru }}</h6>
            <span
              >{{
                text?.category?.parent?.parent &&
                text?.category?.parent?.parent?.name?.ru + "/"
              }}{{
                text?.category?.parent?.name && text?.category?.parent?.name?.ru + "/"
              }}
              {{ text?.category?.name && text?.category?.name?.ru }}</span
            >
          </div>
          <h4 slot="model" slot-scope="text">{{ text ? text : "------" }}</h4>
          <span slot="qty" slot-scope="text">{{ text }}</span>
          <a slot="price" slot-scope="text">{{
            text ? `${`${text}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")} so'm` : "------"
          }}</a>
          <span slot="customTitle"></span>

          <span
            slot="is_active"
            slot-scope="text"
            class="tags-style"
            :class="{
              tag_new: text == 1,
              tag_canceled: text == 0,
            }"
          >
            {{ text ? "Активный " : "Неактивный" }}
          </span>

          <span slot="id" slot-scope="text">
            <span
              v-if="checkAccess('products', 'PUT')"
              class="action-btn"
              @click="$router.push(`/catalog/edit_products/${text}`)"
              v-html="editIcon"
            >
            </span>
            <a-popconfirm
              v-if="checkAccess('products', 'DELETE')"
              title="Are you sure delete this product?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="deletePoduct(text)"
              @cancel="cancel"
            >
              <span class="action-btn" v-html="deleteIcon"> </span>
            </a-popconfirm>
          </span>
        </a-table>
        <div class="d-flex justify-content-end mt-4" v-if="totalPage > params.pageSize">
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
import SearchInput from "../../components/form/Search-input.vue";
import StatusFilter from "../../components/form/Status-filter.vue";
import TitleBlock from "../../components/Title-block.vue";
import global from "../../mixins/global";
import columns from "../../mixins/columns";
import status from "@/mixins/status";
import authAccess from "@/mixins/authAccess";
export default {
  mixins: [global, status, columns, authAccess],
  data() {
    return {
      val: undefined,
      allowClear: false,
      optionsInStock: [
        {
          value: "yes",
          label: "Есть в наличии",
        },
        {
          value: "no",
          label: "Нет в наличии",
        },
      ],
      optionsStatus: [
        {
          value: 0,
          label: "All",
        },
        {
          value: "active",
          label: "Активный",
        },
        {
          value: "inactive",
          label: "Неактивный",
        },
      ],
      brandSelect: [
        {
          value: 2,
          label: "Samsung",
        },
        {
          value: 3,
          label: "Apple",
        },
        {
          value: 0,
          label: "HP",
        },
      ],

      brandSearch: "",
      status: "",
      loading: true,
      editIcon: require("../../assets/svg/components/edit-icon.svg?raw"),
      deleteIcon: require("../../assets/svg/components/delete-icon.svg?raw"),
      addIcon: require("../../assets/svg/components/add-icon.svg?raw"),
      tableData: [],
      selectedRowKeys: [], // Check here to configure the default column
      products: [],
      data: [],
      searchProduct: "",
      fetching: false,
      categories: [],
    };
  },
  computed: {
    filterCategory() {
      return this.$route.query?.category;
    },
  },
  methods: {
    async handleSearch(value) {
      this.fetching = true;
      if (value.length > 2) {
        const categoriesData = await this.$store.dispatch(
          "fetchTopBars/getTopBarsSearch",
          {
            search: value,
          }
        );
        this.categories = categoriesData?.categories.map((item) => {
          return { ...item, id: `${item.id}` };
        });
        this.fetching = false;
      }
    },
    handleChange(value) {
      this.changeStatus(value, "category");
    },
    async __GET_PRODUCTS() {
      this.loading = true;
      this.products = await this.$store.dispatch("fetchProducts/getProducts", {
        ...this.$route.query,
      });
      this.totalPage = this.products.products?.total;
      this.loading = false;
      const pageIndex = this.indexPage(
        this.products.products?.current_page,
        this.products.products?.per_page
      );
      this.data = this.products.products.data.map((item, index) => {
        const DEFAULT_PRODUCT = item.products.filter(
          (elem) => elem.id == item.default_product_id
        )[0];
        if (DEFAULT_PRODUCT?.images.length > 0) {
          return {
            ...item,
            key: item.id,
            indexId: pageIndex + index,
            price: item.price,
            model: item.model,
            name: {
              name: item.name,
              category: item.category,
            },
            img: DEFAULT_PRODUCT.images[0].sm_img,
            status: item.status,
          };
        } else {
          return {
            ...item,
            name: {
              name: item.name,
              category: item.category,
            },
            key: item.id,
            price: item.price,
            model: item.model,
            img: null,
            status: item.status,
          };
        }
      });
      console.log(this.data);
    },
    indexPage(current_page, per_page) {
      return (current_page * 1 - 1) * per_page + 1;
    },
    deletePoduct(id) {
      this.__DELETE_GLOBAL(
        id,
        "fetchProducts/deleteProducts",
        "Продукт был успешно удален",
        "__GET_PRODUCTS"
      );
    },
    async changeStatus(val, tag) {
      this.status = val;
      let obj = { ...this.$route.query, [tag]: val };
      if (val) {
        await this.$router.replace({
          path: this.$route.path,
          query: { ...obj },
        });
      } else {
        let query = { ...this.$route.query };
        delete query[tag];
        await this.$router.replace({
          path: this.$route.path,
          query: { ...query },
        });
      }
      this.__GET_PRODUCTS();
    },
  },
  async mounted() {
    this.getFirstData("/catalog/products", "__GET_PRODUCTS");
  },
  watch: {
    async current(val) {
      this.changePagination(val, "/catalog/products", "__GET_PRODUCTS");
    },
    filterCategory() {
      this.allowClear = true;
      this.val = undefined;
    },
  },
  components: {
    SearchInput,
    TitleBlock,
    StatusFilter,
  },
  layout: "toolbar",
};
</script>
s
