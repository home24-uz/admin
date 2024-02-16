export const actions = {
  async uploadFile({}, data) {
    const res = this.$axios.$post(
      `https://api.diskont.uz/api/admin/files/upload`,
      data
    );
    return res;
  },
};
