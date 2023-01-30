import axios from "axios";

export default {
  sentOTP: function (body) {
    return axios.post("/register/sent_otp", body);
  },

  createAccount: function (body) {
    return axios.post("/register/create_account", body);
  },
};
