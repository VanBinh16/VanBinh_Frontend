import axios from "axios";

export default {
  getListProvince: function() {
    return axios.get("/address/list_province");
  },
  getListDistrict: function (body) {
    return axios.get("/address/list_district", body);
  },
};
