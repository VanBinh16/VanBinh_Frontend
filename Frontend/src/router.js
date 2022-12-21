import Vue from "vue";
import Router from "vue-router";
import Index from "./views/Index";

//MANAGE
import Manage_Demo from "@/views/Manage/Demo";
  //chi nhánh
import Manage_Branch from "@/views/Manage/Branch";
  // loại nhân viên 30/11/2022
import Manage_DepartmentPosition from "@/views/Manage/DepartmentPosition";
  // nhân viên 30/11/2022
import Manage_Staff from "@/views/Manage/Staff";

//DEMO
import Demo_ConcectApi from "@/views/Demo/ConcectApi";

//LOGIN
import Login from "@/views/Login/Login"

//THU GON CHUOI KET NOI
import axios from "axios";

axios.defaults.baseURL = "http://localhost:4000/api";

Vue.use(Router);

const routes = [
  {
    path: "/",
    component: Index,
    children: [
      // TEAMPLATE
      {
        name: "Dashboard",
        path: "/",
        component: () => import("@/views/dashboard/Dashboard"),
      },
      {
        name: "User Profile",
        path: "/pages/user",
        component: () => import("@/views/dashboard/pages/UserProfile"),
      },
      {
        name: "Notifications",
        path: "/components/notifications",
        component: () => import("@/views/dashboard/component/Notifications"),
      },
      {
        name: "Icons",
        path: "/components/icons",
        component: () => import("@/views/dashboard/component/Icons"),
      },
      {
        name: "Typography",
        path: "/components/typography",
        component: () => import("@/views/dashboard/component/Typography"),
      },
      {
        name: "Regular Tables",
        path: "/tables/regular-tables",
        component: () => import("@/views/dashboard/tables/RegularTables"),
      },
      {
        name: "Google Maps",
        path: "/maps/google-maps",
        component: () => import("@/views/dashboard/maps/GoogleMaps"),
      },
      {
        name: "Upgrade",
        path: "/upgrade",
        component: () => import("@/views/dashboard/Upgrade"),
      },

      //DEMO 23/11/2022
      {
        path: "/demo1",
        name: "Demo Concect Api",
        component: Demo_ConcectApi,
      },

      // MANAGE 17/11/2022
      {
        path: "/manage/demo",
        name: "Manage Demo",
        component: Manage_Demo,
      },
        // chi nhánh
      {
        path: "/manage/branch",
        name: "Manage Branch",
        component: Manage_Branch,
      },
        // loại nhân viên 30/11/2022
      {
        path: "/manage/department_position",
        name: "Mamage Department Position",
        component: Manage_DepartmentPosition,
      },
        // Nhân viên 30/11/2022
      {
        path: "/manage/staff",
        name: "Manage Staff",
        component: Manage_Staff,
      },


      //login
      {
        path: "/login",
        name: "Login",
        component: Login,
      }

    ],
  },
];

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
