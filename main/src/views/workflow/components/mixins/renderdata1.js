
export function renderDraftsData1() {
  Object.keys(this.$options.data().newAppForm).map(key => {
    this.newAppForm[key] = this.aDetail[key];
  });
}

export function resetForm() {
  const sessionData = sessionStorage.getItem(this.sessionKey);
  if (sessionData && JSON.parse(sessionData).routeParams && JSON.parse(sessionData).routeParams.detailData_edit) {
    this.aDetail = JSON.parse(JSON.parse(sessionData).routeParams.detailData_edit.values);
    this.renderDraftsData1();
  } else {
    this.newAppForm = this.$options.data().newAppForm;
    this.$nextTick(() => {
      this.$refs["newAppForm"].clearValidate();
    });
  }
}
