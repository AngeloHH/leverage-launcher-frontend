<template>
  <div class="mx-0 d-flex mb-3">
    <button class="btn" :class="'btn-' + btnBg">
      <img src="../assets/icons/color-alert.svg" alt="mc-alert" height="16">
    </button>
    <div class="alert w-100 p-2" :class="'alert-' + alertBg">
      <small><slot></slot></small>
    </div>
  </div>
</template>

<script>
export default {
  name: "PixelAlert",
  props: ['btnBg', 'alertBg']
};
</script>

<style scoped>

</style>