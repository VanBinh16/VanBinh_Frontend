import axios from "axios";

export default {
  getList: function() {
    return axios.get("/product/list");
  },
  create: function (body) {
    return axios.post("/product/create", body);
  },
  update: function (body) {
    return axios.post("/product/update", body);
  },
  delete: function (id) {
    return axios.post("/product/delete", id);
  },
};
