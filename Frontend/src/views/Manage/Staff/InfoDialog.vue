<template>
  <v-dialog v-model="show" persistent width="70%">
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
          <v-row>
            <v-col cols="6" class="mb-0 pb-0">
              <v-text-field
                dense
                outlined
                type="text"
                :label="$t('manage_department_position_name')"
                v-model="value.name"
                :rules="[rules.empty]"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6" class="mb-0 pb-4">
              <v-autocomplete
                dense
                outlined
                hide-details
                return-object
                clearable
                item-text="name"
                item-value="id"
                placeholder="Phòng ban"
                :rules="[rules.empty]"
              />
            </v-col>
            <v-col cols="6" class="mb-0 pb-4">
              <v-autocomplete
                dense
                outlined
                hide-details
                return-object
                clearable
                item-text="name"
                item-value="id"
                placeholder="Phòng ban"
                :rules="[rules.empty]"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" class="mb-0 pb-0">
              <v-textarea
                dense
                outlined
                label="Ghi chú"
                v-model="value.notes"
                :rules="[rules.empty]"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
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
          :color="type === 'add' ? 'green' : 'blue'"
          class="white--text font-weight-bold"
          @click="actionButton"
        >
          {{ text.action }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from "moment";

import { pageMixins } from "@/util/PageMixins";

import branchServices from "@/services/branch/branch.js";

export default {
  props: ["show", "type", "item"],
  mixins: [pageMixins],
  components: {},
  data: function () {
    return {
      value: {},
      text: {
        title: "",
        action: "",
      },
    };
  },
  watch: {
    show: async function () {
      if (!this.show) return;
      //reset from không chạy vào rulue
      this.$refs.form && this.$refs.form.resetValidation();

      if (this.type === "add") {
        this.text = {
          title: this.$t("manage_department_position_add_title"),
          action: this.$t("tooltip_button_add_title"),
        };
      } else if (this.type === "update") {
        this.text = {
          title: this.$t("manage_department_position_update_title"),
          action: this.$t("tooltip_button_update_title"),
        };

        this.value = {
          name: this.item.name,
          notes: this.item.notes,
        };
      }
    },
  },
  methods: {
    actionButton: async function () {
      if (!this.$refs.form.validate()) return;
      this.type === "add"
        ? await this.createDepartmentPosition()
        : await this.updateDepartmentPosition();
    },
    getItem: function () {
      const newItem = {
        name: this.value.name,
        notes: this.value.notes,
      };

      return newItem;
    },
    createDepartmentPosition: async function () {
      try {
        if (!this.$refs.form.validate()) return;
        const body = this.getItem();

        const response = await branchServices.create(body);
        const result = response.data;
        if (result && !result.error) {
          this.$emit("reload-table");
          this.$SnackBar.show(
            "success",
            this.$t("manage_department_position_create_success")
          );
        } else {
          if (result.code === 201) {
            this.$SnackBar.show(
              "error",
              this.$t("manage_department_position_create_exist")
            );
            return;
          } else {
            this.$SnackBar.show(
              "error",
              this.$t("manage_department_position_create_error")
            );
            return;
          }
        }
      } catch (e) {
        this.$SnackBar.show("error", this.$t("connect_net_work_error"));
      }
      this.closeInfoDialog();
    },

    updateDepartmentPosition: async function () {
      try {
        if (!this.$refs.form.validate()) return;
        const body = this.getItem();
        body.id = this.item.id;

        const response = await branchServices.update(body);
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
      this.$emit("close-dialog");
    },
  },
};
</script>
