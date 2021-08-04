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
        <el-button
          type="text"
          size="mini"
          icon="el-icon-edit-outline"
          @click="showpsd(row)"
          >修改密码</el-button
        >
        <el-button
          type="text"
          size="mini"
          icon="el-icon-key"
          @click="resetPsd(row)"
          >初始化密码</el-button
        >
      </template>
    </avue-crud>
    <!-- 弹窗-人员岗位机构树 -->
    <post-tree ref="tree" :node="node"></post-tree>
    <updatepsd
      ref="updatepsdDialog"
      :node="node"
      :tableRow="tableRow"
    ></updatepsd>
  </div>
</template>

<script>
import { getList } from "@/api/basics";
import postTree from "./post-tree";
import basicsdept from "@/mixins/basicsdept";
// import basic from "./form-mixin";
import { Prosonrepsd } from "@/api/dept/noticelist";
import Updatepsd from "./updatepsd.vue";
export default {
  name: "post-table",
  components: {
    postTree,
    Updatepsd,
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
      tableRow: {},
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
    // 初始化密码
    resetPsd(row) {
      this.$confirm("此操作将初始化密码为123456, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        beforeClose: (action, instance, done) => {
          instance.confirmButtonLoading = false;
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "执行中...";
            Prosonrepsd(row.userid).then((res) => {
              if (res.data.code == 200) {
                instance.confirmButtonLoading = false;
                done();
              } else {
                this.$message.error("出错了");
                instance.confirmButtonLoading = false;
              }
            });
          } else {
            done();
          }
        },
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "初始化密码成功!",
          });
        })
        .catch(() => {});
    },
    // 显示修改密码
    showpsd(row) {
      this.tableRow = row;
      this.$refs.updatepsdDialog.upasdVisible = true;
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
