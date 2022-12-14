<template>
  <v-dialog
    @keydown.esc="closeDialog"
    v-model="show"
    persistent
    max-width="450px"
  >
    <v-card>
      <v-card-title class="headline blue darken-2 white--text font-weight-bold">
        {{ $t("manage_staff_input_otp") }}
      </v-card-title>
      <hr />
      <v-form ref="form">
        <div class="pt-3 px-5" style="font-size: 14px">
          <v-row class="ma-0 py-1">
            <v-col class="pa-0" cols="4">
              <span class="label">{{ $t("manage_staff_code") }}:</span>
            </v-col>
            <v-col class="pa-0" cols="8">
              <span class="value" style="color: red; font-size: 500">{{
                item.user_code
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
              <v-text-field
                dense
                outlined
                type="text"
                v-model="item.email"
                readonly
              />
            </v-col>
          </v-row>

          <v-row class="ma-0 py-0">
            <v-col class="pa-0" cols="4">
              <span class="label">{{ $t("manage_staff_input_otp") }}:</span>
            </v-col>
            <v-col class="pa-0" cols="8">
              <v-text-field
                dense
                outlined
                type="number"
                v-model="value.otp_code"
                :rules="[rules.empty]"
              />
            </v-col>
          </v-row>
        </div>
      </v-form>

      <hr />
      <v-card-actions class="" style="background-color: #eeeeee">
        <v-spacer />
        <v-btn @click="closeDialog" class="mr-4" outlined color="blue">
          {{ $t("button_close") }}
        </v-btn>
        <v-btn
          color="blue darken-2"
          class="white--text font-weight-bold"
          @click="comfirmAction"
        >
          {{ $t("button_comfirm") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import TooltipButton from "@/components/TooltipButton";
import { pageMixins } from "@/util/PageMixins";
import { dateFormatMixins } from "@/util/DateFormat";

import accountStaffServices from "@/services/staff/account_staff.js";

export default {
  components: { TooltipButton },
  mixins: [pageMixins, dateFormatMixins],
  data: function () {
    return {
      value: {},
    };
  },
  props: {
    item: {},
    show: {
      type: Boolean,
      default: false,
      required: true,
    },
  },

  methods: {
    comfirmAction: async function () {
      if (!this.$refs.form.validate()) return;
      try {
        let body = {
          email: this.item.email,
          user_code: this.item.user_code,
          otp_code: this.value.otp_code,
        };
        const response = await accountStaffServices.createAccountStaff(body);
        const result = response.data;
        if (result && !result.error) {
          this.$SnackBar.show(
            "success",
            this.$t("manage_staff_create_account_success")
          );
        } else {
          if (result.code === 201) {
            this.$SnackBar.show("error", this.$t("manage_staff_otp_fail"));
            return;
          } else {
            this.$SnackBar.show(
              "error",
              this.$t("manage_staff_create_account_error")
            );
          }
        }
      } catch (e) {
        this.$SnackBar.show("error", this.$t("connect_net_work_error"));
        process.env.VUE_APP_DEBUG === "1" && console.log(e);
      }
      this.closeDialog();
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
}

.value {
  color: black;
}
</style>
