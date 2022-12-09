import axios from "axios";

export default {
  create: function (body) {
    return axios.post("/staff/create_account_staff", body);
  },
};
