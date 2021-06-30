<template>
  <!-- <div v-if="ISLOAD" v-show="state.isPost || state.isDept" class="post-table"> -->
  <div
    v-if="ISLOAD"
    v-show="(state.isPost && state.isEdit) || (state.isDept && state.isEdit)"
    class="post-table"
  >
    <!-- 表格-岗位人员 -->
    <avue-crud
      ref="form"
      v-model="formData"
      :table-loading="tableLoading"
      :data="tableData"
      :page="page"
      :option="option"
      @row-del="rowDel"
      @row-update="rowUpdate"
      @row-save="add"
      @search-change="searchChange"
      @sort-change="sortChange"
      @on-load="onLoad"
      @refresh-change="refreshChange"
      :before-open="beforeOpen"
    >
      <template slot="menu" slot-scope="{ row }">
        <el-button
          type="text"
          size="mini"
          icon="el-icon-setting"
          @click="showTree(row)"
          >岗位</el-button
        >
      </template>
    </avue-crud>
    <!-- 弹窗-人员岗位机构树 -->
    <post-tree ref="tree" :node="node"></post-tree>
  </div>
</template>

<script>
import { getList } from "@/api/basics";
import postTree from "./post-tree";
import basicsdept from "@/mixins/basicsdept";
// import basic from "./form-mixin";
export default {
  name: "post-table",
  components: {
    postTree,
  },
  mixins: [basicsdept],
  props: {
    node: Object,
    state: Object,
  },
  data() {
    return {
      baseOption: {
        height: 300,
        menuWidth: 230,
      },
    };
  },
  watch: {
    "node.id": function() {
      // if (!this.state.isPost || !this.state.isDept) return;
      // this.tableSearch.postId = this.node.id;
      let postId = this.node.id;
      if (this.ISLOAD == true) {
        this.getData();
        this.refreshChange();
      } else {
        this.INIT("users-config").then(this.refreshChange());
      }
    },
  },
  methods: {
    // 获取 table 数据
    getData() {
      this.getList({ other: { postId: this.node.id } });
    },
    refreshChange() {
      this.getData();
    },
    // 新增人员
    add(row, loading) {
      row.postId = this.node.id;
      // let data = {
      //   createtime: "2020",
      //   type: "安标",
      //   name: row.account,
      //   password: row.password,
      // };
      // getAnBiaoLogin(data).then((res) => {});
      this.rowSave(row, loading);
    },
    showTree(row) {
      this.$refs.tree.show(row);
    },
  },
};
</script>

<style lang="scss">
.post-table {
  height: 50%;
  padding: 0px 20px;
}
</style>
