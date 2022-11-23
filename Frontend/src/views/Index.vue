<template>
  <v-app>
    <dashboard-core-drawer />
    <!-- <dashboard-core-settings /> -->
    <v-main>
      <router-view class="ma-4"> </router-view>
      <v-snackbar-ex />
    </v-main>
    <dashboard-core-footer />
  </v-app>
</template>

<script>
import DashboardCoreDrawer from "@/components/core/Drawer";
import DashboardCoreSettings from "@/components/core/Settings";
import DashboardCoreFooter from "@/components/core/Footer";
export default {
  name: "DashboardIndex",

  components: {
    DashboardCoreDrawer,
    //DashboardCoreSettings,
    DashboardCoreFooter,
  },

  data: () => ({
    expandOnHover: false,
  }),
};
</script>
