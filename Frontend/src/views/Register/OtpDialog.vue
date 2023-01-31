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

          <v-row class="ma-0 py-1">
            <v-col class="pa-0" cols="4">
              <span class="label">{{ $t("register_password") }}:</span>
            </v-col>
            <v-col class="pa-0" cols="8">
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
            </v-col>
          </v-row>

          <v-row class="ma-0 py-4">
            <v-col class="pa-0" cols="4">
              <span class="label">{{ $t("register_confirm") }}:</span>
            </v-col>
            <v-col class="pa-0" cols="8">
              <v-text-field
                dense
                outlined
                :append-icon="showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPasswordConfirm ? 'text' : 'password'"
                :label="$t('login_password')"
                v-model="value.password_confirm"
                @click:append="showPasswordConfirm = !showPasswordConfirm"
                :rules="[rules.empty]"
                hide-details
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

          <v-row class="ma-0" justify="end">
            <p class="font-weight-bold red--text" v-if="this.password == true">
              {{ $t("register_confirm_error") }}
            </p>
            <p class="font-weight-bold red--text" v-if="this.account == true">
              {{ $t("register_email_error") }}
            </p>
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

import registerServices from "@/services/register/register.js";
import router from "../../router";

export default {
  components: { TooltipButton },
  mixins: [pageMixins, dateFormatMixins],
  data: function () {
    return {
      showPassword: false,
      showPasswordConfirm: false,
      value: {},
      password: false,
      account: false,
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
      if (this.value.password !== this.value.password_confirm) {
        this.password = true;
        return;
      }
      try {
        let body = {
          email: this.item.email,
          user_name: this.item.user_name,
          phone: this.item.phone,
          province_id: this.item.province_id,
          district_id: this.item.district_id,
          address: this.item.address,
          otp_code: this.value.otp_code,
          password: this.value.password,
        };
        const response = await registerServices.createAccount(body);
        const result = response.data;
        if (result && !result.error) {
          this.$SnackBar.show("success", this.$t("register_success"));
          router.push("/login");
        } else {
          if (result.code === 200) {
            this.account = true;
            return;
          } else if (result.code === 201) {
            this.$SnackBar.show("error", this.$t("register_otp_error"));
            return;
          } else {
            this.$SnackBar.show("error", this.$t("register_error"));
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
