export default {
  data() {
    return {
      statusTypes: {
        pending: "Ожидание",
        accepted: "Принятые",
        canceled: "Отмененные",
        done: "Доставленные",
        new: "Новые",
        returned: "Возврат",
      },
      page: 1,
      current: 1,
      pageSizes: [
        {
          value: 16,
          label: "16",
        },
        {
          value: 25,
          label: "25",
        },
        {
          value: 50,
          label: "50",
        },
        {
          value: 100,
          label: "100",
        },
      ],
      totalPage: 1,
      params: {
        page: 1,
        pageSize: 16,
      },
      searchVal: "",
      value: "",
    };
  },
  methods: {
    async changeSearch(val, url, func) {
      this.searchVal = val.target.value;
      if (val.target.value.length > 2) {
        if (this.$route.query?.search != val.target.value)
          await this.$router.replace({
            path: url,
            query: { ...this.$route.query, search: val.target.value, page: 1 },
          });
        if (val.target.value == this.$route.query.search) this[func]();
      } else if (val.target.value.length == 0) {
        this.clearQuery(url, func);
      }
    },
    async clearQuery(url, func) {
      this.value = "";
      const queryFirst = { ...this.$route.query, page: 1 };
      const { region, operator, date, search, status,stock,category, ...query } = queryFirst;
      this.current = 1;
      if (
        this.$route.query?.search ||
        this.$route.query?.date ||
        this.$route.query?.operator ||
        this.$route.query?.region ||
        this.$route.query?.stock ||
        this.$route.query?.category ||
        this.$route.query?.status
      ) {
        await this.$router.replace({
          path: url,
          query: { ...query },
        });
        this[func]();
      }
    },
    cancel(e) {
      // this.$message.error("Click on No");
    },
    async changePagination(val, url, dataFunc) {
      if (this.$route.query.page != val) {
        await this.$router.replace({
          path: url,
          query: {
            ...this.$route.query,
            page: val,
            per_page: this.params.pageSize,
          },
        });
        this[dataFunc]();
      }
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    },
    async changePageSizeGlobal(e, link, data) {
      this.current = 1;
      if (this.$route.query.per_page != e) {
        await this.$router.replace({
          path: link,
          query: {
            ...this.$route.query,
            page: this.current,
            per_page: e,
          },
        });
        this[data]();
      }
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    },
    async __DELETE_GLOBAL(id, link, message, data) {
      try {
        await this.$store.dispatch(link, id);
        this.notification("Success", message, "success");
        this[data]();
        console.log("iinner");
      } catch (e) {
        console.log("catcg");

        this.statusFunc(e.response);
      }
    },
    async getFirstData(url, dataFunc) {
      if (
        !Object.keys(this.$route.query).includes("page") ||
        !Object.keys(this.$route.query).includes("per_page")
      ) {
        await this.$router.replace({
          path: url,
          query: { page: this.params.page, per_page: this.params.pageSize },
        });
      }
      this[dataFunc]();
      this.current = Number(this.$route.query.page);
      this.params.pageSize = Number(this.$route.query.per_page);
    },
  },
};
