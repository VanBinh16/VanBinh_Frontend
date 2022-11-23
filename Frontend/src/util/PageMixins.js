import { Constants } from "@/util/Constants.js";
import numeral from "numeral";
import _ from "lodash";
import moment from "moment";


export const pageMixins = {
  data() {
    return {
      footerProps: {
        "items-per-page-options": Constants.ITEMS_PER_PAGE_OPTIONS,
        "items-per-page-text": this.$t("items_per_page_text"),
        "items-per-page-all-text": this.$t("items-per-page-all-text"),
      },
      rules: {
        empty: (v) => !!v || this.$t("rules_empty"),
        empty_number: (v) => !!v || v === 0 || this.$t("rules_empty"),
        min: (v) => (v && v.length >= 8) || this.$i18n.t("rules_min8character"),
        date: (v) => /^(0[1-9]|[12][0-9]|3[01])[/](0[1-9]|1[012])[/]\d\d$/.test(v) || this.$t("rules_invalid_date"),
        phone: (v) => {
          if (!v) return true;
          if (!/^(\s*|\d+)$/.test(v)) return this.$t("rules_phone_invalid");
          if (v.length >= 12) return this.$t("rules_phone_invalid_number");
          return true;
        },
        numberOnly: (v) => /^[+-]?\d+(\.\d+)?$/.test(v) || "Chỉ nhập số",
        email: (v) =>
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ),
        greaterThan0: (v) => parseFloat(v) >= 0 ? true : "Phải >= 0",
        inputDateNumber: (v) => {
          if (v === null || v === undefined) return true;
          return v < 365 ? true : this.$t("salary_employee_leave_total_date_number_error");
        },
        inputMonthNumber: (v) => {
          if (v === null || v === undefined) return true;
          return (v < 13 && v > 0) ? true : this.$t("salary_employee_leave_month_number_error");
        },
      },
      moment,
    };
  },
  methods: {
    formatNumber(value, removeDot = false, format) {
      if (value === null || value === undefined) return `0`;
      if (format) return numeral(value).format(format);
      if (removeDot) return numeral(value).format("0,0");

      //Lý do sử dụng .000 là do adp sử dụng 0.001(tấn) ~ 1kg
      return value % 1 === 0 ? numeral(value).format("0,0") : numeral(value).format("0,0.000");
    },

    startOfDate: function (date) {
      return moment(date).startOf("date").utcOffset("07:00").format();
    },

    endOfDate: function (date) {
      return moment(date).endOf("date").utcOffset("07:00").format();
    },

    revenueFormatNumber(value) {
      if (value === null || value === undefined) return `0`;
      //Lý do sử dụng .000 là do adp sử dụng 0.001(tấn) ~ 1kg
      return value % 1 === 0 ? numeral(value).format("0") : numeral(value).format("0,0.000");
    },

    formatMoney(amount) {
      if(amount === undefined || amount === null) return "-";
      if (amount === 0) return "0 vnđ";
      return `${this.formatNumber(amount, true)} vnđ`;
    },

    formatDepotAddress(code, name, address, district, province) {
      return [code, name, address, district, province].filter(Boolean).join(", ");
    },

    formatCodeAndID(code, id) {
      return [code, id].filter(Boolean).join(", ");
    },

    _mixinShowSnackbarAPI(data, successMessage, errorMessage) {
      if (data !== null) {
        this.$SnackBar.show("success", successMessage);
      } else {
        this.$SnackBar.show("error", errorMessage);
      }
    },
    generateUserName: function (fullname, dob) {
      // Bỏ dấu
      if (!fullname) return "";
      const removeSpecialCharacters = _.lowerCase(fullname)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const nameFragments = removeSpecialCharacters.split(" ");
      const mainName = _.last(nameFragments);
      const additionalNames = _.dropRight(nameFragments).map((ten) => ten[0]);
      const [year, month, day] = dob.split("-");
      return mainName + additionalNames.join("") + day + month;
      //Vi du: Huỳnh Văn Bình 1606200=> huynhvanbinh160600
    },

    provinceAutoCompleteFilter(item, queryText, itemText) {
      return (
        item.name.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1 ||
        item.vnname.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1
      );
    },
    districtAutoCompleteFilter(item, queryText, itemText) {
      return (
        item.name.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1 ||
        item.vnname.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1
      );
    },
  },
};
