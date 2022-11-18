<template>
  <v-footer inset color="blue">
    <v-card-text class="py-2 white--text text-center" style = "font-weight: 500;">
      &copy; {{ new Date().getFullYear() }},
      <strong style="color: red">Văn Bình </strong>love older sister
      <v-icon size="20" color="red"> mdi-heart </v-icon>
      <strong style="color: blue"> Trang Vũ</strong> forever.
    </v-card-text>
  </v-footer>
</template>
<script>
export default {
  name: "DashboardCoreFooter",
};
</script>
