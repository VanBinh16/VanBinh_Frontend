<template>
  <v-dialog v-model="show" @keydown.esc="closeInfoDialog" persistent max-width="700">
    <v-card>
      <v-card-title class="blue white--text">
        <h3>{{ text.dialogTitle }}</h3>
      </v-card-title>
      <v-card-text class="mt-7 pb-0">
        <v-form ref="form">
          <v-form ref="form" class="ma-2 mt-5">
            <date-picker
              v-if="show"
              :label="$t('unloading_fee_depot_barem_applied_time')"
              v-model="value.applied_time"
              :required="true"
              :readonly="type === 'update'"
            />
            <v-autocomplete
              :items="allCustomers"
              item-text="name"
              v-model="value.customer"
              dense
              outlined
              return-object
              :label="$t('unloading_fee_depot_barem_customer_name')"
              @change="getDepotsByCustomerID($event.id)"
              :loading="isLoading"
              :rules="[rules.empty]"
              :readonly="type === 'update'"
            />

            <v-autocomplete
              :items="customerBrands"
              item-text="name"
              v-model="value.customer_brand"
              dense
              outlined
              return-object
              :label="$t('unloading_fee_depot_barem_customer_brand_name')"
              :readonly="type === 'update'"
            />
            <v-autocomplete
              :items="typeCalulator"
              item-text="display"
              v-model="value.type_calulator"
              dense
              outlined
              return-object
              :label="$t('unloading_fee_depot_barem_type_calculator')"
              @change="changType"
              :rules="[rules.empty]"
            />
            <v-textarea dense outlined :label="$t('unloading_fee_depot_barem_notes')" v-model="value.notes" />
          </v-form>

          <div v-if="this.value.type_calutors == 1">
            <v-autocomplete
              :items="allDepots"
              item-text="display"
              v-model="value.depot"
              dense
              outlined
              return-object
              :label="$t('unloading_allowance_depot_barem_depot')"
              :rules="[rules.empty]"
            />
          </div>

          <div v-if="this.value.type_calutors == 2">
            <v-autocomplete
              dense
              outlined
              return-object
              item-text="name"
              :label="$t('unloading_fee_depot_barem_depot_province_name')"
              v-model="value.province"
              :items="provinces"
              @input="getAllDistrict"
              :rules="[rules.empty]"
            />
          </div>

          <div v-if="this.value.type_calutors == 3">
            <v-row>
              <v-col cols="6">
                <v-autocomplete
                  dense
                  outlined
                  return-object
                  item-text="name"
                  :label="$t('unloading_fee_depot_barem_depot_province_name')"
                  v-model="value.province"
                  :items="provinces"
                  @input="getAllDistrict"
                  :rules="[rules.empty]"
                />
              </v-col>
              <v-col cols="6">
                <v-autocomplete
                  dense
                  outlined
                  return-object
                  item-text="name"
                  :label="$t('unloading_fee_depot_barem_district_name')"
                  v-model="value.district"
                  :items="districts"
                  :rules="[rules.empty]"
                />
              </v-col>
            </v-row>
          </div>
          <v-row class="mx-1" justify="space-between">
            <v-checkbox class="mt-0" :label="$t('unloading_fee_depot_barem_round_trip')" v-model="value.round_trip" />
          </v-row>
          <v-row align="center" class="mx-1">
            <menu-rule-selection
              type="create"
              :customer="value.customer"
              :customerBrand="value.customer_brand"
              :ignored-group-ids="computeIgnoredGroupIds"
              :crudUnloadingFeeDepotBarem="crudUnloadingFeeDepotBarem"
              :item="value.data"
              :items="value.data"
            />
            <v-spacer />
          </v-row>

          <v-data-table
            hide-default-footer
            disable-sort
            class="mt-3"
            :headers="headers"
            :items="value.data"
            :items-per-page="10000"
          >
            <template v-slot:item="{ item, index }">
              <tr>
                <td>{{ index + 1 }}</td>
                <td style="text-align: center;">
                  <menu-rule-selection
                    type="update"
                    :data="value.data"
                    :customer="value.customer"
                    :customerBrand="value.customer_brand"
                    :item="item"
                    :itemIndex="index"
                    :ignored-group-ids="computeIgnoredGroupIds"
                    :crudUnloadingFeeDepotBarem="crudUnloadingFeeDepotBarem"
                  />
                  <menu-remove-barem
                    v-if="value.data.length > 1"
                    :item="item"
                    @on-remove-barem="onRemoveUnloadingFeeDepotBarem(index, item)"
                  />
                </td>
                <td>{{ item.vehicle_load_type_group_name }}</td>
                <td>{{ item.type_name }}</td>
                <td>{{ item.driver_number }}</td>
                <td style="color: blue; font-weight: 600;">{{ formatMoney(item.price) }}</td>
              </tr>
            </template>
            <template v-slot:no-data>
              <div align="left">
                {{ $t("no_data") }}
              </div>
            </template>
          </v-data-table>
        </v-form>
      </v-card-text>
      <v-card-actions class="">
        <v-spacer />
        <v-btn text color="blue darken-1" @click="closeInfoDialog">
          {{ text.dialogCloseButtonTitle }}
        </v-btn>
        <v-btn color="blue white--text" @click="actionButton">
          {{ text.dialogActionButtonTitle }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import _pick from "lodash/pick";
import _cloneDeep from "lodash/cloneDeep";
import _omit from "lodash/omit";
import moment from "moment";

import unloadingFeeDepotBaremServices from "@/services/unloading_fee_depot_barem/unloading_fee_depot_barem.services";
import allCustomerServices from "@/services/customer/customer.services";
import allDepotServices from "@/services/depot/depot.services";
import customerBrandServices from "@/services/customer/customer_brand.services";

import MenuRuleSelection from "./MenuRuleSelection";
import DatePicker from "@/components/DatePicker";
import TooltipButton from "@/components/TooltipButton";
import MenuRemoveBarem from "./MenuRemoveBarem";

import { pageMixins } from "@/util/PageMixins";
import { RevenueRuleMixin } from "@/util/RevenueRuleMixin";
import { dateFormatMixins } from "@/util/DateFormat";
import provinceServices from "@/services/depot/province.services.js";

export default {
  props: ["show", "item", "type"],
  mixins: [pageMixins, RevenueRuleMixin, dateFormatMixins],
  components: { MenuRuleSelection, DatePicker, TooltipButton, MenuRemoveBarem },
  data: function () {
    return {
      text: {
        dialogTitle: "",
        dialogCloseButtonTitle: "",
        dialogActionButtonTitle: "",
      },
      isLoading: false,
      round_trip: false,
      allCustomers: [],
      allDepots: [],
      customerBrands: [],
      provinces: [],
      districts: [],
      typeCalulator: [
        { id: 1, display: "Kho" },
        { id: 2, display: "TP/tỉnh" },
        { id: 3, display: "Quận/huyện" },
      ],
      value: {
        customer: {},
        data: [],
        delete_oil: [],
        update_two_way: true,
        customer_brand: {},
        applied_time: moment().format("YYYY-MM-DD"),
      },
      startDepotKey: 0,
      endDepotKey: 1000,

      headers: [
        { text: this.$t("no"), width: 90, align: "center" },
        { text: this.$t("unloading_fee_depot_barem_actions"), width: 120, align: "center" },
        { text: this.$t("unloading_fee_depot_barem_vehicle_load_type_group_name"), width: 250 },
        { text: this.$t("unloading_fee_depot_barem_type_calculation_name"), width: 200 },
        { text: this.$t("unloading_fee_depot_barem_num_drivers"), width: 200 },
        { text: this.$t("unloading_fee_depot_barem_price") },
      ],
    };
  },
  computed: {
    computeIgnoredGroupIds: function () {
      return this.value.data.map((usedLoadGroup) => usedLoadGroup.vehicle_load_type_group_id);
    },
  },
  watch: {
    show: async function (val) {
      await this.getAllCustomers();
      this.value.type_calutors = false;
      if (this.type === "add") {
        this.text = {
          dialogTitle: this.$t("unloading_fee_depot_barem_add"),
          dialogCloseButtonTitle: this.$t("button_close"),
          dialogActionButtonTitle: this.$t("button_add"),
        };
        this.value = {
          data: [],
          applied_time: moment().format("YYYY-MM-DD"),
        };
        this.value.round_trip = false;
      } else if (this.type === "update") {
        this.text = {
          dialogTitle: this.$t("unloading_fee_depot_barem_update"),
          dialogCloseButtonTitle: this.$t("button_close"),
          dialogActionButtonTitle: this.$t("button_update"),
        };

        const extractItem = _pick(this.item, [
          "unloading_fee_barem_details",
          "vehicle_load_type_group_id",
          "id",
          "price",
          "type_id",
          "type_name",
          "vehicle_load_type_group_name",
          "unloading_fee_barem_id",
          "customer_id",
          "customer_brand_id",
          "applied_time",
          "depot_id",
          "notes",
          "round_trip",
        ]);

        await this.getDepotsByCustomerID(extractItem.customer_id);
        (this.value.customer = this.allCustomers.find((item) => item.id === extractItem.customer_id)),
          //lấy nhãn hàng
          await this.getCustomerBrandsByCustomerID();
        await this.getAllProvince();
        if (this.item.province_id) await this.getAllDistrict({ id: this.item.province_id });
        if (this.item.district_province_id) await this.getAllDistrict({ id: this.item.district_province_id });

        //nếu có kho
        let type_calulator_id;
        if (this.item.depot_id != null) {
          type_calulator_id = 1;
        }

        //nếu có tỉnh
        if (this.item.province_id != null) {
          type_calulator_id = 2;
        }

        //nếu có huyện
        if (this.item.district_id != null) {
          type_calulator_id = 3;
        }

        this.value = {
          applied_time: extractItem.applied_time,
          customer: this.allCustomers.find((item) => item.id === extractItem.customer_id),

          customer_brand: this.customerBrands.find((item) => item.id === extractItem.customer_brand_id),

          depot: this.allDepots.find((item) => item.id === extractItem.depot_id),

          province: this.item.province_id
            ? this.provinces.find((item) => item.id === this.item.province_id)
            : this.provinces.find((item) => item.id === this.item.district_province_id),

          district: this.item.district_province_id
            ? this.districts.find((item) => item.id === this.item.district_id)
            : null,

          type_calulator: this.typeCalulator.find((item) => item.id === type_calulator_id),
          type_calutors: type_calulator_id,
          round_trip: extractItem.round_trip,
          notes: extractItem.notes,
          data: extractItem.unloading_fee_barem_details,
        };
      }
    },
  },
  mounted() {
    this.getAllProvince();
  },
  methods: {
    changType: function () {
      const typeCalulatorId = this.typeCalulator.find((rule) => rule.id === this.value.type_calulator.id);
      if (typeCalulatorId.id == 1) {
        this.value.type_calutors = 1;
      }
      if (typeCalulatorId.id == 2) {
        this.value.type_calutors = 2;
      }
      if (typeCalulatorId.id == 3) {
        this.value.type_calutors = 3;
      }
    },
    async getAllProvince() {
      try {
        this.value.district = null;
        let response = await provinceServices.getAllProvinces();
        let result = response.data;
        if (result && !result.error) {
          this.provinces = result.data;
        } else process.env.VUE_APP_DEBUG === "1" && console.log(response);
      } catch (error) {
        process.env.VUE_APP_DEBUG === "1" && console.log(error);
      }
    },
    async getAllDistrict({ id }) {
      try {
        let response = await provinceServices.getAllDistrictsOfProvince({ id });
        let result = response.data;
        if (result && !result.error) {
          this.districts = result.data;
        } else process.env.VUE_APP_DEBUG === "1" && console.log(response);
      } catch (error) {
        process.env.VUE_APP_DEBUG === "1" && console.log(error);
      }
    },
    actionButton: async function () {
      if (!this.$refs.form.validate()) return;
      if (this.value.data.length === 0) {
        return this.$SnackBar.show("error", this.$t("unloading_fee_depot_barem_detail_insert_data_error"));
      }
      this.type === "add" ? await this.createUnloadingFeeDepotBarem() : await this.updateUnloadingFeeDepotBarem();
    },
    getAllCustomers: async function () {
      try {
        const payload = {};
        const response = await allCustomerServices.getAllCustomers(payload);
        const result = response.data;
        if (result && !result.error) {
          this.allCustomers = result.data.map((e) => ({
            ...e,
          }));
        }
      } catch (e) {
        process.env.VUE_APP_DEBUG === "1" && console.log(e);
      }
      this.isLoading = false;
    },
    getCustomerBrandsByCustomerID: async function () {
      this.value.customer_brand = {};
      if (!this.value.customer) return;
      const payload = {
        customer_id: this.value.customer.id,
      };
      try {
        const response = await customerBrandServices.getAllCustomerBrand(payload);
        const result = response.data;
        if (result && !result.error) {
          this.customerBrands = result.data.map((item) => ({
            ...item,
          }));
        }
      } catch (error) {
        this.$SnackBar.show("error", this.$t("revenue_order_all_customers_error_no_customers"));
        process.env.VUE_APP_DEBUG === "1" && console.log("ERROR", error);
      }
    },

    getDepotsByCustomerID: async function (customer_id) {
      if (this.value.depot) this.$set(this.value, "customer_brand", null);
      if (!customer_id) return;
      //lấy nhãn hàng theo khách hàng
      this.getCustomerBrandsByCustomerID();
      try {
        //lấy kho theo khách hàng
        const response = await allDepotServices.getAllDepots({ customer_id });
        const result = response.data;
        if (result && !result.error) {
          this.allDepots = result.data.map((item) => ({
            ...item,
            display: [item.code, item.name, item.address, item.district_name, item.province_name]
              .filter(Boolean)
              .join(" - "),
          }));
        }
      } catch (e) {
        process.env.VUE_APP_DEBUG === "1" && console.log(e);
      }
    },

    getItem: function () {
      const { id } = JSON.parse(localStorage.getItem("selectedBranch"));
      const newItem = {
        applied_time: this.value.applied_time,
        customer_id: this.value.customer.id,
        //customer_brand_id: this.value.customer_brand.id,
        depot_id: null,
        round_trip: this.value.round_trip,
        notes: this.value.notes,
        branch_id: parseInt(id),
        province_id: null,
        district_id: null,
      };
      //lấy nhãn hàng
      if (this.value.customer_brand) newItem.customer_brand_id = this.value.customer_brand.id;
      // ưu tiên lấy dữ liệu [ 3.Kho ==> 2.Tỉnh/Thành phố ==> 1.Huyện/Quận] (tăng dần) else nếu không lấy giá trị == null
      if (this.value.province == null && this.value.district == null && this.value.depot == null) {
        this.$SnackBar.show("error", this.$t("unloading_allowance_depot_barem_address_error")); //chọn kho tỉnh hoặc huyện
        return { newItem: null, status: false };
      }
      console.warn("tinh huyen", this.value.type_calulator);
      if (this.value.type_calulator.id == 1) {
        newItem.depot_id = this.value.depot.id;
        this.value.district = null;
        this.value.province = null;
      }

      if (this.value.type_calulator.id == 3) {
        newItem.district_id = this.value.district.id;
        //có huyện tỉnh và kho sẽ nhận giá trị null
        this.value.province = null;
      }
      if (this.value.type_calulator.id == 2) {
        newItem.province_id = this.value.province.id;
        // có tỉnh kho sẽ nhận giá trị null
      }
      if (this.value.data === null || this.value.data === undefined) newItem.unloading_fee_barem_details = [];
      newItem.unloading_fee_barem_details = this.value.data.map((unloadingFeeDepotBarem) =>
        _omit(unloadingFeeDepotBarem, ["vehicle_load_type_group_name", "load_name", "type_name"])
      );
      if (this.type == "update") {
        const create = newItem.unloading_fee_barem_details.filter((item) => !item.id);
        const update = newItem.unloading_fee_barem_details.filter((item) => item.id);
        const remove = this.item.unloading_fee_barem_details.filter((item) => item.is_delete);
        const deletes = remove.map((unloadingFeeDepotBaremDetail_delete) => unloadingFeeDepotBaremDetail_delete.id);
        newItem.unloading_fee_barem_details = { update };
        if (create.length > 0) {
          newItem.unloading_fee_barem_details["create"] = create;
        }
        if (deletes.length > 0) {
          newItem.unloading_fee_barem_details["delete"] = deletes;
        }
      }
      return { newItem, status: true };
    },

    createUnloadingFeeDepotBarem: async function () {
      try {
        const { newItem, status } = this.getItem();
        if (!status) return;
        const response = await unloadingFeeDepotBaremServices.create(newItem);
        const result = response.data;
        if (result && !result.error) {
          this.$SnackBar.show("success", this.$t("unloading_fee_depot_barem_add_data_success"));
          this.$emit("reload-table");
        } else {
          if (result.code === 201) {
            this.$SnackBar.show("error", this.$t("unloading_fee_depot_barem_add_data_error"));
            return;
          } else if (result.code === 209) {
            this.$SnackBar.show("error", this.$t("unloading_fee_depot_barem_add_detail_data_error"));
            return;
          } else {
            this.$SnackBar.show("error", this.$t("unloading_fee_depot_barem_add_data_fail"));
            return;
          }
        }
      } catch (e) {
        this.$SnackBar.show("error", this.$t("unloading_fee_depot_barem_add_data_fail"));
        process.env.VUE_APP_DEBUG === "1" && console.log(e);
      }
      this.closeInfoDialog();
    },
    updateUnloadingFeeDepotBarem: async function () {
      try {
        const { newItem, status } = this.getItem();
        if (!status) return;
        newItem.id = this.item.id;
        //không cho cập nhật nhãn hàng
        delete newItem.customer_brand_id;
        const response = await unloadingFeeDepotBaremServices.update(newItem);
        const result = response.data;
        if (result && !result.error) {
          this.$SnackBar.show("success", this.$t("unloading_fee_depot_barem_update_data_success"));
          this.$emit("reload-table");
        } else {
          if (result.code === 201) {
            this.$SnackBar.show("error", this.$t("unloading_fee_depot_barem_add_data_error"));
            return;
          } else if (result.code === 209) {
            this.$SnackBar.show("error", this.$t("unloading_fee_depot_barem_add_detail_data_error"));
            return;
          } else if (result.code === 200) {
            this.$SnackBar.show("error", this.$t("unloading_fee_depot_barem_add_detail_data_fail"));
            return;
          } else {
            this.$SnackBar.show("error", this.$t("unloading_fee_depot_barem_update_data_fail"));
            return;
          }
        }
      } catch (e) {
        this.$SnackBar.show("error", this.$t("unloading_fee_depot_barem_update_data_fail"));
        process.env.VUE_APP_DEBUG === "1" && console.log(e);
      }
      this.closeInfoDialog();
    },
    closeInfoDialog: function () {
      this.text = { dialogTitle: "", dialogCloseButtonTitle: "", dialogActionButtonTitle: "" };
      this.allCustomers = [];
      this.allDepots = [];

      this.value = {
        depot: {},
        customer: {},
        data: [],
      };
      this.$emit("close-dialog");
    },
    crudUnloadingFeeDepotBarem(barem, type, index) {
      const newData = this.value.data ? [...this.value.data] : [];
      for (let i = 0; i < this.value.data.length; i++) {
        if (
          this.value.data[i].vehicle_load_type_group_id == barem.vehicle_load_type_group_id &&
          type === "create" &&
          this.value.data[i].type_id == barem.type_id
        ) {
          this.$SnackBar.show("error", this.$t("unloading_fee_depot_barem_detail_error"));
          return;
        }
      }
      if (type === "create") newData.push(barem);
      else {
        newData.splice(index, 1);
        newData.splice(index, 0, barem);
      }
      this.$set(this.value, "data", newData);
    },
    onRemoveUnloadingFeeDepotBarem(index) {
      const newData = this.value.data.slice();
      newData.splice(index, 1);
      this.$set(this.value, "data", newData);
    },
  },
};
</script>
