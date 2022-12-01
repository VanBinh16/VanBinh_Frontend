<template>
  <v-card id="regular-tables" fluid tag="section">
    <base-material-card color="blue">
      <template #heading>
        <v-row>
          <v-col cols="12" md="4">
            <h2>{{ $t("manage_branch_title") }}</h2>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="12" md="4">
            <v-text-field
              dense
              outlined
              :label="$t('input_information_find_title')"
              append-icon="mdi-magnify"
              v-model="filter"
            />
          </v-col>
        </v-row>
      </template>

      <v-row align="center" style="align-items: center" class="pt-4">
        <v-col cols="4">
          <v-autocomplete
            dense
            outlined
            hide-details
            return-object
            clearable
            item-text="name"
            item-value="id"
            :placeholder="$t('manage_provice_title')"
          />
        </v-col>
        <v-btn class="blue mx-4">
          <span class="white--text font-weight-bold"> {{ $t("button_find_title") }} </span>
        </v-btn>
        <v-spacer />
      </v-row>

      <v-card>
        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-btn
              v-on="on"
              absolute
              fab
              top
              left
              small
              color="blue"
              @click="openInfoDialog('add')"
            >
              <v-icon> mdi-plus </v-icon>
            </v-btn>
          </template>
          <span>{{ $t("tooltip_button_add_title") }}</span>
        </v-tooltip>

        <v-data-table
          :items="branchs"
          :headers="headers"
          :footer-props="footerProps"
          :search="filter"
        >
          <template #item="{ item, index }">
            <tr :style="index === 0 ? item.style : ''">
              <td>
                {{ item.stt }}
              </td>
              <td class="justify-center ma-0">
                <div class="d-flex justify-center" style="margin-top: -20px;">
                  <tooltip-button
                    icon="mdi-pencil"
                    iconColor="blue"
                    :tooltipText="$t('tooltip_button_update_title')"
                    @on-click="openInfoDialog('update', item)"
                  />
                  <tooltip-button
                    icon="mdi-delete"
                    iconColor="red"
                    :tooltipText="$t('tooltip_button_delete_title')"
                    @on-click="openDeleteDialog(item)"
                  />
                </div>
                <v-row justify="center" align="center"> </v-row>
              </td>
              <td>
                {{ item.code }}
              </td>
              <td>
                {{ item.name }}
              </td>
              <td>
                {{ item.manager }}
              </td>
              <td>
                {{ dateFormatInput(item.start_date) }}
              </td>
              <td>
                {{ item.worker_number }}
              </td>
              <td>
                {{ item.address }}
              </td>
              <td>
                {{ item.notes }}
              </td>
            </tr>
          </template>

          <template v-slot:[`footer.page-text`]="props">
            {{
              $t("pagination_pageText", {
                begin: props.pageStart,
                end: props.pageStop,
                all: props.itemsLength,
              })
            }}
          </template>

          <template v-slot:no-data>
            <div align="left">{{ $t("no_find_data_title") }}</div>
          </template>
        </v-data-table>

        <!-- info dialog -->
        <info-dialog
          :show="infoDialog.show"
          :type="infoDialog.type"
          :item="infoDialog.item"
          @close-dialog="infoDialog.show = false"
          @reload-table="getListBranch"
        />

        <!-- delete dialog -->
        <delete-dialog
          :show="deleteDialog.show"
          :item="deleteDialog.item"
          @close-dialog="deleteDialog.show = false"
          @reload-table="getListBranch"
        />
      </v-card>
    </base-material-card>
  </v-card>
</template>

<script>
import InfoDialog from "./InfoDialog.vue";
import DeleteDialog from "./DeleteDialog.vue";

import branchServices from "@/services/branch/branch.js";

import TooltipButton from "@/components/TooltipButton";

import { pageMixins } from "@/util/PageMixins";
import { dateFormatMixins } from "@/util/DateFormat";

export default {
  components: { TooltipButton, InfoDialog, DeleteDialog },
  mixins: [pageMixins, dateFormatMixins],
  data() {
    return {
      filter: "",
      branchs: [],
      infoDialog: {
        show: false,
        type: "",
        item: {},
      },
      deleteDialog: {
        show: false,
        item: {},
      },
      headers: [
        { text: this.$t("manage_branch_stt"), value: "id", width: "90" },
        {
          text: this.$t("acction_title"),
          value: "acction",
          width: "200",
        },
        {
          text: this.$t("manage_branch_code"),
          value: "code",
          width: "160",
        },
        {
          text: this.$t("manage_branch_name"),
          value: "name",
          width: "220",
        },
        {
          text: this.$t("manage_branch_manager"),
          value: "manager",
          width: "150",
        },
        {
          text: this.$t("manage_branch_start_date"),
          value: "start_date",
          width: "120",
        },
        {
          text: this.$t("manage_branch_worker_number"),
          value: "worker_number",
          width: "120",
        },
        {
          text: this.$t("manage_branch_address"),
          value: "address",
          width: "300",
        },
        { text: this.$t("manage_branch_notes"), value: "notes", width: "200" },
      ],
    };
  },
  mounted: async function () {
    await this.getListBranch();
  },
  methods: {
    getListBranch: async function () {
      const response = await branchServices.getList();
      const result = response.data;
      if (result && !result.error) {
        this.branchs = result.data.map((item, idx) => ({
          ...item,
          stt: idx + 1,
          conmany_code_name: [item.code, item.company].join(" - "),
        }));
      }
    },

    //
    openInfoDialog: function (type, item = {}) {
      this.infoDialog = { show: true, type, item };
    },
    // delete
    openDeleteDialog: function (item = {}) {
      this.deleteDialog = { show: true, item };
    },
  },
};
</script>
