<template>
  <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout">
    {{ snackbar.message }}
    <v-btn text @click="snackbar.show = false">
      OK
    </v-btn>
  </v-snackbar>
</template>

<script>
import SnackBarPlugin from "../../../plugins/SnackBar";

export default {
  data() {
    return {
      snackbar: {
        enable: false,
        timeout: 3000,
        show: false,
        color: "",
        message: "",
      },
    };
  },
  beforeMount() {
    SnackBarPlugin.EventBus.$on("show", (type, message, timeout = 3000) => {
      switch (type) {
        case "success":
          this.success(message, timeout);
          break;
        case "error":
          this.error(message, timeout);
          break;
        case "info":
          this.info(message, timeout);
          break;
        case "warn":
          this.warn(message, timeout);
          break;
        default:
          this.info(message, timeout);
          break;
      }
    });
  },
  methods: {
    show(message, color = "info", timeout) {
      this.snackbar.color = color;
      this.snackbar.message = message;
      this.snackbar.show = true;
      this.snackbar.timeout = timeout;
    },
    error(message, timeout) {
      this.show(message, "error", timeout);
    },
    success(message, timeout) {
      this.show(message, "success", timeout);
    },
    info(message, timeout) {
      this.show(message, "info", timeout);
    },
    warn(message, timeout) {
      // this.show(message, 'warn');
      this.show(message, "orange darken-1", timeout);
    },
  },
};
</script>

<style scoped></style>
