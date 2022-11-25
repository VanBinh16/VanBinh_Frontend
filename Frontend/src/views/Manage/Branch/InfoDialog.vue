<template>
  <v-dialog v-model="show" persistent width="80%">
    <v-card>
      <!-- header infodialog -->
      <v-card-title :class="`${type === 'add' ? 'green' : 'blue'} white--text`">
        <v-row align="center" class="ma-0">
          <span class="font-weight-bold white--text"> {{ text.title }} </span>
        </v-row>
      </v-card-title>

      <!-- nội dung from -->
      <v-card-text class="pt-4">
        <v-form ref="form">
          <date-picker
            :label="$t('manage_branch_start_date')"
            :required="true"
            v-model="value.applied_date"
          />

          <v-text-field
            dense
            outlined
            type="text"
            :label="$t('manage_branch_code')"
            v-model="value.barnch_code"
            :rules="[rules.empty]"
          />

          <v-text-field
            dense
            outlined
            type="text"
            :label="$t('manage_branch_name')"
            v-model="value.branch_name"
            :rules="[rules.empty]"
          />

          <v-text-field
            dense
            outlined
            type="text"
            :label="$t('manage_branch_manager')"
            v-model="value.manage"
            :rules="[rules.empty]"
          />

          <v-text-field
            dense
            outlined
            type="number"
            :label="$t('manage_branch_worker_number')"
            v-model="value.worker_number"
            :rules="[rules.empty]"
          />

          <v-textarea
            dense
            outlined
            :label="$t('manage_branch_address')"
            v-model="value.address"
            :rules="[rules.empty]"
          />

          <v-textarea
            dense
            outlined
            :label="$t('manage_branch_notes')"
            v-model="value.notes"
          />
        </v-form>
      </v-card-text>
      <!-- footer -->
      <v-card-actions class="" style="background-color: #eeeeee">
        <v-spacer />
        <v-btn text color="blue darken-1" @click="closeInfoDialog">
          Đóng
        </v-btn>
        <v-btn
          :color="type === 'add' ? 'green' : 'blue'"
          class="white--text mr-4 font-weight-bold"
          @click="actionButton"
        >
          {{ text.action }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import DatePicker from "@/components/DatePicker";
import moment from "moment";

import { pageMixins } from "@/util/PageMixins";

import branchServices from "@/services/branch/branch.js";

export default {
  props: ["show", "type", "item"],
  mixins: [pageMixins],
  components: { DatePicker },
  data: function () {
    return {
      value: {
        applied_date: moment(new Date()).format("YYYY-MM-DD"),
      },
      text: {
        title: "",
        action: "",
      },
    };
  },
  watch: {
    show: async function () {
      if (!this.show) return;

      if (this.type === "add") {
        this.text = {
          title: this.$t("manage_branch_info_dialog_add_title"),
          action: this.$t("tooltip_button_add_title"),
        };
      } else if (this.type === "update") {
        this.text = {
          title: this.$t("manage_branch_info_dialog_update_title"),
          action: this.$t("tooltip_button_update_title"),
        };

        this.value = {
          id: this.item.id,
        };
      }
    },
  },
  methods: {
    actionButton: async function () {
      this.type === "add"
        ? await this.createBranch()
        : await this.updateBranch();
    },
    getItem: function () {
      const newItem = {
        branch_code: this.value.branch_code,
        branch_name: this.value.branch_name,
        address: this.value.address,
        manager: this.value.manager,
        applied_date: this.value.applied_date,
        worker_number: this.value.worker_number,
        notes: this.value.notes,
      };

      return newItem;
    },
    createBranch: async function () {
      try {
        if (!this.$refs.form.validate()) return;
        const body = this.getItem();

        const response = await branchServices.create(body);
        const result = response.data;
        if (result && !result.error) {
          this.$emit("reload-table");
          this.$SnackBar.show(
            "success",
            this.$t("manage_branch_create_success")
          );
        } else {
          if (result.code === 201) {
            this.$SnackBar.show(
              "error",
              this.$t("manage_branch_create_error_exist")
            );
            return;
          } else {
            this.$SnackBar.show(
              "error",
              this.$t("manage_branch_create_error_data")
            );
            return;
          }
        }
      } catch (e) {
        this.$SnackBar.show(
          "error",
          this.$t("manage_branch_eror_connect_network")
        );
      }
      this.closeInfoDialog();
    },

    updateBranch: async function () {
      try {
        if (!this.$refs.form.validate()) return;
        const body = this.getItem();
        delete body.branch_code;
        body.id = this.item.id;
        const response = await branchServices.create(body);
        const result = response.data;
        if (result && !result.error) {
          this.$emit("reload-table");
          this.$SnackBar.show(
            "success",
            this.$t("manage_branch_create_success")
          );
        } else {
          this.$SnackBar.show(
            "error",
            this.$t("manage_branch_create_error_data")
          );
        }
      } catch (e) {
        this.$SnackBar.show(
          "error",
          this.$t("manage_branch_eror_connect_network")
        );
      }
      this.closeInfoDialog();
    },
    closeInfoDialog: function () {
      this.value = {
        applied_date: moment(new Date()).format("YYYY-MM-DD"),
      };
      this.$emit("close-dialog");
    },
  },
};
</script>
