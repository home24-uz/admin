<template lang="html">
  <div>
    <TitleBlock title="Продукты" :breadbrumb="['Каталог']" lastLink="Продукты">
      <div class="d-flex">
        <div
          class="add-btn add-header-btn add-header-btn-padding btn-light-primary mx-3"
          @click="$router.go(-1)"
        >
          Отмена
        </div>
        <a-button
          v-if="checkAccess('products', 'PUT')"
          class="add-btn add-header-btn btn-primary d-flex align-items-center"
          type="primary"
          @click="submitForm('ruleForm')"
          :loading="uploadLoading"
        >
          Сохранить изменение
        </a-button>
      </div>
    </TitleBlock>
    <div class="container_xl">
      <div class="card_block-form py-5 position-relative">
        <Loader v-if="loading" />

        <el-form
          label-position="top"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="120px"
          class="demo-ruleForm"
        >
          <div
            class="d-flex justify-content-between align-items-center card_header card_tabs_padding"
          ></div>
          <div class="products-from-grid">
            <div class="products-select-grid">
              <el-tabs class="form_tabs" v-model="activeName">
                <el-tab-pane
                  v-for="(item, index) in lang"
                  :label="item.label"
                  :name="item.label"
                  :key="index"
                >
                  <div class="form-container form-container-ltr">
                    <div class="d-flex justify-content-start">
                      <FormTitle title="Изменить продукт" />
                    </div>
                    <div class="form-block required">
                      <el-form-item prop="name.ru" label="Имя">
                        <el-input
                          v-model="ruleForm.name[item.key]"
                          placeholder="Имя продукта"
                        ></el-input>
                      </el-form-item>
                    </div>

                    <!-- <div class="products-input-grid-3">
                      <div class="form-block">
                        <el-form-item prop="model" label="Модель">
                          <el-input
                            v-model="ruleForm.model"
                            placeholder="Модель продукта"
                          ></el-input>
                        </el-form-item>
                      </div>
                    </div> -->
                  </div>
                </el-tab-pane>
              </el-tabs>
              <div class="form-container">
                <div class="d-flex justify-content-start">
                  <FormTitle title="Информация о продукте" />
                </div>
                <div class="d-flex align-items-end">
                  <div class="form-block mb-0 w-100 required">
                    <div><label>Категория</label></div>
                    <span class="bottom_text mt-0 mb-1">Добавить товар в категорию</span>
                    <el-form-item>
                      <a-cascader
                        :options="cascaderCategories"
                        :show-search="{ filter }"
                        popupClassName="category-cascader"
                        class="category-select w-100"
                        popper-class="select-popper-hover"
                        v-model="cascader"
                        placeholder="Выберите категорию"
                        @change="onChange"
                        :fieldNames="{
                          label: 'label',
                          value: 'id',
                          children: 'children',
                        }"
                      >
                      </a-cascader>
                    </el-form-item>
                  </div>
                  <!-- <div class="prducts-details-btns mb-2">
                    <div
                      class="outline-btn outline-light-green-btn disabled"
                      :class="{ disabledBtn: lastCategory.length < 1 }"
                      @click="reloadCategories"
                      v-html="reloadIcon"
                    ></div>
                    <div
                      class="outline-btn outline-light-blue-btn disabled"
                      @click="showModal('category')"
                      v-html="plusCategoryIcon"
                    ></div>
                  </div> -->
                </div>
                <!-- <span class="last-info" v-if="lastCategory.length > 0"
                  >Недавняя категория:
                  <p @click="reloadCategories">{{ findLastCategory }}</p></span
                > -->
              </div>
              <el-tabs class="form_tabs" v-model="activeName">
                <el-tab-pane
                  v-for="(item, index) in lang"
                  :label="item.label"
                  :name="item.label"
                  :key="index"
                >
                  <div class="form-container form-container-ltr">
                    <div class="d-flex justify-content-start">
                      <FormTitle title="Информация о продукте" />
                    </div>
                    <el-tabs class="desc_tab" v-model="activeDesc">
                      <el-tab-pane label="Описание" name="Description">
                        <div class="mt-1">
                          <quill-editor
                            style="min-height: 250px"
                            :options="editorOption"
                            v-model="ruleForm.desc[item.key]"
                          /></div
                      ></el-tab-pane>
                      <el-tab-pane label="Характеристика" name="Character">
                        <div>
                          <h5 class="variant-img-title mb-4 mt-2">
                            Добавить характеристику
                          </h5>
                          <a-button type="primary" @click="showModal('character')"
                            >Редактировать характеристику
                          </a-button>
                        </div>
                      </el-tab-pane>
                    </el-tabs>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
            <!-- Product right details -->
            <div class="products-img-grid">
              <div class="form-container">
                <el-form
                  label-position="top"
                  :model="ruleForm"
                  :rules="rules"
                  ref="ruleForm"
                  label-width="120px"
                  class="demo-ruleForm"
                  action=""
                >
                  <div
                    class="form-block status-style"
                    :class="[ruleForm.is_active ? 'status-active' : 'status-inactive']"
                  >
                    <el-form-item label="Статус">
                      <el-select
                        id="status"
                        class="w-100"
                        popper-class="select-popper-hover"
                        v-model="ruleForm.is_active"
                        default-first-option
                        placeholder="Статус"
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
                    <span class="bottom_text">Установить статус продукта</span>
                  </div>
                  <div class="form-block mb-0">
                    <div><label for="">Бренд</label></div>
                    <div class="product-plus-btn">
                      <el-form-item prop="brand_id">
                        <el-select
                          class="w-100"
                          v-model="ruleForm.brand_id"
                          allow-create
                          popper-class="select-popper-hover"
                          :loading="brands.length < 1"
                          loading-text="Loading..."
                          placeholder="Бренд"
                        >
                          <el-option
                            v-for="item in brands"
                            :key="item?.id"
                            :label="item?.name"
                            :value="item?.id"
                          >
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <div
                        class="outline-btn outline-light-blue-btn mt-1"
                        @click="showModal('brand')"
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 6V18M18 12L6 12"
                            stroke="#5899FF"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                    <div class="bottom_text">Установить статус продукта</div>
                  </div>
                </el-form>
              </div>
              <!-- <div class="form-container">
                <ProductsStatistic />
              </div> -->
            </div>
            <!-- Product right details -->
          </div>
          <!-- Product Variants -->

          <transition-group name="el-zoom-in-top" tag="ul">
            <div
              class="form-container product_list"
              v-for="(element, elementIndex) in ruleForm.products"
              :key="element.id"
              :class="{
                'variant-modal': productModal[`product_modal${element.id}`] == true,
              }"
            >
              <div class="d-flex justify-content-between variant-header">
                <h4 class="variant-title">Вариация №{{ element.id }}</h4>
                <div class="d-flex">
                  <div
                    class="variant-btn variant-btn-check"
                    v-if="productModal[`product_modal${element.id}`]"
                    @click="fullScreen(element.id, false)"
                  >
                    <a-icon
                      type="fullscreen-exit"
                      :style="{ color: '#3699FF', fontSize: '18px' }"
                    />
                  </div>
                  <div
                    v-else
                    class="variant-btn variant-btn-check mx-3"
                    @click="fullScreen(element.id, true)"
                  >
                    <a-icon
                      type="fullscreen"
                      :style="{ color: '#3699FF', fontSize: '18px' }"
                    />
                  </div>
                  <!-- <div
                    v-if="!productModal[`product_modal${element.id}`]"
                    class="variant-btn variant-btn-delete"
                    @click="deleteProduct(element.id)"
                    v-html="removeIcon"
                  ></div> -->
                </div>
              </div>
              <div class="variant-img-container">
                <h5 class="variant-img-title">Изображение товара</h5>

                <div class="variant-img">
                  <div class="list2">
                    <drop-list
                      :items="element.imagesData"
                      class="item-upload"
                      @insert="($event) => onInsert($event, element.id)"
                      @reorder="$event.apply(element.imagesData)"
                    >
                      <template v-slot:item="{ item }">
                        <drag :key="item.uid">
                          <div class="upload-card">
                            <div class="upload_actions">
                              <span @click="uploadSHow(item)">
                                <a-icon class="upload_icons" type="eye" />
                              </span>
                              <span @click="uploadDelete(element.id, item.uid)">
                                <a-icon class="upload_icons" type="delete" />
                              </span>
                            </div>
                            <img
                              v-if="item?.response?.path"
                              :src="item?.response?.path"
                              alt=""
                            />
                            <a-spin tip="Uploading..." v-else> </a-spin>
                          </div>
                        </drag>
                      </template>

                      <template v-slot:feedback="{ data }">
                        <div class="item feedback" :key="data">
                          {{ data }}
                        </div>
                      </template>
                    </drop-list>
                  </div>
                  <a-upload
                    action="https://api.home24.uz/api/admin/files/upload"
                    :headers="headers"
                    list-type="picture-card"
                    :multiple="true"
                    :showUploadList="false"
                    :file-list="element.imagesData"
                    @preview="handlePreview"
                    @change="($event) => handleChangeVatiant($event, element.id)"
                  >
                    <div v-if="fileList.length < 50">
                      <span v-html="addImgIcon"></span>
                      <div class="ant-upload-text">Добавить изображение</div>
                    </div>
                  </a-upload>
                  <a-modal v-model="previewVisible" :footer="null" @cancel="handleCancel">
                    <img alt="example" style="width: 100%" :src="previewImage" />
                  </a-modal>
                </div>
                <p class="variant-img-text">
                  Изображение товар
                  <span>Первое изображение товара является главной.</span>
                </p>
              </div>
              <div>
                <!-- Validations -->
                <!-- <transition-group name="el-zoom-in-top" tag="ul"> -->
                <div
                  class="product-variant"
                  v-for="(item, itemIndex) in element.variations"
                  :key="item.id"
                >
                  <div class="product_variant_block">
                    <div class="variant-grid-4 w-100">
                      <el-form
                        label-position="top"
                        :model="item.optionName"
                        :rules="rulesAtributes"
                        ref="ruleFormAtributes"
                        label-width="120px"
                        class="demo-ruleForm d-flex"
                        action=""
                      >
                        <div class="d-flex flex-column w-100">
                          <el-form-item
                            label="Имя "
                            prop="name"
                            class="form-variant-block mb-0"
                          >
                            <el-input placeholder="Имя (RU)" v-model="item.name.ru" />
                          </el-form-item>
                          <el-form-item prop="name" class="form-variant-block mb-0">
                            <el-input placeholder="Имя (UZ)" v-model="item.name.uz" />
                          </el-form-item>
                        </div>

                        <div
                          v-if="atributes.length > 0"
                          class="form-variant-block atribut_selects"
                          v-for="(atribut, index) in atributes"
                          :key="index"
                        >
                          <div>
                            <label>{{ atribut?.name.ru }}</label>
                          </div>
                          <el-form-item :prop="`at_${atribut.id}`" class="mb-0">
                            <el-select
                              v-if="atribut?.name.ru == 'Цвет'"
                              v-model="item.optionName[`at_${atribut.id}`]"
                              class="w-100 color-options"
                              :style="`background-color: ${
                                atribut.options.find(
                                  (optionItem) =>
                                    optionItem.id == item.optionName[`at_${atribut.id}`]
                                )?.name.ru
                              };`"
                              default-first-option
                              popper-class="select-popper-hover"
                              placeholder="Параметры"
                              @change="
                                ($event) =>
                                  atributOptions($event, {
                                    productId: element.id,
                                    variantId: item.id,
                                    index: index,
                                    color: true,
                                    id: atribut.id,
                                  })
                              "
                            >
                              <el-option
                                :disabled="
                                  Boolean(!color_options.includes(optionElement.id))
                                "
                                class="color"
                                :style="`color: ${optionElement.name.ru}; background-color: ${optionElement.name.ru}`"
                                v-for="optionElement in atribut.options"
                                :key="optionElement.id"
                                :label="optionElement.name.ru"
                                :value="optionElement.id"
                              >
                              </el-option>
                            </el-select>
                            <el-select
                              v-else
                              v-model="item.optionName[`at_${atribut.id}`]"
                              class="w-100"
                              default-first-option
                              popper-class="select-popper-hover"
                              placeholder="Параметры"
                              @change="
                                ($event) =>
                                  atributOptions($event, {
                                    productId: element.id,
                                    variantId: item.id,
                                    index: index,
                                    color: false,
                                    id: atribut.id,
                                  })
                              "
                            >
                              <el-option
                                :disabled="
                                  item.is_combs?.length > 0
                                    ? !item.is_combs.find((combItem) =>
                                        combItem.includes(optionElement.id)
                                      )
                                    : true
                                "
                                v-for="optionElement in atribut.options"
                                :key="optionElement.id"
                                :label="optionElement.name.ru"
                                :value="optionElement.id"
                              >
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </div>
                      </el-form>

                      <div class="form-variant-block atribut_selects mb-0">
                        <div><label>Цена</label></div>
                        <el-input
                          v-model="item.price"
                          placeholder="999 999 999"
                          type="number"
                        ></el-input>
                      </div>
                      <div class="form-variant-block">
                        <div><label>Количество</label></div>
                        <el-input
                          v-model="item.stock"
                          placeholder="Количество"
                          type="number"
                        ></el-input>
                      </div>
                      <el-form-item
                        prop="attributes"
                        label="Aкции "
                        class="form-variant-block form-block mb-0"
                      >
                        <a-select
                          show-search
                          ref="searchProductSelect"
                          mode="multiple"
                          v-model="item.promotions"
                          placeholder="Aкции..."
                          style="width: 100%"
                          :default-active-first-option="false"
                          :show-arrow="false"
                          :filter-option="false"
                          @search="handleSearchPromo"
                        >
                          <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                          <a-select-option
                            v-for="d in promotionsData"
                            :key="d.id"
                            :value="d?.id"
                          >
                            {{ d?.short_name?.ru }}
                          </a-select-option>
                        </a-select>
                      </el-form-item>

                      <div class="form-block mb-0">
                        <div>
                          <label
                            >Pop
                            <a-popover placement="top">
                              <template slot="content">
                                <span>Популярные продукты</span>
                              </template>

                              <span class="nav-info">?</span>
                            </a-popover></label
                          >
                        </div>
                        <span>
                          <a-switch
                            :checked="item.is_popular == 1"
                            @change="
                              ($event) =>
                                $event ? (item.is_popular = 1) : (item.is_popular = 0)
                            "
                          />
                        </span>
                      </div>
                      <div class="form-block mx-2 mb-0">
                        <div>
                          <label
                            >POD
                            <a-popover placement="top">
                              <template slot="content">
                                <span>Продукт дня</span>
                              </template>
                              <span class="nav-info">?</span>
                            </a-popover></label
                          >
                        </div>
                        <span>
                          <a-switch
                            :checked="item.product_of_the_day == 1"
                            @change="
                              ($event) =>
                                $event
                                  ? (item.product_of_the_day = 1)
                                  : (item.product_of_the_day = 0)
                            "
                          />
                        </span>
                      </div>
                      <div class="form-block mb-0">
                        <div>
                          <label
                            >Status
                            <a-popover placement="top">
                              <template slot="content">
                                <span>Status {{ item.status }} </span>
                              </template>
                              <span class="nav-info">?</span>
                            </a-popover></label
                          >
                        </div>
                        <span>
                          <a-switch
                            :checked="item.status == 'active'"
                            @change="
                              ($event) =>
                                $event
                                  ? (item.status = 'active')
                                  : (item.status = 'inactive')
                            "
                          />
                        </span>
                      </div>
                    </div>
                    <div class="variant_btns mb-3">
                      <div
                        v-if="item.indexId != product?.product?.id"
                        class="variant-btn variant-btn-delete mx-2"
                        @click="deleteValidation(element.id, item)"
                        v-html="removeIcon"
                      ></div>
                      <!-- <div
                          class="variant-btn variant-btn-check"
                          @click="onChangeVariants(element.id, item.id)"
                        >
                          <a-radio :checked="item.is_default == 1"></a-radio>
                        </div> -->
                    </div>
                  </div>
                </div>
                <!-- </transition-group> -->
                <!-- Validations -->
              </div>
              <div
                class="d-flex justify-content-start"
                v-if="
                  atributes.length > 0 &&
                  allCombinationsAtr.filter(
                    (combItem) =>
                      combItem[0] ==
                      element.variations[0].optionName[
                        `at_${
                          atributes.find((colorItem) => colorItem.name.ru == 'Цвет').id
                        }`
                      ]
                  ).length > element.variations.length
                "
              >
                <div class="create-inner-variant" @click="addValidation(element.id)">
                  <span v-html="addInnerValidatIcon"></span>
                  Добавит внутренний варизаци
                </div>
                <!-- <div
                  class="create-inner-variant"
                  @click="currentProduct(element.id, false)"
                >
                  <span v-html="addInnerValidatIcon"></span>
                  Добавить внутреннюю вариацию
                </div> -->
              </div>
            </div>
          </transition-group>
          <div>
            <div
              class="add-variant create-inner-variant mt-0"
              @click="addProduct"
              v-if="productsLength"
            >
              <span v-html="addInnerValidatIcon"></span>
              Добавить вариации
            </div>
          </div>
          <!-- Product Variants -->
        </el-form>
      </div>
    </div>
    <!-- brand modal -->
    <a-modal
      v-model="visible.brand"
      title="Добавить бранд"
      :closable="false"
      @ok="handleOk('brand')"
    >
      <el-form
        label-position="top"
        :model="brandData"
        :rules="rulesModal"
        ref="brandData"
        label-width="120px"
        class="demo-ruleForm"
      >
        <div class="form-block required">
          <div><label for="">Brand </label></div>
          <el-form-item prop="name">
            <el-input placeholder="Модель продукта" v-model="brandData.name"></el-input>
          </el-form-item>
        </div>
        <div class="clearfix variant-img">
          <a-upload
            action="https://api.home24.uz/api/admin/files/upload"
            :headers="headers"
            list-type="picture-card"
            :file-list="fileListBrand"
            @preview="handlePreview"
            @change="handleChangeBrand"
          >
            <div v-if="fileListBrand.length < 1">
              <span v-html="addImgIcon"></span>
              <div class="ant-upload-text">Добавить изображение</div>
            </div>
          </a-upload>
          <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
        </div>
      </el-form>
      <template slot="footer">
        <div class="add_modal-footer d-flex justify-content-end">
          <div
            class="add-btn add-header-btn add-header-btn-padding btn-light-primary mx-3"
            @click="handleOk('brand')"
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
    <!-- brand modal -->
    <!-- category modal -->
    <a-modal
      v-model="visible.category"
      title="Добавить категории"
      :closable="false"
      @ok="handleOk('category')"
      :dialog-style="{ top: '20px' }"
    >
      <el-form
        label-position="top"
        :model="ruleFormCategory"
        :rules="rulesCategory"
        ref="categoryData"
        label-width="120px"
        class="demo-ruleForm"
      >
        <div class="form-block required">
          <el-form-item prop="name.ru" label="Название категории">
            <el-input
              placeholder="Название категории "
              v-model="ruleFormCategory.name.ru"
            ></el-input>
          </el-form-item>
        </div>
        <div class="form-block">
          <el-form-item label="Выберите категорию">
            <el-select
              class="w-100"
              v-model="ruleFormCategory.parent_id"
              filterable
              loading-text="Loading..."
              no-data-text="Не найдено"
              no-match-text="Не найдено"
              placeholder="Выберите категорию"
            >
              <el-option
                v-for="item in categories"
                :key="item?.id"
                :label="item?.name?.ru"
                :value="item?.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="form-block required">
          <el-form-item prop="desc.ru" label="Информация о категории">
            <el-input
              type="textarea"
              rows="5"
              placeholder="Описание"
              v-model="ruleFormCategory.desc.ru"
            ></el-input>
          </el-form-item>
        </div>
        <div class="d-flex">
          <div class="form-block">
            <div><label for="">Популярный </label></div>
            <div>
              <a-switch
                @change="switchPopular"
                :checked="ruleFormCategory.is_popular == 1"
              />
            </div>
          </div>
          <div class="form-block mx-5">
            <div><label for="">Статус </label></div>
            <a-switch @change="switchActive" />
          </div>
        </div>

        <div class="form-block">
          <el-form-item prop="attributes" label="Атрибуты">
            <el-select
              class="w-100"
              v-model="ruleFormCategory.attributes"
              allow-create
              :loading="brands.length < 1"
              loading-text="Loading..."
              no-data-text="Не найдено"
              no-match-text="Не найдено"
              multiple
              placeholder="Atibut"
              @focus="__GET_ATRIBUTES"
            >
              <el-option
                v-for="item in atributes"
                :key="item?.id"
                :label="item?.name?.ru"
                :value="item?.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="form-block">
          <el-form-item prop="group_characteristics" label="Характеристическая группа">
            <el-select
              class="w-100"
              v-model="ruleFormCategory.group_characteristics"
              allow-create
              :loading="brands.length < 1"
              loading-text="Loading..."
              multiple
              no-data-text="Не найдено"
              no-match-text="Не найдено"
              placeholder="Группа"
              @focus="__GET_GROUPS"
            >
              <el-option
                v-for="item in allGroups"
                :key="item?.id"
                :label="item?.name?.ru"
                :value="item?.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="form-block mb-0">
          <div><label for="">Изображение</label></div>
          <div class="clearfix variant-img pt-0">
            <a-upload
              action="https://api.home24.uz/api/admin/files/upload"
              :headers="headers"
              list-type="picture-card"
              :file-list="fileListCategory"
              @preview="handlePreview"
              @change="handleChangeCategory"
            >
              <div v-if="fileListCategory.length < 1">
                <span v-html="addImgIcon"></span>
                <div class="ant-upload-text">Добавить изображение</div>
              </div>
            </a-upload>
            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
              <img alt="example" style="width: 100%" :src="previewImage" />
            </a-modal>
          </div>
        </div>
      </el-form>
      <template slot="footer">
        <div class="add_modal-footer d-flex justify-content-end">
          <div
            class="add-btn add-header-btn add-header-btn-padding btn-light-primary mx-3"
            @click="handleOk('category')"
          >
            Отмена
          </div>
          <a-button
            class="add-btn add-header-btn btn-primary"
            @click="categoryPost"
            type="primary"
            :loading="loadingBtn"
          >
            <span v-if="!loadingBtn" class="svg-icon" v-html="addIcon"></span>
            Сохранить
          </a-button>
        </div>
      </template>
    </a-modal>
    <!-- category modal -->
    <!-- character modal -->
    <a-modal
      v-model="visible.character"
      :closable="false"
      :dialog-style="{ top: '0' }"
      :bodyStyle="{ minHeight: '100vh' }"
      width="100%"
      :footer="false"
      @ok="handleOk('character')"
    >
      <div class="add_modal-container" ref="ruleForm1">
        <div class="character_modal-header">
          <div class="character_modal-header_btn">
            <div
              class="character-save-btn"
              @click="submitFormCharacter('ruleFormCharacter')"
            >
              <span class="svg-icon" v-html="addIcon"></span>
              сохранять
            </div>
            <div class="character-close-btn" @click="handleOk('character')">
              <span class="character-close-icon" v-html="closeIcon"></span>
              Закрыть
            </div>
          </div>
          <div
            class="character-products-container d-flex"
            ref="productScroll"
            @scroll="handleScroll"
          >
            <span
              v-for="(product, productIndex) in ruleForm.products"
              :key="productIndex"
              class="d-flex"
            >
              <div
                class="character-product-card"
                v-for="(variations, varIndex) in product.variations"
                :key="varIndex"
              >
                <div class="ch-product-img">
                  <img
                    v-if="product.imagesData.length > 0"
                    :src="product.imagesData[0]?.response?.path"
                    alt=""
                  />
                  <img
                    v-else
                    src="../../../assets/images/photo_2023-03-04_13-28-58.jpg"
                    alt=""
                  />
                </div>
                <div class="ch-product-body">
                  <span class="ch-product-info"> {{ variations?.name?.ru }} </span>
                  <!-- <span class="ch-product-info"> dual SIM 265 gb </span> -->
                  <span class="ch-product-info">
                    {{ `${variations?.price}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ") }}
                    so'm
                  </span>
                </div>
              </div>
            </span>
          </div>
        </div>

        <div class="product-character-container" ref="characterScroll">
          <div class="d-inline-flex flex-column w-100">
            <div
              class="product-character-block"
              v-for="(characterGroup, characterGroupIndex) in character_group"
              :key="characterGroupIndex"
            >
              <div class="character-group">
                <h5 @click="characterValueCopy">
                  {{ characterGroup.name.ru }}
                </h5>
                <div
                  class="character_copy-btn"
                  v-if="characterGroupIndex == 0"
                  @click="characterValueCopy"
                >
                  <span v-html="copyIcon"> </span> Коп. характеристику
                </div>
              </div>
              <div
                class="product-character-items"
                v-for="(characters, index) in characterGroup.characteristics"
                :key="index"
              >
                <div class="product-character-name">
                  {{ characters.name.ru }}
                </div>
                <span class="character_scroll_span" ref="characterScrollItems">
                  <span
                    v-for="(product, productIndex) in ruleForm.products"
                    :key="productIndex"
                    class="d-flex"
                  >
                    <div
                      class="product-character-info"
                      v-for="(variations, indexvar) in product.variations"
                      :key="indexvar"
                    >
                      <el-form
                        label-position="top"
                        :model="variations.characteristicsValues"
                        ref="ruleFormCharacter"
                        label-width="120px"
                        class="demo-ruleForm character_form"
                        action=""
                      >
                        <el-form-item
                          :prop="`char_${characters.id}`"
                          :rules="[
                            {
                              required: true,
                              message: '',
                              trigger: 'change',
                            },
                          ]"
                        >
                          <input
                            type="text"
                            v-model="
                              variations.characteristicsValues[`char_${characters.id}`]
                            "
                            placeholder="Options"
                          />
                          <!-- <el-select
                            v-model="
                              variations.characteristicsValues[`char_${characters.id}`]
                            "
                            popper-class="select-popper-hover"
                            filterable
                            allow-create
                            default-first-option
                            placeholder="Select category"
                            no-data-text="no-category"
                          >
                            <el-option
                              v-for="optionsItem in characters.options"
                              :key="optionsItem.id"
                              :label="optionsItem.name?.ru"
                              :value="optionsItem.id"
                            >
                            </el-option>
                          </el-select> -->
                        </el-form-item>
                      </el-form>
                    </div>
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </a-modal>
    <!-- character modal -->
    <!-- search modal -->
    <a-modal
      v-model="visible.searchVar"
      title="Добавить"
      :closable="false"
      @ok="handleOk('searchVar')"
    >
      <el-form
        label-position="top"
        :model="brandData"
        :rules="rulesModal"
        ref="brandData"
        label-width="120px"
        class="demo-ruleForm"
      >
        <div class="form-block required">
          <div><label for="">Название продукта </label></div>
          <el-form-item prop="name">
            <a-select
              show-search
              focus
              ref="searchProductSelect"
              mode="multiple"
              v-model="searchResoultProducts"
              placeholder="Название продукта..."
              style="width: 100%"
              :default-active-first-option="false"
              :show-arrow="false"
              :filter-option="false"
              @search="handleSearch"
              @change="handleChangeSearch"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small" />
              <a-select-option v-for="d in searchProducts" :key="d.id" :value="d?.id">
                {{ d?.name?.ru }}
              </a-select-option>
            </a-select>
          </el-form-item>
        </div>
      </el-form>
      <template slot="footer">
        <div class="add_modal-footer d-flex justify-content-end">
          <div
            class="add-btn add-header-btn add-header-btn-padding btn-light-primary mx-3"
            @click="handleOk('searchVar')"
          >
            Отмена
          </div>
          <a-button
            class="add-btn add-header-btn btn-primary"
            :class="{ disabledBtn: searchResoultProducts.length == 0 }"
            @click="searchType ? addSearchProductByColor() : addSearchProduct()"
            type="primary"
          >
            <span
              v-if="!searchResoultProducts.length == 0"
              class="svg-icon"
              v-html="addIcon"
            ></span>
            Сохранить
          </a-button>
        </div>
      </template>
    </a-modal>
    <!-- search modal -->
  </div>
</template>
<script>
import TitleBlock from "../../../components/Title-block.vue";
import ProductsStatistic from "../../../components/products/Products-statistic.vue";
import ProductCharacterList from "../../../components/products/Product-character-list.vue";
import CommentCard from "../../../components/products/CommentCard.vue";
import "quill/dist/quill.core.css";
import { Drag, DropList } from "vue-easy-dnd";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import AddBrandModal from "../../../components/products/Add-brand-modal.vue";
import AddCategoryModal from "../../../components/products/Add-category-modal.vue";
import status from "../../../mixins/status";
import authAccess from "@/mixins/authAccess";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
export default {
  layout: "toolbar",
  mixins: [status, authAccess],
  data() {
    return {
      loading: false,
      headers: {
        authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      currentProductId: null,
      searchType: false,
      fetching: false,
      searchProducts: [],
      productModal: {
        product_modal1: false,
      },

      promotionsData: [],
      searchResoultProducts: [],
      closeIcon: require("../../../assets/svg/components/remove.svg?raw"),
      copyIcon: require("../../../assets/svg/components/copy.svg?raw"),
      addIcon: require("../../../assets/svg/components/add-icon.svg?raw"),
      searchIcon: require("../../../assets/svg/components/search-icon.svg?raw"),
      reloadIcon: require("../../../assets/svg/components/reload-icon.svg?raw"),
      removeIcon: require("../../../assets/svg/components/remove.svg?raw"),
      addImgIcon: require("../../../assets/svg/components/add-img-icon.svg?raw"),
      addInnerValidatIcon: require("../../../assets/svg/components/add-inner-validat-icon.svg?raw"),
      plusCategoryIcon: require("../../../assets/svg/components/add-category-icon.svg?raw"),
      title: "Quill Editor",
      product: {},
      items: [1, 2],
      cascader: [],
      editorOption: {
        theme: "snow",
        modules: {
          toolbar: [
            [
              {
                size: [],
              },
            ],
            ["bold", "italic", "underline", "strike"],

            ["image"],
            ["code-block"],
          ],
        },
      },
      atributes: [],
      variantId: null,
      activeName: "Русский",
      activeDesc: "Description",
      searchBlock: false,
      cascaderCategories: [],
      lastCategory: [],
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
      options: [
        {
          value: 1,
          label: "Активный",
        },
        {
          value: 0,
          label: "Неактивный",
        },
      ],
      rules: {
        name: {
          ru: [
            {
              required: true,
              message: "Название продукта обязательна",
              trigger: "change",
            },
          ],
        },
        category_id: [
          {
            required: true,
            message: "Категория обязательна",
            trigger: "change",
          },
        ],
      },
      categories: [],
      ruleForm: {
        name: {
          ru: "",
          uz: "",
          en: "",
        },
        model: "",
        desc: {
          ru: "",
          uz: "",
          en: "",
        },
        brand_id: null,
        is_active: 1,
        category_id: "",
        products: [
          {
            id: 1,
            images: [],
            imagesData: [],
            fileList: [],
            variations: [
              {
                id: 1,
                stock: 1,
                is_combs: [],
                indexId: 0,
                options: [],
                optionName: {},
                characteristics: [],
                characteristicsValues: {},
                price: 0,
                is_default: 1,
                is_popular: 0,
                product_of_the_day: 0,
                status: "active",
                promotions: [],
                name: {
                  ru: "",
                  uz: "",
                  en: "",
                },
              },
            ],
          },
        ],
      },
      validateStatus: [
        {
          label: "Активен",
          value: "active",
        },
        {
          label: "Неактивен",
          value: "inactive",
        },
      ],
      previewVisible: false,
      previewImage: "",
      fileList: [],
      rulesCharacter: {},
      rulesAtributes: {},
      brands: [],
      uploadLoading: false,
      character_group: [],
      characterNames: [],
      characterRequired: false,
      visible: {
        brand: false,
        category: false,
        character: false,
        searchVar: false,
      },
      rulesCategory: {
        desc: {
          ru: [
            {
              required: true,
              message: "Описание обязательна",
              trigger: "change",
            },
          ],
        },
        name: {
          ru: [
            {
              required: true,
              message: "Категория обязательна",
              trigger: "change",
            },
          ],
        },
        attributes: [
          {
            required: true,
            message: "Атрибут обязателен",
            trigger: "change",
          },
        ],
        group_characteristics: [
          {
            required: true,
            message: "Атрибут обязателен",
            trigger: "change",
          },
        ],
      },
      ruleFormCategory: {
        name: {
          ru: "",
        },
        img: null,
        parent_id: null,
        attributes: [],
        group_characteristics: [],
        is_popular: 0,
        is_active: 0,
        desc: {
          ru: "",
        },
      },
      addImgIcon: require("../../../assets/svg/components/add-img-icon.svg?raw"),
      addImgIcon: require("../../../assets/svg/components/add-img-icon.svg?raw"),
      fileListCategory: [],
      allAtributes: [],
      allGroups: [],
      visibleCategory: false,
      fileListBrand: [],
      brandData: {
        name: "",
        logo: "",
      },
      rulesModal: {
        name: [
          {
            required: true,
            message: "Название бренда обязательна",
            trigger: "blur",
          },
        ],
      },
      loadingBtn: false,
      allCombinationsAtr: [],
      combinationsAtr: [],
      color_options: [],
    };
  },
  computed: {
    productsLength() {
      return (
        this.atributes.find((colorItem) => colorItem.name.ru == "Цвет")?.options?.length >
        this.ruleForm.products.length
      );
    },
    findLastCategory() {
      // let allCategories = [];
      // if (this.cascaderCategories.length > 0 && this.lastCategory.length == 3) {
      //   const findCategory = this.cascaderCategories.find(
      //     (item) => item.id == this.lastCategory[0]
      //   );
      //   const findChildCategory = findCategory?.children.find(
      //     (item) => item.id == this.lastCategory[1]
      //   );
      //   const findChild2Category = findChildCategory?.children.find(
      //     (item) => item.id == this.lastCategory[2]
      //   );
      //   findCategory?.label && allCategories.push(findCategory?.label);
      //   findChildCategory?.label && allCategories.push(findChildCategory?.label);
      //   findChild2Category?.label && allCategories.push(findChild2Category?.label);
      // }
      // if (allCategories.length == 3) {
      //   return allCategories.join("/");
      // }
    },
  },
  async mounted() {
    await Promise.all([
      this.__GET_BRANDS(),
      this.__GET_CATEGORIES(),
      this.__GET_PRODUCT_BY_ID(),
    ]);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    if (localStorage.getItem("lastCategory")) {
      this.lastCategory = JSON.parse(localStorage.getItem("lastCategory"));
    } else {
      this.lastCategory = [];
    }
    const searchProductData = await this.$store.dispatch("fetchPromotions/getPromotions");
    this.promotionsData = searchProductData.promotions.data;
  },
  methods: {
    async handleSearch(value) {
      this.fetching = true;
      if (value.length > 1) {
        const searchProductData = await this.$store.dispatch(
          "fetchProducts/getProductsSearch",
          {
            search: value,
            brand: this.ruleForm.brand_id,
            category: this.ruleForm.category_id,
          }
        );
        this.searchProducts = searchProductData.products;
        this.fetching = false;
      }
    },
    async handleSearchPromo(value) {
      this.fetching = true;
      if (value.length > 1) {
        const searchProductData = await this.$store.dispatch(
          "fetchPromotions/getPromotions",
          {
            search: value,
          }
        );
        this.promotionsData = searchProductData.promotions.data;
        this.fetching = false;
      }
    },
    handleChangeSearch(value) {
      // let obj = this.ruleForm.find((item) => item.indexId == id);
      // obj.category_id = value;
    },
    currentProduct(id, typeProduct) {
      this.searchType = typeProduct;
      this.currentProductId = id;
      this.visible.searchVar = true;
    },
    addSearchProductByColor() {
      this.searchResoultProducts.forEach((item) => {
        let seartProduct = this.searchProducts.find((elem) => elem.id == item);
        const options = { ...this.atributNames };
        const newVariations = [
          {
            name: seartProduct.info.name,
            id: 1,
            stock: 1,
            indexId: seartProduct.id,
            options: [1],
            price: seartProduct.price,
            is_default: 1,
            product_of_the_day: 0,
            is_popular: 0,
            optionName: options,
            characteristics: [],
            characteristicsValues: {},
            status: "active",
            name: {
              ru: "",
              uz: "",
              en: "",
            },
            promotions: [],
          },
        ];
        this.ruleForm.products.push({
          id: this.ruleForm.products.at(-1).id + 1,
          images: [],
          imagesData: [],
          variations: newVariations,
        });
      });

      this.visible.searchVar = false;
    },
    addSearchProduct() {
      const product = this.findProductWithId(this.currentProductId);
      const options = { ...this.atributNames };
      this.searchResoultProducts.forEach((item) => {
        let seartProduct = this.searchProducts.find((elem) => elem.id == item);
        product.variations.push({
          id: product.variations.at(-1).id + 1,
          stock: 1,
          indexId: seartProduct.id,
          options: [1],
          price: seartProduct.price,
          is_default: 0,
          product_of_the_day: 0,
          is_popular: 0,
          characteristics: [],
          characteristicsValues: {},
          optionName: { ...options },
          status: "active",
          name: seartProduct.info.name,
          promotions: [],
        });
        product.images = [
          ...product.images,
          ...seartProduct.images.map((imgId) => imgId.lg_img),
        ];
        product.imagesData = [
          ...product.imagesData,
          ...seartProduct.images.map((itemImg2, index) => {
            return {
              uid: (index + 1) * -1,
              name: "image.png",
              status: "done",
              oldImg: true,
              id: itemImg2.id,
              response: {
                path: itemImg2.lg_img,
              },
              url: itemImg2.lg_img,
            };
          }),
        ];
      });
      this.visible.searchVar = false;
    },
    fullScreen(id, val) {
      this.productModal = {
        [`product_modal${id}`]: val,
      };
      if (val) {
        document.body.style.height = "100vh";
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.height = "auto";
        document.body.style.overflow = "auto";
      }
    },
    uploadSHow(img) {
      this.previewImage = img.response.path;
      this.previewVisible = true;
    },
    uploadDelete(id, imgId) {
      const product = this.findProductWithId(id);
      product.imagesData = product.imagesData.filter((item) => item.uid != imgId);
    },

    onInsert(event, id) {
      this.ruleForm.products
        .find((item) => item.id == id)
        .images.splice(event.index, 0, event.data);
    },
    getData() {
      this.$refs["brandData"].validate((valid) => (valid ? this.__POST_BRAND() : false));
    },
    handleChangeBrand({ fileList }) {
      this.fileListBrand = fileList;
      this.loadingBtn = true;
      if (fileList[0]?.response?.path) {
        this.brandData.logo = fileList[0]?.response?.path;
        this.loadingBtn = false;
      } else if (fileList.length == 0) {
        this.loadingBtn = false;
      }
    },
    switchStatus(e) {},
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    async __POST_BRAND() {
      try {
        await this.$store.dispatch("fetchBrands/postBrands", this.brandData);
        this.notification("Success", "Бранд успешно добавлен", "success");
        this.handleOk("brand");
        this.brandData.name = "";
        this.brandData.logo = "";
        this.fileListBrand = [];
        this.__GET_BRANDS();
      } catch (e) {
        this.statusFunc(e.response);
      }
    },

    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    categoryPost() {
      this.$refs["categoryData"].validate((valid) =>
        valid ? this.__POST_CATEGORY(this.ruleFormCategory) : false
      );
    },
    handleChangeCategory({ fileList }) {
      this.fileListCategory = fileList;
      this.loadingBtn = true;
      if (fileList[0]?.response?.path) {
        this.ruleFormCategory.img = fileList[0]?.response?.path;
        this.loadingBtn = false;
      } else if (fileList.length == 0) {
        this.loadingBtn = false;
      }
    },
    switchPopular(checked) {
      checked
        ? (this.ruleFormCategory.is_popular = 1)
        : (this.ruleFormCategory.is_popular = 0);
    },
    switchActive(checked) {
      checked
        ? (this.ruleFormCategory.is_active = 1)
        : (this.ruleFormCategory.is_active = 0);
    },
    async __GET_GROUPS() {
      const data = await this.$store.dispatch("fetchCharacters/getGroups");
      this.allGroups = data?.groups;
    },
    async __GET_ATRIBUTES() {
      const data = await this.$store.dispatch("fetchAtributes/getAtributes");
      this.allAtributes = data.attributes?.data;
    },
    async __POST_CATEGORY(res) {
      try {
        await this.$store.dispatch("fetchCategories/postCategories", res);
        this.notification("Success", "Категория успешно добавлен", "success");
        this.handleOk("category");
        this.ruleFormCategory.name.ru = "";
        this.ruleFormCategory.desc.ru = "";
        this.ruleFormCategory.is_active = 0;
        this.ruleFormCategory.is_popular = 0;
        this.ruleFormCategory.parent_id = null;
        this.fileListCategory = [];
        this.allAtributes = [];
        this.allGroups = [];
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
    showModal(type) {
      this.visible[type] = true;
    },
    handleOk(type) {
      this.visible[type] = false;
    },
    // products
    submitForm(ruleForm) {
      const newData = this.transformData();
      const imagesCount = newData.products.filter((item) => item.images.length);
      let artibutReqiured = [];
      if (this.$refs.ruleFormAtributes) {
        this.$refs["ruleFormAtributes"].forEach((item) => {
          item.validate((valid) => {
            valid ? artibutReqiured.push(valid) : false;
          });
        });
      }
      this.$refs[ruleForm].validate((valid) => {
        const atr = this.$refs.ruleFormAtributes
          ? this.$refs.ruleFormAtributes.length
          : 0;
        const atributValid = artibutReqiured.length == atr;

        if (valid) {
          if (atributValid) {
            imagesCount.length == newData.products.length
              ? this.__POST_PRODUCTS(newData)
              : this.notification("Required", "Product image is required", "error");
          }
        } else {
          return false;
        }
        // this.characterRequired
        //   ? this.__POST_PRODUCTS(newData)
        //   : this.notification("Success", "Вы не добавили характеристику", "error");
      });
    },
    onChange(value, selectedOptions) {
      this.ruleForm.category_id = value.at(-1);
      this.__GET_CATEGORY_BY_ID(value.at(-1));
    },
    filter(inputValue, path) {
      return (
        path.some(
          (option) => option.label.toUpperCase().indexOf(inputValue.toUpperCase()) > -1
        ) ||
        path.some(
          (option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
        )
      );
    },
    submitFormCharacter(ruleForm) {
      this.handleOk("character");
      // if (this.$refs[ruleForm]) {
      //   this.characterRequired = false;
      //   const trueData = [];
      //   this.$refs[ruleForm].forEach((item) => {
      //     item.validate((valid) => {
      //       if (!valid) return false;
      //       trueData.push(valid);
      //       if (trueData.length == this.$refs[ruleForm].length)
      //         (this.characterRequired = true), this.handleOk("character");
      //     });
      //   });
      // }
    },
    // transformData() {
    //   const newData = {
    //     ...this.ruleForm,

    //     products: this.ruleForm.products.map((item) => {
    //       const newVariation = item.variations.map((elem) => {
    //         return {
    //           id: elem.indexId,
    //           stock: elem.stock,
    //           options: Object.values(elem.optionName),
    //           price: Number.parseFloat(elem.price).toFixed(2) * 1,
    //           is_default: elem.is_default,
    //           is_popular: elem.is_popular,
    //           product_of_the_day: elem.product_of_the_day,
    //           characteristics: Object.keys(elem.characteristicsValues).map(
    //             (charItem, index) => {
    //               return {
    //                 characteristic_id: Number(charItem.split("_")[1]),
    //                 name: elem.characteristicsValues[charItem],
    //               };
    //             }
    //           ),
    //           status: elem.status,
    //           name: elem.name,
    //           promotions: elem.promotions,
    //         };
    //       });
    //       return {
    //         variations: newVariation,
    //         images: item.imagesData.map((item) => {
    //           return item.id
    //             ? {
    //                 id: item.id,
    //               }
    //             : {
    //                 id: 0,
    //                 img: item.response.path,
    //               };
    //         }),
    //       };
    //     }),
    //   };
    //   return newData;
    // },
    // transformData() {
    //   const artIds = this.atributes.map((elem) => elem.id);
    //   const charIds = [];
    //   this.character_group.forEach((item) => {
    //     item.characteristics.forEach((elem) => {
    //       charIds.push(elem.id);
    //     });
    //   });
    //   const newData = {
    //     ...this.ruleForm,
    //     products: this.ruleForm.products.map((item) => {
    //       const newVariation = item.variations.map((elem) => {
    //         const atrIoptions = Object.entries(elem.optionName)
    //           .map(([artItem, value]) => {
    //             if (artIds.includes(Number(artItem.split("_")[1]))) {
    //               return value;
    //             } else {
    //               return undefined;
    //             }
    //           })
    //           .filter((check) => check);
    //         const charIoptions = Object.entries(elem.characteristicsValues)
    //           .map(([charItem, value]) => {
    //             if (charIds.includes(Number(charItem.split("_")[1])) && value) {
    //               return {
    //                 characteristic_id: Number(charItem.split("_")[1]),
    //                 name: value,
    //               };
    //             } else {
    //               return undefined;
    //             }
    //           })
    //           .filter((check) => check);

    //         return {
    //           stock: elem.stock,
    //           options: atrIoptions,
    //           price: Number.parseFloat(elem.price).toFixed(2) * 1,
    //           is_default: elem.is_default,
    //           is_popular: elem.is_popular,
    //           product_of_the_day: elem.product_of_the_day,
    //           characteristics: charIoptions,
    //           status: elem.status,
    //           promotions: elem.promotions,
    //           name: elem.name,
    //         };
    //       });
    //       return {
    //         variations: newVariation,
    //         images: item.imagesData.map((item) => item.response.path),
    //       };
    //     }),
    //   };
    //   return newData;
    // },
    transformData() {
      const artIds = this.atributes.map((elem) => elem.id);
      const charIds = [];
      this.character_group.forEach((item) => {
        item.characteristics.forEach((elem) => {
          charIds.push(elem.id);
        });
      });
      const newData = {
        ...this.ruleForm,
        products: this.ruleForm.products.map((item) => {
          const newVariation = item.variations.map((elem) => {
            const atrIoptions = Object.entries(elem.optionName)
              .map(([artItem, value]) => {
                if (artIds.includes(Number(artItem.split("_")[1]))) {
                  return value;
                } else {
                  return undefined;
                }
              })
              .filter((check) => check);
            const charIoptions = Object.entries(elem.characteristicsValues)
              .map(([charItem, value]) => {
                if (charIds.includes(Number(charItem.split("_")[1])) && value) {
                  return {
                    characteristic_id: Number(charItem.split("_")[1]),
                    name: value,
                  };
                } else {
                  return undefined;
                }
              })
              .filter((check) => check);

            return {
              id: elem.indexId,
              stock: elem.stock,
              options: atrIoptions,
              price: Number.parseFloat(elem.price).toFixed(2) * 1,
              is_default: elem.is_default,
              is_popular: elem.is_popular,
              product_of_the_day: elem.product_of_the_day,
              characteristics: charIoptions,
              status: elem.status,
              promotions: elem.promotions,
              name: elem.name,
            };
          });
          return {
            variations: newVariation,
            // images: item.imagesData.map((item) => item.response.path),
            images: item.imagesData.map((item) => {
              return item.id
                ? {
                    id: item.id,
                  }
                : {
                    id: 0,
                    img: item.response.path,
                  };
            }),
          };
        }),
      };
      return newData;
    },
    reloadCategories() {
      this.cascader = JSON.parse(localStorage.getItem("lastCategory"));
      this.__GET_CATEGORY_BY_ID(this.cascader.at(-1));
    },
    handleScroll(event) {
      this.$refs.characterScrollItems.forEach((item) => {
        item.scrollLeft = this.$refs.productScroll.scrollLeft;
      });
      this.$refs.characterScroll.scrollLeft = this.$refs.productScroll.scrollLeft;
    },

    async handleChangeVatiant({ fileList }, id) {
      const currentProduct = this.findProductWithId(id);
      currentProduct.imagesData = await fileList;
      if (fileList[0]?.response?.path) {
        currentProduct.imagesData = [...fileList];
      }
    },

    atributOptions(id, obj) {
      const product = this.findProductWithId(obj.productId);
      if (obj.color) {
        product.variations = product.variations.map((item) => {
          let elem = { ...item.optionName, [`at_${obj.id}`]: id };
          return {
            ...item,
            optionName: elem,
          };
        });
      }
      this.reloadColorAndComb(obj.productId);
    },
    reloadColorAndComb(id) {
      let is_combs = [];
      const product = this.findProductWithId(id);
      product.variations = product.variations.map((item) => {
        const varComb = Object.values(item.optionName);
        if (this.atributes.length == varComb.length) {
          is_combs = this.combinationsAtr.filter((combItem) =>
            varComb.every((element) => combItem.includes(element))
          );
          this.combinationsAtr = this.combinationsAtr.filter(
            (combItem) => !varComb.every((element) => combItem.includes(element))
          );
        } else {
          is_combs = this.combinationsAtr.filter((combItem) => {
            return varComb.every((element) => combItem.includes(element));
          });
        }
        return {
          ...item,
          is_combs: is_combs,
        };
      });
    },
    atributOptionsChange(obj) {
      const product = this.findProductWithId(obj.productId);
      product.variations.find((varId) => varId.id == obj.variantId).options[
        obj.index
      ] = product.variations.find((varId) => varId.id == obj.variantId).optionName[
        `at_${obj.id}`
      ];
    },
    handleCancel() {
      this.previewVisible = false;
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    //variant
    atributNames() {
      const options = {};
      this.atributes.forEach((elem) => {
        return (options[`at_${elem?.id}`] = "");
      });
      return options;
    },
    addValidation(variantId) {
      const currentColorId = this.atributes.find(
        (colorItem) => colorItem?.name.ru == "Цвет"
      )?.id;
      const product = this.findProductWithId(variantId);
      const findColorVar = product.variations.find(
        (item) => item.optionName[`at_${currentColorId}`]
      )?.optionName[`at_${currentColorId}`];
      const options = {
        ...this.atributNames,
        [`at_${currentColorId}`]: findColorVar,
      };
      product.variations.push({
        id: product.variations.at(-1).id + 1,
        is_combs: this.combinationsAtr,
        stock: 1,
        indexId: 0,
        options: this.atributes.find((colorItem) => colorItem?.name.ru == "Цвет")?.id
          ? [this.atributes.find((colorItem) => colorItem?.name.ru == "Цвет")?.id]
          : [1],
        price: 0,
        is_default: 0,
        product_of_the_day: 0,
        is_popular: 0,
        characteristics: [],
        characteristicsValues: {},
        optionName: options,
        status: "active",
        name: {
          ru: "",
          uz: "",
          en: "",
        },
        promotions: [],
      });
      this.reloadColorAndComb(variantId);
      this.colorOptionsFilter();
    },
    colorOptionsFilter() {
      if (this.atributes.length > 0) {
        // this.color_options = this.atributes
        //   .find((colorItem) => colorItem?.name.ru == "Цвет")
        //   ?.options.map((item) => item.id);

        // this.color_options = this.color_options.filter(
        //   (elem) =>
        //     !this.ruleForm.products.find(
        //       (item) =>
        //         (item.variations.at(-1).is_combs.length > 0 &&
        //           item.variations.at(-1).is_combs[0][0]) == elem
        //     )
        // );
        let all_color_options = this.atributes
          .find((colorItem) => colorItem?.name.ru == "Цвет")
          ?.options.map((item) => item.id);
        this.color_options = all_color_options;
        if (
          this.atributes.length > 0 &&
          Object.values(this.ruleForm.products[0].variations[0].optionName).length > 0
        ) {
          this.color_options = all_color_options.filter(
            (elem) =>
              !this.ruleForm.products.find(
                (item) =>
                  item.variations.at(-1).is_combs.length > 0 &&
                  item.variations.at(-1).is_combs.at(-1)[0] ==
                    item.variations.at(-1).is_combs[0][0] &&
                  item.variations.at(-1).is_combs[0][0] == elem
              )
          );
        }
      }
    },
    colorOptionsFilter() {
      let all_color_options = this.atributes
        .find((colorItem) => colorItem?.name.ru == "Цвет")
        ?.options.map((item) => item.id);
      this.color_options = all_color_options;
      if (
        this.atributes.length > 0 &&
        Object.values(this.ruleForm.products[0].variations[0].optionName).length > 0
      ) {
        this.color_options = all_color_options.filter(
          (elem) =>
            !this.ruleForm.products.find(
              (item) =>
                item.variations.at(-1).is_combs.length > 0 &&
                item.variations.at(-1).is_combs.at(-1)[0] ==
                  item.variations.at(-1).is_combs[0][0] &&
                item.variations.at(-1).is_combs[0][0] == elem
            )
        );
      }
    },
    // addValidation(variantId) {
    //   const currentColorId = this.atributes.find(
    //     (colorItem) => colorItem?.name.ru == "Цвет"
    //   )?.id;
    //   const product = this.findProductWithId(variantId);
    //   const options = {
    //     ...this.atributNames,
    //     [`at_${currentColorId}`]: currentColorId,
    //   };
    //   product.variations.push({
    //     id: product.variations.at(-1).id + 1,
    //     stock: 1,
    //     indexId: 0,
    //     options: this.atributes.find((colorItem) => colorItem?.name.ru == "Цвет")?.id
    //       ? [this.atributes.find((colorItem) => colorItem?.name.ru == "Цвет")?.id]
    //       : [1],
    //     price: 0,
    //     is_default: 0,
    //     product_of_the_day: 0,
    //     is_popular: 0,
    //     characteristics: [],
    //     characteristicsValues: {},
    //     optionName: options,
    //     status: "active",
    //     name: {
    //       ru: "",
    //       uz: "",
    //       en: "",
    //     },
    //     promotions: [],
    //   });
    // },
    // addValidation(variantId) {
    //   const currentColorId = this.atributes.find(
    //     (colorItem) => colorItem?.name.ru == "Цвет"
    //   )?.id;
    //   const product = this.findProductWithId(variantId);
    //   const findColorVar = product.variations.find(
    //     (item) => item.optionName[`at_${currentColorId}`]
    //   )?.optionName[`at_${currentColorId}`];
    //   const options = {
    //     ...this.atributNames,
    //     [`at_${currentColorId}`]: findColorVar,
    //   };
    //   product.variations.push({
    //     id: product.variations.at(-1).id + 1,
    //     stock: 1,
    //     indexId: 0,
    //     options: this.atributes.find((colorItem) => colorItem?.name.ru == "Цвет")?.id
    //       ? [this.atributes.find((colorItem) => colorItem?.name.ru == "Цвет")?.id]
    //       : [1],
    //     price: 0,
    //     is_default: 0,
    //     product_of_the_day: 0,
    //     is_popular: 0,
    //     characteristics: [],
    //     characteristicsValues: {},
    //     optionName: options,
    //     status: "active",
    //     name: {
    //       ru: "",
    //       uz: "",
    //       en: "",
    //     },
    //     promotions: [],
    //   });
    // },
    deleteProduct(variantId) {
      if (this.ruleForm.products.length > 1) {
        this.ruleForm.products = this.ruleForm.products.filter(
          (item) => item.id != variantId
        );
      }
    },
    deleteValidation(variantId, innerVarId) {
      const product = this.findProductWithId(variantId);
      if (!innerVarId?.constProduct) {
        product.variations = product.variations.filter(
          (item) => item.id != innerVarId.id
        );
      }
      if (product.variations.length == 0) {
        this.deleteProduct(product?.id);
      }
      if (innerVarId.constProduct) {
        this.__DELETE_GLOBAL(innerVarId.indexId);
      }
      // const checkDefault = product.variations.filter((item) => item.is_default == 1);
      // if (checkDefault.length == 0) {
      //   product.variations[0].is_default = 1;
      // }
    },
    async __DELETE_GLOBAL(id) {
      try {
        await this.$store.dispatch("fetchProducts/deleteProductsVariation", id);
        this.notification("Success", "message", "success");
        this.__GET_PRODUCT_BY_ID();
      } catch (e) {
        this.statusFunc(e.response);
      }
    },
    findProductWithId(variantId) {
      return this.ruleForm.products.find((element) => element.id == variantId);
    },
    cascaderChange(e) {
      this.__GET_CATEGORY_BY_ID(e.at(-1));
    },
    async addProduct() {
      const options = await { ...this.atributNames };
      const newVariations = await [
        {
          id: 1,
          indexId: 0,
          is_combs: this.combinationsAtr,
          stock: 1,
          options: [1],
          price: 0,
          is_default: 1,
          product_of_the_day: 0,
          is_popular: 0,
          optionName: options,
          characteristics: [],
          characteristicsValues: {},
          status: "active",
          promotions: [],
          name: {
            ru: "",
            uz: "",
            en: "",
          },
        },
      ];
      await this.ruleForm.products.push({
        id: this.ruleForm.products.at(-1).id + 1,
        images: [],
        imagesData: [],
        variations: newVariations,
      });
      this.reloadColorAndComb(this.ruleForm.products.at(-1).id);
      this.colorOptionsFilter();
    },
    // addProduct() {
    //   const options = { ...this.atributNames };
    //   const newVariations = [
    //     {
    //       id: 1,
    //       stock: 1,
    //       indexId: 0,
    //       options: [1],
    //       price: 0,
    //       is_default: 1,
    //       product_of_the_day: 0,
    //       is_popular: 0,
    //       optionName: options,
    //       characteristics: [],
    //       characteristicsValues: {},
    //       status: "active",
    //       name: {
    //         ru: "",
    //         uz: "",
    //         en: "",
    //       },
    //       promotions: [],
    //     },
    //   ];
    //   this.ruleForm.products.push({
    //     id: this.ruleForm.products.at(-1).id + 1,
    //     images: [],
    //     imagesData: [],
    //     variations: newVariations,
    //   });
    // },
    // variant
    onChangeVariants(elementId, varId) {
      this.ruleForm.products
        .find((proId) => proId.id == elementId)
        .variations.find((variantId) => variantId.id == varId).is_default = 1;
      this.ruleForm.products
        .find((proId) => proId.id == elementId)
        .variations.filter((element) => element.id != varId)
        .forEach((item) => {
          item.is_default = 0;
        });
    },
    async __POST_PRODUCTS(data) {
      try {
        await this.$store.dispatch("fetchProducts/editProducts", {
          data: data,
          id: this.$route.params.index,
        });
        this.$router.go(-1);
        this.notification("Success", "Продукт успешно добавлен", "success");
        localStorage.setItem("lastCategory", JSON.stringify(this.cascader));
      } catch (e) {
        if (e.response == undefined) {
          this.notificationError("Error", "Внутренняя ошибка сервера");
        }
        if (e.response.status) {
          switch (e.response.status) {
            case 422:
              this.notificationError(
                "Error",
                e.response.data.errors[Object.keys(e.response.data.errors)[0]][0]
              );
              break;
            case 500:
              this.notificationError("Error", "Внутренняя ошибка сервера");
              break;
            case 404:
              this.notificationError("Error", "Нет результатов запроса для модели");
              break;
          }
        } else {
          this.notificationError("Error", "Внутренняя ошибка сервера");
        }
      }
    },
    async __GET_BRANDS() {
      const data = await this.$store.dispatch("fetchBrands/getAllBrands");
      this.brands = [
        {
          name: "----",
          id: null,
        },
        ...data?.brands,
      ];
    },
    async __GET_CATEGORIES() {
      const data = await this.$store.dispatch("fetchCategories/getCategories");
      // this.categories = [...data.categories?.data];
      // this.cascaderCategories = this.categories.map((item) => {
      //   item.label = item.name.ru;
      //   if (item.children.length > 0) {
      //     item.children = item.children.map((item2) => {
      //       item2.label = item2.name.ru;
      //       if (item2.children.length > 0) {
      //         item2.children = item2.children.map((item3) => {
      //           item3.label = item3.name.ru;
      //           if (item3.children?.length > 0) {
      //             return item3;
      //           } else {
      //             delete item3["children"];
      //             return item3;
      //           }
      //         });
      //         return item2;
      //       } else {
      //         delete item2["children"];
      //         return item2;
      //       }
      //     });
      //     return item;
      //   } else {
      //     delete item["children"];
      //     return item;
      //   }
      // });
      // this.cascaderCategories = this.cascaderCategories.filter((item) => item.children);
      this.categories = [...data.categories?.data];

      const mapCategories = (categories) => {
        return categories.map((category) => {
          const label = category.name.ru;
          const children =
            category.children?.length > 0 ? mapCategories(category?.children) : undefined;
          const { children: _, ...rest } = category;
          if (category.children?.length == 0) {
            return {
              ...rest,
              label,
            };
          } else {
            return {
              ...rest,
              label,
              children,
            };
          }
        });
      };

      this.cascaderCategories = mapCategories(this.categories);
      this.cascaderCategories = this.cascaderCategories.filter((item) => item.children);
      // this.categoriesWidthChild.unshift({
      //   name: { ru: "Главная категория" },
      //   id: null,
      // });
      // data.categories?.data.forEach((item) => {
      //   if (item.children?.length > 0) {
      //     this.categoriesWidthChild = [
      //       ...this.categoriesWidthChild,
      //       item,
      //       ...item.children,
      //     ];
      //   } else {
      //     this.categoriesWidthChild = [...this.categoriesWidthChild, item];
      //   }
      // });
      console.log(this.cascaderCategories);
      this.categories.unshift({
        name: {
          ru: "Главная категория",
        },
        id: null,
      });
    },
    async __GET_CATEGORY_BY_ID(id) {
      const data = await this.$store.dispatch("fetchCategories/getCategoriesById", id);
      const category = data.category;
      this.atributes = category.attributes;
      const arrays = category.attributes.map((item) => {
        const inArr = item.options.map((elem) => elem.id);
        return inArr;
      });
      this.combinations(arrays);
      this.character_group = category.characteristic_groups;
      this.atributes.forEach((element) => {
        this.rulesAtributes[`at_${element.id}`] = [
          {
            required: true,
            message: "Atribut is required",
            trigger: "change",
          },
        ];
      });
      category.characteristic_groups.forEach((item) => {
        item.characteristics.forEach((elem) => {
          this.characterNames.push(`char_${elem.id}`);
          this.rulesCharacter[`char_${elem.id}`] = [
            {
              required: true,
              message: "Brand name is required",
              trigger: "change",
            },
          ];
        });
      });
      this.colorOptionsFilter();
    },
    // async __GET_CATEGORY_BY_ID(id) {
    //   const data = await this.$store.dispatch("fetchCategories/getCategoriesById", id);
    //   const category = data.category;
    //   this.atributes = category.attributes;
    //   this.character_group = category.characteristic_groups;
    //   this.atributes.forEach((element) => {
    //     this.rulesAtributes[`at_${element.id}`] = [
    //       {
    //         required: true,
    //         message: "Атрибут обязателен",
    //         trigger: "blur",
    //       },
    //     ];
    //   });
    //   category.characteristic_groups.forEach((item) => {
    //     item.characteristics.forEach((elem) => {
    //       this.characterNames.push(`char_${elem.id}`);
    //       this.rulesCharacter[`char_${elem.id}`] = [
    //         {
    //           required: true,
    //           message: "Название бренда обязательна",
    //           trigger: "change",
    //         },
    //       ];
    //     });
    //   });
    // },
    async __GET_PRODUCT_BY_ID() {
      this.loading = true;
      const data = await this.$store.dispatch(
        "fetchProducts/getProductsById",
        this.$route.params.index
      );
      const category = [
        {
          name: "category 1",
          id: 1,
          parent: {
            name: "category 2",
            id: 2,
            parent: {
              name: "category 3",
              id: 3,
            },
          },
        },
        {
          name: "category 11",
          id: 11,
          parent: {
            name: "category 12",
            id: 21,
            parent: {
              name: "category 13",
              id: 31,
            },
          },
        },
      ];
      this.loading = false;
      this.ruleForm.name = data.info?.name;
      this.ruleForm.desc = data.info.desc;
      this.product = { ...data };
      this.ruleForm.brand_id = data.info.brand_id;
      this.ruleForm.model = data.info.products[0].model;
      this.ruleForm.is_active = data.info?.is_active;
      function buildCascader(category, cascader = []) {
        if (category.parent) {
          buildCascader(category.parent, cascader);
        }
        cascader.push(category.id);
      }
      buildCascader(data.info.category, this.cascader);

      let promotionsArr = [];
      this.ruleForm.category_id = data.info.category.id;
      this.__GET_CATEGORY_BY_ID(data.info.category.id);
      this.ruleForm.products = data.products.map((item, productIndex) => {
        let characterNames = {};
        const variat = item.variations.map((variant, index) => {
          let atribut = {};
          let charac = {};
          variant.attribute_options.forEach((artibutItem) => {
            atribut = {
              ...atribut,
              [`at_${artibutItem.attribute_id}`]: artibutItem.id,
            };
          });
          variant.characteristic_options.forEach((characItem) => {
            charac = {
              ...charac,
              [`char_${characItem.characteristic_id}`]: characItem.name.ru,
            };
            this.rulesCharacter[`char_${characItem.characteristic_id}`] = [
              {
                required: true,
                message: "Название бренда обязательна",
                trigger: "change",
              },
            ];
          });
          let options = variant.attribute_options.map((atrOp) => atrOp.id);
          let characteristics = variant.characteristic_options.map((charOp) => charOp.id);
          promotionsArr.push(...variant.promotions);
          return {
            name: variant.name,
            id: index + 1,
            stock: variant.stock,
            constProduct: true,
            indexId: variant.id,
            options: [...options],
            optionName: atribut,
            characteristics: [...characteristics],
            characteristicsValues: charac,
            price: variant.price,
            is_default: 1,
            is_popular: variant.is_popular,
            product_of_the_day: variant.product_of_the_day,
            status: variant.status,
            promotions:
              variant.promotions.length > 0
                ? variant.promotions.map((promoItem) => promoItem.id)
                : [],
          };
        });
        return {
          id: productIndex + 1,
          images: item.images ? item.images.map((itemImg) => itemImg.lg_img) : [],
          imagesData: item.images
            ? item.images.map((itemImg2, index) => {
                return {
                  uid: (index + 1) * -1,
                  name: "image.png",
                  status: "done",
                  oldImg: true,
                  id: itemImg2.id,
                  response: {
                    path: itemImg2.lg_img,
                  },
                  url: itemImg2.lg_img,
                };
              })
            : [],
          variations: variat,
        };
      });
      this.characterRequired = true;
      this.comments = data.comments;
      // this.promotionsData = promotionsArr.filter(
      //   (item) => !this.promotionsData.find((elem) => elem.id == item.id)
      // );
      this.promotionsData = promotionsArr.filter(
        (obj, index) => promotionsArr.findIndex((item) => item.id === obj.id) === index
      );
      this.ruleForm.products.forEach((elem) => {
        this.reloadColorAndComb(elem.id);
      });
    },
    characterValueCopy() {
      var copyCharacter = {};
      this.ruleForm.products.forEach((item, itemIndex) => {
        item.variations.forEach((elem, elemIndex) => {
          if (itemIndex == 0 && elemIndex == 0) {
            copyCharacter = { ...elem.characteristicsValues };
          } else {
            Object.keys(copyCharacter).forEach((charElem) => {
              if (!elem.characteristicsValues[charElem]) {
                elem.characteristicsValues[charElem] = copyCharacter[charElem];
                elem.characteristicsValues = { ...elem.characteristicsValues };
              }
              // if (!Object.keys(elem.characteristicsValues).includes(charElem)) {
              //   elem.characteristicsValues[charElem] = copyCharacter[charElem];
              //   elem.characteristicsValues = { ...elem.characteristicsValues };
              // }
            });
          }
        });
      });
      copyCharacter = {};
    },
    generateCombinations(arrays, currentIndex, currentCombination, resultMatrix) {
      if (currentIndex === arrays.length) {
        resultMatrix.push([...currentCombination]);
        return;
      }

      for (let i = 0; i < arrays[currentIndex].length; i++) {
        currentCombination.push(arrays[currentIndex][i]);
        this.generateCombinations(
          arrays,
          currentIndex + 1,
          currentCombination,
          resultMatrix
        );
        currentCombination.pop();
      }
    },
    combinations(arrays) {
      const resultMatrix = [];
      this.generateCombinations(arrays, 0, [], resultMatrix);
      this.allCombinationsAtr = resultMatrix;
      this.combinationsAtr = resultMatrix;
      this.reloadCombs();
    },
    reloadCombs() {
      this.ruleForm.products = this.ruleForm.products.map((item) => {
        const variant = item.variations.map((elem) => {
          return {
            ...elem,
            is_combs: this.combinationsAtr,
          };
        });
        return {
          ...item,
          variations: variant,
        };
      });
    },
  },
  watch: {
    "visible.searchVar"(val) {
      if (!val) {
        // this.searchType ? this.addSearchProductByColor() : this.addSearchProduct();
        this.searchResoultProducts = [];
      } else {
        setTimeout(() => {
          this.$refs.searchProductSelect.focus();
        }, 0);
      }
    },
    "ruleForm.products.length"(val) {
      this.ruleForm.products.forEach((item) => {
        this.productModal[`product_modal${item.id}`] = false;
      });
    },
  },
  components: {
    ProductsStatistic,
    ProductCharacterList,
    CommentCard,
    TitleBlock,
    AddBrandModal,
    AddCategoryModal,
    Drag,
    DropList,
  },
};
</script>
<style lang="scss">
.upload-card {
  width: 119px !important;
  height: 119px !important;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  transition: transform 0.2s !important;
  transition: 0.2s !important;
  padding: 8px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  position: relative;
  &:hover {
    .upload_actions {
      z-index: 10;
      opacity: 1;
    }
  }
  .upload_actions {
    width: 101px;
    height: 101px;
    transition: 0.3s;
    top: 8px;
    left: 8px;
    opacity: 0;
    z-index: -1;
    background-color: hsla(0, 0%, 100%, 0.5);
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      padding: 5px;
      cursor: pointer;
    }
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    pointer-events: none;
    transition: transform 0.2s !important;
    transition: 0.2s !important;
  }
}
.list > div {
  display: flex;
  flex-wrap: wrap;
}

.list2 {
  display: flex;
  flex-wrap: wrap;
  .ant-upload-picture-card-wrapper {
    width: 119px;
  }
}
.item-upload {
  display: flex;
  flex-wrap: wrap;
}
.flip-list2-move {
  transition: transform 0.2s;
}
.over {
  opacity: 0.6;
  transition: transform 0.2s !important;
  transition: 0.2s !important;
}

.product_list {
  transition: 0.2s;
}
.color-options input {
  background-color: transparent !important;
  color: transparent !important;
  // border: none !important;
}
.atribut_selects {
  max-width: 120px;
  min-width: 100px !important;
}
</style>
