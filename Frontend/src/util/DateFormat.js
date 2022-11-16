import moment from "moment";

export const dateFormatMixins = {
  methods: {
    dateFormat: (date, format = "DD/MM/YY") => {
      if (!date) return null;
      return moment(date).format(format);
    },
    dateFormatFull: (date) => {
      if (!date) return null;
      return moment(date).format("DD/MM/YYYY");
    },
    dateFormatInput: (date) => {
      if (!date) return null;
      return moment(date).format("DD-MM-YYYY");
    },
    dateFormatReverse: (date) => {
      if (!date) return null;
      return moment(date).format("YYYY-MM-DD");
    },
    dateTimeFormatReverse2: (date) => {
      if (!date) return null;
      return moment(date).format("YYYY-MM-DD HH:mm");
    },
    dateTimeFormatReverse3: (date) => {
      if (!date) return null;
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    timeFormatReverse: (time) => {
      if (!time) return null;
      return moment(time).format("HH:mm:ss");
    },
    dateTimeFormatReverse: (date) => {
      if (!date) return null;
      return moment(date).format();
    },
    dateFormatWithTime: (date) => {
      if (!date) return null;
      return moment(date).format("DD/MM/YYYY HH:mm");
    },
    dateFormatWithTime2: (date) => {
      if (!date) return null;
      return moment(date).format("YYYY_MM_DD_HH_mm");
    },
    dataFormatWithTime3: (date) => {
      if (!date) return null;
      return moment(date).format("DD/MM HH:mm");
    },
    dateFormatTimeOnly: (date) => {
      if (!date) return null;
      return moment(date).format("HH:mm");
    },
    dateDiffInDays: (date1, date2) => {
      let dt1 = new Date(date1);
      let dt2 = new Date(date2);
      let diffInTimes = dt2.getTime() - dt1.getTime();
      let diffInDays = diffInTimes / (1000 * 3600 * 24);
      return diffInDays;
    },
    dateFormatCustom: (date, format = "DD/MM/YYYY") => {
      if (!date) return null;
      return moment(date).format(format);
    },
  },
};
