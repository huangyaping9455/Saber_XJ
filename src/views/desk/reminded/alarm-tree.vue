<template>
  <el-dialog
    :visible.sync="dialog"
    @open="openDialog"
    title="设置预警权限"
    width="40%"
  >
    <el-tree
      style="max-height:630px;overflow-y:scroll"
      v-loading="loading"
      ref="tree"
      :default-checked-keys="keys"
      :check-strictly="true"
      :data="data"
      highlight-current
      accordion
      show-checkbox
      empty-text="暂无数据"
      node-key="id"
      :props="defaultProps"
    ></el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="quxiao">取 消</el-button>
      <el-button type="primary" @click="setting">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { treeDG, checkHavePost, saveMultiple } from "@/api/system/dept"; //getyujingquanxian
import { getyujingquanxian } from "@/api/dept/noticelist";
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
    // 显示弹框
    show(row) {
      this.row = row;
      this.dialog = true;
      // this.$nextTick(() => {
      //   this.getKeys(row.id);
      //   if (this.data.length == 0) {
      //     this.getData();
      //   }
      // });
    },

    // 树结构 父节点禁用方法
    disabledFN(treedata) {
      let str = treedata.treeCode.indexOf("000001005446");
      if (str !== -1) {
        return true;
      } else {
        return false;
      }
    },
    // 关闭弹框
    quxiao() {
      this.dialog = false;
      this.getData();
    },
    // 提交
    setting() {
      let keys = [];
      let menus = [];
      this.$refs.tree.getCheckedNodes().forEach((node) => {
        keys.push(node.id);
      });
      this.row.forEach((val) => {
        menus.push(val.yujingxiangid);
      });
      let checkedKeys = keys.join(",");
      let menuids = menus.join(",");
      getyujingquanxian(menuids, checkedKeys).then(() => {
        this.dialog = false;
        this.$parent.refreshList();
        this.getData();
        this.$message({
          type: "success",
          message: "操作成功!",
        });
      });
    },
    // 打开弹框得方法
    openDialog() {
      this.getData();
    },
    // 获取组织树
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
