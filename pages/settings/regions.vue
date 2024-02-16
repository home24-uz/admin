<template lang="html">
  <div>
    <TitleBlock title="Регионы" :breadbrumb="['Контент сайта']" lastLink="Регионы">
      <div
        v-if="activeTab == 'regions' && checkAccess('regions', 'POST')"
        class="add-btn add-header-btn add-header-btn-padding btn-primary"
        @click="openRegionModal"
      >
        <span class="svg-icon" v-html="addIcon"></span>
        Добавить
      </div>
      <div
        v-if="activeTab != 'regions' && checkAccess('region-groups', 'POST')"
        class="add-btn add-header-btn add-header-btn-padding btn-primary"
        @click="openGroupModal"
      >
        <span class="svg-icon" v-html="addIcon"></span>
        Добавить
      </div>
    </TitleBlock>
    <div class="container_xl app-container mt-5">
      <el-tabs
        class="order_tabs"
        v-model="activeName"
        @tab-click="($event) => handleClickatab($event)"
      >
        <el-tab-pane label="Регионы" name="regions">
          <div class="card_block py-5">
            <div class="d-flex justify-content-between align-items-center card_header">
              <div
                class="prodduct-list-header-grid w-100 align-items-center"
                style="grid-gap: 1.25rem"
              >
                <!-- <div> -->
                <SearchInput
                  placeholder="Поиск"
                  @changeSearch="
                    changeSearch($event, '/settings/regions', '__GET_LOCATIONS')
                  "
                />
                <!-- </div> -->
                <span></span>
                <span></span>
                <a-button
                  @click="clearQuery('/settings/regions', '__GET_LOCATIONS')"
                  type="primary"
                  class="d-flex align-items-center justify-content-center"
                  style="height: 38px"
                  ><a-icon type="reload"
                /></a-button>
              </div>
            </div>
            <div class="antd_table product_table">
              <a-table
                :columns="columnRegions"
                :data-source="regions"
                :pagination="false"
                align="center"
                :loading="loading"
              >
                <span slot="name" slot-scope="text" align="center">
                  <h6>{{ text?.ru }}</h6>
                </span>
                <span slot="key" slot-scope="text">#{{ text }}</span>
                <span slot="group" slot-scope="text" align="center">
                  <h6>{{ text?.group ? text?.group?.name?.ru : "----" }}</h6>
                </span>
                <span slot="id" slot-scope="text">
                  <span
                    v-if="checkAccess('regions', 'PUT')"
                    class="action-btn"
                    @click="$router.push(`/settings/edit/${text}`)"
                  >
                    <img :src="editIcon" alt="" />
                  </span>
                  <a-popconfirm
                    v-if="checkAccess('regions', 'DELETE')"
                    title="Вы действительно хотите удалить?"
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="deletePost(text)"
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
        </el-tab-pane>
        <el-tab-pane label="Группы" name="groups">
          <div class="card_block py-5">
            <div class="d-flex pt-4 justify-content-between align-items-center">
              <FormTitle title="Группы" />
            </div>
            <div class="antd_table product_table">
              <a-table
                :columns="columns1"
                :data-source="groups"
                :pagination="false"
                align="center"
                :loading="loading"
              >
                <span slot="name" slot-scope="text" align="center">
                  <h6>{{ text?.ru }}</h6>
                </span>
                <div
                  slot="regions"
                  slot-scope="text"
                  align="center"
                  class="option-container cursor_pointer"
                  :class="{ maxHeigth: activeOptions == text?.id }"
                  @click="activeCat(text?.id)"
                >
                  <span
                    class="option-items"
                    v-for="(item, index) in text?.regions"
                    :key="index"
                    >{{ item.name.ru ? item.name.ru : "-----" }}</span
                  >
                </div>
                <span slot="key" slot-scope="text">#{{ text }}</span>
                <span
                  slot="is_active"
                  slot-scope="tags"
                  class="tags-style"
                  :class="{
                    tag_pending: tags == 'pending',
                    tag_accepted: tags == 'accepted',
                    tag_canceled: tags == 'canceled',
                    tag_done: tags == 'done',
                    tag_new: tags == 1,
                    tag_returned: tags == 0,
                  }"
                >
                  {{ tags ? "Active" : "Inactive" }}
                </span>
                <span slot="id" slot-scope="text">
                  <span
                    class="action-btn"
                    v-if="checkAccess('region-groups', 'PUT')"
                    @click="groupEdit(text)"
                  >
                    <img :src="editIcon" alt="" />
                  </span>

                  <a-popconfirm
                    v-if="checkAccess('region-groups', 'DELETE')"
                    title="Вы действительно хотите удалить?"
                    ok-text="Yes"
                    cancel-text="No"
                    @confirm="deleteGroup(text)"
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
        </el-tab-pane>
      </el-tabs>
    </div>
    <a-modal
      v-model="visible"
      :title="editId ? 'Изменения Область' : 'Добавить Область'"
      :closable="false"
      @ok="handleOk"
    >
      <div class="d-flex flex-column">
        <div class="form_tab mb-4 bottom_hr">
          <span
            style="border-right: 0"
            v-for="(item, index) in modalTabData"
            :key="index"
            @click="modalTab = item.index"
            :class="{ 'avtive-formTabModal': modalTab == item.index }"
          >
            {{ item.label }}
          </span>
        </div>
        <div
          class="flex-column d-flex"
          v-for="(item, index) in modalTabData"
          :key="index"
          v-if="modalTab == item.index"
        >
          <el-form
            label-position="top"
            :model="ruleForm"
            :rules="rules"
            ref="ruleFormRegion"
            label-width="120px"
            class="demo-ruleForm"
            action=""
          >
            <div>
              <div class="form-block required">
                <div>
                  <label for="">Область </label>
                </div>
                <el-form-item prop="name.ru">
                  <el-input
                    type="text"
                    placeholder="Область..."
                    v-model="ruleForm.name[item.index]"
                  ></el-input>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
      </div>
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
            :loading="loadingBtn"
          >
            <span v-if="!loadingBtn" class="svg-icon" v-html="addIcon"></span>
            Сохранить
          </a-button>
        </div>
      </template>
    </a-modal>
    <a-modal
      v-model="visibleGroup"
      title="Добавить"
      :closable="false"
      @ok="handleOkGroup"
    >
      <div class="d-flex flex-column">
        <div class="form_tab mb-4 bottom_hr">
          <span
            style="border-right: 0"
            v-for="(item, index) in modalTabData"
            :key="index"
            @click="modalTab = item.index"
            :class="{ 'avtive-formTabModal': modalTab == item.index }"
          >
            {{ item.label }}
          </span>
        </div>
        <div
          class="flex-column d-flex"
          v-for="(item, index) in modalTabData"
          :key="index"
          v-if="modalTab == item.index"
        >
          <el-form
            label-position="top"
            :model="ruleFormGroup"
            :rules="rules"
            ref="ruleFormRegion"
            label-width="120px"
            class="demo-ruleForm"
            action=""
          >
            <div>
              <el-form-item
                class="form-block required align-items-start"
                prop="name.ru"
                label="Группа"
              >
                <el-input
                  type="text"
                  placeholder="Группа..."
                  v-model="ruleFormGroup.name[item.index]"
                ></el-input>
              </el-form-item>
              <el-form-item
                class="form-block required align-items-start"
                prop="name.ru"
                label="Статус"
              >
                <a-select
                  placeholder="Inserted are removed"
                  v-model="ruleFormGroup.is_active"
                  style="width: 100%"
                >
                  <a-select-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </el-form-item>
              <el-form-item
                class="form-block required align-items-start"
                prop="price"
                label="Цена"
              >
                <el-input
                  type="text"
                  placeholder="Цена..."
                  v-model="ruleFormGroup.delivery_price"
                ></el-input>
              </el-form-item>
              <el-form-item
                class="w-100 form-block required align-items-start"
                label="Регионы"
              >
                <a-select
                  mode="multiple"
                  label-in-value
                  :value="value"
                  placeholder="Регионы..."
                  style="width: 100%"
                  :filter-option="false"
                  :not-found-content="fetching ? undefined : null"
                  @search="fetchUser"
                  @change="handleChangeSearch"
                >
                  <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                  <a-select-option v-for="d in regions" :key="d.id">
                    {{ d.name.ru }}
                  </a-select-option>
                </a-select>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
      <template slot="footer">
        <div class="add_modal-footer d-flex justify-content-end">
          <div
            class="add-btn add-header-btn add-header-btn-padding btn-light-primary mx-3"
            @click="handleOkGroup"
          >
            Отмена
          </div>
          <a-button
            class="add-btn add-header-btn btn-primary"
            @click="sendGroup"
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
import AddBtn from "../../components/form/Add-btn.vue";
import SearchInput from "../../components/form/Search-input.vue";
import Title from "../../components/Title.vue";
import TitleBlock from "../../components/Title-block.vue";
import FormTitle from "../../components/Form-title.vue";
import global from "../../mixins/global";
import status from "@/mixins/status";
import columns from "../../mixins/columns";
import authAccess from "@/mixins/authAccess";

const OPTIONS = ["Apples", "Nails", "Bananas", "Helicopters"];
const columns1 = [
  {
    title: "Название",
    dataIndex: "name",
    scopedSlots: { customRender: "name" },
    className: "column-name",
  },
  {
    title: "Регионы",
    // dataIndex: "categories",
    scopedSlots: { customRender: "regions" },
    className: "column-options",
    key: "regions",
  },
  {
    title: "Статус",
    key: "is_active",
    dataIndex: "is_active",
    scopedSlots: { customRender: "is_active" },
    className: "column-tags",
    filters: [
      { text: "Активный", value: "active" },
      { text: "Неактивный", value: "inactive" },
    ],
    onFilter: (value, record) => record.status.indexOf(value) === 0,
  },
  {
    title: "действия",
    dataIndex: "id",
    scopedSlots: { customRender: "id" },
    className: "column-btns",
    width: "100px",
  },
];
const data = [];
for (let i = 0; i < 10; i++) {
  data.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    regions: ["Apples"],
    status: "active",
  });
}
export default {
  // middleware: "auth",
  mixins: [global, status, columns, authAccess],
  data() {
    this.cacheData = data.map((item) => ({ ...item }));
    return {
      fetching: false,
      value: [],
      activeTab: "regions",
      statusOptions: [
        {
          value: 1,
          label: "Активный",
        },
        {
          value: 0,
          label: "Неактивный",
        },
      ],
      activeLang: "Русский",
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
      visible: false,
      visibleGroup: false,
      options: OPTIONS,
      selectedItems: [],
      groups: [],
      modalTab: "ru",
      activeName: "regions",
      data,
      columns1,
      editingKey: "",
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
      editIcon: require("../../assets/svg/components/edit-icon.svg"),
      deleteIcon: require("../../assets/svg/components/delete-icon.svg"),
      addIcon: require("../../assets/svg/components/add-icon.svg?raw"),
      loading: true,
      loadingBtn: false,
      groupForm: {
        name: {
          ru: "",
          uz: "",
          en: "",
        },
        is_active: 1,
        regions: [],
      },
      regions: [],
      ruleFormGroup: {
        name: {
          ru: "",
          uz: "",
          en: "",
        },
        delivery_price: "",
        regions: [],
        is_active: 1,
      },
      ruleForm: {
        name: {
          ru: "",
          uz: "",
          en: "",
        },
      },
      editId: "",
      regions: [],
      formData: {},
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
    };
  },
  methods: {
    sendGroup() {
      this.ruleFormGroup.regions = this.value.map((item) => item.key);
      this.groupId ? this.__EDIT_GROUP() : this.__POST_GROUP(this.ruleFormGroup);
    },
    groupEdit(id) {
      this.groupId = id;
      // this.ruleFormGroup;
      this.__GET_REGION_GROUPS_BY_ID(id);
    },
    handleChange(value, key, column) {
      const newData = [...this.data];
      const target = newData.find((item) => key === item.key);
      if (target) {
        target[column] = value;
        this.data = newData;
      }
    },
    async fetchUser(value) {
      this.options = [];
      if (value.length > 2) {
        this.fetching = true;
        const data = await this.$store.dispatch("fetchRegions/getRegions", {
          search: value,
        });
        this.regions = data?.regions?.data;
        this.fetching = false;
      }
    },
    handleChangeSearch(value) {
      Object.assign(this, {
        value,
        options: [],
        fetching: false,
      });
    },
    handleClick(tab, event) {
      this.formVal = "";
    },
    handleChange1(selectedItems) {
      const target = this.data.find((item) => item.key == this.editingKey);
      target.regions = [...selectedItems];
    },
    edit(key) {
      const newData = [...this.data];
      const target = newData.find((item) => key === item.key);
      this.editingKey = key;
      if (target) {
        target.editable = true;
        this.data = newData;
      }
    },
    save(key) {
      const newData = [...this.data];
      const newCacheData = [...this.cacheData];
      const target = newData.find((item) => key === item.key);
      const targetCache = newCacheData.find((item) => key === item.key);
      if (target && targetCache) {
        delete target.editable;
        this.data = newData;
        Object.assign(targetCache, target);
        this.cacheData = newCacheData;
      }
      this.editingKey = "";
    },
    cancel(key) {
      const newData = [...this.data];
      const target = newData.find((item) => key === item.key);
      this.editingKey = "";
      if (target) {
        Object.assign(
          target,
          this.cacheData.find((item) => key === item.key)
        );
        delete target.editable;
        this.data = newData;
      }
    },
    handleClickatab(e) {
      this.activeTab = e.name;
    },
    showModal() {
      this.visible = true;
    },
    handleOk(e) {
      this.visible = false;
    },
    handleOkGroup(e) {
      this.visibleGroup = false;
    },
    getData() {
      this.$refs["ruleFormRegion"][0].validate((valid) => {
        if (valid) {
          this.__POST_BRANDS(this.ruleForm);
        } else {
          return false;
        }
      });
    },
    openRegionModal() {
      this.visible = true;
    },
    openGroupModal() {
      this.visibleGroup = true;
    },
    deleteGroup(id) {
      this.__DELETE_GLOBAL(
        id,
        "fetchRegions/deleteRegionsGroup",
        "Успешно удален",
        "__GET_REGION_GROUPS"
      );
    },
    deletePost(id) {
      this.__DELETE_GLOBAL(
        id,
        "fetchRegions/deleteRegions",
        "Успешно удален",
        "__GET_LOCATIONS"
      );
    },

    async __GET_LOCATIONS() {
      this.loading = true;
      const data = await this.$store.dispatch("fetchRegions/getRegions", {
        ...this.$route.query,
      });
      this.regions = data.regions?.data;
      this.loading = false;
      this.totalPage = data.regions?.total;
      const pageIndex = this.indexPage(
        data?.regions?.current_page,
        data?.regions?.per_page
      );
      this.regions = this.regions.map((item, index) => {
        return {
          key: pageIndex + index,
          ...item,
        };
      });
    },
    async __GET_REGION_GROUPS() {
      this.loading = true;
      const data = await this.$store.dispatch("fetchRegions/getRegionsGroups", {
        ...this.$route.query,
      });
      this.groups = data.groups?.data;
      this.loading = false;
      this.totalPage = data.groups?.total;
      const pageIndex = this.indexPage(
        data?.groups?.current_page,
        data?.groups?.per_page
      );
      this.groups = this.groups.map((item, index) => {
        return {
          key: pageIndex + index,
          ...item,
        };
      });
    },
    indexPage(current_page, per_page) {
      return (current_page * 1 - 1) * per_page + 1;
    },
    async __POST_GROUP(res) {
      try {
        await this.$store.dispatch("fetchRegions/postRegionsGroup", res);
        this.notification("Success", "Успешно добавлен", "success");
        this.visibleGroup = false;
        this.__GET_REGION_GROUPS();
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
    async __EDIT_GROUP() {
      try {
        await this.$store.dispatch("fetchRegions/putRegionsGroup", {
          id: this.groupId,
          data: this.ruleFormGroup,
        });
        this.notification("Success", "Успешно добавлен", "success");
        this.visibleGroup = false;
        this.__GET_REGION_GROUPS();
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
    async __GET_REGION_GROUPS_BY_ID(res) {
      const data = await this.$store.dispatch("fetchRegions/getRegionsGroupsById", res);
      const { id, created_at, updated_at, for_search, ...rest } = data?.group;
      this.ruleFormGroup = { ...rest };
      if (this.groupId) {
        this.visibleGroup = true;
      }
    },
    async __POST_BRANDS(res) {
      try {
        await this.$store.dispatch("fetchRegions/postRegions", res);
        this.notification("Success", "Успешно добавлен", "success");
        this.handleOk();
        this.__GET_LOCATIONS();
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
  },

  async mounted() {
    this.getFirstData("/settings/regions", "__GET_LOCATIONS");
    this.__GET_REGION_GROUPS();
  },
  watch: {
    async current(val) {
      this.changePagination(val, "/settings/regions", "__GET_LOCATIONS");
    },
    visibleGroup(val) {
      if (!val) {
        this.groupId = null;
      }
    },
  },
  components: {
    AddBtn,
    SearchInput,
    Title,
    TitleBlock,
    FormTitle,
    SearchInput,
  },
  layout: "toolbar",
};
</script>
<style lang="scss">
.post_img {
  width: 101px;
  height: 101px;
  border: 1px dashed #d9d9d9;
  position: relative;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  div {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    transition: 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      display: none;
      cursor: pointer;
      i {
        font-size: 32px;
        height: 40px;
        width: 40px;
      }
    }
  }
  &:hover {
    div {
      z-index: 100;
      background: rgba(255, 255, 255, 0.5);
      span {
        display: block;
      }
    }
  }
}
</style>
