import axios from "axios";

export default {
  getListProvince: function () {
    return axios.get("/address/list_province");
  },
  getListDistrict: function (params) {
    return axios.get("/address/list_district", { params });
  },
};
