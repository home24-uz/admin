<template lang="html">
  <div>
    <TitleBlock title="Филиалы" :breadbrumb="['настройки']" lastLink="Филиалы">
      <div
        v-if="checkAccess('branches', 'POST')"
        class="add-btn add-header-btn add-header-btn-padding btn-primary"
        @click="openAddModal"
      >
        <span class="svg-icon" v-html="addIcon"></span>
        Добавить
      </div>
    </TitleBlock>
    <div class="container_xl app-container">
      <div class="card_block py-5">
        <div class="d-flex justify-content-between align-items-center pt-4">
          <div class="d-flex justify-content-between w-100">
            <FormTitle title="Филиалы" />
          </div>
        </div>
        <div class="antd_table product_table">
          <a-table
            :columns="columnBranches"
            :data-source="group"
            :pagination="false"
            align="center"
            :loading="loading"
          >
            <span slot="name" slot-scope="text" align="center">
              <h6>{{ text?.ru }}</h6>
            </span>
            <span slot="key" slot-scope="text">#{{ text }}</span>
            <span slot="id" slot-scope="text">
              <span
                class="action-btn"
                v-if="checkAccess('branches', 'PUT')"
                @click="editPost(text)"
              >
                <img :src="editIcon" alt="" />
              </span>
              <a-popconfirm
                v-if="checkAccess('branches', 'DELETE')"
                title="Are you sure delete this row?"
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
    </div>
    <a-modal
      v-model="visible"
      :title="editId ? `Изменять` : `Добавить`"
      :closable="false"
      @ok="handleOk"
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
      <el-form
        label-position="top"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
      >
        <div
          v-for="(item, index) in modalTabData"
          :key="index"
          v-if="modalTab == item.index"
        >
          <el-form-item
            class="form-block required align-items-start"
            label="Зоговолок"
            prop="name.ru"
          >
            <el-input
              type="text"
              placeholder="Зоговолок"
              v-model="ruleForm.name[`${item.index}`]"
            ></el-input>
          </el-form-item>
          <el-form-item class="form-block align-items-start" label="Link">
            <el-input
              type="text"
              placeholder="Link..."
              v-model="ruleForm.link"
            ></el-input>
          </el-form-item>
          <el-form-item
            class="form-block required align-items-start"
            label="Рабочее время"
            prop="work_time"
          >
            <el-time-picker
              class="w-100"
              is-range
              v-model="value1"
              start-placeholder="Start time"
              end-placeholder="End time"
              :editable="false"
              :clearable="true"
              :picker-options="{
                selectableRange: '18:30:00 - 20:30:00',
              }"
            >
            </el-time-picker>
          </el-form-item>
          <el-form-item
            class="form-block required align-items-start"
            label="Адрес"
            prop="phone_number"
          >
            <el-input
              type="text"
              placeholder="Адрес..."
              v-model="ruleForm.phone_number[`${item.index}`]"
            />
          </el-form-item>
          <el-form-item
            class="w-100 form-block required align-items-start"
            label="Регионы"
            v-if="ruleForm.region_id"
          >
            <a-select
              :value="ruleForm.region_id"
              show-search
              placeholder="Регионы"
              style="width: 100%"
              @change="onChangeRegion"
            >
              <a-select-option v-for="d in regions" :key="d.id">
                {{ d.name.ru }}
              </a-select-option>
            </a-select>
          </el-form-item>
          <el-form-item
            class="w-100 form-block required align-items-start"
            label="Регионы"
            v-else
          >
            <a-select
              show-search
              placeholder="Регионы"
              style="width: 100%"
              @change="onChangeRegion"
            >
              <a-select-option v-for="d in regions" :key="d.id">
                {{ d.name.ru }}
              </a-select-option>
            </a-select>
          </el-form-item>
        </div>
      </el-form>
      <template slot="footer">
        <div class="add_modal-footer d-flex justify-content-end">
          <div
            class="add-btn add-header-btn add-header-btn-padding btn-light-primary mx-3"
            @click="closeModal"
          >
            Отмена
          </div>
          <a-button
            class="add-btn add-header-btn btn-primary"
            @click="getData"
            type="primary"
            :loading="loadingBtn"
          >
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
import Title from "../../../components/Title.vue";
import TitleBlock from "../../../components/Title-block.vue";
import FormTitle from "../../../components/Form-title.vue";
import global from "../../../mixins/global";
import status from "@/mixins/status";
import authAccess from "@/mixins/authAccess";
import columns from "../../../mixins/columns";
import moment from "moment";
export default {
  // middleware: "auth",
  mixins: [global, status, columns, authAccess],
  data() {
    return {
      fetching: false,
      value: "",
      regions: [],
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
      modalTab: "ru",
      value1: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
      visible: false,
      editIcon: require("../../../assets/svg/components/edit-icon.svg"),
      deleteIcon: require("../../../assets/svg/components/delete-icon.svg"),
      addIcon: require("../../../assets/svg/components/add-icon.svg?raw"),
      plusCategoryIcon: require("../../../assets/svg/components/add-category-icon.svg?raw"),
      loading: true,
      loadingBtn: false,
      ruleForm: {
        name: {
          ru: "",
          uz: "",
          en: "",
        },
        work_time: "",
        phone_number: { ru: "", uz: "", en: "" },
        region_id: null,
        link: "",
      },
      fetching: false,
      permissions: [],
      editId: "",
      group: [],
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
        phone_number: [
          {
            required: true,
            message: "Это поле обязательна",
            trigger: "change",
          },
        ],
        region_id: [
          {
            required: true,
            message: "Это поле обязательна",
            trigger: "change",
          },
        ],
        work_time: [
          {
            required: true,
            message: "Это поле обязательна",
            trigger: "change",
          },
        ],
      },
    };
  },

  methods: {
    moment,
    onChangeRegion(id) {
      this.ruleForm.region_id = id;
    },
    showModal() {
      this.visible = true;
    },
    handleOk(e) {
      this.visible = false;
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
    getData() {
      const data = {
        ...this.ruleForm,
      };
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.editId != "" ? this.__EDIT_LOCATIONS(data) : this.__POST_LOCATIONS(data);
        } else {
          return false;
        }
      });
    },
    closeModal() {
      this.visible = false;
    },
    deleteImg() {
      this.editImage = "";
    },
    openAddModal() {
      this.showModal();
      this.editId = "";
    },
    editPost(id) {
      this.editId = id;
      // console.log(new Date(2016, 9, 10, 8, 40));
      this.__GET_LOCATIONS_BY_ID(id);
    },
    async __GET_LOCATIONS_BY_ID(id) {
      const data = await this.$store.dispatch("fetchLocations/showLocations", id);
      this.ruleForm = {
        name: data.branch?.name,
        work_time: data.branch?.work_time,
        phone_number: data.branch?.phone_number,
        region_id: data.branch?.region_id,
        link: data.branch?.link,
      };
      this.value1[0] = new Date(
        2016,
        9,
        10,
        Number(data.branch?.work_time.split("-")[0].split(":")[0]),
        Number(data.branch?.work_time.split("-")[0].split(":")[1])
      );
      this.value1[1] = new Date(
        2016,
        9,
        10,
        Number(data.branch?.work_time.split("-")[1].split(":")[0]),
        Number(data.branch?.work_time.split("-")[1].split(":")[1])
      );
      this.showModal();
    },
    deletePost(id) {
      this.__DELETE_GLOBAL(
        id,
        "fetchLocations/deleteLocations",
        "Успешно удален",
        "__GET_LOCATIONS"
      );
    },
    async __GET_LOCATIONS() {
      this.loading = true;
      const data = await this.$store.dispatch("fetchLocations/getLocations", {
        ...this.$route.query,
      });
      this.group = data.branches?.data;
      this.loading = false;
      this.totalPage = data.branches?.total;
      const pageIndex = this.indexPage(
        data?.branches?.current_page,
        data?.branches?.per_page
      );
      this.group = this.group.map((item, index) => {
        return {
          ...item,
          numberId: item.id,
          key: index + pageIndex,
        };
      });
    },
    indexPage(current_page, per_page) {
      return (current_page * 1 - 1) * per_page + 1;
    },
    async __POST_LOCATIONS(res) {
      try {
        await this.$store.dispatch("fetchLocations/postLocations", res);
        this.notification("Success", "Успешно добавлен", "success");
        this.handleOk();
        this.__GET_LOCATIONS();
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
    async __EDIT_LOCATIONS(res) {
      try {
        await this.$store.dispatch("fetchLocations/editLocations", {
          id: this.editId,
          data: res,
        });
        this.notification("Success", "Успешно добавлен", "success");
        this.handleOk();
        this.__GET_LOCATIONS();
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
    emptyData() {
      this.ruleForm = {
        name: {
          ru: "",
          uz: "",
          en: "",
        },
        work_time: "",
        phone_number: "",
        region_id: null,
      };
      this.editId = "";
    },
    async handleSearch(value) {
      this.fetching = true;
      if (value.length > 2) {
        const permissionsData = await this.$store.dispatch(
          "fetchLocations/getLocations",
          {
            search: value,
          }
        );
        this.permissions = permissionsData?.permissions?.data;
        this.fetching = false;
      }
    },
    // handleChange(value, id) {
    //   console.log(value);
    //   let obj = this.ruleForm.find((item) => item.indexId == id);
    //   obj.category_id = value;
    //   console.log(obj);
    // },
  },

  async mounted() {
    const permissionsData = await this.$store.dispatch("fetchLocations/getLocations");
    this.permissions = permissionsData?.permissions?.data;
    const data = await this.$store.dispatch("fetchRegions/getRegions");
    this.regions = data?.regions?.data;
    this.getFirstData("/settings/locations", "__GET_LOCATIONS");
  },
  watch: {
    async current(val) {
      this.changePagination(val, "/settings/locations", "__GET_LOCATIONS");
    },
    value1(val) {
      if (val) {
        this.ruleForm.work_time = `${this.moment(val[0]).format("HH:mm")}-${this.moment(
          val[1]
        ).format("HH:mm")}`;
      }
    },
    modalTab() {
    },
    visible(val) {
      if (val == false) {
        this.emptyData();
      }
    },
  },
  components: {
    AddBtn,
    SearchInput,
    Title,
    TitleBlock,
    FormTitle,
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
