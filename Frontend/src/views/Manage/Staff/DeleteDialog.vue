<template>
  <v-dialog @keydown.esc="closeDialog" v-model="show" persistent max-width="450px">
    <v-card>
      <v-card-title class="headline red darken-2 white--text font-weight-bold">
        {{ $t("manage_department_position_delete_title") }}
      </v-card-title>
      <hr>

      <div class="pt-3 px-5" style="font-size: 14px">
        <v-row class="ma-0 py-1">
          <v-col class="pa-0" cols="4">
            <span class="label">{{ $t("manage_staff_code") }}:</span>
          </v-col>
          <v-col class="pa-0" cols="8">
            <span class="value" style="color: red; font-size: 500">{{ item.code }}</span>
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
            <span class="label">{{ $t("manage_staff_birthday") }}:</span>
          </v-col>
          <v-col class="pa-0" cols="8">
            <span class="value">{{ dateFormatInput(item.birthday) }}</span>
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
            <span class="label">{{ $t("manage_staff_department_position_name") }}:</span>
          </v-col>
          <v-col class="pa-0" cols="8">
            <span class="value" style="color: red; font-size: 500">{{ item.department_position_name }}</span>
          </v-col>
        </v-row>

        <v-row class="ma-0 py-1">
          <v-col class="pa-0" cols="4">
            <span class="label">{{ $t("manage_staff_start_date") }}:</span>
          </v-col>
          <v-col class="pa-0" cols="8">
            <span class="value" style="color: red; font-size: 500">{{ dateFormatInput(item.start_date) }}</span>
          </v-col>
        </v-row>

        <v-row class="ma-0 py-1">
          <v-col class="pa-0" cols="4">
            <span class="label">{{ $t("manage_department_position_notes") }}:</span>
          </v-col>
          <v-col class="pa-0" cols="8">
            <span class="value" style="color: red; font-size: 500">{{
                item.notes
            }}</span>
          </v-col>
        </v-row>
      </div>

      <hr>
      <v-card-actions class="" style="background-color: #eeeeee">
        <v-spacer />
        <v-btn @click="closeDialog" class="mr-4" outlined color="red">
          {{ $t("button_close") }}
        </v-btn>
        <v-btn color="red darken-2" class="white--text font-weight-bold" @click="deleteAction">
          {{ $t("tooltip_button_delete_title") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import TooltipButton from "@/components/TooltipButton";
import { pageMixins } from "@/util/PageMixins";
import { dateFormatMixins } from "@/util/DateFormat";

import staffServices from "@/services/staff/staff.js";

export default {
  components: { TooltipButton },
  mixins: [pageMixins, dateFormatMixins],
  props: {
    item: {},
    show: {
      type: Boolean,
      default: false,
      required: true,
    },
  },

  methods: {
    deleteAction: async function () {
      try {
        const response = await staffServices.delete({ id: this.item.id });
        const result = response.data;
        if (result && !result.error) {
          this.$SnackBar.show(
            "success",
            this.$t("manage_department_position_delete_success")
          );
          this.$emit("reload-table");
        } else {
          this.$SnackBar.show(
            "error",
            this.$t("manage_department_position_delete_error")
          );
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
  //font-weight: 299;
}

.value {
  color: black;
}
</style>
