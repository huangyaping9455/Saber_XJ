<template>
  <basic-container>
    <avue-crud
      v-if="ISLOAD"
      v-model="formData"
      :table-loading="tableLoading"
      :data="tableData"
      :page="page"
      :option="option"
      @row-del="rowDel"
      @row-update="rowUpdate"
      @row-save="rowSave"
      @on-load="onLoad"
      @search-change="searchChange"
      @sort-change="sortChange"
      @refresh-change="refreshChange"
    ></avue-crud>
  </basic-container>
</template>
 
<script>
import basics from '@/mixins/basics';
export default {
  name: 'zhengjianshenyan',
  mixins: [basics],
  data() {
    return {};
  },
  mounted() {
    this.INIT();
  }
};
</script>
 
<style lang="scss" >
</style>