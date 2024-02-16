<template lang="html">
  <div>
    <TitleBlock title="Permissions" :breadbrumb="['настройки']" lastLink="Permissions">
      <div class="d-flex">
        <span class="mx-3">
          <LayoutHeaderBtn name="Отмена" :headerbtnCallback="toBack" :light="true" />
        </span>
        <div
          v-if="checkAccess('permissions', 'PUT')"
          class="add-btn add-header-btn add-header-btn-padding btn-primary"
          type="submit"
          @click="submitForm('ruleForm')"
        >
          <span class="svg-icon" v-html="addIcon"></span>
          Сохранять
        </div>
      </div>
    </TitleBlock>
    <div class="container_xl">
      <div class="card_block-form py-5">
        <div
          class="d-flex justify-content-between align-items-center card_header card_tabs_padding"
        ></div>

        <div class="form-container form-container-ltr">
          <FormTitle title="Permissions" />
          <div class="list">
            <el-form
              v-for="item in ruleForm"
              :key="item.id"
              label-position="top"
              :model="item"
              :rules="rules"
              ref="ruleForm"
              label-width="120px"
              class="demo-ruleForm"
            >
              <div class="top-menu-input-grid pb-3">
                <el-form-item
                  label="Название"
                  class="mb-0 form-block required w-100 align-items-start"
                  prop="name"
                >
                  <el-input v-model="item.name" placeholder="Название..."></el-input>
                </el-form-item>
                <el-form-item
                  label="Url"
                  prop="url"
                  class="form-block required mb-0 w-100 align-items-start"
                >
                  <el-input v-model="item.url" placeholder="Url..."></el-input>
                </el-form-item>
                <el-form-item
                  class="form-block mb-0 w-100 align-items-start"
                  label="Методы"
                  style="max-width: 387px"
                >
                  <el-select
                    multiple
                    class="w-100"
                    placeholder="Status"
                    default-first-option
                    v-model="item.methods"
                  >
                    <el-option
                      v-for="method in methods"
                      :key="method.value"
                      :label="method.label"
                      :value="method.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <div class="variant_btns mb-1 mt-0">
                  <div
                    v-if="checkAccess('permissions', 'DELETE')"
                    class="variant-btn variant-btn-delete mx-2"
                    @click="deleteElement(item)"
                  >
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 30 30"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.3029 9.69684L9.69629 20.3034M20.3029 20.3034L9.69629 9.69678"
                        stroke="#F65160"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </el-form>
            <div class="d-flex justify-content-start">
              <div class="create-inner-variant mt-0" @click="addElement()">
                <span v-html="addInnerValidatIcon"></span>
                Добавить
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import LayoutHeaderBtn from "../../components/form/Layout-header-btn.vue";
import TitleBlock from "../../components/Title-block.vue";
import { Drag, DropList } from "vue-easy-dnd";
import status from "@/mixins/status";
import authAccess from "@/mixins/authAccess";

export default {
  layout: "toolbar",
  mixins: [status, authAccess],
  data() {
    return {
      activeName: "Русский",
      multiSelectError: true,
      fetching: false,
      data: [],
      methods: [
        {
          value: "POST",
          label: "POST",
        },
        {
          value: "PUT",
          label: "PUT",
        },
        {
          value: "GET",
          label: "GET",
        },
        {
          value: "DELETE",
          label: "DELETE",
        },
      ],
      addIcon: require("../../assets/svg/components/add-icon.svg?raw"),
      addInnerValidatIcon: require("../../assets/svg/components/add-inner-validat-icon.svg?raw"),
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
      options: [],

      ruleForm1: {},
      rules: {
        name: [
          {
            required: true,
            message: "This is required",
            trigger: "change",
          },
        ],
        url: [
          {
            required: true,
            message: "This is required",
            trigger: "change",
          },
        ],
      },

      ruleForm: [
        {
          indexId: 1,
          name: "",
          url: "",
          id: 0,
          methods: [],
        },
      ],
    };
  },
  mounted() {
    this.__GET_PERMISSIONS();
  },
  methods: {
    async deleteElement(item) {
      if (item?.id) {
        try {
          await this.$store.dispatch("fetchPermissions/deletePermissions", item.id);
          this.notification("Success", "Успешно удален", "success");
          this.__GET_PERMISSIONS();
        } catch (e) {}
      } else {
        if (this.ruleForm.length > 1)
          this.ruleForm = this.ruleForm.filter((elem) => elem.indexId != item.indexId);
      }
    },
    addElement() {
      this.ruleForm.push({
        indexId: Math.max(...this.ruleForm.map((o) => o.indexId)) + 1,
        name: "",
        url: "",
        id: 0,
        method: [],
      });
    },
    submitForm(ruleForm) {
      let arr = [];
      const data = this.ruleForm.map((item) => {
        const { indexId, ...rest } = item;
        return {
          ...rest,
          methods: rest.methods.length == 0 ? null : rest.methods,
        };
      });
      this.$refs[ruleForm].forEach((item) => {
        item.validate((valid) => {
          if (!valid) return false;
          arr.push(1);
        });
      });
      if (arr.length == this.$refs[ruleForm].length) {
        this.__POST_PERMISSIONS({ permissions: data });
      }
    },

    async __POST_PERMISSIONS(data) {
      try {
        await this.$store.dispatch("fetchPermissions/postPermissions", data);
        this.notification("Success", "Успешно добавлен", "success");
        this.$router.push("/settings/permissions-group");
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
    async __GET_PERMISSIONS() {
      try {
        const data = await this.$store.dispatch("fetchPermissions/getPermissions");
        this.ruleForm = data?.permissions.map((item, index) => {
          const { created_at, groups, updated_at, ...rest } = item;
          if (rest.methods) {
            return { ...rest, indexId: index + 1 };
          } else {
            return {
              ...rest,
              indexId: index + 1,
              methods: [],
            };
          }
        });
      } catch (e) {
        this.statusFunc(e.response);
      }
    },

    toBack() {
      this.$router.go(-1);
    },
  },
  watch: {},
  components: {
    TitleBlock,
    LayoutHeaderBtn,
    Drag,
    DropList,
  },
};
</script>
<style lang="scss">
@import "../../assets/scss/custom/page/characteristic.scss";
.top-menu-input-grid {
  display: flex;
  gap: 8px;
}
.item {
  pointer-events: painted;
}
</style>
