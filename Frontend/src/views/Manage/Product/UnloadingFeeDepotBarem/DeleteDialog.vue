<template>
  <v-dialog @keydown.esc="$emit('close-dialog')" v-model="show" persistent max-width="550px">
    <v-card>
      <v-card-title class="headline red darken-2 white--text">
        {{ $t("loading_allowance_depot_barem_delete") }}
      </v-card-title>
      <v-card-text class="pt-5">
        <strong class="mt-5 font-weight-bold" style="font-size: 16px;">{{
          $t("loading_allowance_depot_barem_delete_title")
        }}</strong>
        <ul class="pa-0 ml-10 mt-3">
          <li>
            <span class="font-weight-bold">{{ $t("unloading_fee_depot_barem_applied_time") }}</span>
            <span>: {{ dateFormat(item.applied_time) }}</span>
          </li>
          <li>
            <span class="font-weight-bold">{{ $t("unloading_fee_depot_barem_customer_name") }}</span>
            <span>: {{ item.customer_name }}</span>
          </li>
          <li>
            <span class="font-weight-bold">{{ $t("unloading_fee_depot_barem_depot_name") }}</span>
            <span>: {{ item.depot_name }}</span>
          </li>
          <li>
            <span class="font-weight-bold">{{ $t("unloading_fee_depot_barem_round_trip") }}</span>
            <span>: {{ item.round_trip ? "Có" : "Không" }}</span>
          </li>
          <li>
            <span class="font-weight-bold">{{ $t("unloading_fee_depot_barem_notes") }}</span>
            <span>: {{ item.notes }}</span>
          </li>
        </ul>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn class="font-weight-bold" color="red darken-2" text @click="$emit('close-dialog')">
          {{ $t("button_cancel") }}
        </v-btn>
        <v-btn class="font-weight-bold elevation-0" color="red darken-2" @click.native="submit">
          {{ $t("button_ok") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import unloadingFeeDepotBaremServices from "@/services/unloading_fee_depot_barem/unloading_fee_depot_barem.services";
import { dateFormatMixins } from "@/util/DateFormat";

export default {
  props: ["show", "item"],
  mixins: [dateFormatMixins],
  methods: {
    async submit() {
      const payload = { id: this.item.id };
      try {
        const response = await unloadingFeeDepotBaremServices.delete(payload);
        const result = response.data;
        if (result && !result.error) {
          this.$SnackBar.show("success", this.$t("unloading_fee_depot_barem_delete_data_success"));
          this.$emit("reload-table");
        } else {
          process.env.VUE_APP_DEBUG === "1" && console.log(response);
          this.$SnackBar.show("error", this.$t("unloading_fee_depot_barem_delete_data_fail"));
        }
      } catch (error) {
        process.env.VUE_APP_DEBUG === "1" && console.log(error);
        this.$SnackBar.show("error", this.$t("unloading_fee_depot_barem_delete_data_fail"));
      }
      this.$emit("close-dialog");
    },
  },
};
</script>

<style lang="scss" scoped></style>
