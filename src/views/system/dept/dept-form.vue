<template>
  <avue-form
    v-if="ISLOAD"
    v-show="show"
    ref="form"
    v-model="formData"
    :option="option"
  ></avue-form>
</template>

<script>
import basics from "./form-mixin";
export default {
  mixins: [basics],
  data() {
    return {
      TOKEN: "dept-config",
    };
  },
  computed: {
    show() {
      // showAddress: false;
      let s = this.state;
      return s.isPost || s.isDept;
    },
  },
};
</script>

<style lang="scss"></style>
