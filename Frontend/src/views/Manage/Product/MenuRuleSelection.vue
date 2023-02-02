<template>
  <v-menu v-model="menu" offset-x :close-on-content-click="false" top>
    <template v-slot:activator="{ on: menu, attrs }">
      <v-btn
        class="elevation-0 ma-0 green darken-3 font-weight-bold"
        v-if="type === 'create'"
        v-on="menu"
        v-bind="attrs"
        :disabled="!customer ? true : false"
        @click="onBtnClick"
      >
        {{ $t("unloading_fee_depot_barem_add_detail") }}
      </v-btn>

      <v-tooltip v-if="type === 'update'" bottom>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn v-on="{ ...tooltip, ...menu }" v-bind="attrs" icon class="mx-0" @click="onBtnClick">
            <v-icon color="blue">mdi-pencil</v-icon>
          </v-btn>
        </template>
        <span>{{ $t("unloading_fee_depot_barem_update_detail") }}</span>
      </v-tooltip>
    </template>
    <v-form ref="form" class="white pa-5" style="width: 600px;">
      <h2 v-if="type === 'create'" class="black--text mb-3">{{ $t("unloading_fee_depot_barem_add_detail") }}</h2>
      <h2 v-if="type === 'update'" class="black--text mb-3">{{ $t("unloading_fee_depot_barem_update_detail") }}</h2>

      <v-autocomplete
        dense
        outlined
        v-model="value.type_name"
        item-text="display"
        return-object
        :items="unloadingFeeDepotBaremDetailTypes"
        :label="$t('unloading_fee_depot_barem_type_calculation_name')"
        :rules="[notEmpty]"
        @change="changType"
      />

      <!-- tính theo chuyến ( type_id ==1) -->
      <div v-if="this.value.type_ids == 1">
        <v-text-field
          dense
          outlined
          type="number"
          :label="$t('unloading_fee_depot_barem_price')"
          v-model="value.price"
          :rules="[notEmpty]"
        />
      </div>

      <!-- tính theo số lượng lái xe ( type_id ==2) -->
      <div v-if="this.value.type_ids == 2">
        <v-autocomplete
          dense
          outlined
          v-model="value.vehicle_load_type_group"
          item-text="display"
          return-object
          :items="vehicleLoadTypeGroups"
          :label="$t('unloading_fee_depot_barem_vehicle_load_type_group_name')"
          :rules="[notEmpty]"
          :readonly="type === 'update'"
        />

        <v-text-field
          dense
          outlined
          type="number"
          :label="$t('unloading_fee_depot_barem_price')"
          v-model="value.price"
          :rules="[notEmpty]"
        />

        <v-text-field
          dense
          outlined
          type="number"
          :label="$t('unloading_fee_depot_barem_num_drivers')"
          v-model="value.driver_number"
          :rules="[notEmpty]"
        />
      </div>

      <!-- tính theo cbm ( type_id ==3) -->
      <div v-if="this.value.type_ids == 3">
        <v-text-field
          dense
          outlined
          type="number"
          :label="$t('unloading_fee_depot_barem_price')"
          v-model="value.price"
          :rules="[notEmpty]"
        />
      </div>

      <!-- tính theo tải trọng book ( type_id == 4) -->
      <div v-if="this.value.type_ids == 4">
        <v-text-field
          dense
          outlined
          type="number"
          :label="$t('unloading_fee_depot_barem_price')"
          v-model="value.price"
          :rules="[notEmpty]"
        />
      </div>

      <!-- tính theo chuyến ( type_id ==5) -->
      <div v-if="(this.value.type_ids == 5)">
        <v-autocomplete
          dense
          outlined
          v-model="value.vehicle_load_type_group"
          item-text="display"
          return-object
          :items="vehicleLoadTypeGroups"
          :label="$t('unloading_fee_depot_barem_vehicle_load_type_group_name')"
          :rules="[notEmpty]"
          :readonly="type === 'update'"
        />

        <v-text-field
          dense
          outlined
          type="number"
          :label="$t('unloading_fee_depot_barem_price')"
          v-model="value.price"
          :rules="[notEmpty]"
        />
      </div>

      <v-row class="ma-0 pa-0 mt-5">
        <v-spacer></v-spacer>
        <v-btn depressed class="ma-0 pa-0 mr-5 grey darken-3" @click="menu = false">{{ $t("button_cancel") }}</v-btn>
        <v-btn v-if="type === 'create'" depressed class="ma-0 pa-0 green darken-3" @click="submit">{{
          $t("button_add")
        }}</v-btn>
        <v-btn v-if="type === 'update'" depressed class="ma-0 pa-0 green darken-3" @click="submit">{{
          $t("button_update")
        }}</v-btn>
      </v-row>
    </v-form>
  </v-menu>
</template>

<script>

import { pageMixins } from "@/util/PageMixins";


import _cloneDeep from "lodash/cloneDeep";

export default {
  name: "RuleSelection",
  props: [
    "type",
    "customer",
    "customerBrand",
    "crudUnloadingFeeDepotBarem",
    "item",
    "data",
    "itemIndex",
    "customerProducts",
    "productTypes",
    "locationTypesProps",
    "ignoredGroupIds",
  ],
  mixins: [pageMixins],
  data() {
    return {
      menu: false,
      value: {},
      vehicleLoadTypeGroups: [],
      unloadingFeeDepotBaremDetailTypes: [],
      notEmpty: (v) => !!v || this.$t("rules_empty"),
    };
  },
  methods: {
    
  },
};
</script>

<style lang="scss" scoped></style>
