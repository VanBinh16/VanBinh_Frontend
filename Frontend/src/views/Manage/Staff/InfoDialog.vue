<template>
  <v-dialog v-model="show" persistent width="60%">
    <v-card>
      <!-- header infodialog -->
      <v-card-title :class="`${type === 'add' ? 'green' : 'blue'} white--text`">
        <v-row align="center" class="ma-0">
          <span class="font-weight-bold white--text"> {{ text.title }} </span>
        </v-row>
      </v-card-title>
      <hr />

      <!-- nội dung from -->
      <v-card-text class="pt-4">
        <v-form ref="form">
          <v-row v-if="this.type === 'update'">
            <v-col cols="6" class="mb-0 pb-0">
              <v-text-field dense outlined type="text" :label="$t('manage_staff_code')" v-model="value.code"
                :rules="[rules.empty]" :readonly="type === 'update'" />
            </v-col>
            <v-col cols="6" class="mb-0 pb-0">
              <v-text-field dense outlined type="text" :label="$t('manage_staff_name')" v-model="value.name"
                :rules="[rules.empty]" />
            </v-col>
          </v-row>

          <v-row v-if="this.type === 'add'">
            <v-col cols="12" class="mb-0 pb-0">
              <v-text-field dense outlined type="text" :label="$t('manage_staff_name')" v-model="value.name"
                :rules="[rules.empty]" />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6" class="mb-0 pb-0">
              <v-text-field dense outlined type="text" :label="$t('manage_staff_email')" v-model="value.email" />
            </v-col>
            <v-col cols="6" class="mb-0 pb-0">
              <v-text-field dense outlined type="number" :label="$t('manage_staff_phone')" v-model="value.phone"
                :rules="[rules.empty]" />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6" class="mb-0 pb-0">
              <date-picker v-if="show" :label="$t('manage_staff_start_date')" v-model="value.start_date"
                :required="true" />
            </v-col>
            <v-col cols="6" class="mb-0 pb-0">
              <v-text-field dense outlined type="number" :label="$t('manage_staff_atm_number')"
                v-model="value.atm_number" />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6" class="mb-0 pb-0">
              <date-picker v-if="show" :label="$t('manage_staff_birthday')" v-model="value.birthday" :required="true" />
            </v-col>
            <v-col cols="6" class="mb-0 pb-0">
              <v-autocomplete dense outlined hide-details return-object v-model="value.gender" :items="genders"
                item-text="name" item-value="id" :label="$t('manage_staff_gender_name')" :rules="[rules.empty]" />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6" class="mb-0 pb-4">
              <v-autocomplete dense outlined hide-details return-object v-model="value.department_position"
                :items="departmentPosition" item-text="name" item-value="id"
                :label="$t('manage_staff_department_position_name')" :rules="[rules.empty]" />
            </v-col>
            <v-col cols="6" class="mb-0 pb-4">
              <v-autocomplete dense outlined hide-details return-object v-model="value.branch" :items="branchs"
                item-text="name" item-value="id" :label="$t('manage_staff_branch_name')" :rules="[rules.empty]" />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6" class="mb-0 pb-4">
              <v-autocomplete dense outlined hide-details v-model="value.province" :items="provinces" return-object
                @change="getListDistrict()" item-text="name" item-value="id" :label="$t('manage_staff_province_name')"
                :rules="[rules.empty]" />
            </v-col>
            <v-col cols="6" class="mb-0 pb-4">
              <v-autocomplete dense outlined hide-details return-object v-model="value.district" :items="districts"
                item-text="name" item-value="id" :label="$t('manage_staff_district_name')" :rules="[rules.empty]" />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" class="mb-0 pb-0">
              <v-text-field dense outlined :label="$t('manage_staff_address')" v-model="value.address"
                :rules="[rules.empty]" />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" class="mb-0 pb-0">
              <v-textarea dense outlined :label="$t('manage_staff_notes')" v-model="value.notes" />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <!-- footer -->
      <hr />
      <v-card-actions class="" style="background-color: #eeeeee">
        <v-spacer />
        <v-btn @click="closeInfoDialog" class="mr-4" outlined :color="type === 'add' ? 'green' : 'blue'">
          {{ $t("button_close") }}
        </v-btn>
        <v-btn :color="type === 'add' ? 'green' : 'blue'" class="white--text font-weight-bold" @click="actionButton">
          {{ text.action }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from "moment";

import { pageMixins } from "@/util/PageMixins";
import DatePicker from "@/components/DatePicker";

import branchServices from "@/services/branch/branch.js";
import moreDetailServices from "@/services/more_detail/more_detail.js";
import departmentPositionlServices from "@/services/department_position/department_position.js";
import addressServices from "@/services/address/address.js";
import staffServices from "@/services/staff/staff.js";

export default {
  props: ["show", "type", "item"],
  components: { DatePicker },
  mixins: [pageMixins],
  data: function () {
    return {
      value: {
        start_date: moment(new Date()).format("YYYY-MM-DD"),
      },
      gender: {},
      genders: [],
      department_position: {},
      departmentPosition: [],
      province: {},
      provinces: [],
      district: {},
      districts: [],
      branch: {},
      branchs: [],
      text: {
        title: "",
        action: "",
      },
    };
  },
  watch: {
    show: async function () {
      if (!this.show) return;
      await this.getListBranch();
      await this.getListGender();
      await this.getListDepartmentPosition();
      await this.getListProvince();

      //reset from không chạy vào rulue
      this.$refs.form && this.$refs.form.resetValidation();

      if (this.type === "add") {
        this.text = {
          title: this.$t("manage_department_position_add_title"),
          action: this.$t("tooltip_button_add_title"),
        };
      } else if (this.type === "update") {
        await this.getListDistrict();
        this.text = {
          title: this.$t("manage_department_position_update_title"),
          action: this.$t("tooltip_button_update_title"),
        };

        this.value = {
          name: this.item.name,
          code: this.item.code,
          birthday: this.item.birthday,
          email: this.item.email,
          phone: this.item.phone,
          start_date: this.item.start_date,
          atm_number: this.item.atm_number,
          notes: this.item.notes,
          address: this.item.address,
        };

        // lấy dữ liệu lên combobox
        if (this.branchs)
          this.value.branch = this.branchs.find(
            (item) => item.id === this.item.branch_id
          );
        if (this.genders)
          this.value.gender = this.genders.find(
            (item) => item.id === this.item.gender_id
          );
        if (this.departmentPosition)
          this.value.department_position = this.departmentPosition.find(
            (item) => item.id === this.item.department_position_id
          );
        if (this.provinces)
          this.value.province = this.provinces.find(
            (item) => item.id === this.item.province_id
          );
        if (this.districts)
          this.value.district = this.districts.find(
            (item) => item.id === this.item.district_id
          );
      }
    },
  },
  methods: {
    actionButton: async function () {
      if (!this.$refs.form.validate()) return;
      this.type === "add" ? await this.createStaff() : await this.updateStaff();
    },
    // lấy danh sách chi nhánh
    getListBranch: async function () {
      const response = await branchServices.getList();
      const result = response.data;
      if (result && !result.error) {
        this.branchs = result.data.map((item, idx) => ({
          ...item,
          display: [item.code, item.name].join(" - "),
        }));
      }
    },
    // lấy danh sách giới tính
    getListGender: async function () {
      const response = await moreDetailServices.getListGender();
      const result = response.data;
      if (result && !result.error) {
        this.genders = result.data.map((item, idx) => ({
          ...item,
        }));
      }
    },
    //lấy danh sách chức vụ
    getListDepartmentPosition: async function () {
      const response = await departmentPositionlServices.getList();
      const result = response.data;
      if (result && !result.error) {
        this.departmentPosition = result.data.map((item, idx) => ({
          ...item,
        }));
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

    getItem: function () {
      const newItem = {
        name: this.value.name,
        birthday: this.value.birthday,
        email: this.value.email,
        phone: this.value.phone,
        start_date: this.value.start_date,
        atm_number: this.value.atm_number,
        notes: this.value.notes,
        address: this.value.address,
      };
      if (this.value.gender) newItem.gender_id = this.value.gender.id;
      if (this.value.department_position)
        newItem.department_position_id = this.value.department_position.id;
      if (this.value.province) newItem.province_id = this.value.province.id;
      if (this.value.district) newItem.district_id = this.value.district.id;
      if (this.value.branch) newItem.branch_id = this.value.branch.id;
      return newItem;
    },
    createStaff: async function () {
      try {
        if (!this.$refs.form.validate()) return;
        const body = this.getItem();
        if (this.value.branch)
          body.code =
            this.value.branch.code +
            moment(new Date()).format("DDMMYYYYHHmmss");
        console.warn("data", body);
        const response = await staffServices.create(body);
        const result = response.data;
        if (result && !result.error) {
          this.$emit("reload-table");
          this.$SnackBar.show(
            "success",
            this.$t("manage_staff_create_success")
          );
        } else {
          if (result.code === 201) {
            this.$SnackBar.show(
              "error",
              this.$t("manage_staff_create_error_exist")
            );
            return;
          } else {
            this.$SnackBar.show("error", this.$t("manage_staff_create_error"));
            return;
          }
        }
      } catch (e) {
        this.$SnackBar.show("error", this.$t("connect_net_work_error"));
      }
      this.closeInfoDialog();
    },

    updateStaff: async function () {
      try {
        if (!this.$refs.form.validate()) return;
        const body = this.getItem();
        body.id = this.item.id;

        const response = await staffServices.update(body);
        const result = response.data;
        if (result && !result.error) {
          this.$emit("reload-table");
          this.$SnackBar.show(
            "success",
            this.$t("manage_department_position_update_success")
          );
        } else {
          this.$SnackBar.show(
            "error",
            this.$t("manage_department_position_update_error")
          );
        }
      } catch (e) {
        this.$SnackBar.show("error", this.$t("connect_net_work_error"));
      }
      this.closeInfoDialog();
    },
    closeInfoDialog: function () {
      this.value = {};
      this.$emit("close-dialog");
    },
  },
};
</script>
