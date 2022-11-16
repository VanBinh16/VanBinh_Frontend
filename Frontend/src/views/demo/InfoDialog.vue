<template>
  <v-dialog v-model="show" persistent width="60%">
    <v-card>
      <!-- header infodialog -->
      <v-card-title :class="`${type === 'add' ? 'green' : 'blue'} white--text`">
        <v-row align="center" class="ma-0">
          <span class="font-weight-bold white--text"> {{ text.title }} </span>
        </v-row>
      </v-card-title>

      <!-- nội dung from -->
      <v-card-text class="mt-7 pb-0">
        <v-form ref="form">
          <v-row>
            <v-col cols="6" class="mb-0 pb-0">
              <v-text-field
                dense
                outlined
                type="text"
                label="Mã cửa hàng"
                v-model="value.code_company"
              />
            </v-col>
            <v-col cols="6" class="mb-0 pb-0">
              <v-text-field
                dense
                outlined
                type="text"
                label="Tên cửa hàng"
                v-model="value.company_name"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6" class="mb-0 pb-0">
              <v-text-field
                dense
                outlined
                type="text"
                label="Nơi đăng ký"
                v-model="value.address_register"
              />
            </v-col>
            <v-col cols="6" class="mb-0 pb-0">
              <v-text-field
                dense
                outlined
                type="text"
                label="Mã số thuế"
                v-model="value.code_tax"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6" class="mb-0 pb-0">
              <v-text-field
                dense
                outlined
                type="text"
                label="Giám đốc"
                v-model="value.manager"
              />
            </v-col>
            <v-col cols="6" class="mb-0 pb-0">
              <v-text-field
                dense
                outlined
                type="text"
                label="Đại diện pháp luật"
                v-model="value.legal_representative"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6" class="mb-0 pb-0">
              <date-picker
                v-if="show"
                label="Ngày cấp phép"
                v-model="value.licensing_date"
                :required="true"
              />
            </v-col>
            <v-col cols="6" class="mb-0 pb-0">
              <date-picker
                v-if="show"
                label="Ngày hoạt động"
                v-model="value.start_date"
                :required="true"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6" class="mb-0 pb-0">
              <v-text-field
                dense
                outlined
                type="text"
                label="Năm tài chính"
                v-model="value.year_finance"
              />
            </v-col>
            <v-col cols="6" class="mb-0 pb-0">
              <v-text-field
                dense
                outlined
                type="text"
                label="Số lao động"
                v-model="value.worker_number"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" class="mb-0 pb-0">
              <v-textarea
                dense
                outlined
                label="Ghi chú"
                v-model="value.notes"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <!-- footer -->
      <v-card-actions class="" style="background-color: #eeeeee">
        <v-spacer />
        <v-btn text color="blue darken-1" @click="closeInfoDialog">
          Đóng
        </v-btn>
        <v-btn
          :color="type === 'add' ? 'green' : 'blue'"
          class="white--text font-weight-bold"
          @click="actionButton"
        >
          {{ text.action }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import DatePicker from "@/components/DatePicker";


export default {
  props: ["show", "type", "item"],
  components: { DatePicker },
  data: function () {
    return {
      value: {
        id: "",
        name: "",
        address: "",
      },
      text: {
        title: "",
        action: "",
      },
    };
  },
  watch: {
    show: async function () {
      if (!this.show) return;

      if (this.type === "add") {
        this.text = {
          title: "Thêm cửa hàng",
          action: "Thêm",
        };
      } else if (this.type === "update") {
        this.text = {
          title: "Cập nhật cửa hàng",
          action: "Cập nhật",
        };

        this.value = {
          id: this.item.id,
        };
      }
    },
  },
  methods: {
    actionButton: async function () {
      this.type === "add"
        ? await this.createBranch()
        : await this.createBranch();
    },
    getItem: function () {
      const newItem = {
        code_company: this.value.code_company,
        company_name: this.value.company_name,
        code_tax: this.value.code_tax,
        status_id: this.value.status_id,
        address_register: this.value.address_register,
        //address: this.value.address,
        legal_representative: this.value.legal_representative,
        manager: this.value.manager,
        licensing_date: this.value.licensing_date,
        start_date: this.value.start_date,
        year_finance: this.value.year_finance,
        worker_number: this.value.worker_number,
        notes: this.value.notes,
      };

      return newItem;
    },
    createBranch: async function () {
      try {
        const body = this.getItem();
        console.warn("vào đây", body);
        this.$SnackBar.show("success", "Tạo barem mới thành công");
        // const response = await branchServices.create(body);
        // const result = response.data;

        // if (result && !result.error) {
        //   this.$emit("reload-table");
        //   this.$SnackBar.show("success", "Tạo thành công");
        // } else {
        //   if (result.code === 201) {
        //     this.$SnackBar.show("error", "Đã tồn tại");
        //     return;
        //   } else {
        //     this.$SnackBar.show("error", "Có lỗi");
        //     return;
        //   }
        // }
      } catch (e) {
        this.$SnackBar.show("error", "Thất bại");
      }
      this.closeInfoDialog();
    },
    closeInfoDialog: function () {
      this.$emit("close-dialog");
      //this.value = null;
    },
  },
};
</script>
