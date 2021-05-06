<template>
  <div class="basic-container">
    <scroll v-if="scroll" :ops="ops">
      <slot></slot>
    </scroll>
    <slot v-else></slot>
  </div>
</template>

<script>
export default {
  name: "basicContainer",
  props: {
    scroll: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      ops: {
        scrollPanel: {
          scrollingX: false,
        },
      },
    };
  },
};
</script>

<style lang="scss">
.basic-container {
  border-radius: 10px;
  box-sizing: border-box;
  overflow: hidden;
  width: 100%;
  height: 100%;
  background: #fff;
  padding: 1rem;
}
.__rail-is-vertical {
  z-index: 9999;
  div {
    z-index: 9999;
  }
}
</style>
