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
        title="Заказы"
        :breadbrumb="['Главная', 'Заказы']"
        :lastLink="`#${order?.id}`"
      >
        <div class="d-flex">
          <span class="mx-3">
            <LayoutHeaderBtn name="Отмена" :headerbtnCallback="toBack" :light="true" />
          </span>
          <div
            v-if="checkAccess('orders', 'PUT')"
            class="add-btn add-header-btn add-header-btn-padding btn-primary"
            type="submit"
            @click="submitForm('ruleForm')"
          >
            Сохранять
          </div>
        </div>
      </TitleBlock>

      <div class="container_xl">
        <div class="order-edit-grid">
          <div class="card_block-form py-5">
            <div
              class="d-flex justify-content-between align-items-center card_header card_tabs_padding"
            ></div>

            <div class="form-container">
              <FormTitle title="Информация о заказе" />
              <div class="form-block">
                <div><label for="character_group">Статус</label></div>
                <el-form-item prop="character_group">
                  <el-select
                    class="w-100"
                    v-model="ruleForm.status"
                    filterable
                    allow-create
                    placeholder="Статус"
                  >
                    <el-option
                      v-for="item in status[ruleForm.status]"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="form-block required">
                <div><label for="character_group">Способ доставки</label></div>
                <el-form-item prop="character_group">
                  <el-select
                    class="w-100"
                    v-model="ruleForm.character_group"
                    filterable
                    allow-create
                    placeholder="Способ доставки"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="form-block required">
                <div><label for="character_group">Дата заказа</label></div>
                <el-input type="text" disabled :value="`#${order?.id}`" />
              </div>
            </div>
          </div>
          <div class="card_block-form py-5">
            <div
              class="d-flex justify-content-between align-items-center card_header card_tabs_padding"
            ></div>

            <div class="form-container form-container-ltr">
              <FormTitle title="Подробности доставки" />
              <div class="order_grid_3">
                <div class="form-block">
                  <div><label for="character_group">Область</label></div>
                  <el-form-item prop="character_group">
                    <el-select
                      class="w-100"
                      v-model="ruleForm.region"
                      filterable
                      allow-create
                      placeholder="Область"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="form-block">
                  <div><label for="character_group">Район</label></div>
                  <el-form-item prop="character_group">
                    <el-select
                      class="w-100"
                      v-model="ruleForm.area"
                      filterable
                      allow-create
                      placeholder="Район"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="form-block">
                  <div><label for="character_group">Почтовый код</label></div>
                  <el-form-item prop="character_group">
                    <el-input
                      type="text"
                      v-model="ruleForm.postNumber"
                      placeholder="Почтовый код"
                    />
                  </el-form-item>
                </div>
              </div>
              <div class="form-block">
                <div><label for="">Полный адрес </label></div>
                <el-form-item prop="character_name">
                  <el-input
                    type="textarea"
                    rows="6"
                    v-modal="ruleForm.fullAdress"
                  ></el-input>
                </el-form-item>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
import AddBtn from "../../../components/form/Add-btn.vue";
import LayoutHeaderBtn from "../../../components/form/Layout-header-btn.vue";
import TitleBlock from "../../../components/Title-block.vue";
import Title from "../../../components/Title.vue";
import authAccess from "@/mixins/authAccess";

export default {
  layout: "toolbar",
  mixins: [authAccess],
  data() {
    return {
      status: {
        pending: [
          {
            value: "pending",
            label: "Ожидание ",
          },
          {
            value: "accepted",
            label: "Принятые",
          },
          {
            value: "canceled",
            label: "Отменено",
          },
        ],
        accepted: [
          {
            value: "accepted",
            label: "Принятые",
          },
          {
            value: "done",
            label: "Доставленные",
          },
          {
            value: "returned",
            label: "Возврат ",
          },
        ],
        returned: [
          {
            value: "returned",
            label: "Возврат ",
          },
        ],
        done: [
          {
            value: "done",
            label: "Доставленные",
          },
        ],
        canceled: [
          {
            value: "canceled",
            label: "Отменено",
          },
        ],
      },
      rules: {
        character_name: [
          {
            required: true,
            // message: "incorrec",
            trigger: "change",
          },
        ],
      },
      ruleForm: {
        status: "",
      },
      count: 10,
    };
  },
  mounted() {
    this.__GET_ORDER();
  },
  methods: {
    submitForm(ruleForm) {
      this.__EDIT_ORDER(this.ruleForm);
      // this.$refs[ruleForm].validate((valid) => {
      //   if (valid) {
      //     console.log(this.ruleForm);
      //   } else {
      //     console.log("error submit!!");
      //     return false;
      //   }
      // });
    },
    async __GET_ORDER() {
      const data = await this.$store.dispatch(
        "fetchOrders/getOrdersById",
        this.$route.params.index
      );
      this.ruleForm.status = data?.order?.status;
      this.order = data?.order;
    },
    async __EDIT_ORDER(formData) {
      try {
        const data = await this.$store.dispatch("fetchOrders/editOrders", {
          id: this.$route.params.index,
          data: formData,
        });
        this.__GET_ORDER();
      } catch (e) {}
    },
    toBack() {
      this.$router.go(-1);
    },
  },
  components: {
    AddBtn,
    Title,
    TitleBlock,
    LayoutHeaderBtn,
  },
};
</script>
<style lang="scss">
.order_grid_3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 16px;
}
</style>
