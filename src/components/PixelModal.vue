<template>
  <div class="modal modal-xl mc-modal" data-bs-backdrop="false">
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5 font-mc-ten">{{ title }}</h1>
          <button class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PixelModal",
  props: ['title']
};
</script>

<style scoped>
.mc-modal .modal-content {
  background-color: #ede5e2
}

.mc-modal .modal-header {
  box-shadow: 0 4px 0 0 rgba(0,0,0,.30);
  background-color: #d0c5c0;
  --bs-modal-inner-border-radius: 0;
  border-bottom: 0;
}
</style>