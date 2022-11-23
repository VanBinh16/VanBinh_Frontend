import axios from "axios";

export default {
  getList: function() {
    return axios.get("/branch/list");
  },
  create: function (body) {
    return axios.post("/branch/create", body);
  },
  update: function (body) {
    return axios.post("/branch/update", body);
  },
  delete: function (id) {
    return axios.post("/branch/delete", id);
  },
};
