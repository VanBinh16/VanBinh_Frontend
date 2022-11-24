<template>
  <v-card id="regular-tables" fluid tag="section">
    <base-material-card color="blue">
      <template #heading>
        <v-row>
          <v-col cols="12" md="4">
            <h2>demo</h2>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="12" md="4">
            <v-text-field
              dense
              outlined
              label="Nhập thông tin tìm kiếm"
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
          <span class="font-weight-bold"> Tìm </span>
        </v-btn>
        <v-checkbox class="mb-4 mx-5" label="Xem tất cả" />

        <v-spacer />
      </v-row>

      <v-card>
        <v-tooltip bottom>
        <template #activator="{on}">
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
        <span>Thêm</span>
      </v-tooltip>

        <v-data-table :items="demos" :headers="headers">
          <template #item="{ item, headers, index }">
            <tr :style="index === 0 ? item.style : ''">
              <td>
                {{ item.stt }}
              </td>
              <td>
                <tooltip-button
                  icon="mdi-pencil"
                  iconColor="blue"
                  tooltipText="Cập nhật"
                  @on-click="openInfoDialog('update', item)"
                />
              </td>
              <td>
                {{ item.id }}
              </td>
              <td>
                {{ item.name }}
              </td>
              <td>
                {{ item.address }}
              </td>
            </tr>
          </template>

          <template v-slot:no-data>
            <div align="left">Không có dữ liệu!!</div>
          </template>
        </v-data-table>

        <!-- info dialog -->
        <info-dialog
          :show="infoDialog.show"
          :type="infoDialog.type"
          :item="infoDialog.item"
          @close-dialog="infoDialog.show = false"
        />
      </v-card>
    </base-material-card>
  </v-card>
</template>

<script>
import InfoDialog from "./InfoDialog.vue";
//import demoServices from "@/services/demo/demo.js";

//thư viện of project
import TooltipButton from "@/components/TooltipButton";

export default {
  components: { InfoDialog, TooltipButton },
  data() {
    return {
      demos: [],
      infoDialog: {
        show: false,
        type: "",
        item: {},
      },
      headers: [
        { text: "STT", value: "stt" },
        { text: "Thao tác", value: "action" },
        { text: "Mã", value: "id" },
        { text: "Tên", value: "name" },
        { text: "Địa chỉ", value: "address" },
      ],
    };
  },
  mounted: async function () {
    //await this.getDemo();
  },
  methods: {
    // getDemo: async function () {
    //   const response = await demoServices.getList();
    //   const result = response.data;
    //   if (result && !result.error) {
    //     this.demos = result.data.map((item, idx) => ({
    //       ...item,
    //       stt: idx + 1,
    //     }));
    //   }
    // },
    openInfoDialog: function (type, item = {}) {
      this.infoDialog = { show: true, type, item };
    },
  },
};
</script>
