<template lang="html">
  <div class="toolbar">
    <el-container
      style="height: 500px; border: 1px solid #eee"
      :class="{ collapsedСontrol: collapsed }"
    >
      <div class="toolbar-aside">
        <div class="toolbar-logo">
          <div class="d-flex">
            <span v-html="icons.logoIcon"></span>
            <h3>Admin panel</h3>
          </div>
          <div
            class="sidebar_toggle"
            @click="collapsedToggle"
            v-html="icons.toolbarResIcon"
          ></div>
        </div>
        <el-aside
          width="200px"
          style="background-color: rgb(238, 241, 246)"
          v-if="!loading"
        >
          <el-menu
            @open="handleOpen"
            @close="handleClose"
            :default-active="activeRouterName"
            :default-openeds="defaultOpens"
            ref="mainMenu"
          >
            <el-submenu index="1" class="home_menu">
              <div slot="title">
                <span class="menu-icon" v-html="icons.catalogIcon"></span>
                <p>Каталог</p>
              </div>
              <el-menu-item-group
                v-for="(items, index) in toolbarMenu.category"
                v-if="items.show"
                class="toolbar-menu-products"
                :class="{ disabled: items.disabled }"
                :key="index"
              >
                <nuxt-link
                  :to="items.to"
                  :class="{ 'event-none': items.to == $route.path }"
                >
                  <el-menu-item
                    :index="items.index"
                    :class="{
                      is_active: items.to == $route.path,
                      disabled: items.disabled,
                    }"
                  >
                    <span class="menu-bullet"><span class="bullet-dot"></span></span>
                    <p>{{ items.name }}</p></el-menu-item
                  >
                </nuxt-link>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="9" class="home_menu" v-if="checkShow('dashboard')">
              <div slot="title">
                <span class="menu-icon" v-html="icons.dashboardIcon"></span>
                <p>Dashboard</p>
              </div>
              <el-menu-item-group
                v-for="(items, index) in toolbarMenu.dashboard"
                v-if="items.show"
                class="toolbar-menu-products"
                :class="{ disabled: items.disabled }"
                :key="index"
              >
                <nuxt-link
                  :to="items.to"
                  :class="{ 'event-none': items.to == $route.path }"
                >
                  <el-menu-item
                    :index="items.index"
                    :class="{
                      is_active: items.to == $route.path,
                      disabled: items.disabled,
                    }"
                  >
                    <span class="menu-bullet"><span class="bullet-dot"></span></span>
                    <p>{{ items.name }}</p></el-menu-item
                  >
                </nuxt-link>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="8" class="home_menu" v-if="checkShow('showcases')">
              <div slot="title">
                <span class="menu-icon" v-html="icons.orderIcon"> </span>
                <p>Витрины</p>
              </div>
              <el-menu-item-group
                v-for="(items, index) in toolbarMenu.showcases"
                class="toolbar-menu-products"
                :key="index"
                :class="{ disabled: items.disabled }"
              >
                <nuxt-link :to="items.to">
                  <el-menu-item
                    :index="items.index"
                    :class="{
                      is_active: items.to == $route.path,
                      disabled: items.disabled,
                    }"
                  >
                    <span class="menu-bullet"><span class="bullet-dot"></span></span>
                    <p>{{ items.name }}</p></el-menu-item
                  >
                </nuxt-link>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu
              index="2"
              class="home_menu"
              v-if="toolbarMenu.orders?.filter((elem) => elem.show).length > 0"
            >
              <div slot="title">
                <span class="menu-icon" v-html="icons.orderIcon"> </span>
                <p>Заказы</p>
              </div>
              <el-menu-item-group
                v-for="(items, index) in toolbarMenu.orders"
                v-if="items.show"
                class="toolbar-menu-products"
                :key="index"
                :class="{
                  disabled: items.disabled,
                }"
              >
                <nuxt-link :to="items.to">
                  <el-menu-item
                    :index="items.index"
                    :class="{
                      is_active: items.to == $route.path,
                    }"
                  >
                    <span class="menu-bullet"><span class="bullet-dot"></span></span>
                    <p>{{ items.name }}</p></el-menu-item
                  >
                </nuxt-link>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu
              index="3"
              class="home_menu"
              v-if="toolbarMenu.marketing?.filter((elem) => elem.show).length > 0"
            >
              <div slot="title">
                <span v-html="icons.marketingIcon" class="menu-icon"> </span>
                <p>Маркетинг</p>
              </div>
              <el-menu-item-group
                class="toolbar-menu-products"
                v-for="(items, index) in toolbarMenu.marketing"
                v-if="items.show"
                :key="index"
              >
                <nuxt-link :to="items.to">
                  <el-menu-item
                    :index="items.index"
                    :class="{
                      is_active: items.to == $route.path,
                      disabled: items.disabled,
                    }"
                  >
                    <span class="menu-bullet"><span class="bullet-dot"></span></span>
                    <p>{{ items.name }}</p></el-menu-item
                  >
                </nuxt-link>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item-group
              class="home_menu toolbar-menu-products"
              v-if="checkShow('clients')"
            >
              <nuxt-link to="/home/clients">
                <el-menu-item
                  index="40"
                  :class="{
                    is_active: $route.path.includes('clients'),
                  }"
                >
                  <span class="menu-icon" v-html="icons.customerIcon"> </span>
                  <p class="not-ul-menu">Клиенты</p></el-menu-item
                >
              </nuxt-link>
            </el-menu-item-group>
            <el-submenu
              index="5"
              class="home_menu"
              v-if="toolbarMenu.content?.filter((elem) => elem.show).length > 0"
            >
              <div slot="title">
                <span class="menu-icon" v-html="icons.contentIcon"> </span>
                <p>Контент сайта</p>
              </div>
              <el-menu-item-group
                class="toolbar-menu-products"
                v-for="(items, index) in toolbarMenu.content"
                v-if="items.show"
                :key="index"
                :class="{ disabled: items.disabled }"
              >
                <nuxt-link :to="items.to">
                  <el-menu-item
                    :index="items.index"
                    :class="{
                      is_active: items.to == $route.path,
                      disabled: items.disabled,
                    }"
                  >
                    <span class="menu-bullet"><span class="bullet-dot"></span></span>
                    <p>{{ items.name }}</p></el-menu-item
                  >
                </nuxt-link>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu
              index="6"
              class="home_menu"
              v-if="toolbarMenu.settings?.filter((elem) => elem.show).length > 0"
            >
              <div slot="title">
                <span class="menu-icon" v-html="icons.settingsIcon"> </span>
                <p>Настройки сайта</p>
              </div>

              <el-submenu
                index="7"
                v-for="(items, index) in toolbarMenu.settings"
                v-if="items.submenu && items.show"
                :key="index"
              >
                <template slot="title">{{ items.name }}</template>
                <el-menu-item-group
                  class="toolbar-menu-products"
                  v-for="(itemsIn, index) in items.data"
                  :key="index"
                  :class="{ disabled: items.disabled }"
                  v-if="itemsIn.show"
                >
                  <nuxt-link :to="itemsIn.to" class="sub_menu">
                    <el-menu-item
                      :index="itemsIn.index"
                      :class="{ is_active: itemsIn.to == $route.path }"
                    >
                      <span class="menu-bullet"><span class="bullet-dot"></span></span>
                      <p>{{ itemsIn.name }}</p></el-menu-item
                    >
                  </nuxt-link>
                </el-menu-item-group>
              </el-submenu>

              <el-menu-item-group
                class="toolbar-menu-products"
                v-for="(items, index) in toolbarMenu.settings"
                :key="index"
                :class="{ disabled: items.disabled }"
                v-if="items.show && items.to"
              >
                <nuxt-link :to="items.to">
                  <el-menu-item
                    :index="items.index"
                    :class="{
                      is_active: items.to == $route.path,
                      disabled: items.disabled,
                    }"
                  >
                    <span class="menu-bullet"><span class="bullet-dot"></span></span>
                    <p>{{ items.name }}</p></el-menu-item
                  >
                </nuxt-link>
              </el-menu-item-group>
            </el-submenu>
            <!-- <el-menu-item-group class="home_menu toolbar-menu-products">
              <nuxt-link to="/home/content-manager">
                <el-menu-item
                  index="70"
                  :class="{
                    is_active: $route.path.includes('content-manager'),
                  }"
                >
                  <span class="menu-icon" v-html="icons.contentManagerIcon"></span>
                  <p class="not-ul-menu">Контент-менеджеры</p></el-menu-item
                >
              </nuxt-link>
            </el-menu-item-group> -->
          </el-menu>
        </el-aside>
        <div class="toolbar-setting pt-05r pr-15r pl-15r pb-15r">
          <a href=""> Docs & Components </a>
        </div>
      </div>
      <el-container class="toolbar-right">
        <el-header
          style="text-align: right; font-size: 12px"
          class="d-flex justify-content-between"
        >
          <div><div class="header-btn"></div></div>
          <div class="d-flex align-items-center">
            <nuxt-link to="/contents/comments" class="mx-5">
              <a-badge :count="comments?.total">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  version="1.1"
                  x="0px"
                  width="24"
                  y="0px"
                  viewBox="0 0 256 256"
                  enable-background="new 0 0 256 256"
                  xml:space="preserve"
                >
                  <metadata>
                    Svg Vector Icons : http://www.onlinewebfonts.com/icon
                  </metadata>
                  <g>
                    <g>
                      <path
                        fill="#a1a5b7"
                        d="M183.1,73.5H72.9c-4.7,0-7.9,3.2-7.9,7.9c0,4.7,3.2,7.9,7.9,7.9h110.1c4.7,0,7.9-3.2,7.9-7.9C190.9,76.7,187.8,73.5,183.1,73.5z"
                      />
                      <path
                        fill="#a1a5b7"
                        d="M183.1,112.9H72.9c-4.7,0-7.9,3.2-7.9,7.9s3.2,7.9,7.9,7.9h110.1c4.7,0,7.9-3.2,7.9-7.9C190.9,116,187.8,112.9,183.1,112.9z"
                      />
                      <path
                        fill="#a1a5b7"
                        d="M222.4,10.6c0.8,0-188.8,0-188.8,0c-15,0-23.6,7.9-23.6,22.8v134.5c0,15,8.6,23.6,23.6,23.6h31.5v39.3c2.4,11,18.1,22,39.3,7.9l47.2-47.2h70.8c15,0,23.6-16.5,23.6-31.5V34.2C246,19.3,236.6,10.6,222.4,10.6z M230.3,160.1c0,10.2-6.3,15.7-16.5,15.7c0.8,0-70,0-70,0L96.5,223c-10.2,10.2-15.7,0-15.7-7.9c0-16.5,0-39.3,0-39.3H41.5c-10.2,0-15.7-5.5-15.7-15.7v-118c0-10.2,5.5-15.7,15.7-15.7h173.1c10.2,0,15.7,5.5,15.7,15.7V160.1z"
                      />
                    </g>
                  </g>
                </svg>
              </a-badge>
            </nuxt-link>
            <div class="block d-flex align-items-center">
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link d-flex">
                  <el-avatar
                    shape="circle"
                    size="medium"
                    :src="squareUrl"
                    alt="avatar"
                  ></el-avatar>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="logout">Log Out</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </el-header>
        <div class="toolbar-inner">
          <Nuxt />
        </div>
      </el-container>
    </el-container>
    <div v-if="loading" class="loader"><a-spin /></div>
  </div>
</template>
<script>
import FormTitle from "../components/Form-title.vue";
import AddModal from "../components/modals/Add-modal.vue";
export default {
  middleware: ["auth"],
  data() {
    const item = {
      date: "2016-05-02",
      name: "Tom",
      address: "No. 189, Grove St, Los Angeles",
    };
    return {
      comments: {},
      loading: false,
      activeRouterName: "",
      tableData: Array(20).fill(item),
      sidebarToggle: true,
      collapsed: false,
      defaultOpens: [],
      icons: {
        catalogIcon: require("../assets/svg/custom/toolbar/eCommersSvg.svg?raw"),
        orderIcon: require("../assets/svg/custom/toolbar/orderIcon.svg?raw"),
        marketingIcon: require("../assets/svg/custom/toolbar/marketingIcon.svg?raw"),
        customerIcon: require("../assets/svg/custom/toolbar/customerIcon.svg?raw"),
        contentIcon: require("../assets/svg/custom/toolbar/contentIcon.svg?raw"),
        settingsIcon: require("../assets/svg/custom/toolbar/settingsIcon.svg?raw"),
        contentManagerIcon: require("../assets/svg/custom/toolbar/contentManagerIcon.svg?raw"),
        toolbarResIcon: require("../assets/svg/custom/toolbar/toolbarResIcon.svg?raw"),
        logoIcon: require("../assets/svg/custom/toolbar/home24-logo.svg?raw"),
        dashboardIcon: require("../assets/svg/custom/toolbar/dashboard.svg?raw"),
      },
      toolbarMenu: {},
      squareUrl: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
    };
  },

  computed: {
    routerName() {
      return this.$route.name;
    },
  },
  async mounted() {
    this.loading = true;
    this.__GET_COMMENTS();
    await this.$store.dispatch("getPermissions");
    await this.$store.dispatch("getOrdersCount");
    this.loading = false;
    this.toolbarMenu = {
      dashboard: [
        {
          name: "Dashboard",
          index: "81",
          to: "/dashboard",
          path: "dashboard",
          disabled: false,
          show: this.checkShow("dashboard"),
          // show: true,
        },
      ],
      category: [
        {
          name: "Продукты",
          index: "11",
          to: "/catalog/products",
          path: "catalog-products",
          disabled: false,
          show: this.checkShow("products"),
        },
        {
          name: "Категории",
          index: "12",
          to: "/catalog/categories",
          path: "catalog-categories",
          show: this.checkShow("categories"),
        },
        {
          name: "Атрибуты",
          index: "13",
          to: "/catalog/atributs",
          path: "catalog-atributs",
          show: this.checkShow("attributes"),
        },
        {
          name: "Характеристика",
          index: "14",
          to: "/catalog/characteristic_groups",
          path: "catalog-characteristic_groups",
          disabled: false,
          show: this.checkShow("characteristics"),
        },
        {
          name: "Бренды",
          index: "15",
          to: "/catalog/brands",
          path: "catalog-brands",
          disabled: false,
          show: this.checkShow("brands"),
        },
        // {
        //   name: "Значки",
        //   index: "16",
        //   to: "/catalog/badges",
        //   path: "catalog-badges",
        //   disabled: false,
        //   show: this.checkShow("badges"),
        // },
      ],
      showcases: [],
      orders: [
        {
          name: `Все заказы (${this.$store.state.ordersCount.all})`,
          index: "21",
          to: "/orders/all-orders",
          path: "orders-all-orders",
          disabled: false,
          show: this.checkShow("orders"),
        },
        {
          name: `Новые заказы (${this.$store.state.ordersCount.new})`,
          index: "22",
          to: "/orders/new-orders",
          path: "orders-new-orders",
          disabled: false,
          show: this.checkShow("orders"),
        },
        {
          name: `Принятые заказы (${this.$store.state.ordersCount.accepted})`,
          index: "23",
          to: "/orders/accepted-orders",
          path: "orders-accepted-orders",
          disabled: false,
          show: this.checkShow("orders"),
        },

        {
          name: `Ожидание (${this.$store.state.ordersCount.pending})`,
          index: "24",
          to: "/orders/pending-orders",
          path: "orders-pending-orders",
          disabled: false,
          show: this.checkShow("orders"),
        },
        {
          name: `В доставке (${this.$store.state.ordersCount.on_the_way})`,
          index: "25",
          to: "/orders/delivery-orders",
          path: "orders-delivery-orders",
          disabled: false,
          show: this.checkShow("orders"),
        },
        // {
        //   name: "Готовые в отправке (0)",
        //   index: "24",
        //   to: "/orders/ready-orders",
        //   path: "orders-ready-orders",

        //   disabled: false,
        // show: this.checkShow("orders"),
        // },
        // {
        //   name: "В доставке (0)",
        //   index: "25",
        //   to: "/orders/delivery-orders",
        //   path: "orders-delivery-orders",
        //   disabled: false,
        // show: this.checkShow("orders"),
        // },
        {
          name: `Возврат (${this.$store.state.ordersCount.returned})`,
          index: "26",
          to: "/orders/returned-orders",
          path: "orders-returned-orders",

          disabled: false,
          show: this.checkShow("orders"),
        },
        {
          name: `Доставленные (${this.$store.state.ordersCount.done})`,
          index: "27",
          to: "/orders/done-orders",
          path: "orders-done-orders",

          disabled: false,
          show: this.checkShow("orders"),
        },
        {
          name: `Отмененные (${this.$store.state.ordersCount.canceled})`,
          index: "28",
          to: "/orders/canceled-orders",
          path: "orders-canceled-orders",
          disabled: false,
          show: this.checkShow("orders"),
        },
        {
          name: "Заявки",
          index: "29",
          to: "/orders/applications",
          path: "orders-applications",
          disabled: false,
          show: this.checkShow("applications"),
        },
      ],
      marketing: [
        {
          name: "Скидки",
          index: "31",
          to: "/inbox/discount",
          path: "inbox-discount",
          disabled: false,
          show: this.checkShow("discount"),
        },
        {
          name: "По Email",
          index: "32",
          to: "/inbox/email",
          path: "inbox-email",
          disabled: false,
          show: false,
        },
        {
          name: "SMS Рассылка",
          index: "33",
          to: "/inbox/sms",
          path: "inbox-sms",
          disabled: false,
          show: this.checkShow("sms"),
        },
        {
          name: "Aкции",
          index: "34",
          to: "/inbox/promotions",
          path: "inbox-promotions",
          disabled: false,
          show: this.checkShow("promotions"),
        },
      ],
      content: [
        {
          name: "Блог",
          index: "51",
          to: "/contents/blog",
          path: "contents-blog",
          disabled: false,
          show: this.checkShow("posts"),
        },
        {
          name: "Баннеры",
          index: "52",
          to: "/contents/banners",
          path: "contents-banners",
          disabled: false,
          show: this.checkShow("banners"),
        },
        {
          name: "Отзывы",
          index: "53",
          to: "/contents/comments",
          disabled: false,
          show: this.checkShow("comments"),
        },
        // {
        //   name: "Отзывы",
        //   index: "54",
        //   to: "/contents/banners2",
        //   path: "contents-banners2",
        //   disabled: true,
        // },
        {
          name: "Вопрос и ответы",
          index: "55",
          to: "/contents/faq",
          path: "contents-faq",
          disabled: false,
          show: this.checkShow("faqs"),
        },
        // {
        //   name: "Категории (F.A.Q)",
        //   index: "56",
        //   to: "/contents/faq_categories",
        //   path: "contents-faq_categories",
        //   disabled: false,
        //   show: this.checkShow("faq-categories"),
        // },
        {
          name: "Feedbacks",
          index: "57",
          to: "/contents/feedbacks",
          path: "contents-feedbacks",
          disabled: false,
          show: this.checkShow("feedbacks"),
        },
        // {
        //   name: "Топ меню",
        //   index: "58",
        //   to: "/contents/top-menu",
        //   path: "contents-top-menu",
        //   disabled: false,
        //   show: this.checkShow("top-bars"),
        // },
      ],
      settings: [
        {
          name: "Характеристика",
          disabled: false,
          submenu: true,
          index: "61",
          show: this.checkShow("characteristic-options"),
          data: [
            {
              index: "71",
              name: "Параметры",
              to: "/settings/characteristics/options",
              path: "settings-characteristics-options",
              disabled: false,
              show: true,
            },
          ],
        },
        {
          name: "Переводы",
          index: "62",
          to: "/settings/translations",
          path: "settings-translations",
          disabled: false,
          show: this.checkShow("translations"),
        },
        {
          name: "Общие данные",
          index: "64",
          to: "/settings/site-info",
          path: "settings-site-info",
          disabled: false,
          show: this.checkShow("site-info"),
        },
        {
          name: "Пользователи",
          index: "65",
          to: "/settings/users",
          path: "settings-users",
          disabled: false,
          show: this.checkShow("users"),
        },
        {
          name: "Роли",
          index: "66",
          to: "/settings/roles",
          path: "settings-roles",
          disabled: false,
          show: this.checkShow("roles"),
        },
        {
          name: "Permissions group",
          index: "67",
          to: "/settings/permissions-group",
          path: "settings-permissions-group",
          disabled: false,
          show: this.checkShow("permission-groups"),
        },
        {
          name: `Регионы`,
          index: "68",
          to: "/settings/regions",
          path: "settings-regions",
          disabled: false,
          show: this.checkShow("regions"),
        },
      ],
    };
    await Promise.all([this.$store.dispatch("getShowCasesStore")]);
    this.toolbarMenu.showcases = [];
    this.$store.state.showcases.forEach((elem, index) => {
      this.toolbarMenu.showcases.push({
        name: elem?.name?.ru,
        index: `${81 + index}`,
        to: `/showcases/case/${elem.id}`,
        path: `showcases-case-${elem.id}`,
        disabled: false,
      });
    });
    if (localStorage.getItem("auth_token")) {
      this.$store.commit("logIn");
    } else {
      // this.$router.push("/admin/login");
      this.$store.commit("logOut");
    }
    this.handleOpen();
    this.handleClose();
    this.activeOpens();
    this.checkToolbar(this.$route.path);
  },

  methods: {
    async __GET_COMMENTS() {
      const data = await this.$store.dispatch("fetchComments/getComments", {
        ...this.$route.query,
      });

      this.comments = data?.comments;
    },
    checkShow(val) {
      if (this.$store.state.permissions.length > 0) {
        const target = this.$store.state.permissions.find((item) => item.url == val);
        return Boolean(target?.methods.includes("GET"));
      } else {
        return true;
      }
    },
    async logOut() {
      try {
        const data = await this.$store.dispatch("fetchAuth/logOut");
        await localStorage.removeItem("auth_token");
        this.$router.push("/");
      } catch (e) {
        this.statusFunc(e);
      }
    },
    takeChange(e) {},
    handleCommand(command) {
      switch (command) {
        case "logout":
          this.logOut();

          break;
      }
    },
    activeOpens() {
      const routerName = this.$route.name;
      if (routerName.includes("catalog")) {
        this.defaultOpens = ["1"];
      } else if (routerName.includes("orders")) {
        this.defaultOpens = ["2"];
      } else if (routerName.includes("inbox")) {
        this.defaultOpens = ["3"];
      } else if (routerName.includes("contents")) {
        this.defaultOpens = ["5"];
      } else if (routerName.includes("characteristics")) {
        this.defaultOpens = ["6", "7"];
      } else if (routerName.includes("showcases")) {
        this.defaultOpens = ["8"];
      } else if (routerName.includes("settings")) {
        this.defaultOpens = ["6"];
      } else if (routerName.includes("dashboard")) {
        this.defaultOpens = ["9"];
      }
    },
    handleOpen(key, keyPath) {},
    handleClose(key, keyPath) {},
    collapsedToggle() {
      this.collapsed = !this.collapsed;
    },
    checkToolbar(newVal) {
      const toolBarNames = Object.keys(this.toolbarMenu);
      toolBarNames.forEach((elem) => {
        this.toolbarMenu[elem].forEach((item) => {
          switch (newVal) {
            case item.to:
              this.activeRouterName = item.index;
              break;
          }
        });
      });
    },
  },
  watch: {
    "$store.state.changeShowcases"(val) {
      this.toolbarMenu.showcases = [];
      this.$store.state.showcases.forEach((elem, index) => {
        this.toolbarMenu.showcases.push({
          name: elem?.name?.ru,
          index: `${81 + index}`,
          to: `/showcases/case/${elem.id}`,
          path: `showcases-case-${elem.id}`,
          disabled: false,
        });
      });
    },
    async routerName(oldVal, newVal) {
      if (oldVal !== newVal) {
        if (oldVal.includes("catalog")) {
          this.defaultOpens = ["1"];
        } else if (oldVal.includes("orders")) {
          this.defaultOpens = ["2"];
          await this.$store.dispatch("getOrdersCount");
          this.loading = false;
          this.toolbarMenu.orders = [
            {
              name: `Все заказы (${this.$store.state.ordersCount.all})`,
              index: "21",
              to: "/orders/all-orders",
              path: "orders-all-orders",
              disabled: false,
              show: this.checkShow("orders"),
            },
            {
              name: `Новые заказы (${this.$store.state.ordersCount.new})`,
              index: "22",
              to: "/orders/new-orders",
              path: "orders-new-orders",
              disabled: false,
              show: this.checkShow("orders"),
            },
            {
              name: `Принятые заказы (${this.$store.state.ordersCount.accepted})`,
              index: "23",
              to: "/orders/accepted-orders",
              path: "orders-accepted-orders",
              disabled: false,
              show: this.checkShow("orders"),
            },
            {
              name: `Ожидание (${this.$store.state.ordersCount.pending})`,
              index: "24",
              to: "/orders/pending-orders",
              path: "orders-pending-orders",
              disabled: false,
              show: this.checkShow("orders"),
            },
            {
              name: `В доставке (${this.$store.state.ordersCount.on_the_way})`,
              index: "25",
              to: "/orders/delivery-orders",
              path: "orders-delivery-orders",
              disabled: false,
              show: this.checkShow("orders"),
            },
            {
              name: `Возврат (${this.$store.state.ordersCount.returned})`,
              index: "26",
              to: "/orders/returned-orders",
              path: "orders-returned-orders",

              disabled: false,
              show: this.checkShow("orders"),
            },
            {
              name: `Доставленные (${this.$store.state.ordersCount.done})`,
              index: "27",
              to: "/orders/done-orders",
              path: "orders-done-orders",

              disabled: false,
              show: this.checkShow("orders"),
            },
            {
              name: `Отмененные (${this.$store.state.ordersCount.canceled})`,
              index: "28",
              to: "/orders/canceled-orders",
              path: "orders-canceled-orders",
              disabled: false,
              show: this.checkShow("orders"),
            },
            {
              name: "Заявки",
              index: "29",
              to: "/orders/applications",
              path: "orders-applications",
              disabled: false,
              show: this.checkShow("applications"),
            },
          ];
        } else if (oldVal.includes("inbox")) {
          this.defaultOpens = ["3"];
        } else if (oldVal.includes("contents")) {
          this.defaultOpens = ["5"];
        } else if (oldVal.includes("contents")) {
          this.defaultOpens = ["5"];
        } else if (oldVal.includes("characteristics")) {
          this.defaultOpens = ["6", "7"];
        } else if (oldVal.includes("showcases")) {
          this.defaultOpens = ["8"];
        } else if (oldVal.includes("settings")) {
          this.defaultOpens = ["6"];
        }
      }
      this.checkToolbar(oldVal);
    },
  },
  components: { FormTitle, AddModal },
};
</script>
<style>
.disabled {
  color: red !important;
  background: rgba(255, 0, 0, 0.02);
  pointer-events: none !important;
}
.event-none {
  pointer-events: none;
}
.loader {
  background-color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
