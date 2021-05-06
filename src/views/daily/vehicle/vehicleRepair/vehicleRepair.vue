<template>
  <basic-container>
    <avue-crud
      v-if="ISLOAD"
      :data="vehicleSafeData"
      :option="option"
      :page="page"
      ref="table"
      v-model="form"
      @on-load="onLoad"
      @search-change="searchChange"
      @refresh-change="searchChange"
      @row-del="rowDel"
      @row-update="rowUpdate"
      @row-save="rowSave"
      :table-loading="loading"
    ></avue-crud>
  </basic-container>
</template>

<script>
import vehicle from "@/mixins/vehicle";
export default {
  mixins: [vehicle],
  mounted() {
    this.INIT();
  },
};
</script>

<style></style>
