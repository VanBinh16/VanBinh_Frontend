import axios from "axios";

export default {
  getListGender: function () {
    return axios.get("/address/list_gender");
  },
};
