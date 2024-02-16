<template lang="html">
  <div>
    <TitleBlock title="Блог" :breadbrumb="['Контент сайта']" lastLink="Блог">
      <div
        class="add-btn add-header-btn add-header-btn-padding btn-primary"
        @click="show('edit_manager')"
      >
        <span class="svg-icon"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            version="1.1"
          >
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <polygon points="0 0 24 0 24 24 0 24"></polygon>
              <path
                d="M5.85714286,2 L13.7364114,2 C14.0910962,2 14.4343066,2.12568431 14.7051108,2.35473959 L19.4686994,6.3839416 C19.8056532,6.66894833 20,7.08787823 20,7.52920201 L20,20.0833333 C20,21.8738751 19.9795521,22 18.1428571,22 L5.85714286,22 C4.02044787,22 4,21.8738751 4,20.0833333 L4,3.91666667 C4,2.12612489 4.02044787,2 5.85714286,2 Z"
                fill="#000000"
                fill-rule="nonzero"
                opacity="0.3"
              ></path>
              <path
                d="M11,14 L9,14 C8.44771525,14 8,13.5522847 8,13 C8,12.4477153 8.44771525,12 9,12 L11,12 L11,10 C11,9.44771525 11.4477153,9 12,9 C12.5522847,9 13,9.44771525 13,10 L13,12 L15,12 C15.5522847,12 16,12.4477153 16,13 C16,13.5522847 15.5522847,14 15,14 L13,14 L13,16 C13,16.5522847 12.5522847,17 12,17 C11.4477153,17 11,16.5522847 11,16 L11,14 Z"
                fill="#000000"
              ></path>
            </g></svg
        ></span>
        Добавить
      </div>
    </TitleBlock>
    <div class="container_xl app-container">
      <div class="card_block py-5">
        <div class="d-flex justify-content-between align-items-center pt-4">
          <div class="d-flex justify-content-between w-100">
            <FormTitle title="Блог" />
          </div>
        </div>
        <div class="antd_table product_table">
          <a-table
            :columns="columns"
            :data-source="tableData"
            :pagination="false"
            align="center"
          >
            <a slot="img" slot-scope="text"
              ><img
                class="table-image"
                src="../../assets/images/image.png"
                alt=""
            /></a>
            <span
              @click="$router.push('/home/customer-info/123')"
              slot="name"
              slot-scope="text"
            >
              <h6>{{ text }}</h6>
            </span>
            <h4 slot="number" slot-scope="text">{{ text }}</h4>
            <a slot="price" slot-scope="text">${{ text }}</a>
            <span slot="customTitle"></span>

            <span
              slot="tags"
              slot-scope="tags"
              class="tags-style"
              :class="{
                tag_new: tags == 'Success',
                tag_pending: tags == 'in progress',
                tag_accepted: tags == 'Approved',
                tag_canceled: tags == 'rejected',
              }"
            >
              {{ tags }}
            </span>
            <span slot="btns" slot-scope="text">
              <span class="action-btn" @click="tableActions(text)">
                <img :src="editIcon" alt="" />
              </span>
              <span class="action-btn" @click="tableActions(text)">
                <img :src="deleteIcon" alt="" />
              </span>
            </span>
          </a-table>
        </div>
      </div>
    </div>
    <AddModal
      title="Изменения блога"
      name="edit_manager"
      btnText="Save"
      :callback="getData"
      refName="modalClose"
    >
      <el-form
        label-position="top"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
        action=""
      >
        <div class="form-block required mb-3">
          <div><label for="">ФИО </label></div>
          <el-form-item>
            <el-input
              type="text"
              placeholder="Зоговолок"
              v-model="ruleForm.name"
            ></el-input>
          </el-form-item>
        </div>
        <div class="form-block required mb-3">
          <div><label for="">Номер телефона </label></div>
          <el-form-item>
            <el-input
              type="number"
              placeholder="Подзоговолок"
              v-model="ruleForm.number"
            ></el-input>
          </el-form-item>
        </div>
        <div class="form-block required mb-3">
          <div><label for="">Username </label></div>
          <el-form-item>
            <el-input
              type="text"
              placeholder="Зоговолок"
              v-model="ruleForm.username"
            ></el-input>
          </el-form-item>
        </div>
        <div class="form-block required mb-3">
          <div><label for="">Пароль </label></div>
          <el-form-item>
            <el-input
              type="password"
              placeholder="Зоговолок"
              v-model="ruleForm.password"
            ></el-input>
          </el-form-item>
        </div>
        <div class="form-block required mb-3">
          <div><label for="">Подтверждение пароля</label></div>
          <el-form-item>
            <el-input
              type="password"
              placeholder="Зоговолок"
              v-model="ruleForm.returnPassword"
            ></el-input>
          </el-form-item>
        </div>

        <div class="clearfix variant-img">
          <a-upload
            list-type="picture-card"
            :file-list="fileList"
            @preview="handlePreview"
            @change="handleChange"
          >
            <div v-if="fileList.length < 1">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.0264 19.999L20.0125 24.999M20.0125 24.999L24.9987 19.999M20.0125 24.999L20.0125 4.99902"
                  stroke="#3699FF"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12.5334 15V15C8.40276 15 5.0542 18.3486 5.0542 22.4792L5.0542 26.3333C5.0542 31.1198 8.9344 35 13.7209 35L26.3044 35C31.0909 35 34.9711 31.1198 34.9711 26.3333L34.9711 22.4792C34.9711 18.3486 31.6225 15 27.4919 15V15"
                  stroke="#3699FF"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <div class="ant-upload-text">Upload image</div>
            </div>
          </a-upload>
          <a-modal
            :visible="previewVisible"
            :footer="null"
            @cancel="handleCancel"
          >
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
        </div>
      </el-form>
    </AddModal>
  </div>
</template>
<script>
import AddBtn from "../../components/form/Add-btn.vue";
import SearchInput from "../../components/form/Search-input.vue";
import Title from "../../components/Title.vue";
import TitleBlock from "../../components/Title-block.vue";
import FormTitle from "../../components/Form-title.vue";
import AddModal from "../../components/modals/Add-modal.vue";

export default {
  // middleware: "auth",
  data() {
    return {
      pageSize: 10,
      editIcon: require("../../assets/svg/components/edit-icon.svg"),
      deleteIcon: require("../../assets/svg/components/delete-icon.svg"),
      tableData: [],
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
      ruleForm: {
        name: "Sub title",
        number: "Sub title",
        password: "desc",
        returnPassword: "desc",
        username: "desc",
      },
      columns: [
        {
          title: "ID",
          dataIndex: "id",
          key: "id",
          slots: { title: "customTitle" },
          scopedSlots: { customRender: "id" },
          align: "left",
          className: "column-name",
          width: "60px",
        },
        {
          title: "ФИО",
          dataIndex: "img",
          key: "img",
          slots: { title: "customTitle" },
          scopedSlots: { customRender: "img" },
          align: "left",
          className: "column-img",
          colSpan: 2,
          width: "45px",
        },
        {
          dataIndex: "name",
          key: "name",
          slots: { title: "customTitle" },
          scopedSlots: { customRender: "name" },
          className: "column-name",
          width: "30%",
          colSpan: 0,
        },
        {
          title: "Номер телефона",
          dataIndex: "number",
          scopedSlots: { customRender: "number" },
          className: "column-code",
          key: "number",
          //   width: "10%",
        },
        {
          title: "Username",
          dataIndex: "username",
          className: "column-qty",
          key: "username",
          align: "center",
          //   width: "10%",
        },

        {
          title: "действия",
          key: "btns",
          dataIndex: "btns",
          scopedSlots: { customRender: "btns" },
          className: "column-btns",
          //   width: "10%",
          align: "right",
        },
      ],
      options: [
        {
          value: "All",
          label: "All",
        },
        {
          value: "Published",
          label: "Published",
        },
        {
          value: "Scheduled",
          label: "Scheduled",
        },
        {
          value: "Inactive",
          label: "Неактивен",
        },
      ],
      value: "",
      data: [
        {
          key: "1",
          id: "#12",
          name: "HONOR MagicBook X 15BBR",
          number: "+998 99 730 14 99",
          username: "Fullname Lastname",
          btns: "id",
        },
        {
          key: "2",
          id: "#12",
          name: "HONOR MagicBook X 15BBR",
          number: "+998 99 730 14 99",
          username: "Fullname Lastname",

          btns: "id",
        },
        {
          key: "3",
          id: "#12",

          name: "HONOR MagicBook X 15BBR",
          number: "+998 99 730 14 99",
          username: "Fullname Lastname",

          btns: "id",
        },
        {
          key: "4",
          id: "#12",
          name: "HONOR MagicBook X 15BBR",
          number: "+998 99 730 14 99",
          username: "Fullname Lastname",

          btns: "id",
        },
      ],
      previewVisible: false,
      previewImage: "",
      fileList: [],
    };
  },
  methods: {
    show(name) {
      this.$modal.show(name);
      document.body.style.overflowY = "hidden";
      document.body.style.height = "100vh";
    },
    hide(name) {
      this.$modal.hide(name);
      document.body.style.overflowY = "auto";
      document.body.style.height = "auto";
    },
    toAddProduct() {
      this.$router.push("/catalog/add_products");
    },
    handleTableChange(pagination, filters, sorter) {
      this.tableData = this.data.map((item) => {
        filters.tags.forEach((element) => {
          if (item.tags == element);
          return item;
        });
      });
    },
    getData() {
    },
    start() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.selectedRowKeys = [];
      }, 1000);
    },
    tableActions(id) {
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    handleSizeChange(val) {
    },
    handleCurrentChange(val) {
    },
    handleCommand(command) {
      this.pageSize = command;
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    handleChange({ fileList }) {
      this.fileList = fileList;
    },
    handleCancel() {
      this.previewVisible = false;
    },
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },

    classObject(tag) {
      return {
        tag_new: tag == "Success",
        tag_pending: tag == "in progress",
      };
    },
  },
  mounted() {
    if (this.data) {
      this.tableData = this.data;
    }
  },

  components: {
    AddBtn,
    SearchInput,
    Title,
    TitleBlock,
    FormTitle,
    AddModal,
  },
  layout: "toolbar",
};
</script>
