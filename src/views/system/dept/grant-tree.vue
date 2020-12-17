<template>
  <el-dialog
    :visible.sync="dialog"
    :title="state.grantTreeState.title"
    @open="openDialog"
    @close="closeDialog"
    style="top: -65px"
    width="50%"
  >
    <!--  style="max-height:650px;overflow:scroll" -->
    <el-tabs v-model="active">
      <el-tab-pane
        v-for="item in treeTbas"
        :key="item.label"
        :label="item.label"
        :name="item.label"
      >
        <el-tree
          style="max-height: 630px; overflow-y: scroll"
          :ref="item.ref"
          v-loading="item.loading"
          :default-checked-keys="item.keys"
          :data="item.data"
          :props="{ label: 'title', disabled: disabledFN }"
          :check-strictly="state.grantTreeState.mark == 3"
          highlight-current
          accordion
          show-checkbox
          empty-text="暂无数据"
          node-key="id"
        ></el-tree>
      </el-tab-pane>
    </el-tabs>

    <span slot="footer" class="dialog-footer">
      <button-group :group="buttonGroup" @action="onAction"></button-group>
    </span>
  </el-dialog>
</template>
 
<script>
import {
  tree,
  ABTree,
  ABTreeKeys,
  ABTreeSave,
  YWTree,
  YWTreeKeys,
  YWTreeSave,
  MLTree,
  MLTreeKeys,
  MLTreeSave,
  YJTree,
  YJTreeKeys,
  YJTreeSave,
  FNTree,
  FNTreeKeys,
  FNTreeSave,
  APPTree,
  APPTreeKeys,
  APPTreeSave,
  grantAdd,
  grantSyn,
  YDtree,
  YDtreeSave,
} from "@/api/system/dept";
import buttonGroup from "C/button-group";

export default {
  name: "grant-tree",
  components: {
    buttonGroup,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    state: Object,
    node: Object,
    label: "title",
  },
  data() {
    return {
      active: "",
      loading: false,
      dialog: false,
      keys: [],
      treeList: [
        {
          ref: "YW",
          label: "运维端菜单",
          loading: false,
          load: false,
          isKey: false,
          data: [],
          keys: [],
          apiType: 0,
          getKeys: YWTreeKeys,
          getTree: YWTree,
          setGrant: YWTreeSave,
          show: [1, 2],
        },
        {
          ref: "AB",
          label: "用户端菜单",
          loading: false,
          load: false,
          isKey: false,
          data: [],
          keys: [],
          apiType: 1,
          getKeys: ABTreeKeys,
          getTree: ABTree,
          setGrant: ABTreeSave,
          show: [1, 2],
        },
        {
          ref: "APP",
          label: "APP菜单",
          loading: false,
          load: false,
          isKey: false,
          data: [],
          keys: [],
          apiType: 4,
          getKeys: APPTreeKeys,
          getTree: APPTree,
          setGrant: APPTreeSave,
          show: [1, 2],
        },
        {
          ref: "ML",
          label: "标准化目录",
          loading: false,
          load: false,
          isKey: false,
          data: [],
          keys: [],
          apiType: 2,
          params: {
            postId: this.$store.getters.postId,
          },
          getKeys: MLTreeKeys,
          getTree: MLTree,
          setGrant: MLTreeSave,
          show: [1, 2],
        },
        {
          ref: "YJ",
          label: "预警权限",
          loading: false,
          load: false,
          isKey: false,
          data: [],
          keys: [],
          params: {
            postId: this.$store.getters.postId,
          },
          getKeys: YJTreeKeys,
          getTree: YJTree,
          setGrant: YJTreeSave,
          show: [1],
        },
        {
          ref: "FN",
          label: "功能权限",
          loading: false,
          load: false,
          isKey: false,
          data: [],
          keys: [],
          apiType: 3,
          getKeys: FNTreeKeys,
          getTree: FNTree,
          setGrant: FNTreeSave,
          show: [1, 2],
        },
        {
          ref: "YD",
          label: "机构异动",
          loading: false,
          load: false,
          isKey: false,
          params: {
            postId: this.$store.getters.postId,
          },
          data: [],
          keys: [],
          getTree: YDtree,
          setGrant: YDtreeSave,
          show: [3],
        },
      ],
    };
  },
  computed: {
    treeTbas() {
      return this.treeList.filter((v) => {
        // 显示对应状态下的树
        return v.show.includes(this.state.grantTreeState.mark);
      });
    },
    selectTab() {
      return this.treeTbas.find((item) => item.label == this.active);
    },
    buttonGroup() {
      let mark = this.state.grantTreeState.mark;
      let attrs = {
        type: "primary",
        loading: this.loading,
      };
      return [
        {
          text: "取消",
          action: this.cancel,
        },
        {
          text: "确定",
          show: mark == 1,
          action: this.submit,
          attrs,
        },
        {
          text: "权限同步",
          show: mark == 2,
          attrs,
          action: () => this.asyncGrant("async"),
        },
        {
          text: "权限追加",
          show: mark == 2,
          attrs,
          action: () => this.asyncGrant("add"),
        },
        {
          text: "移动",
          show: mark == 3,
          attrs,
          action: this.moveTreeOrgan,
        },
      ];
    },
  },
  watch: {
    value() {
      this.active = this.treeTbas[0].label;
      this.dialog = this.value;
    },
    dialog() {
      this.$emit("input", this.dialog);
    },
    active() {
      this.getTree();
    },
    node() {
      this.clearKeys();
    },
  },
  mounted() {},
  methods: {
    cancel() {
      this.dialog = false;
    },
    onAction(item) {
      item.action && item.action();
    },
    // 获取树
    getTree() {
      if (!this.dialog) return;
      this.$nextTick(() => {
        let item = this.selectTab;
        let params = item.params || {};
        const tree = this.$refs[item.ref][0];
        if (!item.load) {
          item.loading = true;
          item.getTree(params).then((res) => {
            item.data = res.data.data;
            item.load = true;
            item.loading = false;
          });
        }
        // 只在岗位节点下才回填权限
        if (
          this.state.grantTreeState.mark == 1 &&
          item.getKeys &&
          !item.isKey
        ) {
          tree.getCheckedKeys().forEach((key) => tree.setChecked(key, false));
          item.loading = true;
          item.getKeys(this.node.id).then((res) => {
            item.keys = res.data.data;
            item.isKey = true;
            item.loading = false;
          });
        }
      });
    },
    // 清除选中
    clearKeys() {
      this.treeList.forEach((item) => {
        item.isKey = false;
        item.keys = [];
      });
    },
    // Dialog 打开的回调
    openDialog() {
      let item = this.selectTab;
      let params = item.params || {};
      item.loading = true;
      item.getTree(params).then((res) => {
        item.data = res.data.data;
        item.loading = false;
      });
      // }
      // 只在岗位节点下才回填权限
      if (this.state.grantTreeState.mark == 1 && item.getKeys && !item.isKey) {
        tree.getCheckedKeys().forEach((key) => tree.setChecked(key, false));
        item.loading = true;
        item.getKeys(this.node.id).then((res) => {
          item.keys = res.data.data;
          item.isKey = true;
          item.loading = false;
        });
      }
    },
    closeDialog() {},
    // 获取选中节点
    getCheckNodes() {
      let checkedKeys = [];
      const tree = this.$refs[this.selectTab.ref][0];
      const checkedNodes = tree.getCheckedNodes(false, true);
      checkedNodes.forEach((node) => checkedKeys.push(node.id));
      checkedKeys = checkedKeys.join(",");
      return {
        checkedNodes,
        checkedKeys,
      };
    },
    // 节点禁用的方法
    disabledFN(treedata, node) {
      if (this.state.grantTreeState.mark == 3) {
        if (
          treedata.jigouleixing == "geti" ||
          treedata.jigouleixing == "fenzu" ||
          treedata.jigouleixing == "qiye" ||
          treedata.jigouleixing == "xianZF"
        ) {
          if (node.label == "安全管理平台" || node.label == "监控中心") {
            return true;
          } else {
            if (this.$parent.$parent.treeNode.label == node.label) {
              return true;
            } else {
              return false;
            }
          }
        } else {
          return true;
        }
      } else {
        return false;
      }
    },
    // 设置岗位权限
    submit() {
      let { checkedKeys } = this.getCheckNodes();
      this.selectTab.setGrant(this.node.id, checkedKeys).then((res) => {
        let is = res.data.success;
        this.dialog = false;
        this.loading = false;
        this.$message({
          type: is ? "success" : "error",
          message: res.data.msg,
        });
      });
    },
    // 同步追加权限
    asyncGrant(state) {
      let { checkedKeys } = this.getCheckNodes();
      const asyncGrant = state == "add" ? grantAdd : grantSyn;
      this.loading = true;
      asyncGrant({
        deptId: this.node.id,
        menuIds: checkedKeys,
        type: this.selectTab.apiType,
      }).then((res) => {
        let is = res.data.success;
        this.dialog = false;
        this.loading = false;
        this.$message({
          type: is ? "success" : "error",
          message: res.data.msg,
        });
        this.$parent.$parent.requestNewData(); //树 懒加载刷新方法
      });
    },
    // 机构异动
    moveTreeOrgan() {
      let { checkedKeys, checkedNodes } = this.getCheckNodes();
      if (checkedNodes.length !== 1) {
        return this.$message.warning("必须选中一条机构信息");
      }
      this.loading = true;
      YDtreeSave({
        deptId: this.node.id,
        newdeptId: checkedKeys,
      }).then((res) => {
        let is = res.data.code;
        this.loading = false;
        this.$message({
          type: is == 200 ? "success" : "error",
          message: res.data.msg,
        });
        this.dialog = false;
        this.$parent.$parent.requestNewData(); //树 懒加载刷新方法
      });
    },
  },
};
</script>
 
<style lang="scss" scoped>
</style>