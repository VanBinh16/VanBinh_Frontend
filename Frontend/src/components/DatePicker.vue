<template>
  <v-menu
    offset-y
    max-width="290px"
    min-width="290px"
    ref="date_picker_menu"
    transition="scale-transition"
    v-model="date_picker_menu"
    :close-on-content-click="false"
    :disabled="readonly === true ? true : false"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        dense
        outlined
        :clearable="clearable"
        v-on="on"
        v-bind="attrs"
        v-model="dateFormatted"
        :label="label"
        :placeholder="format"
        :rules="computedRules"
        :readonly="readonly === true ? true : false"
        :hide-details="hideDetails === true ? true : false"
        @blur="onUnfocus"
        @keydown.enter="onUnfocus"
      />
    </template>
    <v-date-picker
      no-title
      locale="vi"
      class="remove_margin"
      v-model="date"
      :type="month === true ? 'month' : 'date'"
      @input="onDatePickerSelect"
    ></v-date-picker>
  </v-menu>
</template>

<script>
import { dateFormatMixins } from "../util/DateFormat";
import moment from "moment";

/**
 * KHAI BÁO SỬ DỤNG
 * <DatePicker/>
 *
 * 2 props phải truyền: label và v-model
 *            - label: Title của date picker đó
 *            - v-model: Là biến giá trị
 *
 * Muốn reload lại component này thì thêm :key="count" sau đó tăng count để reload lại component
 *
 * Nếu date picker này là field bắt buộc điền thì thêm :require="true"
 *
 *
 * ==> <DatePicker label="test" v-model="date" :key="count" :required="true" />
 */
export default {
  mixins: [dateFormatMixins],
  props: {
    label: {},
    value: {},
    required: {},
    readonly: {},
    hideDetails: {},
    month: {},
    clearable: {
      type: Boolean,
      default: false,
    },
    format: {
      default: "DD/MM/YY",
    },
  },
  data() {
    return {
      date: this.value ? this.dateFormatReverse(new Date(this.value)) : null,
      dateFormatted: this.value ? this.dateFormat(new Date(this.value), this.format) : null,
      date_picker_menu: false,
      rules: {
        empty: (v) => !!v || "Không thể bỏ trống",
        date: (v) => {
          if (!v) return true;
          return moment(v, this.format, true).isValid();
        },
      },
    };
  },
  watch: {
    value(val) {
      if (!val && !this.date && !this.dateFormatted) return;
      this.date = val ? this.dateFormatReverse(new Date(val)) : this.dateFormatReverse(new Date());
    },
    date(val) {
      this.date_picker_menu = false;
      this.$emit("input", val);
      this.$emit("update-route-package");
      if (!val && !this.date && !this.dateFormatted) return;
      this.dateFormatted = val ? this.dateFormat(new Date(val), this.format) : null;
    },
  },
  methods: {
    parseDate(date) {
      if (
        this.rules.date(date) !== "Định dạng ngày không hợp lệ" &&
        this.rules.empty(date) !== "Không thể bỏ trống"
      ) {
        if (!date) return null;
        return this.dateFormatReverse(moment(date, this.format).format());
      } else {
        return null;
      }
    },

    onUnfocus() {
      if (this.clearable && !this.dateFormatted) {
        this.date = null;
        return;
      }

      this.date = this.parseDate(this.dateFormatted);
    },

    onDatePickerSelect() {
      this.date_picker_menu = false;
    },
  },
  computed: {
    computedRules() {
      let result = [];
      if (this.required === true) {
        result.push(this.rules.empty);
      }
      result.push(this.rules.date);
      return result;
    },
  },
};
</script>

<style scoped>
.remove_margin {
  margin: 0px;
}
</style>
