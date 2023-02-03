<template>
  <v-card id="regular-tables" fluid tag="section">
    <base-material-card color="blue">
      <template v-slot:heading>
        <v-row>
          <v-col>
            <h2 class="white--text">{{ $t("unloading_fee_depot_barem_header_title") }}</h2>
          </v-col>
          <v-col>
            <v-text-field
              dense
              outlined
              hide-details
              clearable
              prepend-inner-icon="mdi-magnify"
              v-model="filter"
              :label="$t('filter')"
            />
          </v-col>
        </v-row>
      </template>

      <v-row align="center">
        <v-col cols="12" md="3">
          <date-picker
            v-model="searchDate"
            :hideDetails="true"
            :label="$t('unloading_fee_depot_barem_filter_by_date')"
          />
        </v-col>
        <v-btn class="elevation-0 font-weight-bold" color="blue" @click="getallUnloadingFeeDepotBarem">
          {{ $t("unloading_fee_depot_barem_find") }}
        </v-btn>
        <v-checkbox
          class="ml-2"
          color="success"
          :label="$t('unloading_fee_depot_barem_show_all')"
          v-model="showAll"
          @change="getallUnloadingFeeDepotBarem"
        />
      </v-row>

      <v-card>
        <v-btn absolute fab top left small v-if="ui.buttons[0].visible" color="blue" @click="openInfoDialog('add')">
          <v-icon>mdi-plus</v-icon>
        </v-btn>

        <v-data-table
          show-expand
          single-expand
          :search="filter"
          :headers="headers"
          :items="unloadingFeeDepotBarem"
          :footer-props="footerProps"
          :sort-desc="[true]"
        >
          <template #[`item.actions`]="{item}">
            <v-row justify="center" align="center">
              <tooltip-button
                v-if="ui.buttons[1].visible"
                icon="mdi-pencil"
                iconColor="blue"
                :tooltipText="$t('unloading_fee_depot_barem_update')"
                @on-click="openInfoDialog('update', item)"
              />
              <tooltip-button
                v-if="ui.buttons[2].visible"
                icon="mdi-delete"
                iconColor="red"
                :tooltipText="$t('unloading_fee_depot_barem_remove')"
                @on-click="openDeleteDialog(item)"
              />
            </v-row>
          </template>
          <template #[`item.vn_applied_time`]="{item}"> {{ dateFormat(item.applied_time) }} </template>
          <template #[`item.vn_customer_name`]="{item}"> {{ item.customer_name }}</template>
          <template #[`item.vn_customer_brand_name`]="{item}"> {{ item.customer_brand_name }}</template>
          <template #[`item.vn_depot_name`]="{item}"> {{ item.depot_name }}</template>
          <template #[`item.round_trip`]="{item}">
            <v-row justify="center">
              <v-checkbox v-model="item.round_trip" :readonly="true" />
            </v-row>
          </template>
          <template #[`item.vn_notes`]="{item}"> {{ item.notes }}</template>
          <template #[`item.data-table-expand`]="{item, expand, isExpanded}">
            <strong
              @click="customExpand(item, expand, isExpanded)"
              style="text-decoration: underline; cursor: pointer;"
            >
              {{ $t("unloading_fee_depot_barem_detail") }}
            </strong>
          </template>
          <template #[`expanded-item`]="props">
            <td :colspan="headers.length + 1" class="pa-5 grey lighten-4" style="background-color: white;">
              <v-data-table
                hide-default-footer
                style="width: 80%;"
                :headers="detailHeaders"
                :items="props.item.unloading_fee_barem_details"
                :items-per-page="10000"
              >
                <template v-slot:item="{ item, index }">
                  <tr>
                    <td>{{ index + 1 }}</td>
                    <td>
                      {{ item.vehicle_load_type_group_name }}
                    </td>
                    <td>
                      {{ item.type_name }}
                    </td>
                    <td>
                      {{ item.driver_number }}
                    </td>
                    <td style="color: blue; font-weight: 600;">
                      {{ formatMoney(item.price) }}
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </td>
          </template>

          <template v-slot:[`footer.page-text`]="props">
            {{ $t("pagination_pageText", { begin: props.pageStart, end: props.pageStop, all: props.itemsLength }) }}
          </template>

          <template v-slot:no-data>
            <div align="left">
              {{ $t("no_data") }}
            </div>
          </template>
        </v-data-table>
      </v-card>
      <info-dialog
        :show="infoDialog.show"
        :type="infoDialog.type"
        :item="infoDialog.item"
        @close-dialog="infoDialog.show = false"
        @reload-table="getallUnloadingFeeDepotBarem"
      />
      <delete-dialog
        :show="deleteDialog.show"
        :type="deleteDialog.type"
        :item="deleteDialog.item"
        @close-dialog="deleteDialog.show = false"
        @reload-table="getallUnloadingFeeDepotBarem"
      />
    </base-material-card>
  </v-card>
</template>

<script>
import DatePicker from "@/components/DatePicker";
import { pageMixins } from "@/util/PageMixins";
import { RevenueRuleMixin } from "@/util/RevenueRuleMixin";
import { removeAccentString } from "@/util/VNCharacter";
import { checkPermissions } from "@/util/Permissions";
import { dateFormatMixins } from "@/util/DateFormat";

import unloadingFeeDepotBaremServices from "@/services/unloading_fee_depot_barem/unloading_fee_depot_barem.services";
import InfoDialog from "./InfoDialog";
import DeleteDialog from "./DeleteDialog";

import TooltipButton from "@/components/TooltipButton";
import moment from "moment";
import _ from "lodash";

export default {
  components: { TooltipButton, DatePicker, InfoDialog, DeleteDialog },
  mixins: [pageMixins, TooltipButton, RevenueRuleMixin, dateFormatMixins],
  data: function () {
    return {
      // from_date: moment().startOf("month").format("YYYY-MM-DD"),
      // to_date: moment().endOf("month").format("YYYY-MM-DD"),
      ui: {
        isAllBranch: false,
        path: "/unloading_fee_depot_barem",
        permission: [],
        buttons: [
          { tag: "Them", visible: false },
          { tag: "CapNhat", visible: false },
          { tag: "Xoa", visible: false },
        ],
      },
      showAll: false,
      searchDate: this.dateFormatReverse(moment()),

      infoDialog: {
        show: false,
        type: "",
        item: {},
      },

      deleteDialog: {
        show: false,
        item: {},
      },

      isShowAll: false,
      filter: "",

      unloadingFeeDepotBarem: [],
      revenueRules: [],
      detailHeaders: [
        { text: this.$t("no"), width: 90 },
        { text: this.$t("unloading_fee_depot_barem_vehicle_load_type_group_name"), width: 250 },
        { text: this.$t("unloading_fee_depot_barem_type_calculation_name"), with: 200 },
        { text: this.$t("unloading_fee_depot_barem_num_drivers"), with: 100 },
        { text: this.$t("unloading_fee_depot_barem_price"), with: 150 },
      ],
      headers: [
        { text: "", value: "data-table-expand", width: 90 },
        { text: this.$t("unloading_fee_depot_barem_actions"), value: "actions", align: "center", width: 150 },
        { text: this.$t("unloading_fee_depot_barem_id"), value: "id", width: 90 },
        {
          text: this.$t("unloading_fee_depot_barem_applied_time"),
          value: "vn_applied_time",
          width: 180,
        },
        {
          text: this.$t("unloading_fee_depot_barem_customer_name"),
          value: "vn_customer_name",
          align: "center",
          width: 200,
        },
        {
          text: this.$t("loading_allowance_depot_barem_customer_brand"),
          value: "customer_brand_name",
          align: "center",
          width: 200,
        },
        {
          text: this.$t("unloading_fee_depot_barem_depot_name"),
          value: "vn_depot_name",
          align: "center",
          width: 200,
        },
        {
          text: this.$t("unloading_fee_depot_barem_district_name"),
          value: "district_name",
          align: "center",
          width: 200,
        },
        {
          text: this.$t("unloading_fee_depot_barem_depot_province_name"),
          value: "province_name",
          align: "center",
          width: 200,
        },
        {
          text: this.$t("unloading_fee_depot_barem_round_trip"),
          value: "round_trip",
          align: "center",
          width: 200,
        },

        {
          text: this.$t("unloading_fee_depot_barem_notes"),
          value: "notes",
          align: "center",
          width: 200,
        },
      ],
    };
  },
  mounted: async function () {
    await this.getallUnloadingFeeDepotBarem();
    this.$root.$emit("mpc_appbar_all_branch", this.ui.isAllBranch);
    checkPermissions(this.ui.buttons, this.ui.path, this.ui.isAllBranch);
    await this.$root.$on("mpc_branch_changed", async () => {
      await this.getallUnloadingFeeDepotBarem();
      checkPermissions(this.ui.buttons, this.ui.path, this.ui.isAllBranch);
    });
  },
  methods: {
    getallUnloadingFeeDepotBarem: async function () {
      try {
        const { id } = JSON.parse(localStorage.getItem("selectedBranch"));
        const payload = {
          search_date: this.searchDate,
          branch_id: id,
        };
        if (this.showAll === true) {
          delete payload.search_date;
        }
        const response = await unloadingFeeDepotBaremServices.getList(payload);
        const result = response.data;
        if (result && !result.error) {
          this.unloadingFeeDepotBarem = result.data.map((item, index) => ({
            ...item,
            stt: ++index,
            vn_applied_time: this.dateFormat(item.applied_time),
            vn_customer_name: removeAccentString(item.customer_name),
            vn_customer_brand_name: removeAccentString(item.customer_brand_name),
            vn_depot_name: removeAccentString(item.depot_name),
            vn_notes: removeAccentString(item.notes),
          }));
        }
      } catch (e) {
        process.env.VUE_APP_DEBUG === "1" && console.log(e);
      }
    },

    openDeleteDialog: function (item) {
      this.deleteDialog = { show: true, item };
    },
    closeDeleteDialog: function () {
      this.deleteDialog = { show: false, item: {} };
    },
    openInfoDialog(type, item = {}) {
      this.infoDialog.show = true;
      this.infoDialog.type = type;
      this.infoDialog.item = item;
    },
    closeInfoDialog: function () {
      this.infoDialog = { show: false, item: {}, type: "" };
    },
    customExpand: async function (item, expand, isExpanded) {
      if (!isExpanded) {
      }
      expand(!isExpanded);
    },
  },
};
</script>
