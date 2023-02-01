<template>
  <v-dialog
    @keydown.esc="closeDialog"
    v-model="show"
    persistent
    max-width="55%"
  >
    <v-card>
      <v-card-title
        class="headline purple darken-2 white--text font-weight-bold"
      >
        {{ $t("login_title") }}
      </v-card-title>
      <hr />
      <v-form ref="form">
        <div class="pt-3 px-5" style="font-size: 14px">
          <v-text-field
            dense
            outlined
            type="text"
            :label="$t('login_email')"
            v-model="value.email"
            :rules="[rules.email]"
          />

          <v-text-field
            dense
            outlined
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            :label="$t('login_password')"
            v-model="value.password"
            @click:append="showPassword = !showPassword"
            :rules="[rules.empty]"
            hide-details
          />
          <v-row class="ma-0" justify="end">
            <h3
              class="font-weight-bold green--text"
              style="cursor: pointer"
              @click="register()"
            >
              {{ $t("register_no_account") }}
            </h3>
          </v-row>
        </div>
      </v-form>
      <hr />
      <v-card-actions class="" style="background-color: #eeeeee">
        <v-spacer />
        <v-btn @click="forgotPassword()" class="mr-4" outlined color="red">
          {{ $t("login_btn_forget_password") }}
        </v-btn>
        <v-btn
          color="blue darken-2"
          class="white--text font-weight-bold"
          @click="loginAction"
        >
          {{ $t("login_btn_log_in") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import TooltipButton from "@/components/TooltipButton";
import { pageMixins } from "@/util/PageMixins";
import { dateFormatMixins } from "@/util/DateFormat";
import DrawerDialog from "@/components/core/Drawer.vue";
import router from "../../router";

import loginServices from "@/services/login/login.js";

export default {
  components: { TooltipButton, DrawerDialog },
  mixins: [pageMixins, dateFormatMixins],
  data() {
    return {
      showPassword: false,
      value: {
        email: "vuthitrangvb1407@gmail.com",
      },
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false,
      required: true,
    },
  },

  methods: {
    register: async function () {
      router.push("/register");
    },

    forgotPassword: async function () {
      console.warn("loading");
    },

    getItem: function () {
      const newItem = {
        email: this.value.email,
        password: this.value.password,
      };
      return newItem;
    },

    loginAction: async function () {
      if (!this.$refs.form.validate()) return;
      localStorage.clear();
      try {
        const body = this.getItem();
        const response = await loginServices.login(body);
        const result = response.data;
        if (result && !result.error) {
          localStorage.setItem("id", 1606);
          localStorage.setItem("status_login_id", 600);
          localStorage.setItem("status_login_name", "Đăng nhập thành công");

          router.push("/trangchu");

          this.closeDialog();
          this.$emit("load-screen");
          this.$SnackBar.show("success", this.$t("login_success"));
        } else {
          if (result.code === 201) {
            this.$SnackBar.show(
              "error",
              this.$t("login_error_email_or_password")
            );
            return;
          } else {
            this.$SnackBar.show("error", this.$t("login_error"));
            return;
          }
        }
      } catch (e) {
        this.$SnackBar.show("error", this.$t("connect_net_work_error"));
        process.env.VUE_APP_DEBUG === "1" && console.log(e);
      }
    },

    closeDialog() {
      this.$emit("close-dialog");
    },
  },
};
</script>

<style lang="scss" scoped>
.label {
  color: blue;
  font-weight: 700;
  //font-weight: 299;
}
.value {
  color: black;
}
</style>
