<template lang="html">
  <div>
    <a-layout id="components-layout-demo-side" style="min-height: 100vh;">
      <a-layout-sider
        v-model="collapsed"
        :trigger="null"
        collapsible
        width="265"
      >
        <div class="toolbar-logo" :class="{ collapsedLogo: collapsed }">
          <img src="../assets/svg/custom/toolbar/default-dark.svg" alt="" />
          <div
            class="sidebar_toggle trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            @click="() => (collapsed = !collapsed)"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.5"
                d="M14.2657 11.4343L18.45 7.25C18.8642 6.83579 18.8642 6.16421 18.45 5.75C18.0358 5.33579 17.3642 5.33579 16.95 5.75L11.4071 11.2929C11.0166 11.6834 11.0166 12.3166 11.4071 12.7071L16.95 18.25C17.3642 18.6642 18.0358 18.6642 18.45 18.25C18.8642 17.8358 18.8642 17.1642 18.45 16.75L14.2657 12.5657C13.9533 12.2533 13.9533 11.7467 14.2657 11.4343Z"
                fill="currentColor"
              ></path>
              <path
                d="M8.2657 11.4343L12.45 7.25C12.8642 6.83579 12.8642 6.16421 12.45 5.75C12.0358 5.33579 11.3642 5.33579 10.95 5.75L5.40712 11.2929C5.01659 11.6834 5.01659 12.3166 5.40712 12.7071L10.95 18.25C11.3642 18.6642 12.0358 18.6642 12.45 18.25C12.8642 17.8358 12.8642 17.1642 12.45 16.75L8.2657 12.5657C7.95328 12.2533 7.95328 11.7467 8.2657 11.4343Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
        </div>
        <el-aside width="200px" style="background-color: rgb(238, 241, 246);">
          <el-menu @onchange="takeChange">
            <el-submenu index="1" class="home_menu">
              <div slot="title">
                <svg
                  class="menu-icon"
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
                  ></path>
                  <path
                    opacity="0.3"
                    d="M6.04095 22.041C6.59324 22.041 7.04095 21.5932 7.04095 21.041C7.04095 20.4887 6.59324 20.041 6.04095 20.041C5.48867 20.041 5.04095 20.4887 5.04095 21.041C5.04095 21.5932 5.48867 22.041 6.04095 22.041Z"
                    fill="currentColor"
                  ></path>
                  <path
                    opacity="0.3"
                    d="M7.04095 16.041L19.1409 15.1409C19.7409 15.1409 20.141 14.7409 20.341 14.1409L21.7409 8.34094C21.9409 7.64094 21.4409 7.04095 20.7409 7.04095H5.44095L7.04095 16.041Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M19.041 20.041H5.04096C4.74096 20.041 4.34095 19.841 4.14095 19.541C3.94095 19.241 3.94095 18.841 4.14095 18.541L6.04096 14.841L4.14095 4.64095L2.54096 3.84096C2.04096 3.64096 1.84095 3.04097 2.14095 2.54097C2.34095 2.04097 2.94096 1.84095 3.44096 2.14095L5.44096 3.14095C5.74096 3.24095 5.94096 3.54096 5.94096 3.84096L7.94096 14.841C7.94096 15.041 7.94095 15.241 7.84095 15.441L6.54096 18.041H19.041C19.641 18.041 20.041 18.441 20.041 19.041C20.041 19.641 19.641 20.041 19.041 20.041Z"
                    fill="currentColor"
                  ></path>
                </svg>
                <p>eCommerce</p>
              </div>
              <!-- <el-menu-item-group>
                <div slot="title">Group 1</div>
              </el-menu-item-group> -->
              <el-submenu index="1-1" class="sub_menu">
                <div slot="title">
                  <span class="menu-bullet"
                    ><span class="bullet-dot"></span
                  ></span>
                  <p>Catalog</p>
                </div>
                <el-menu-item-group class="toolbar-menu-products">
                  <el-menu-item
                    index="1-1-1"
                    @click="$router.push('/catalog/products')"
                  >
                    <span class="menu-bullet"
                      ><span class="bullet-dot"></span
                    ></span>
                    <p>Products</p></el-menu-item
                  >
                </el-menu-item-group>
                <el-menu-item-group class="toolbar-menu-products">
                  <el-menu-item
                    index="1-2-1"
                    @click="$router.push('/catalog/categories')"
                  >
                    <span class="menu-bullet"
                      ><span class="bullet-dot"></span
                    ></span>
                    <p>Categories</p></el-menu-item
                  >
                </el-menu-item-group>
                <!-- <el-menu-item-group class="toolbar-menu-products">
                  <el-menu-item
                    index="1-1-2"
                    @click="$router.push('/products/add_products')"
                  >
                    <span class="menu-bullet"
                      ><span class="bullet-dot"></span></span
                    >Add Product</el-menu-item
                  >
                </el-menu-item-group> -->
              </el-submenu>
              <!-- <el-menu-item-group title="Group 2">
                <el-menu-item index="1-3">Option 3</el-menu-item>
              </el-menu-item-group> -->
              <!-- <el-submenu index="1-4"  class="sub_menu">
                <div slot="title"> <span class="menu-bullet"
                    ><span class="bullet-dot"></span
                  ></span>Categories</div>
                <el-menu-item
                  index="1-4-1"
                  @click="$router.push('/products/products')"
                  >Categories</el-menu-item
                >
              </el-submenu> -->
            </el-submenu>
            <el-submenu index="2" class="home_menu">
              <div slot="title">
                <i class="el-icon-menu"></i>
                <p>Navigator Two</p>
              </div>
              <el-menu-item-group class="toolbar-menu-products">
                <div slot="title">Group 1</div>
                <el-menu-item index="2-1">Option 1</el-menu-item>
                <el-menu-item index="2-2">Option 2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="Group 2" class="toolbar-menu-products">
                <el-menu-item index="2-3">Option 3</el-menu-item>
              </el-menu-item-group>
              <el-submenu index="2-4" class="home_menu">
                <div slot="title">Option 4</div>
                <el-menu-item index="2-4-1">Option 4-1</el-menu-item>
              </el-submenu>
            </el-submenu>
          </el-menu>
        </el-aside>
        <div class="toolbar-setting pt-05r pr-15r pl-15r pb-15r">
          <a href="">
            Docs & Components
          </a>
        </div>
      </a-layout-sider>
      <a-layout>
        <a-layout-header style="background: #fff; padding: 0;">
          <a-icon
            class="trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            @click="() => (collapsed = !collapsed)"
          />
        </a-layout-header>
        <a-layout-content
          :style="{
            margin: '24px 16px',
            padding: '24px',
            background: '#fff',
            minHeight: '280px',
          }"
        >
          Content
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>
<script>
export default {
  data() {
    return {
      collapsed: false,
    };
  },
};
</script>
<style lang="scss">
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>
