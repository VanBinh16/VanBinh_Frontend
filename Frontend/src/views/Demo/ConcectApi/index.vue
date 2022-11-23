<template>
  <v-card id="regular-tables" fluid tag="section">
    <base-material-card color="blue">
      <template #heading>
        <v-row>
          <v-col cols="12" md="4">
            <h2>{{ $t("demo_concect_api_title") }}</h2>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="12" md="4">
            <v-text-field
              dense
              outlined
              :label="$t('input_information_find_title')"
              append-icon="mdi-magnify"
            />
          </v-col>
        </v-row>
      </template>

      <v-row align="center" style="align-items: center">
        <v-col cols="2" class="pt-0">
          <v-autocomplete
            dense
            outlined
            hide-details
            return-object
            clearable
            item-text="name"
            item-value="id"
            placeholder="Phòng ban"
          />
        </v-col>
        <v-col cols="2" class="pt-0">
          <v-autocomplete
            dense
            outlined
            hide-details
            return-object
            clearable
            item-text="name"
            item-value="id"
            placeholder="Phòng ban"
          />
        </v-col>
        <v-btn class="blue mb-4 mx-3">
          <span class="font-weight-bold"> {{ $t("button_find_title") }} </span>
        </v-btn>
        <v-checkbox class="mb-4 mx-5" label="Xem tất cả" />

        <v-spacer />
      </v-row>

      <v-card>
        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-btn v-on="on" absolute fab top left small color="blue">
              <v-icon> mdi-plus </v-icon>
            </v-btn>
          </template>
          <span>Thêm</span>
        </v-tooltip>

        <v-data-table
          :items="demos"
          :headers="headers"
          :footer-props="footerProps"
        >
          <template #item="{ item, index }">
            <tr :style="index === 0 ? item.style : ''">
              <td>
                {{ item.id }}
              </td>
              <td>
                <v-row justify="center" align="center">
                  <tooltip-button
                    icon="mdi-pencil"
                    iconColor="blue"
                    tooltipText="Cập nhật"
                  />
                </v-row>
              </td>
              <td>
                {{ item.name }}
              </td>
              <td>
                {{ item.address }}
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
      </v-card>
    </base-material-card>
  </v-card>
</template>

<script>
import demoServices from "@/services/demoConcectApi/demoConcectApi.js";

import TooltipButton from "@/components/TooltipButton";
import { pageMixins } from "@/util/PageMixins";

export default {
  components: { TooltipButton },
  mixins: [pageMixins],
  data() {
    return {
      demos: [],
      infoDialog: {
        show: false,
        type: "",
        item: {},
      },
      headers: [
        { text: this.$t("demo_concect_api_stt"), value: "id", width: "90" },
        {
          text: this.$t("demo_concect_api_acction"),
          value: "acction",
          width: "90",
        },
        { text: this.$t("demo_concect_api_name"), value: "name" },
        { text: this.$t("demo_concect_api_address"), value: "address" },
      ],
    };
  },
  mounted: async function () {
    await this.getDemo();
  },
  methods: {
    getDemo: async function () {
      const response = await demoServices.getList();
      const result = response.data;
      console.warn("data", result.data);
      if (result && !result.error) {
        this.demos = result.data.map((item, idx) => ({
          ...item,
          stt: idx + 1,
        }));
      }
    },
  },
};
</script>
