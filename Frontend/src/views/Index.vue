<template>
  <v-app>
    <dashboard-core-drawer />
    <!-- <dashboard-core-settings /> -->
    <v-content class="ma-4">
      <router-view> </router-view>
      <v-snackbar-ex />
    </v-content>
    <Footer />
  </v-app>
</template>

<script>
import DashboardCoreDrawer from "@/components/core/Drawer";
import DashboardCoreSettings from "@/components/core/Settings";
import Footer from "@/components/core/Footer";
export default {
  name: "DashboardIndex",

  components: {
    DashboardCoreDrawer,
    //DashboardCoreSettings,
    Footer,
  },

  data: () => ({
    expandOnHover: false,
  }),
};
</script>
