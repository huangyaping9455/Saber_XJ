<template>
  <div class="button-group">
    <el-button
      v-for="(item, index) in buttonGroup"
      :key="index"
      :icon="item.icon"
      size="small"
      v-bind="item.attrs"
      @click="emitAction(item)"
    >{{ item.text }}</el-button>
  </div>
</template>
 
<script>
export default {
  name: "button-group",
  props: {
    group: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
    };
  },
  computed: {
    buttonGroup() {
      return this.group.filter((item) => this.isShow(item));
    },
  },
  methods: {
    isShow(item) {
      return item.show == undefined ? true : item.show;
    },
    emitAction(item) {
      this.$emit("action", item);
    },
  },
};
</script>

<style lang="scss" >
</style>