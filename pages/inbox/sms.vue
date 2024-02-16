<template lang="html">
  <div>
    <el-form
      label-position="top"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <TitleBlock
        title="SMS Рассылка"
        :breadbrumb="['Маркетинг']"
        lastLink="SMS Рассылка"
      >
        <div class="d-flex">
          <div
            v-if="changeBlock"
            class="add-btn add-header-btn add-header-btn-padding btn-primary"
            type="submit"
            @click="changeBlockAction(false)"
          >
            Отправить
          </div>
          <div
            v-else
            class="add-btn add-header-btn add-header-btn-padding btn-light-primary"
            @click="changeBlockAction(true)"
          >
            Отмена
          </div>
        </div>
      </TitleBlock>
      <div class="container_xl">
        <div class="card_block py-5" v-if="changeBlock">
          <div class="d-flex justify-content-between align-items-center pt-4">
            <FormTitle title="Отправленные сообщения" />
          </div>
          <div class="antd_table product_table">
            <a-table
              :columns="columnMessages"
              :data-source="messages"
              :pagination="false"
              align="center"
              :loading="loading"
            >
              <span slot="created_at" slot-scope="text">
                {{ moment(text).format("DD/MM/YYYY") }}
              </span>
              <span slot="admin" slot-scope="text">
                <h6>{{ text?.username }}</h6>
              </span>
              <span slot="key" slot-scope="text">#{{ text }}</span>

              <span slot="id" slot-scope="text" class="d-flex justify-content-end">
                <a-popconfirm
                  v-if="checkAccess('promotions', 'DELETE')"
                  title="Are you sure delete this row?"
                  ok-text="Yes"
                  cancel-text="No"
                  @confirm="deleteMessage(text)"
                  @cancel="cancel"
                >
                  <span class="action-btn">
                    <img :src="deleteIcon" alt="" />
                  </span>
                </a-popconfirm>
              </span>
            </a-table>
            <div class="d-flex justify-content-between mt-4">
              <!-- <el-select
              v-model="params.pageSize"
              class="table-page-size"
              placeholder="Select"
              @change="changePageSize"
            >
              <el-option
                v-for="item in pageSizes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select> -->
              <span></span>
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
        <div class="card_block-form py-5" v-else>
          <div class="form-container">
            <div class="form-block required">
              <div><label for="text">Сообщение</label></div>
              <el-form-item prop="text">
                <el-input
                  type="textarea"
                  rows="10"
                  v-model="ruleForm.text"
                  placeholder="Введите техт"
                ></el-input>
              </el-form-item>
            </div>
            <div class="form-block">
              <el-form-item label="Отправить всем клиентам">
                <a-switch
                  :checked="Boolean(ruleForm.all)"
                  @change="($event) => ($event ? (ruleForm.all = 1) : (ruleForm.all = 0))"
                />
              </el-form-item>
            </div>

            <div class="d-flex justify-content-end">
              <div
                class="add-btn add-header-btn add-header-btn-padding btn-primary"
                type="submit"
                @click="submitForm('ruleForm')"
              >
                Отправить сообщение
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
import LayoutHeaderBtn from "../../components/form/Layout-header-btn.vue";
import TitleBlock from "../../components/Title-block.vue";
import Title from "../../components/Title.vue";
import status from "@/mixins/status";
import authAccess from "@/mixins/authAccess";
import columns from "@/mixins/columns";
import global from "@/mixins/global";
import moment from "moment";
import FormTitle from "../../components/Form-title.vue";
export default {
  layout: "toolbar",
  mixins: [global, status, columns, authAccess],
  data() {
    return {
      changeBlock: true,
      activeName: "Русский",
      loading: false,
      messages: [],
      deleteIcon: require("@/assets/svg/components/delete-icon.svg"),
      options: [
        {
          value: "HTML",
          label: "HTML",
        },
        {
          value: "CSS",
          label: "CSS",
        },
        {
          value: "JavaScript",
          label: "JavaScript",
        },
      ],
      value: [],
      rules: {
        text: [
          {
            required: true,
            message: "This field is required",
            trigger: "change",
          },
        ],
      },
      ruleForm: {
        text: "",
        all: 0,
      },
    };
  },
  mounted() {
    this.__GET_DATA();
  },
  methods: {
    moment,
    changeBlockAction(val) {
      this.changeBlock = val;
    },
    async __GET_DATA() {
      this.loading = true;
      const data = await this.$store.dispatch("fetchSms/getData", {
        ...this.$route.query,
      });
      const pageIndex = this.indexPage(
        data?.newsletters?.current_page,
        data?.newsletters?.per_page
      );
      this.totalPage = data?.newsletters?.total;
      this.messages = data?.newsletters?.data.map((item, index) => {
        return {
          ...item,
          key: index + pageIndex,
        };
      });
      this.loading = false;
    },
    async __POST_MESSAGES(res) {
      try {
        await this.$store.dispatch("fetchSms/postMessages", res);
        this.notification("Success", "Успешно отправлен", "success");
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
    submitForm(ruleForm) {
      this.$refs[ruleForm].validate((valid) =>
        valid ? this.__POST_MESSAGES(this.ruleForm) : false
      );
    },
    indexPage(current_page, per_page) {
      return (current_page * 1 - 1) * per_page + 1;
    },
    deleteMessage(id) {
      this.__DELETE_GLOBAL(id, "fetchSms/deleteMessage", "Успешно удален", "__GET_DATA");
    },
  },
  watch: {
    async current(val) {
      this.changePagination(val, "/inbox/sms", "__GET_DATA");
    },
  },
  components: {
    Title,
    TitleBlock,
    LayoutHeaderBtn,
    FormTitle,
  },
};
</script>
<style lang="css"></style>
