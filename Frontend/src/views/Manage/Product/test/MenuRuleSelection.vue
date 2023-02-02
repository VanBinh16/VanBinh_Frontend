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
import vehicleLoadTypeGroupServices from "@/services/vehicle/vehicle_load_type_group.services";
import unloadingFeeDepotBaremDetailTypeServices from "@/services/unloading_fee_depot_barem_detail_type/unloading_fee_depot_barem_detail_type.services";
import { pageMixins } from "@/util/PageMixins";
import { RevenueRuleMixin } from "@/util/RevenueRuleMixin";
import { removeAccentString } from "@/util/VNCharacter";
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
  mixins: [pageMixins, RevenueRuleMixin],
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
    getVehicleLoadTypeGroups: async function () {
      try {
        const response = await vehicleLoadTypeGroupServices.getList();
        const result = response.data;
        if (result && !result.error) {
          this.vehicleLoadTypeGroups = result.data.map((item) => ({
            ...item,
            display: `${item.name}`,
          }));
        }
      } catch (e) {
        process.env.VUE_APP_DEBUG === "1" && console.log(e);
      }
      this.isLoading = false;
    },
    changType: function () {
      const unloadingFeeDepotBaremDetail = this.unloadingFeeDepotBaremDetailTypes.find(
        (rule) => rule.id === this.value.type_name.id
      );

      if (unloadingFeeDepotBaremDetail.id == 1) {
        this.value.type_ids = 1;
      }

      if (unloadingFeeDepotBaremDetail.id == 2) {
        this.value.type_ids = 2;
      }
      if (unloadingFeeDepotBaremDetail.id == 3) {
        this.value.type_ids = 3;
      }
      if (unloadingFeeDepotBaremDetail.id == 4) {
        this.value.type_ids = 4;
      }
      if (unloadingFeeDepotBaremDetail.id == 5) {
        this.value.type_ids = 5;
      }
    },

    async unloadingFeeDepotBaremDetailType() {
      try {
        const response = await unloadingFeeDepotBaremDetailTypeServices.getList();
        const result = response.data;
        if (result && !result.error) {
          this.unloadingFeeDepotBaremDetailTypes = result.data.map((item) => ({
            ...item,
            display: `${item.name}`,
            vn_display: removeAccentString(`${item.name}`),
          }));
        }
      } catch (error) {
        this.$SnackBar.show("error", this.$t("unloading_fee_depot_barem_error"));
        process.env.VUE_APP_DEBUG === "1" && console.log("ERROR", error);
      }
    },

    submit() {
      if (!this.$refs.form.validate()) return;
      const unloadingFeeDepotBaremDetailType = this.unloadingFeeDepotBaremDetailTypes.find(
        (rule) => rule.id === this.value.type_name.id
      );
      const barem = {
        price: this.value.price,
        //driver_number: this.value.driver_number,
        // vehicle_load_type_group_id: unloadingFeeDepotBaremDetail.id,
        //vehicle_load_type_group_name: unloadingFeeDepotBaremDetail.name,
        type_id: unloadingFeeDepotBaremDetailType.id,
        type_name: unloadingFeeDepotBaremDetailType.name,
      };
      if (this.value.vehicle_load_type_group) {
        const unloadingFeeDepotBaremDetail = this.vehicleLoadTypeGroups.find(
          (rule) => rule.id === this.value.vehicle_load_type_group.id
        );
        barem.vehicle_load_type_group_id = unloadingFeeDepotBaremDetail.id;
        barem.vehicle_load_type_group_name = unloadingFeeDepotBaremDetail.name;
      }
      if (this.type == "create") {
        for (let i = 0; i < this.item.length; i++) {
          const data = this.item[i];
          if (data.type_id == barem.type_id && data.vehicle_load_type_group_id == barem.vehicle_load_type_group_id) {
            this.$SnackBar.show("error", this.$t("unloading_allowance_depot_barem_detail_error"));
            return;
          }
        }
      }
      if (this.type == "update") {
        const barmeArray = _.cloneDeep(this.data);
        barmeArray.splice(this.itemIndex, 1);
        for (let i = 0; i < barmeArray.length; i++) {
          const data = barmeArray[i];
          if (data.type_id == barem.type_id && data.vehicle_load_type_group_id == barem.vehicle_load_type_group_id) {
            this.$SnackBar.show("error", this.$t("unloading_allowance_depot_barem_detail_error"));
            return;
          }
        }
      }
      if (!this.item == false || this.item != null || this.item != undefined) {
        barem.id = this.item.id;
        barem.unloading_fee_barem_id = this.item.unloading_fee_barem_id;
      }
      if (this.value.type_ids == 2) {
        barem.driver_number = this.value.driver_number;
      } else {
        barem.driver_number = null;
      }
      this.crudUnloadingFeeDepotBarem(barem, this.type, this.itemIndex);
      this.menu = false;
    },

    async onBtnClick() {
      await this.getVehicleLoadTypeGroups();
      await this.unloadingFeeDepotBaremDetailType();
      this.setData();
    },

    setData() {
      if (this.type === "create") {
        this.value = { type_id: 1, min: 0, driver_number: 1 };
        this.$refs.form && this.$refs.form.resetValidation();
        return;
      } else if (this.type === "update") {
        this.value = { type_id: 1, min: 0 };
        this.$refs.form && this.$refs.form.resetValidation();

        let tmpValue = {
          //type_id: this.item.type,
          price: this.item.price,
          vehicle_load_type_group: this.item.vehicle_load_type_group_name,
          type_ids: false,
        };
        if (this.item.id) tmpValue.id = this.item.id;
        if (this.item.price) tmpValue.price = this.item.price;
        if (this.item.driver_number) tmpValue.driver_number = this.item.driver_number;
        // if (this.item.type_id) tmpValue.type_id = this.item.type_id;
        //if (this.item.type_name) tmpValue.type_name = this.item.type_name;
        if (this.item.type_id)
          tmpValue.type_name = this.unloadingFeeDepotBaremDetailTypes.find((group) => group.id === this.item.type_id);
        if (this.item.vehicle_load_type_group_id)
          tmpValue.vehicle_load_type_group = this.vehicleLoadTypeGroups.find(
            (group) => group.id === this.item.vehicle_load_type_group_id
          );
        this.value = tmpValue;

        if (this.item.type_id == 1) {
          tmpValue.type_ids = 1;
        }
        if (this.item.type_id == 2) {
          tmpValue.type_ids = 2;
          //tmpValue.driver_number = null;
        }
        if (this.item.type_id == 3) {
          tmpValue.type_ids = 3;
        }
        if (this.item.type_id == 4) {
          tmpValue.type_ids = 4;
        }
        if (this.item.type_id == 5) {
          tmpValue.type_ids = 5;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
