<template lang="html">
  <div>
    <TitleBlock
      title="Комментарии"
      :breadbrumb="['Контент сайта']"
      lastLink="Комментарии"
    >
    </TitleBlock>
    <div class="container_xl app-container">
      <div class="card_block py-5">
        <div class="d-flex justify-content-between align-items-center pt-4">
          <div
            class="prodduct-list-header-grid w-100 align-items-center"
            style="grid-gap: 1.25rem"
          >
            <!-- <div> -->
            <SearchInput
              placeholder="Поиск комментариев"
              @changeSearch="changeSearch($event, '/contents/comments', '__GET_COMMENTS')"
            />
            <!-- </div> -->
            <span></span>
            <span></span>
            <a-button
              @click="clearQuery('/contents/comments', '__GET_COMMENTS')"
              type="primary"
              class="d-flex align-items-center justify-content-center"
              style="height: 38px"
              ><a-icon type="reload"
            /></a-button>
          </div>
        </div>
        <div class="antd_table product_table">
          <a-table
            :columns="columns"
            :data-source="comments"
            :pagination="false"
            :loading="loading"
          >
            <span
              @click="$router.push('/home/customer-info/123')"
              slot="product"
              slot-scope="text"
            >
              <nuxt-link :to="`/catalog/edit_products/${text?.id}`">
                <h6>{{ text?.name?.ru }}</h6></nuxt-link
              >
            </span>
            <span slot="user" slot-scope="text">{{ text?.name }}</span>
            <span slot="key" slot-scope="text">#{{ text }}</span>
            <span slot="customTitle"></span>
            <span
              slot="status"
              slot-scope="text"
              class="tags-style"
              :class="{
                tag_new: text,
                tag_canceled: !text,
              }"
            >
              {{ text ? "Активный " : "Неактивный" }}
            </span>
            <span slot="editId" slot-scope="text">
              <span class="action-btn" @click="editAction(text)">
                <img :src="editIcon" alt="" />
              </span>
              <a-popconfirm
                v-if="checkAccess('comments', 'DELETE')"
                title="Are you sure delete this comment?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="deleteComments(text)"
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
      title="Добавить"
      :closable="false"
      @ok="handleOk"
      width="561px"
    >
      <el-form
        label-position="top"
        :model="ruleForm"
        :rules="rules"
        ref="ruleFormComment"
        label-width="120px"
        class="demo-ruleForm"
        action=""
      >
        <div>
          <el-form-item class="form-block" label="Комментарий">
            <a-input type="textarea" v-model="ruleForm.comment" rows="5" />
          </el-form-item>
          <el-form-item class="form-block" label="Статус">
            <a-switch
              :checked="ruleForm.is_active"
              @change="ruleForm.is_active = !ruleForm.is_active"
            />
          </el-form-item>
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
            type="primary"
            @click="submitCommit"
          >
            Сохранить
          </a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script>
import TitleBlock from "../../components/Title-block.vue";
import FormTitle from "../../components/Form-title.vue";
import global from "../../mixins/global";
import authAccess from "@/mixins/authAccess";
import SearchInput from "../../components/form/Search-input.vue";
import status from "../../mixins/status";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
export default {
  // middleware: "auth",
  mixins: [global, authAccess,status],
  data() {
    return {
      editorOption: {
        theme: "snow",
      },
      loading: true,
      visible: false,
      editIcon: require("../../assets/svg/components/edit-icon.svg"),
      deleteIcon: require("../../assets/svg/components/delete-icon.svg"),
      addIcon: require("../../assets/svg/components/add-icon.svg?raw"),
      columns: [
        {
          title: "№",
          dataIndex: "key",
          key: "key",
          slots: { title: "customTitle" },
          scopedSlots: { customRender: "key" },
          align: "left",
          className: "column-name",
          width: "60px",
        },
        {
          title: "Продукт",
          dataIndex: "product_info",
          key: "product_info",
          slots: { title: "customTitle" },
          scopedSlots: { customRender: "product" },
          align: "left",
          className: "column-name",
          width: "20%",
        },

        {
          title: "Пользователь",
          dataIndex: "user",
          key: "user",
          slots: { title: "customTitle" },
          scopedSlots: { customRender: "user" },
          className: "column-name",
          width: "10%",
        },

        {
          title: "Коммент",
          dataIndex: "comment",
          scopedSlots: { customRender: "comment" },
          className: "column-code",
          key: "comment",
          //   width: "10%",
        },
        {
          title: "Статус",
          key: "is_active",
          dataIndex: "is_active",
          scopedSlots: { customRender: "status" },
          className: "column-tags",
          filters: [
            { text: "Активный", value: "active" },
            { text: "Неактивный", value: "inactive" },
          ],
          onFilter: (value, record) => record.status.indexOf(value) === 0,
          // width: "16%",
        },
        {
          title: "действия",
          key: "editId",
          dataIndex: "editId",
          scopedSlots: { customRender: "editId" },
          className: "column-btns",
          width: "100px",
          align: "right",
        },
      ],
      previewVisible: false,
      comments: [],
      currentComment: {},
      rules: {
        comment: [
          {
            required: true,
            message: "This field is required",
            trigger: "change",
          },
        ],
      },
      editId: null,
      ruleForm: {
        user_id: null,
        product_id: null,
        comment: "",
        stars: null,
        is_active: false,
      },
    };
  },
  methods: {
    handleOk() {
      this.visible = false;
    },
    show(name) {
      this.$modal.show(name);
    },
    hide(name) {
      this.$modal.hide(name);
    },
    editAction(id) {
      this.editId = id;
      this.visible = true;
      this.currentComment = this.comments.find((item) => item.id == id);
      this.ruleForm.user_id = this.currentComment.user_id;
      this.ruleForm.product_id = this.currentComment.product_info_id;
      this.ruleForm.comment = this.currentComment.comment;
      this.ruleForm.stars = this.currentComment.stars;
      this.ruleForm.is_active = this.currentComment.is_active;
    },
    deleteComments(id) {
      this.__DELETE_GLOBAL(
        id,
        "fetchComments/deleteComments",
        "Успешно удален",
        "__GET_COMMENTS"
      );
    },
    submitCommit() {
      this.$refs.ruleFormComment.validate((valid) => {
        if (valid) {
          this.__POST_COMMENTS(this.ruleForm);
        } else {
          return false;
        }
      });
    },
    async __POST_COMMENTS(formData) {
      try {
        const data = await this.$store.dispatch("fetchComments/editComments", {
          id: this.editId,
          data: formData,
        });
        this.__GET_COMMENTS();
        this.visible = false;
        this.editId = null;
      } catch (e) {}
    },
    cancel(e) {
      // this.$message.error("Click on No");
    },
    async changePageSize(e) {
      this.current = 1;
      if (this.$route.query.per_page != e) {
        await this.$router.replace({
          path: `/contents/comments`,
          query: {
            page: this.current,
            per_page: e,
          },
        });
        this.__GET_COMMENTS();
      }
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    },
    async __GET_COMMENTS() {
      this.loading = true;
      const data = await this.$store.dispatch("fetchComments/getComments", {
        ...this.$route.query,
      });
      this.loading = false;
      this.totalPage = data.comments?.total;
      const pageIndex = this.indexPage(
        data?.comments?.current_page,
        data?.comments?.per_page
      );
      this.comments = data.comments?.data.map((item, index) => {
        return {
          ...item,
          editId: item.id,
          key: pageIndex + index,
        };
      });
    },
    indexPage(current_page, per_page) {
      return (current_page * 1 - 1) * per_page + 1;
    },
    // deleteComment(id) {
    //   this.__DELETE_COMMENT(id);
    // },
    async __DELETE_COMMENT(id) {
      try {
        await this.$store.dispatch("fetchComments/deleteComments", id);
        await this.$notify({
          title: "Success",
          message: "Пост был успешно удален",
          type: "success",
        });
        this.__GET_COMMENTS();
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
  },
  async mounted() {
    this.getFirstData("/contents/comments", "__GET_COMMENTS");
  },
  watch: {
    async current(val) {
      this.changePagination(val, "/contents/comments", "__GET_COMMENTS");
    },
    visible(val) {
      if (!val) {
      }
    },
  },
  components: {
    TitleBlock,
    FormTitle,
    SearchInput,
  },
  layout: "toolbar",
};
</script>
<style lang="scss">
.ant-modal-mask,
.ant-modal-wrap {
  z-index: 1002 !important;
}
</style>
