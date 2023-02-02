<template>
  <v-menu v-model="menu" top :close-on-content-click="false">
    <template v-slot:activator="{ on: menu, attrs }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn v-on="{ ...tooltip, ...menu }" v-bind="attrs" icon class="mx-0">
            <v-icon color="red">mdi-delete</v-icon>
          </v-btn>
        </template>
        <span>{{$t("unloading_fee_depot_barem_delete_detail")}}</span>
      </v-tooltip>
    </template>
    <v-form ref="form" class="white pa-5" style="width: 320px;">
      <h2 class="mb-2">{{$t("unloading_fee_depot_barem_delete_detail")}}</h2>
      <ul style="font-size: 14px;">
        <li>
          <span class="grey--text">{{$t("unloading_fee_depot_barem_vehicle_load_type_group_name")}}</span>
          <span class="font-weight-bold">: {{ item.vehicle_load_type_group_name }}</span>
        </li>

        <li>
          <span class="grey--text">{{$t("unloading_fee_depot_barem_type_calculation_name")}}</span>
          <span class="font-weight-bold">: {{ item.type_name }}</span>
        </li>

         <li>
          <span class="grey--text">{{$t("unloading_fee_depot_barem_num_drivers")}}</span>
          <span class="font-weight-bold">: {{ item.driver_number }}</span>
        </li>

        <li>
          <span class="grey--text">{{$t("unloading_fee_depot_barem_price")}}</span>
          <span class="font-weight-bold">: {{ formatMoney(item.price) }}</span>
        </li>

       
      </ul>
      <v-row class="mt-2">
        <v-col cols="6" class="pa-1">
          <v-btn width="100%" depressed class="ma-0 pa-0 mr-2 grey darken-3" @click="menu = false">
            {{ $t("button_cancel") }}
          </v-btn>
        </v-col>
        <v-col cols="6" class="pa-1">
          <v-btn width="100%" depressed class="ma-0 pa-0 red darken-3" @click="remove">
            {{ $t("button_remove") }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-menu>
</template>

<script>
import { pageMixins } from "@/util/PageMixins";

export default {
  name: "RuleSelection",
  props: ["item", "productTypes"],
  mixins: [pageMixins],
  data() {
    return {
      menu: false,
    };
  },
  methods: {
    remove() {
      this.$emit("on-remove-barem");
      this.item.is_delete = true;
      this.menu = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
