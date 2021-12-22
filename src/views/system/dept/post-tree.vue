<template>
  <el-dialog
    :visible.sync="dialog"
    @open="openDialog"
    title="设置人员岗位"
    width="40%"
  >
    <el-tree
      style="max-height:630px;overflow-y:scroll"
      v-loading="loading"
      ref="tree"
      :default-checked-keys="keys"
      :data="data"
      :props="defaultProps"
      highlight-current
      accordion
      show-checkbox
      empty-text="暂无数据"
      node-key="id"
    ></el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="quxiao">取 消</el-button>
      <el-button type="primary" @click="setting">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { treeDG, checkHavePost, saveMultiple } from "@/api/system/dept";
export default {
  name: "sub-tree",
  props: {
    node: Object,
  },
  data() {
    return {
      row: {},
      data: [],
      keys: [],
      dialog: false,
      loading: false,
      defaultProps: {
        children: "children",
        label: "deptName",
        disabled: this.disabledFN,
      },
    };
  },
  methods: {
    show(row) {
      this.row = row;
      this.dialog = true;
      this.$nextTick(() => {
        this.getKeys(row.id);
        if (this.data.length == 0) {
          this.getData();
        }
      });
    },
    // 树结构 父节点禁用方法
    disabledFN(treedata) {
      let str = treedata.treeCode.indexOf("000001005446");
      if (
        this.row.jigouleixing == "qiye" ||
        this.row.jigouleixing == "geti" ||
        this.row.jigouleixing == "qita" ||
        this.row.jigouleixing == "fenzu" ||
        this.row.jigouleixing == "sheng" ||
        this.row.jigouleixing == "xian" ||
        this.row.jigouleixing == "shi"
      ) {
        if (str !== -1) {
          return true;
        } else {
          return false;
        }
      } else {
        if (str === -1) {
          return true;
        } else {
          return false;
        }
      }
    },
    quxiao() {
      this.getData();
      this.dialog = false;
    },
    setting() {
      let keys = [];
      this.$refs.tree.getCheckedNodes().forEach((node) => {
        if (node.extendType == "岗位") {
          keys.push(node.id);
        }
      });
      let checkedKeys = keys.join(",");
      saveMultiple(this.row.userid, checkedKeys).then(() => {
        this.$parent.refreshChange();
        this.getData();
        this.$message({
          type: "success",
          message: "操作成功!",
        });
        this.dialog = false;
      });
    },
    openDialog() {
      this.getData();
    },
    getData() {
      this.loading = true;
      treeDG(this.$store.getters.postId).then(({ data }) => {
        this.data = data.data;
        this.loading = false;
      });
    },
    getKeys() {
      this.$refs.tree.getCheckedKeys().forEach((key) => {
        this.$refs.tree.setChecked(key, false);
      });
      checkHavePost(this.row.userid).then(({ data }) => {
        this.keys = data.data;
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
