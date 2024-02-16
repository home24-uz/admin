export default {
  methods: {
    notificationError(title, message) {
      this.$notify.error({
        title: title,
        message: message,
      });
    },
    statusFunc(res) {
      if (res == undefined) {
        this.notificationError("Error", "Внутренняя ошибка сервера");
      }
      if (res.status) {
        switch (res.status) {
          case 422:
            this.notificationError(
              "Error",
              "Указанные данные недействительны."
            );
            break;
          case 500:
            this.notificationError("Error", "Внутренняя ошибка сервера");
            break;
          case 404:
            this.notificationError(
              "Error",
              "Нет результатов запроса для модели"
            );
            break;
        }
      } else {
        this.notificationError("Error", "Внутренняя ошибка сервера");
      }
    },
    notification(title, message, type) {
      this.$notify({
        title: title,
        message: message,
        type: type,
      });
    },
  },
};
