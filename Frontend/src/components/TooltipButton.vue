<template>
  <v-tooltip bottom :color="disabled ? 'error' : 'grey'">
    <template v-slot:activator="{ on }">
      <div v-on="on">
        <v-btn dark icon class="mx-0 button-style" @click="$emit('on-click')" :disabled="disabled">
          <v-icon :color="iconColor"> {{ icon }} </v-icon>
        </v-btn>
      </div>
    </template>
    <span>{{ disabled ? tooltipDisabledText : tooltipText }}</span>
  </v-tooltip>
</template>

<script>
export default {
  //Chỉ có icon và tooltip
  name: "TooltipButton",
  props: {
    disabled: { type: Boolean, default: false },
    icon: { type: String, default: "" },
    iconColor: { type: String, default: "" },
    tooltipText: { type: String, default: "" },
    tooltipDisabledText: { type: String, default: "" },
  },
};
</script>

<style lang="css" scoped></style>
