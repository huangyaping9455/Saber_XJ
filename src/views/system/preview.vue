<template>
  <basic-container>
    <p v-if="!node">请先选择要预览的模板</p>
    <div v-else v-loading="!ISLOAD" class="config-preview">
      <P>
        <b>模块预览 {{node.label}} ：</b>
      </P>
      <avue-crud
        v-if="ISLOAD"
        v-model="formData"
        :table-loading="tableLoading"
        :data="tableData"
        :page="page"
        :option="option"
        @on-load="onLoad"
        @search-change="searchChange"
        @sort-change="sortChange"
        @refresh-change="refreshChange"
      ></avue-crud>
      <P>
        <b>JSON 配置 ：</b>
      </P>
      <pre class="json">{{ JSON.stringify(fieldColumn,null, 4)}}</pre>
    </div>
  </basic-container>
</template>
 
<script>
import basics from '@/mixins/basics';

export default {
  name: 'preview',
  mixins: [basics],
  computed: {
    node() {
      let id = this.$route.query.id;
      return this.$store.state.models.models[id];
    }
  },
  mounted() {
    if (!this.node) return;
    this.INIT(this.node.token);
  }
};
</script>
 
<style lang="scss" >
.config-preview {
  .json {
    max-height: 400px;
    overflow: auto;
  }
}
</style>