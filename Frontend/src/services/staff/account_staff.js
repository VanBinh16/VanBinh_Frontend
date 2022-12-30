import axios from "axios";

export default {
  sentOTP: function (body) {
    return axios.post("/staff/sent_otp_account_staff", body);
  },

  createAccountStaff: function (body) {
    return axios.post("/staff/create_account_staff", body);
  },

  login: function (body) {
    return axios.post("/staff/login", body);
  },
};
