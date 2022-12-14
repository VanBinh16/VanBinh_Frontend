<template>
  <v-dialog v-model="show" persistent max-width="40%">
    <v-card>
      <!-- header infodialog -->
      <v-card-title :class="`${type === 'add' ? 'green' : 'blue'} white--text`">
        <v-row align="center" class="ma-0">
          <span class="font-weight-bold white--text"> {{ text.title }} </span>
        </v-row>
      </v-card-title>
      <hr />

      <!-- nội dung from -->
      <div class="pt-3 px-5" style="font-size: 14px">
        <v-row class="ma-0 py-0">
          <v-col class="pa-0" cols="4">
            <span class="label">{{ $t("manage_staff_code") }}:</span>
          </v-col>
          <v-col class="pa-0" cols="8">
            <span class="value" style="color: red; font-size: 500">{{
              item.code
            }}</span>
          </v-col>
        </v-row>

        <v-row class="ma-0 py-1">
          <v-col class="pa-0" cols="4">
            <span class="label">{{ $t("manage_staff_name") }}:</span>
          </v-col>
          <v-col class="pa-0" cols="8">
            <span class="value">{{ item.name }}</span>
          </v-col>
        </v-row>

        <v-row class="ma-0 py-1">
          <v-col class="pa-0" cols="4">
            <span class="label">{{ $t("manage_staff_email") }}:</span>
          </v-col>
          <v-col class="pa-0" cols="8">
            <span class="value">{{ item.email }}</span>
          </v-col>
        </v-row>

        <v-row class="ma-0 py-1">
          <v-col class="pa-0" cols="4">
            <span class="label">{{ $t("manage_staff_phone") }}:</span>
          </v-col>
          <v-col class="pa-0" cols="8">
            <span class="value">{{ item.phone }}</span>
          </v-col>
        </v-row>

        <v-row class="ma-0 py-1">
          <v-col class="pa-0" cols="4">
            <span class="label">{{ $t("manage_staff_gender_name") }}:</span>
          </v-col>
          <v-col class="pa-0" cols="8">
            <span class="value">{{ item.gender_name }}</span>
          </v-col>
        </v-row>

        <v-row class="ma-0 py-1">
          <v-col class="pa-0" cols="4">
            <span class="label"
              >{{ $t("manage_staff_department_position_name") }}:</span
            >
          </v-col>
          <v-col class="pa-0" cols="8">
            <span class="value" style="color: red; font-size: 500">{{
              item.department_position_name
            }}</span>
          </v-col>
        </v-row>

        <v-row class="ma-0 py-1">
          <v-col class="pa-0" cols="4">
            <span class="label"
              >{{ $t("manage_department_position_notes") }}:</span
            >
          </v-col>
          <v-col class="pa-0" cols="8">
            <span class="value" style="color: red; font-size: 500">{{
              item.notes
            }}</span>
          </v-col>
        </v-row>
      </div>
      <!-- footer -->
      <hr />
      <v-card-actions class="" style="background-color: #eeeeee">
        <v-spacer />
        <v-btn
          @click="closeInfoDialog"
          class="mr-4"
          outlined
          :color="type === 'add' ? 'green' : 'blue'"
        >
          {{ $t("button_close") }}
        </v-btn>
        <v-btn
          color="blue"
          class="white--text font-weight-bold"
          @click="sendOtpStaff"
        >
          {{ $t("buuton_sent_otp") }}
        </v-btn>
      </v-card-actions>

      <otp-dialog
        :show="otpDialog.show"
        :item="otpDialog.item"
        @close-dialog="otpDialog.show = false"
      />
    </v-card>
  </v-dialog>
</template>

<script>
import { pageMixins } from "@/util/PageMixins";
import DatePicker from "@/components/DatePicker";

import OtpDialog from "./OtpDialog.vue";

import staffServices from "@/services/staff/account_staff.js";

export default {
  props: ["show", "type", "item"],
  components: { DatePicker, OtpDialog },
  mixins: [pageMixins],
  data: function () {
    return {
      text: {
        title: "",
      },
      otpDialog: {
        show: false,
        item: {},
      },
    };
  },
  watch: {
    show: async function () {
      if (!this.show) return;

      if (this.type === "create") {
        this.text = {
          title: this.$t("manage_staff_account_title"),
        };
      } else if (this.type === "update") {
        await this.getListDistrict();
        this.text = {
          title: this.$t("manage_department_position_update_title"),
        };
      }
    },
  },
  methods: {
    getItem: function () {
      const newItem = {
        email: this.item.email,
        user_code: this.item.code,
      };

      return newItem;
    },
    sendOtpStaff: async function () {
      try {
        const body = this.getItem();
        const response = await staffServices.sentOTP(body);
        const result = response.data;
        if (result && !result.error) {
          this.$SnackBar.show(
            "success",
            this.$t("manage_staff_create_otp_code_success")
          );
          body.name = this.item.name;
          this.openOtpDialog(body);
        } else {
          this.$SnackBar.show(
            "error",
            this.$t("manage_staff_create_otp_code_error")
          );
        }
      } catch (e) {
        this.$SnackBar.show("error", this.$t("connect_net_work_error"));
        process.env.VUE_APP_DEBUG === "1" && console.log(e);
      }
      //this.closeInfoDialog();
    },

    closeInfoDialog: function () {
      this.$emit("close-dialog");
    },
    // otp dialog
    openOtpDialog: function (item = {}) {
      this.otpDialog = { show: true, item };
    },
  },
};
</script>
