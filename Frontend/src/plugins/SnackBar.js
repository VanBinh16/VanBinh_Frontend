import VSnackbarEx from "../views/dialog/general/VSnackbarEx.vue";

const SnackBar = {
  install(Vue, options) {
    this.EventBus = new Vue();
    Vue.component("v-snackbar-ex", VSnackbarEx);
    Vue.prototype.$SnackBar = {
      show(type, content, timeout = 2000) {
        SnackBar.EventBus.$emit("show", type, content, timeout);
      },
    };
  },
};

export default SnackBar;
