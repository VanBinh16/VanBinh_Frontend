import axios from "axios";

export default {
  getList: function() {
    return axios.get("/type_product/list");
  },
  create: function (body) {
    return axios.post("/type_product/create", body);
  },
  update: function (body) {
    return axios.post("/type_product/update", body);
  },
  delete: function (id) {
    return axios.post("/type_product/delete", id);
  },
};
