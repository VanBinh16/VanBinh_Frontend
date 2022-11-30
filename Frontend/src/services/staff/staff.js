import axios from "axios";

export default {
  getList: function() {
    return axios.get("/staff/list");
  },
  create: function (body) {
    return axios.post("/staff/create", body);
  },
  update: function (body) {
    return axios.post("/staff/update", body);
  },
  delete: function (id) {
    return axios.post("/staff/delete", id);
  },
};
