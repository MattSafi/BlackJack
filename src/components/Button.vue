<template>
  <button @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  }

};

</script>
 
<style scoped>
 
 
</style>