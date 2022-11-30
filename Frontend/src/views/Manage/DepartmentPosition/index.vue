<template>
  <v-card id="regular-tables" fluid tag="section">
    <base-material-card color="blue">
      <template #heading>
        <v-row>
          <v-col cols="12" md="4">
            <h2>{{ $t("manage_department_position_title") }}</h2>
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
          :items="demos"
          :headers="headers"
          :footer-props="footerProps"
          :search="filter"
        >
          <template #[`item.actions`]="{ item }">
            <v-row justify="center" align="center">
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
            </v-row>
          </template>
          <template #[`item.vn_name`]="{ item }"> {{ item.name }} </template>
          <template #[`item.notes`]="{ item }"> {{ item.nptes }} </template>

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

import departmentPositionServices from "@/services/department_position/department_position.js";

import TooltipButton from "@/components/TooltipButton";

import { pageMixins } from "@/util/PageMixins";
import { dateFormatMixins } from "@/util/DateFormat";

export default {
  components: { TooltipButton, InfoDialog, DeleteDialog },
  mixins: [pageMixins, dateFormatMixins],
  data() {
    return {
      filter: "",
      demos: [],
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
        { text: this.$t("column_stt"), value: "stt", width: "90" },
        {
          text: this.$t("acction_title"),
          value: "actions",
          width: "150",
        },
        {
          text: this.$t("manage_department_position_name"),
          value: "name",
          width: "300",
        },

        { text: this.$t("manage_department_position_notes"), value: "notes" },
      ],
    };
  },
  mounted: async function () {
    await this.getListBranch();
  },
  methods: {
    getListBranch: async function () {
      const response = await departmentPositionServices.getList();
      const result = response.data;
      console.warn("data", result.data);
      if (result && !result.error) {
        this.demos = result.data.map((item, idx) => ({
          ...item,
          stt: idx + 1,
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
