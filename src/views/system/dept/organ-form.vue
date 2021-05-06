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
      TOKEN: "organ-config",
    };
  },
  computed: {
    show() {
      return this.state.isOrgan;
    },
  },
};
</script>

<style lang="scss"></style>
