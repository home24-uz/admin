<template lang="html">
  <div class="all-orders">
    <TitleBlock
      title="Заказы"
      :breadbrumb="['Главная', 'Заказы']"
      :lastLink="`#${order?.id}`"
    >
      <a-button type="primary" @click="submitForm">Сохранять</a-button>
    </TitleBlock>
    <div class="container_xl app-container mt-5">
      <Loader v-if="loading" />
      <el-tabs class="order_tabs" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="Итог заказа" name="summa">
          <div class="mt-4 mb-5">
            <div class="order-detail-grid-2">
              <div>
                <div class="custom_block px-4 mb-3 py-4">
                  <FormTitle title="Сведения о клиенте" />

                  <div class="order-details-items">
                    <span
                      ><svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.3"
                          d="M16.5 9C16.5 13.125 13.125 16.5 9 16.5C4.875 16.5 1.5 13.125 1.5 9C1.5 4.875 4.875 1.5 9 1.5C13.125 1.5 16.5 4.875 16.5 9Z"
                          fill="currentColor"
                        ></path>
                        <path
                          d="M9 16.5C10.95 16.5 12.75 15.75 14.025 14.55C13.425 12.675 11.4 11.25 9 11.25C6.6 11.25 4.57499 12.675 3.97499 14.55C5.24999 15.75 7.05 16.5 9 16.5Z"
                          fill="currentColor"
                        ></path>
                        <rect
                          x="7"
                          y="6"
                          width="4"
                          height="4"
                          rx="2"
                          fill="currentColor"
                        ></rect>
                      </svg>
                      Клиент</span
                    >
                    <div class="order-user">
                      <p>{{ order?.user?.name }} {{ order?.user?.surname }}</p>
                    </div>
                  </div>
                  <!-- <div class="order-details-items">
                    <span>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.3"
                          d="M21 19H3C2.4 19 2 18.6 2 18V6C2 5.4 2.4 5 3 5H21C21.6 5 22 5.4 22 6V18C22 18.6 21.6 19 21 19Z"
                          fill="currentColor"
                        ></path>
                        <path
                          d="M21 5H2.99999C2.69999 5 2.49999 5.10005 2.29999 5.30005L11.2 13.3C11.7 13.7 12.4 13.7 12.8 13.3L21.7 5.30005C21.5 5.10005 21.3 5 21 5Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                      Электронная почта</span
                    >
                    <p>{{ order?.user?.email ? order?.user?.email : "---" }}</p>
                  </div> -->
                  <div class="order-details-items">
                    <span>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 20H19V21C19 21.6 18.6 22 18 22H6C5.4 22 5 21.6 5 21V20ZM19 3C19 2.4 18.6 2 18 2H6C5.4 2 5 2.4 5 3V4H19V3Z"
                          fill="currentColor"
                        ></path>
                        <path
                          opacity="0.3"
                          d="M19 4H5V20H19V4Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                      Телефон</span
                    >
                    <p>{{ `+${order?.phone_number}` }}</p>
                  </div>
                </div>
                <div class="custom_block px-4 py-4">
                  <FormTitle :title="`Информация заказa (#${order?.id})`" />
                  <div class="order-details-items">
                    <span
                      ><svg
                        width="20"
                        height="21"
                        viewBox="0 0 20 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.3"
                          d="M19 3.40002C18.4 3.40002 18 3.80002 18 4.40002V8.40002H14V4.40002C14 3.80002 13.6 3.40002 13 3.40002C12.4 3.40002 12 3.80002 12 4.40002V8.40002H8V4.40002C8 3.80002 7.6 3.40002 7 3.40002C6.4 3.40002 6 3.80002 6 4.40002V8.40002H2V4.40002C2 3.80002 1.6 3.40002 1 3.40002C0.4 3.40002 0 3.80002 0 4.40002V19.4C0 20 0.4 20.4 1 20.4H19C19.6 20.4 20 20 20 19.4V4.40002C20 3.80002 19.6 3.40002 19 3.40002ZM18 10.4V13.4H14V10.4H18ZM12 10.4V13.4H8V10.4H12ZM12 15.4V18.4H8V15.4H12ZM6 10.4V13.4H2V10.4H6ZM2 15.4H6V18.4H2V15.4ZM14 18.4V15.4H18V18.4H14Z"
                          fill="currentColor"
                        ></path>
                        <path
                          d="M19 0.400024H1C0.4 0.400024 0 0.800024 0 1.40002V4.40002C0 5.00002 0.4 5.40002 1 5.40002H19C19.6 5.40002 20 5.00002 20 4.40002V1.40002C20 0.800024 19.6 0.400024 19 0.400024Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                      Дата добавлена</span
                    >
                    <p>{{ moment(order.created_at).format("DD/MM/YYYY HH:mm") }}</p>
                  </div>
                  <div class="order-details-items">
                    <span
                      ><svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.3"
                          d="M3.20001 5.91897L16.9 3.01895C17.4 2.91895 18 3.219 18.1 3.819L19.2 9.01895L3.20001 5.91897Z"
                          fill="currentColor"
                        ></path>
                        <path
                          opacity="0.3"
                          d="M13 13.9189C13 12.2189 14.3 10.9189 16 10.9189H21C21.6 10.9189 22 11.3189 22 11.9189V15.9189C22 16.5189 21.6 16.9189 21 16.9189H16C14.3 16.9189 13 15.6189 13 13.9189ZM16 12.4189C15.2 12.4189 14.5 13.1189 14.5 13.9189C14.5 14.7189 15.2 15.4189 16 15.4189C16.8 15.4189 17.5 14.7189 17.5 13.9189C17.5 13.1189 16.8 12.4189 16 12.4189Z"
                          fill="currentColor"
                        ></path>
                        <path
                          d="M13 13.9189C13 12.2189 14.3 10.9189 16 10.9189H21V7.91895C21 6.81895 20.1 5.91895 19 5.91895H3C2.4 5.91895 2 6.31895 2 6.91895V20.9189C2 21.5189 2.4 21.9189 3 21.9189H19C20.1 21.9189 21 21.0189 21 19.9189V16.9189H16C14.3 16.9189 13 15.6189 13 13.9189Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                      Способ оплаты</span
                    >
                    <p>
                      {{
                        order?.payment_method == "cash"
                          ? "Наличные"
                          : order?.payment_method
                      }}
                    </p>
                  </div>
                  <div class="order-details-items">
                    <span
                      ><svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.3"
                          d="M3.20001 5.91897L16.9 3.01895C17.4 2.91895 18 3.219 18.1 3.819L19.2 9.01895L3.20001 5.91897Z"
                          fill="currentColor"
                        ></path>
                        <path
                          opacity="0.3"
                          d="M13 13.9189C13 12.2189 14.3 10.9189 16 10.9189H21C21.6 10.9189 22 11.3189 22 11.9189V15.9189C22 16.5189 21.6 16.9189 21 16.9189H16C14.3 16.9189 13 15.6189 13 13.9189ZM16 12.4189C15.2 12.4189 14.5 13.1189 14.5 13.9189C14.5 14.7189 15.2 15.4189 16 15.4189C16.8 15.4189 17.5 14.7189 17.5 13.9189C17.5 13.1189 16.8 12.4189 16 12.4189Z"
                          fill="currentColor"
                        ></path>
                        <path
                          d="M13 13.9189C13 12.2189 14.3 10.9189 16 10.9189H21V7.91895C21 6.81895 20.1 5.91895 19 5.91895H3C2.4 5.91895 2 6.31895 2 6.91895V20.9189C2 21.5189 2.4 21.9189 3 21.9189H19C20.1 21.9189 21 21.0189 21 19.9189V16.9189H16C14.3 16.9189 13 15.6189 13 13.9189Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                      Статус оплаты:
                      <span
                      v-if="!order?.is_paid"
                        class="cursor-pointer"
                        style="color: #3699ff"
                        @click="copyText(order?.payment_link)"
                        >{{ order?.payment_link }}</span
                      ></span
                    >
                    <p :class="order?.is_paid ? 'is_paid' : 'not_paid'">
                      {{ order?.is_paid ? "Оплачен" : "Неоплачен" }}
                    </p>
                  </div>
                  <div class="order-details-items">
                    <span
                      ><svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20 8H16C15.4 8 15 8.4 15 9V16H10V17C10 17.6 10.4 18 11 18H16C16 16.9 16.9 16 18 16C19.1 16 20 16.9 20 18H21C21.6 18 22 17.6 22 17V13L20 8Z"
                          fill="currentColor"
                        ></path>
                        <path
                          opacity="0.3"
                          d="M20 18C20 19.1 19.1 20 18 20C16.9 20 16 19.1 16 18C16 16.9 16.9 16 18 16C19.1 16 20 16.9 20 18ZM15 4C15 3.4 14.6 3 14 3H3C2.4 3 2 3.4 2 4V13C2 13.6 2.4 14 3 14H15V4ZM6 16C4.9 16 4 16.9 4 18C4 19.1 4.9 20 6 20C7.1 20 8 19.1 8 18C8 16.9 7.1 16 6 16Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                      Способ доставки</span
                    >
                    <p>
                      {{ order?.delivery_method == "pickup" ? "Cамовывоз" : "Доставка" }}
                    </p>
                  </div>
                  <div class="order-details-items">
                    <span
                      ><svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.3"
                          d="M16.5 9C16.5 13.125 13.125 16.5 9 16.5C4.875 16.5 1.5 13.125 1.5 9C1.5 4.875 4.875 1.5 9 1.5C13.125 1.5 16.5 4.875 16.5 9Z"
                          fill="currentColor"
                        ></path>
                        <path
                          d="M9 16.5C10.95 16.5 12.75 15.75 14.025 14.55C13.425 12.675 11.4 11.25 9 11.25C6.6 11.25 4.57499 12.675 3.97499 14.55C5.24999 15.75 7.05 16.5 9 16.5Z"
                          fill="currentColor"
                        ></path>
                        <rect
                          x="7"
                          y="6"
                          width="4"
                          height="4"
                          rx="2"
                          fill="currentColor"
                        ></rect>
                      </svg>
                      Оператор</span
                    >
                    <p>{{ order?.operator ? order?.operator?.username : "---" }}</p>
                  </div>
                  <div class="order-details-items">
                    <span
                      ><svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.3"
                          d="M16.5 9C16.5 13.125 13.125 16.5 9 16.5C4.875 16.5 1.5 13.125 1.5 9C1.5 4.875 4.875 1.5 9 1.5C13.125 1.5 16.5 4.875 16.5 9Z"
                          fill="currentColor"
                        ></path>
                        <path
                          d="M9 16.5C10.95 16.5 12.75 15.75 14.025 14.55C13.425 12.675 11.4 11.25 9 11.25C6.6 11.25 4.57499 12.675 3.97499 14.55C5.24999 15.75 7.05 16.5 9 16.5Z"
                          fill="currentColor"
                        ></path>
                        <rect
                          x="7"
                          y="6"
                          width="4"
                          height="4"
                          rx="2"
                          fill="currentColor"
                        ></rect>
                      </svg>
                      Курьер</span
                    >
                    <p>{{ order?.courier_name ? order?.courier_name : "---" }}</p>
                  </div>
                </div>
              </div>
              <div>
                <div class="custom_block px-4 py-4 mb-3">
                  <div class="d-flex justify-content-between">
                    <FormTitle title="Статус заказа" />
                    <!-- <a-button type="primary" @click="submitForm">Сохранять</a-button> -->
                  </div>
                  <div class="d-flex column-tags status-tags">
                    <span
                      class="tags-style empty-style"
                      v-for="item in Object.keys(statusTypes)"
                      :class="{
                        tag_pending: currentStatus == 'pending' && item == currentStatus,
                        tag_accepted:
                          currentStatus == 'accepted' && item == currentStatus,
                        tag_canceled:
                          currentStatus == 'canceled' && item == currentStatus,
                        tag_done: currentStatus == 'done' && item == currentStatus,
                        'd-none': item == 'new',
                        tag_returned:
                          currentStatus == 'returned' && item == currentStatus,
                      }"
                      >{{ statusTypes[item] }}</span
                    >
                  </div>

                  <!-- <div class="order-details-items">
                    <span
                      ><svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.3"
                          d="M16.5 9C16.5 13.125 13.125 16.5 9 16.5C4.875 16.5 1.5 13.125 1.5 9C1.5 4.875 4.875 1.5 9 1.5C13.125 1.5 16.5 4.875 16.5 9Z"
                          fill="currentColor"
                        ></path>
                        <path
                          d="M9 16.5C10.95 16.5 12.75 15.75 14.025 14.55C13.425 12.675 11.4 11.25 9 11.25C6.6 11.25 4.57499 12.675 3.97499 14.55C5.24999 15.75 7.05 16.5 9 16.5Z"
                          fill="currentColor"
                        ></path>
                        <rect
                          x="7"
                          y="6"
                          width="4"
                          height="4"
                          rx="2"
                          fill="currentColor"
                        ></rect>
                      </svg>
                      Клиент</span
                    >
                    <div class="order-user">
                      <p>{{ order?.user?.name }}</p>
                    </div>
                  </div> -->
                  <div class="form-block">
                    <div><label for="character_group">Статус</label></div>
                    <el-select
                      class="w-100"
                      v-model="currentStatus"
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
                  </div>
                  <a-button type="primary" @click="submitForm">Сохранять</a-button>
                </div>
                <div class="custom_block px-4 py-4 mb-3">
                  <div class="d-flex justify-content-between">
                    <FormTitle title="Доставка" />
                  </div>
                  <el-form
                    label-position="top"
                    :model="ruleForm"
                    :rules="rules"
                    ref="ruleForm"
                    label-width="120px"
                    class="demo-ruleForm"
                  >
                    <div class="courier-grid-2">
                      <el-form-item class="form-block align-items-start">
                        <el-input
                          v-model="ruleForm.courier_name"
                          placeholder="Имя курьера..."
                        ></el-input>
                      </el-form-item>
                      <el-form-item class="form-block align-items-start">
                        <el-input
                          v-model="ruleForm.courier_phone_number"
                          placeholder="Тел. номер курьера..."
                        ></el-input>
                      </el-form-item>
                    </div>
                    <el-form-item class="form-block align-items-start">
                      <el-input
                        type="textarea"
                        rows="4"
                        placeholder="Доп. инфо"
                        v-model="ruleForm.add_info"
                      ></el-input>
                    </el-form-item>
                  </el-form>
                  <a-button type="primary" @click="submitForm">Сохранять</a-button>
                </div>
                <div class="custom_block px-4 py-4">
                  <div class="d-flex justify-content-between">
                    <FormTitle title="Замечание" />
                  </div>
                  <el-form
                    label-position="top"
                    :model="ruleForm"
                    :rules="rules"
                    ref="ruleForm"
                    label-width="120px"
                    class="demo-ruleForm"
                  >
                    <el-form-item class="form-block align-items-start">
                      <el-input
                        v-model="ruleForm.notes"
                        placeholder="Замечание..."
                        type="textarea"
                        rows="4"
                      ></el-input>
                    </el-form-item>
                  </el-form>
                  <a-button type="primary" @click="submitForm">Сохранять</a-button>
                </div>
              </div>
            </div>
          </div>
          <div
            class="mb-5"
            v-if="order?.delivery_method == 'courier' && order?.user_address"
          >
            <div class="custom_block px-4 py-4 position-relative">
              <FormTitle title="Адрес доставки" />
              <ul class="order-adress-list">
                <li v-if="order?.user_address?.region?.name?.ru">
                  {{ order?.user_address?.region?.name?.ru }},
                </li>
                <li v-if="order?.user_address?.district?.name?.ru">
                  {{ order?.user_address?.district?.name?.ru }},
                </li>
                <li v-if="order?.user_address?.village?.name?.ru">
                  {{ order?.user_address?.village?.name?.ru }},
                </li>
                <li v-if="order?.user_address?.address">
                  {{ order?.user_address?.address }}. ,
                </li>
              </ul>
              <div class="abs_img">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    opacity="0.3"
                    d="M18.041 22.041C18.5932 22.041 19.041 21.5932 19.041 21.041C19.041 20.4887 18.5932 20.041 18.041 20.041C17.4887 20.041 17.041 20.4887 17.041 21.041C17.041 21.5932 17.4887 22.041 18.041 22.041Z"
                    fill="currentColor"
                  />
                  <path
                    opacity="0.3"
                    d="M6.04095 22.041C6.59324 22.041 7.04095 21.5932 7.04095 21.041C7.04095 20.4887 6.59324 20.041 6.04095 20.041C5.48867 20.041 5.04095 20.4887 5.04095 21.041C5.04095 21.5932 5.48867 22.041 6.04095 22.041Z"
                    fill="currentColor"
                  />
                  <path
                    opacity="0.3"
                    d="M7.04095 16.041L19.1409 15.1409C19.7409 15.1409 20.141 14.7409 20.341 14.1409L21.7409 8.34094C21.9409 7.64094 21.4409 7.04095 20.7409 7.04095H5.44095L7.04095 16.041Z"
                    fill="currentColor"
                  />
                  <path
                    d="M19.041 20.041H5.04096C4.74096 20.041 4.34095 19.841 4.14095 19.541C3.94095 19.241 3.94095 18.841 4.14095 18.541L6.04096 14.841L4.14095 4.64095L2.54096 3.84096C2.04096 3.64096 1.84095 3.04097 2.14095 2.54097C2.34095 2.04097 2.94096 1.84095 3.44096 2.14095L5.44096 3.14095C5.74096 3.24095 5.94096 3.54096 5.94096 3.84096L7.94096 14.841C7.94096 15.041 7.94095 15.241 7.84095 15.441L6.54096 18.041H19.041C19.641 18.041 20.041 18.441 20.041 19.041C20.041 19.641 19.641 20.041 19.041 20.041Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div class="mb-5">
            <div class="card_block py-5">
              <div
                class="d-flex justify-content-between align-items-center card_header pt-4"
              >
                <FormTitle :title="`Total: ${order?.products?.length}`" />
              </div>
              <a-table
                :columns="columnsOrder"
                :data-source="order?.products_info"
                :pagination="false"
                align="center"
              >
                <a slot="img" slot-scope="text"
                  ><img class="table-image" :src="text?.images[0]?.md_img" alt=""
                /></a>
                <nuxt-link
                  :to="`/catalog/edit_products/${text?.id}`"
                  slot="product"
                  slot-scope="text"
                  align="center"
                >
                  {{ text?.info?.name?.ru }}
                </nuxt-link>
                <a slot="price" slot-scope="text"
                  >{{
                    `${
                      text?.price_with_discount
                        ? text?.price_with_discount.toFixed()
                        : text?.price.toFixed()
                    }`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                  }}
                  so'm
                  {{
                    text?.price - text?.price_with_discount > 0 ? "(с скидкой)" : ""
                  }}</a
                >
                <span slot="totalSum" slot-scope="text"
                  >{{
                    `${text?.price_with_discount.toFixed() * text?.count}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      " "
                    )
                  }}
                  so'm</span
                >
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
              </a-table>
              <div
                class="d-flex justify-content-end align-items-end flex-column card_header pt-4"
              >
                <div
                  class="d-flex justify-content-end align-items-start flex-column summ-titles"
                >
                  <h2>
                    Скидка:
                    {{
                      ` - ${
                        order?.products_info?.reduce((sum, item) => {
                          return sum + item?.count * item?.price;
                        }, 0) -
                        order?.products_info
                          ?.filter((elem) => elem.price_with_discount)
                          ?.reduce((sum, item) => {
                            return sum + item?.count * item?.price_with_discount;
                          }, 0)
                      }`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                    }}
                    so'm
                  </h2>
                
                  <h2>
                    Доставка
                    {{
                      order?.delivery_price
                        ? `${order?.delivery_price}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                        : 0
                    }}
                    so'm
                  </h2>
                  <FormTitle
                    :title="`Общий сумма: ${`${order?.amount}`.replace(
                      /\B(?=(\d{3})+(?!\d))/g,
                      ' '
                    )} so'm`"
                  />
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="История заказов" name="history">
          <div class="mt-4 mb-5">
            <div class="order-detail-grid-2">
              <div class="custom_block px-4 py-4">
                <FormTitle :title="`Информация заказa (#${order?.id})`" />
                <div class="order-details-items">
                  <span
                    ><svg
                      width="20"
                      height="21"
                      viewBox="0 0 20 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.3"
                        d="M19 3.40002C18.4 3.40002 18 3.80002 18 4.40002V8.40002H14V4.40002C14 3.80002 13.6 3.40002 13 3.40002C12.4 3.40002 12 3.80002 12 4.40002V8.40002H8V4.40002C8 3.80002 7.6 3.40002 7 3.40002C6.4 3.40002 6 3.80002 6 4.40002V8.40002H2V4.40002C2 3.80002 1.6 3.40002 1 3.40002C0.4 3.40002 0 3.80002 0 4.40002V19.4C0 20 0.4 20.4 1 20.4H19C19.6 20.4 20 20 20 19.4V4.40002C20 3.80002 19.6 3.40002 19 3.40002ZM18 10.4V13.4H14V10.4H18ZM12 10.4V13.4H8V10.4H12ZM12 15.4V18.4H8V15.4H12ZM6 10.4V13.4H2V10.4H6ZM2 15.4H6V18.4H2V15.4ZM14 18.4V15.4H18V18.4H14Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M19 0.400024H1C0.4 0.400024 0 0.800024 0 1.40002V4.40002C0 5.00002 0.4 5.40002 1 5.40002H19C19.6 5.40002 20 5.00002 20 4.40002V1.40002C20 0.800024 19.6 0.400024 19 0.400024Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                    Дата добавлена</span
                  >
                  <p>{{ moment(order.created_at).format("DD/MM/YYYY HH:mm") }}</p>
                </div>
                <div class="order-details-items">
                  <span
                    ><svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.3"
                        d="M3.20001 5.91897L16.9 3.01895C17.4 2.91895 18 3.219 18.1 3.819L19.2 9.01895L3.20001 5.91897Z"
                        fill="currentColor"
                      ></path>
                      <path
                        opacity="0.3"
                        d="M13 13.9189C13 12.2189 14.3 10.9189 16 10.9189H21C21.6 10.9189 22 11.3189 22 11.9189V15.9189C22 16.5189 21.6 16.9189 21 16.9189H16C14.3 16.9189 13 15.6189 13 13.9189ZM16 12.4189C15.2 12.4189 14.5 13.1189 14.5 13.9189C14.5 14.7189 15.2 15.4189 16 15.4189C16.8 15.4189 17.5 14.7189 17.5 13.9189C17.5 13.1189 16.8 12.4189 16 12.4189Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M13 13.9189C13 12.2189 14.3 10.9189 16 10.9189H21V7.91895C21 6.81895 20.1 5.91895 19 5.91895H3C2.4 5.91895 2 6.31895 2 6.91895V20.9189C2 21.5189 2.4 21.9189 3 21.9189H19C20.1 21.9189 21 21.0189 21 19.9189V16.9189H16C14.3 16.9189 13 15.6189 13 13.9189Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                    Способ оплаты</span
                  >
                  <p>
                    {{
                      order?.payment_method == "cash" ? "Наличные" : order?.payment_method
                    }}
                  </p>
                </div>
                <div class="order-details-items">
                  <span
                    ><svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 8H16C15.4 8 15 8.4 15 9V16H10V17C10 17.6 10.4 18 11 18H16C16 16.9 16.9 16 18 16C19.1 16 20 16.9 20 18H21C21.6 18 22 17.6 22 17V13L20 8Z"
                        fill="currentColor"
                      ></path>
                      <path
                        opacity="0.3"
                        d="M20 18C20 19.1 19.1 20 18 20C16.9 20 16 19.1 16 18C16 16.9 16.9 16 18 16C19.1 16 20 16.9 20 18ZM15 4C15 3.4 14.6 3 14 3H3C2.4 3 2 3.4 2 4V13C2 13.6 2.4 14 3 14H15V4ZM6 16C4.9 16 4 16.9 4 18C4 19.1 4.9 20 6 20C7.1 20 8 19.1 8 18C8 16.9 7.1 16 6 16Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                    Способ доставки</span
                  >
                  <p>
                    {{ order?.delivery_method == "pickup" ? "Cамовывоз" : "Доставка" }}
                  </p>
                </div>
                <div class="order-details-items">
                  <span
                    ><svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.3"
                        d="M16.5 9C16.5 13.125 13.125 16.5 9 16.5C4.875 16.5 1.5 13.125 1.5 9C1.5 4.875 4.875 1.5 9 1.5C13.125 1.5 16.5 4.875 16.5 9Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M9 16.5C10.95 16.5 12.75 15.75 14.025 14.55C13.425 12.675 11.4 11.25 9 11.25C6.6 11.25 4.57499 12.675 3.97499 14.55C5.24999 15.75 7.05 16.5 9 16.5Z"
                        fill="currentColor"
                      ></path>
                      <rect
                        x="7"
                        y="6"
                        width="4"
                        height="4"
                        rx="2"
                        fill="currentColor"
                      ></rect>
                    </svg>
                    Оператор</span
                  >
                  <p>{{ order?.operator ? order?.operator?.username : "---" }}</p>
                </div>
                <div class="order-details-items">
                  <span
                    ><svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.3"
                        d="M16.5 9C16.5 13.125 13.125 16.5 9 16.5C4.875 16.5 1.5 13.125 1.5 9C1.5 4.875 4.875 1.5 9 1.5C13.125 1.5 16.5 4.875 16.5 9Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M9 16.5C10.95 16.5 12.75 15.75 14.025 14.55C13.425 12.675 11.4 11.25 9 11.25C6.6 11.25 4.57499 12.675 3.97499 14.55C5.24999 15.75 7.05 16.5 9 16.5Z"
                        fill="currentColor"
                      ></path>
                      <rect
                        x="7"
                        y="6"
                        width="4"
                        height="4"
                        rx="2"
                        fill="currentColor"
                      ></rect>
                    </svg>
                    Курьер</span
                  >
                  <p>{{ order?.courier_name ? order?.courier_name : "---" }}</p>
                </div>
              </div>
              <div class="custom_block px-4 py-4">
                <FormTitle title="Сведения о клиенте" />

                <div class="order-details-items">
                  <span
                    ><svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.3"
                        d="M16.5 9C16.5 13.125 13.125 16.5 9 16.5C4.875 16.5 1.5 13.125 1.5 9C1.5 4.875 4.875 1.5 9 1.5C13.125 1.5 16.5 4.875 16.5 9Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M9 16.5C10.95 16.5 12.75 15.75 14.025 14.55C13.425 12.675 11.4 11.25 9 11.25C6.6 11.25 4.57499 12.675 3.97499 14.55C5.24999 15.75 7.05 16.5 9 16.5Z"
                        fill="currentColor"
                      ></path>
                      <rect
                        x="7"
                        y="6"
                        width="4"
                        height="4"
                        rx="2"
                        fill="currentColor"
                      ></rect>
                    </svg>
                    Клиент</span
                  >
                  <div class="order-user">
                    <p>{{ order?.user?.name }}</p>
                  </div>
                </div>
                <div class="order-details-items">
                  <span>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.3"
                        d="M21 19H3C2.4 19 2 18.6 2 18V6C2 5.4 2.4 5 3 5H21C21.6 5 22 5.4 22 6V18C22 18.6 21.6 19 21 19Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M21 5H2.99999C2.69999 5 2.49999 5.10005 2.29999 5.30005L11.2 13.3C11.7 13.7 12.4 13.7 12.8 13.3L21.7 5.30005C21.5 5.10005 21.3 5 21 5Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                    Электронная почта</span
                  >
                  <p>{{ order?.user?.email ? order?.user?.email : "---" }}</p>
                </div>
                <div class="order-details-items">
                  <span>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 20H19V21C19 21.6 18.6 22 18 22H6C5.4 22 5 21.6 5 21V20ZM19 3C19 2.4 18.6 2 18 2H6C5.4 2 5 2.4 5 3V4H19V3Z"
                        fill="currentColor"
                      ></path>
                      <path opacity="0.3" d="M19 4H5V20H19V4Z" fill="currentColor"></path>
                    </svg>
                    Телефон</span
                  >
                  <p>{{ `+${order?.phone_number}` }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="mb-5">
            <div class="card_block py-4">
              <div class="d-flex justify-content-between align-items-center">
                <div
                  class="d-flex align-items-between justify-content-between w-100 pt-3"
                >
                  <FormTitle title=" Истории #14534" />

                  <div class="d-flex align-items-center"></div>
                </div>
              </div>
              <a-table
                :columns="columnsHistory"
                :data-source="history"
                :pagination="false"
                align="center"
              >
                <a slot="img" slot-scope="text"
                  ><img class="table-image" :src="text?.images[0]?.md_img" alt=""
                /></a>
                <nuxt-link
                  :to="`/catalog/edit_products/${text?.id}`"
                  slot="product"
                  slot-scope="text"
                  align="center"
                >
                  {{ text?.info?.name?.ru }}
                </nuxt-link>
                <span slot="numberId" slot-scope="text">#{{ text?.id }}</span>
                <span slot="totalSum" slot-scope="text"
                  >{{ `${text}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ") }} so'm</span
                >
                <span slot="created_at" slot-scope="text"
                  >{{ moment(text).format("DD/MM/YYYY HH:mm") }}
                </span>
                <span slot="delivery_method" slot-scope="text"
                  >{{ text == "pickup" ? "Cамовывоз" : "Доставка" }}
                </span>
                <span
                  slot="is_paid"
                  slot-scope="text"
                  class="tags-style"
                  :class="{
                    tag_new: text == 1,
                    tag_returned: text == 0,
                  }"
                  >{{ text ? "Оплачено" : "Неоплачено" }}
                </span>

                <span slot="customTitle"></span>

                <span
                  slot="tags"
                  slot-scope="tags"
                  class="tags-style"
                  :class="{
                    tag_pending: tags == 'pending',
                    tag_accepted: tags == 'accepted',
                    tag_canceled: tags == 'canceled',
                    tag_done: tags == 'done',
                    tag_new: tags == 'new',
                    tag_returned: tags == 'returned',
                  }"
                >
                  {{ statusTypes[tags] }}
                </span>
                <span slot="btns" slot-scope="text">
                  <span
                    class="action-btn"
                    @click="$router.push(`/orders/${text}/details`)"
                  >
                    <img :src="eyeIcon" alt="" />
                  </span>
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
      </el-tabs>
    </div>
  </div>
</template>
<script>
import TitleBlock from "../../../components/Title-block.vue";
import FormTitle from "../../../components/Form-title.vue";
import moment from "moment";
import global from "../../../mixins/global";
export default {
  layout: "toolbar",
  mixins: [global],
  data() {
    return {
      rules: {
        character_group: [
          {
            required: true,
            // message: "incorrec",
            trigger: "change",
          },
        ],
        character_name: [
          {
            required: true,
            // message: "incorrec",
            trigger: "change",
          },
        ],
      },
      ruleForm: {
        character_group: "",
        character_name: "",
        character_option: "",
      },
      currentStatus: "",
      statusTypes: {
        pending: "Ожидание",
        accepted: "Принятые",
        canceled: "Отмененные",
        done: "Доставленные",
        new: "Новые",
        returned: "Возврат",
      },
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
        courier_name: "",
        courier_phone_number: "",
        add_info: "",
        notes: "",
      },
      history: [],
      count: 10,
      pageSize: 10,
      editIcon: require("../../../assets/svg/components/edit-icon.svg"),
      eyeIcon: require("../../../assets/svg/components/eye-icon.svg"),
      deleteIcon: require("../../../assets/svg/components/delete-icon.svg"),
      loading: false,
      activeName: "summa",
      order: {},
      lang: [
        {
          key: "Русский",
        },
        {
          key: "Uzbek",
        },
        {
          key: "English",
        },
      ],

      columnsOrder: [
        {
          title: "ПРОДУКТ",
          dataIndex: "product",
          key: "product",
          slots: { title: "customTitle" },
          scopedSlots: { customRender: "img" },
          width: "50px",
          align: "left",
          className: "column-img",
          colSpan: 0,
        },
        {
          title: "ПРОДУКТ",
          dataIndex: "product",
          slots: { title: "customTitle" },
          scopedSlots: { customRender: "product" },
          className: "column-code",
          key: "product",
          colSpan: 2,
          align: "left",
          //   width: "20%",
        },
        {
          title: "КОЛ-ВО",
          dataIndex: "count",
          scopedSlots: { customRender: "count" },
          className: "column-code",
          key: "count",
        },
        {
          title: "ЦЕНА ЗА ЕДИНИЦУ ТОВАРА",
          scopedSlots: { customRender: "price" },
          className: "column-code",
          key: "product",
        },
        {
          title: "ОБЩИЙ",
          scopedSlots: { customRender: "totalSum" },
          className: "column-code",
        },
      ],
      columnsHistory: [
        {
          title: "Заказ №",
          slots: { title: "customTitle" },
          scopedSlots: { customRender: "numberId" },
          className: "column-name",
        },
        {
          title: "ДАТА ДОБАВЛЕНА",
          dataIndex: "created_at",
          key: "dateAdd",
          slots: { title: "customTitle" },
          scopedSlots: { customRender: "created_at" },
          className: "column-date",
        },

        {
          title: "Способ оплаты",
          dataIndex: "payment_method",
          scopedSlots: { customRender: "comment" },
          className: "column-name",
          key: "comment",
        },
        {
          title: "СТАТУС ЗАКАЗА",
          dataIndex: "status",
          scopedSlots: { customRender: "tags" },
          className: "column-tags",
          key: "tags",
        },
        {
          title: "Способ доставки",
          dataIndex: "delivery_method",
          scopedSlots: { customRender: "delivery_method" },
          className: "column-code",
          key: "customer",
        },
        {
          title: "ОБЩИЙ",
          dataIndex: "amount",
          scopedSlots: { customRender: "totalSum" },
          className: "column-code",
        },
        {
          title: "действия",
          key: "id",
          dataIndex: "id",
          scopedSlots: { customRender: "btns" },
          className: "column-btns",
          //   width: "10%",
          align: "right",
        },
      ],
    };
  },
  async mounted() {
    if (
      !Object.keys(this.$route.query).includes("page") ||
      !Object.keys(this.$route.query).includes("per_page")
    ) {
      await this.$router.replace({
        path: this.$route.path,
        query: { page: this.params.page, per_page: this.params.pageSize },
      });
    }
    this.__GET_ORDER();
    this.current = Number(this.$route.query.page);
    this.params.pageSize = Number(this.$route.query.per_page);
  },
  methods: {
    moment,
    submitForm() {
      const data = {
        ...this.ruleForm,
        status: this.currentStatus,
      };
      this.__EDIT_ORDER(data);
    },
    async copyText(name) {
      await navigator.clipboard.writeText(name);
      this.$message.success("Copy");
    },
    async __GET_ORDER() {
      const data = await this.$store.dispatch("fetchOrders/getOrdersById", {
        id: this.$route.params.index,
        params: { ...this.$route.query },
      });
      this.totalPage = data?.history?.total;
      this.ruleForm.status = data?.order?.status;
      this.ruleForm.courier_name = data?.order?.courier_name;
      this.ruleForm.courier_phone_number = data?.order?.courier_phone_number;
      this.ruleForm.add_info = data?.order?.add_info;
      this.ruleForm.notes = data?.order?.notes;
      this.currentStatus = data?.order?.status;
      this.order = data?.order;
      this.history = data?.history?.data;
    },
    async __EDIT_ORDER(formData) {
      this.loading = true;
      try {
        const data = await this.$store.dispatch("fetchOrders/editOrders", {
          id: this.$route.params.index,
          data: formData,
        });
        this.$notify({
          title: "Success",
          message: "успешно изменен",
          type: "success",
        });
        this.loading = false;
        this.__GET_ORDER();
      } catch (e) {}
    },
  },
  watch: {
    async current(val) {
      this.changePagination(
        val,
        `/orders/${this.$route.params.index}/details`,
        "__GET_ORDER"
      );
    },
  },
  components: {
    TitleBlock,
    FormTitle,
  },
};
</script>
<style lang="scss">
.summ-titles h2 {
  font-family: "TT Interfaces";
  font-weight: 600 !important;
  font-size: 16px !important;
  font-style: normal;
  line-height: 15.6px;
  color: #181c32;
  margin-bottom: 16px !important;
}
.status-tags {
  gap: 8px;
  margin-bottom: 12px;
}
.courier-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 16px;
}
</style>
