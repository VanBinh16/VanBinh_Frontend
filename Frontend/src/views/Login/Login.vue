<template>
  <v-dialog
    @keydown.esc="closeDialog"
    v-model="show"
    persistent
    max-width="55%"
  >
    <v-card>
      <v-card-title class="headline purple darken-2 white--text font-weight-bold">
        {{ $t("login_title") }}
      </v-card-title>
      <hr>

      <div class="pt-3 px-5" style="font-size: 14px">
        <v-text-field
            dense
            outlined
            type="text"
            :label="$t('login_email')"
            v-model="value"
          />

          <v-text-field
            dense
            outlined
            type="text"
            :label="$t('login_password')"
            v-model="value"
          />
      </div>

      <hr>
      <v-card-actions class="" style="background-color: #eeeeee">
        <v-spacer />
        <v-btn @click="closeDialog" class = "mr-4" outlined  color="red">
          {{ $t("login_btn_forget_password") }}
        </v-btn>
        <v-btn
          color="blue darken-2"
          class="white--text font-weight-bold"
       
        >
          {{ $t("login_btn_log_in") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import TooltipButton from "@/components/TooltipButton";
import { pageMixins } from "@/util/PageMixins";
import { dateFormatMixins } from "@/util/DateFormat";


export default {
  components: { TooltipButton },
  mixins: [pageMixins, dateFormatMixins],
  props: {
    value: {},
    show: {
      type: Boolean,
      default: false,
      required: true,
    },
  },

  methods: {
  
    closeDialog() {
      this.$emit("close-dialog");
    },
  },
};
</script>

<style lang="scss" scoped>
.label {
  color: blue;
  font-weight: 700;
  //font-weight: 299;
}
.value {
  color: black
}
</style>
