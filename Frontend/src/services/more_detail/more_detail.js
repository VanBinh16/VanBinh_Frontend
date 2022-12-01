import axios from "axios";

export default {
  getListGender: function () {
    return axios.get("/more_detail/list_gender");
  },
};
