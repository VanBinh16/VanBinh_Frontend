import Vue from "vue";
import Router from "vue-router";
import Index from "./views/Index";

import Manage_Demo from "@/views/Manage/Demo";
//Demo
import Demo_ConcectApi from "@/views/Demo/ConcectApi";

//thu gọn chuỗi kết nối api
import axios from "axios";

axios.defaults.baseURL = "http://localhost:4000/api";

Vue.use(Router);

const routes = [
  {
    path: "/",
    component: Index,
    children: [
      // Dashboard
      {
        name: "Dashboard",
        path: "/",
        component: () => import("@/views/dashboard/Dashboard"),
      },
      // Pages
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
      // Tables
      {
        name: "Regular Tables",
        path: "/tables/regular-tables",
        component: () => import("@/views/dashboard/tables/RegularTables"),
      },
      // Maps
      {
        name: "Google Maps",
        path: "/maps/google-maps",
        component: () => import("@/views/dashboard/maps/GoogleMaps"),
      },
      // Upgrade
      {
        name: "Upgrade",
        path: "/upgrade",
        component: () => import("@/views/dashboard/Upgrade"),
      },
      //Demo 23/11/2022
      //concect api
      {
        path: "/demo1",
        name: "Demo Concect Api",
        component: Demo_ConcectApi,
      },

      // MANAGE 17/11/2022
      // demo
      {
        path: "/manage/demo",
        name: "Manage Demo",
        component: Manage_Demo,
      },
    ],
  },
];

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
