<template>
  <v-app>
    <div
      class="login-page"
      :style="{ 'background-image': `url('${background}')` }"
    >
      <div class="login-form">
        <br />
        <h2 style="color: red; font-weight: 600">
          {{ $t("register_title") }}
        </h2>
        <v-form ref="form">
          <v-col cols="12" class="mb-0 pb-0">
            <v-text-field
              dense
              outlined
              v-model="value.user_name"
              type="text"
              :label="$t('register_user_name')"
              :rules="[rules.empty]"
            />
          </v-col>
          <v-col cols="12" class="mb-0 pb-0">
            <v-text-field
              dense
              outlined
              v-model="value.email"
              type="text"
              :label="$t('register_email')"
              :rules="[rules.empty]"
            />
          </v-col>

          <v-col cols="12" class="mb-0 pb-0">
            <v-text-field
              dense
              outlined
              v-model="value.phone"
              type="number"
              :label="$t('register_phone')"
              :rules="[rules.empty]"
            />
          </v-col>

          <v-col cols="12" class="mb-0 pb-4">
            <v-autocomplete
              dense
              outlined
              hide-details
              v-model="value.province"
              :items="provinces"
              return-object
              @change="getListDistrict()"
              item-text="name"
              item-value="id"
              :label="$t('register_provice_name')"
              :rules="[rules.empty]"
            />
          </v-col>
          <v-col cols="12" class="mb-0 pb-4">
            <v-autocomplete
              dense
              outlined
              hide-details
              return-object
              v-model="value.district"
              :items="districts"
              item-text="name"
              item-value="id"
              :label="$t('register_district_name')"
              :rules="[rules.empty]"
            />
          </v-col>

          <v-col cols="12" class="mb-0 pb-0">
            <v-textarea
              dense
              outlined
              :label="$t('register_address')"
              v-model="value.address"
            />
          </v-col>
          <v-row style="margin-left: 2px; margin-right: 2px">
            <v-col cols="6" class="mb-0 pb-0">
              <v-btn
                large
                color="primary"
                @click="login"
                class="white--text ml-0"
                style="width: 100%"
              >
                {{ $t("register_login_in") }}
              </v-btn>
            </v-col>

            <v-col cols="6" class="mb-0 pb-0">
              <v-btn
                large
                color="error"
                @click="register"
                class="white--text ml-0"
                style="width: 100%"
              >
                {{ $t("register_title_button") }}
              </v-btn>
            </v-col>
          </v-row>
          <br />
        </v-form>
      </div>
    </div>

    <otp-dialog
      :show="otpDialog.show"
      :item="otpDialog.item"
      @close-dialog="otpDialog.show = false"
    />
  </v-app>
</template>

<script>
import router from "@/router";
import { pageMixins } from "@/util/PageMixins";
import addressServices from "@/services/address/address.js";
import registerServices from "@/services/register/register.js";
import OtpDialog from "./OtpDialog.vue";

export default {
  components: { OtpDialog },
  mixins: [pageMixins],
  data() {
    return {
      value: {
        email: "huynhvanbinh1606@gmail.com",
      },
      otpDialog: {
        show: false,
        item: {},
      },
      province: {},
      provinces: [],
      district: {},
      districts: [],
      background: "",
      error: null,
    };
  },
  mounted: async function () {
    this.background = require(`../../image/trangvu.jpg`);
    await this.getListProvince();
  },

  methods: {
    login: async function () {
      router.push("/login");
    },

    getItem: function () {
      const newItem = {
        user_name: this.value.user_name,
        email: this.value.email,
        phone: this.value.phone,
        province_id: this.value.province.id,
        district_id: this.district.id,
        address: this.value.address,
      };
      return newItem;
    },

    register: async function () {
      if (!this.$refs.form.validate()) return;
      try {
        const body = this.getItem();
        this.openOtpDialog(body);
        const response = await registerServices.sentOTP({
          email: this.value.email,
        });
        const result = response.data;

        if (result && !result.error) {
          this.openOtpDialog(body);
        } else {
          this.$SnackBar.show("error", this.$t("register_data_fail"));
          return;
        }
      } catch (e) {
        this.$SnackBar.show("error", this.$t("connect_net_work_error"));
        process.env.VUE_APP_DEBUG === "1" && console.log(e);
      }
    },

    //lấy danh sách tỉnh
    getListProvince: async function () {
      const response = await addressServices.getListProvince();
      const result = response.data;
      if (result && !result.error) {
        this.provinces = result.data.map((item, idx) => ({
          ...item,
        }));
      }
    },
    // lấy danh sách huyện
    getListDistrict: async function () {
      //if (!this.value.province) return;
      const params = {
        province_id: this.item.province_id
          ? this.item.province_id
          : this.value.province.id,
      };
      const response = await addressServices.getListDistrict(params);
      const result = response.data;
      if (result && !result.error) {
        this.districts = result.data.map((item, idx) => ({
          ...item,
        }));
      }
    },

    // otp dialog
    openOtpDialog: function (item = {}) {
      this.otpDialog = { show: true, item };
    },
  },
};
</script>

<style scoped>
.login-page {
  width: 100%;
  height: 100vh;
  background-color: #ffffff;
  margin: auto;
  padding-top: 50px;
}

.login-form {
  position: relative;
  z-index: 1;
  background: #ffffff;
  max-width: 80%;
  margin: 0 auto 100px;
  /* padding: 50px; */
  text-align: center;
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.2), 0 3px 3px 0 rgba(0, 0, 0, 0.24);
}

.login-page,
.acrylic::before {
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  font-family: "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
