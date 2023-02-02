<template>
  <v-dialog v-model="show" persistent width="80%">
    <v-card>
      <!-- header infodialog -->
      <v-card-title :class="`${type === 'add' ? 'green' : 'blue'} white--text`">
        <v-row align="center" class="ma-0">
          <span class="font-weight-bold white--text"> {{ text.title }} </span>
        </v-row>
      </v-card-title>
      <hr />

      <!-- nội dung from -->
      <div class="pt-3 px-5">
        <v-form ref="form">
          <v-text-field
            dense
            outlined
            type="text"
            :label="$t('product_code')"
            v-model="value.code"
            :rules="[rules.empty]"
            :readonly="type === 'update'"
          />

          <v-text-field
            dense
            outlined
            type="text"
            :label="$t('product_name')"
            v-model="value.name"
            :rules="[rules.empty]"
          />

          <v-autocomplete
            class="pb-6"
            dense
            outlined
            hide-details
            return-object
            v-model="value.type_product"
            :items="typeProducts"
            item-text="name"
            item-value="id"
            :label="$t('product_type_name')"
            :rules="[rules.empty]"
          />

          <v-textarea
            dense
            outlined
            :label="$t('type_product_notes')"
            v-model="value.notes"
          />

          <menu-rule-selection
            type="create"
            :customer="value.name"
            :customerBrand="value.customer_brand"
           
            :crudUnloadingFeeDepotBarem="crudUnloadingFeeDepotBarem"
            :item="value.data"
            :items="value.data"
          />
        </v-form>
      </div>
      <!-- footer -->
      <hr />
      <v-card-actions class="" style="background-color: #eeeeee">
        <v-spacer />
        <v-btn
          @click="closeInfoDialog"
          class="mr-4"
          outlined
          :color="type === 'add' ? 'green' : 'blue'"
        >
          {{ $t("button_close") }}
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
import moment from "moment";

import { pageMixins } from "@/util/PageMixins";
import MenuRuleSelection from "./MenuRuleSelection";

import typeProductServices from "@/services/type_product/type_product.js";
import productServices from "@/services/type_product/type_product.js";

export default {
  props: ["show", "type", "item"],
  mixins: [pageMixins],
  components: { MenuRuleSelection },
  data: function () {
    return {
      value: {
        start_date: moment(new Date()).format("YYYY-MM-DD"),
        name: "",
      },
      text: {
        title: "",
        action: "",
      },
      type_product: {},
      typeProducts: [],
    };
  },
  watch: {
    show: async function () {
      if (!this.show) return;
      await this.getListTypeProduct();
      //reset from không chạy vào rulue
      this.$refs.form && this.$refs.form.resetValidation();

      if (this.type === "add") {
        this.text = {
          title: this.$t("product_add_title"),
          action: this.$t("tooltip_button_add_title"),
        };
      } else if (this.type === "update") {
        this.text = {
          title: this.$t("product_update_title"),
          action: this.$t("tooltip_button_update_title"),
        };

        this.value = {
          code: this.item.code,
          name: this.item.name,
          notes: this.item.notes,
        };
        if (this.typeProducts)
          this.value.type_product = this.typeProducts.find(
            (item) => item.id === this.item.product_type_id
          );
      }
    },
  },
  computed: {
    computeIgnoredGroupIds: function () {
     console.warn("váo đây");
    },
  },
  methods: {
    crudUnloadingFeeDepotBarem(barem, type, index) {
      console.warn("thêm 1 dòng mới");
      return;
    },
    actionButton: async function () {
      if (!this.$refs.form.validate()) return;
      this.type === "add" ? await this.create() : await this.update();
    },
    // lấy danh sách loại sản phẩm
    getListTypeProduct: async function () {
      const response = await typeProductServices.getList();
      const result = response.data;
      if (result && !result.error) {
        this.typeProducts = result.data.map((item, idx) => ({
          ...item,
          display: [item.code, item.name].join(" - "),
        }));
      }
    },
    getItem: function () {
      const newItem = {
        code: this.value.code,
        name: this.value.name,
        notes: this.value.notes,
      };
      if (this.value.type_product)
        newItem.product_type_id = this.value.type_product.id;
      return newItem;
    },
    create: async function () {
      try {
        if (!this.$refs.form.validate()) return;
        const body = this.getItem();
        const response = await productServices.create(body);
        const result = response.data;
        if (result && !result.error) {
          this.$emit("reload-table");
          this.$SnackBar.show("success", this.$t("product_add_success"));
        } else {
          if (result.code === 201) {
            this.$SnackBar.show("error", this.$t("product_add_exist_error"));
            return;
          } else {
            this.$SnackBar.show("error", this.$t("product_get_data_error"));
            return;
          }
        }
      } catch (e) {
        this.$SnackBar.show("error", this.$t("product_connect_error"));
      }
      this.closeInfoDialog();
    },

    update: async function () {
      try {
        if (!this.$refs.form.validate()) return;
        const body = this.getItem();
        delete body.code;
        body.id = this.item.id;
        const response = await productServices.update(body);
        const result = response.data;
        if (result && !result.error) {
          this.$emit("reload-table");
          this.$SnackBar.show("success", this.$t("product_update_success"));
        } else {
          this.$SnackBar.show("error", this.$t("product_get_data_error"));
        }
      } catch (e) {
        this.$SnackBar.show("error", this.$t("product_connect_error"));
      }
      this.closeInfoDialog();
    },
    closeInfoDialog: function () {
      this.$emit("close-dialog");
    },
  },
};
</script>
