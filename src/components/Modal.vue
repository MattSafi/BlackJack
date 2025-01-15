<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeOnOverlay">
    <div class="modal-content" @click.stop>
      <button class="modal-close" @click="close">×</button>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Modal",
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    closeOnOverlayClick: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
    closeOnOverlay() {
      if (this.closeOnOverlayClick) {
        this.close();
      }
    },
  },
};
</script>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: rgba(0, 0, 0, 0.85);
  padding: 20px;
  width: 80vw;
  border-radius: 8px;
  position: relative;
  text-align: justify;
  line-height: 45px;
}
.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
}
@media screen and (max-width: 960px) {
  .modal-content {
    background: rgba(0, 0, 0, 0.9);
    padding: 12px;
    width: 100vw;
    border-radius: 8px;
    position: relative;
    text-align: center;
    font-size: 1rem;
    line-height: 25px;
  }
}
</style>
