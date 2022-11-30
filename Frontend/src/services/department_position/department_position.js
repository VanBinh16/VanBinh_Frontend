import axios from "axios";

export default {
  getList: function() {
    return axios.get("/department_position/list");
  },
  create: function (body) {
    return axios.post("/department_position/create", body);
  },
  update: function (body) {
    return axios.post("/department_position/update", body);
  },
  delete: function (id) {
    return axios.post("/department_position/delete", id);
  },
};
