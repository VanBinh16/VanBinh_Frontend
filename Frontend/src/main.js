// =========================================================
// * Vuetify Material Dashboard - v2.1.0
// =========================================================
//
// * Product Page: https://www.creative-tim.com/product/vuetify-material-dashboard
// * Copyright 2019 Creative Tim (https://www.creative-tim.com)
//
// * Coded by Creative Tim
//
// =========================================================
//
// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/base";
import "./plugins/chartist";
import "./plugins/vee-validate";
import vuetify from "./plugins/vuetify";
import i18n from "./i18n";
import SnackBar from "./plugins/SnackBar";

import axios from "axios";
Vue.config.productionTip = false;

const vm = Vue.use(SnackBar);
new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount("#app");

if (localStorage.status_login_id != 600) {
  router.push("/login");
} else if (localStorage.status_login_id == 600) {
  router.push("/trangchu");
}

axios.interceptors.request.use(
  function (config) {
    console.warn("vao đây");
    return config;
  },
  function (error) {
    console.warn("vao đây");
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    console.warn("data vào đây");
    return response;
  },
  function (error) {
    // kết nối API lỗi
    //localStorage.clear();
    //location.reload();
  }
);