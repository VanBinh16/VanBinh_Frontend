import axios from "axios";

export default {
  getList: function() {
    return axios.get("/type_service/list");
  },
  create: function (body) {
    return axios.post("/type_service/create", body);
  },
  update: function (body) {
    return axios.post("/type_service/update", body);
  },
  delete: function (id) {
    return axios.post("/type_service/delete", id);
  },
};
