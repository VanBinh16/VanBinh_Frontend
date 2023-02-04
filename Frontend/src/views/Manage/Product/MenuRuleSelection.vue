<template>
  <v-menu v-model="menu" offset-x :close-on-content-click="false" top>
    <template v-slot:activator="{ on: menu, attrs }">
      <v-btn class="elevation-0 ma-0 green darken-3 font-weight-bold" v-if="type === 'create'" v-on="menu"
        v-bind="attrs" :disabled="!type_product ? true : false" @click="onBtnClick">
        {{ $t("product_add_detail_title") }}
      </v-btn>

      <v-tooltip v-if="type === 'update'" bottom>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn v-on="{ ...tooltip, ...menu }" v-bind="attrs" icon class="mx-0" @click="onBtnClick">
            <v-icon color="blue">mdi-pencil</v-icon>
          </v-btn>
        </template>
        <span>{{ $t("product_detail_title") }}</span>
      </v-tooltip>
    </template>
    <v-form ref="form" class="white pa-5" style="width: 600px">
      <h2 v-if="type === 'create'" class="black--text mb-3">
        {{ $t("product_add_detail_product_type") }}
      </h2>
      <h2 v-if="type === 'update'" class="black--text mb-3">
        {{ $t("product_update_detail_product_type") }}
      </h2>

      <v-text-field dense outlined type="text" :label="$t('product_add_detail_name_title')" v-model="value.name"
        :rules="[rules.empty]" />
      <v-text-field dense outlined type="text" :label="$t('product_add_detail_price')" v-model="value.price"
        :rules="[rules.empty]" />
      <v-textarea dense outlined :label="$t('product_add_title_notes')" v-model="value.notes" />

      <v-row class="ma-0 pa-0 mt-5">
        <v-spacer></v-spacer>
        <v-btn depressed class="ma-0 pa-0 mr-5 grey darken-3" @click="menu = false">{{ $t("button_close") }}</v-btn>
        <v-btn v-if="type === 'create'" depressed class="ma-0 pa-0 green darken-3" @click="submit">{{
          $t("tooltip_button_add_title")
        }}</v-btn>
        <v-btn v-if="type === 'update'" depressed class="ma-0 pa-0 green darken-3" @click="submit">{{
          $t("tooltip_button_update_title")
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
  props: ["type", "type_product", "crudProductDetail", "item", "itemIndex", "listDetail"],
  mixins: [pageMixins],
  data() {
    return {
      menu: false,
      value: {},
    };
  },
  methods: {
    submit() {
      if (!this.$refs.form.validate()) return;

      const detail = {
        name: this.value.name,
        price: this.value.price,
        notes: this.value.notes,
      };

      // kiểm tra chi tiết sản phẩm đã tồn tại
      const listDetail = _.cloneDeep(this.listDetail);
      if (this.type === "update") {
        listDetail.splice(this.itemIndex, 1);
      }
      for (let i = 0; i < listDetail.length; i++) {
        if (listDetail[i].name === detail.name) {
          this.$SnackBar.show("error", this.$t("product_add_detail_exist_fail"));
          return;
        }
      }

      this.crudProductDetail(detail, this.type, this.itemIndex);
      this.menu = false;
    },
    async onBtnClick() {
      this.setData();
    },

    setData() {
      if (this.type === "create") {
        this.value = {};
        this.$refs.form && this.$refs.form.resetValidation();
        return;
      } else if (this.type === "update") {
        let tmpValue = {
          name: this.item.name,
          price: this.item.price,
          notes: this.item.notes
        }

        //gán danh sách this.value bằng biến vừa lấy giá trị
        this.value = tmpValue;
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
