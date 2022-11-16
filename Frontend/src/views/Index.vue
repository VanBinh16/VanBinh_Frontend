<template>
  <v-app>
    <dashboard-core-app-bar />

    <dashboard-core-drawer />

    <dashboard-core-view />

    <!-- <dashboard-core-settings /> -->
    <v-snackbar-ex />
  </v-app>
</template>

<script>
import DashboardCoreAppBar from "@/components/core/AppBar"
import DashboardCoreDrawer from "@/components/core/Drawer"
import DashboardCoreSettings from "@/components/core/Settings"
import DashboardCoreView from "@/components/core/View"
  export default {
    name: 'DashboardIndex',

    components: {
      DashboardCoreAppBar,
      DashboardCoreDrawer,
      DashboardCoreSettings,
      DashboardCoreView,
    },

    data: () => ({
      expandOnHover: false,
    }),
  }
</script>
