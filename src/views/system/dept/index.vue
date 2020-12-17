<template>
  <basic-container class="organ" :scroll="false">
    <div class="title">
      <b>机构管理 - {{ formType }} {{ state.title }}</b>
      <!-- 按钮组 -->
      <button-group :group="buttonGroup" @action="onAction"></button-group>
    </div>
    <!-- 机构树 -->
    <div class="tree">
      <scroll>
        <el-tree
          ref="tree"
          lazy
          :load="loadNode"
          :props="{ isLeaf: isLeaf, label: 'deptName' }"
          :expand-on-click-node="false"
          highlight-current
          empty-text="暂无数据"
          node-key="id"
          @current-change="nodeChange"
        ></el-tree>
      </scroll>
    </div>
    <!-- 表单信息 -->
    <div v-loading="formLoading" class="form">
      <scroll>
        <!-- 机构信息表单 -->
        <organ-form
          :node="nodeData"
          :state="state"
          @action="onAction"
        ></organ-form>
        <!-- 岗位部门信息表单 -->
        <dept-form
          :node="nodeData"
          :state="state"
          @action="onAction"
        ></dept-form>
        <!-- 绑定地址 -->
        <address-form
          :node="nodeData"
          :state="state"
          @action="onAction"
        ></address-form>
        <!-- 岗位人员-列表 -->
        <post-table :node="nodeData" :state="state"></post-table>
      </scroll>
    </div>
    <!-- 弹窗-岗位权限-机构树 -->
    <grant-tree
      v-model="isGrantTree"
      :state="state"
      :node="nodeData"
    ></grant-tree>
  </basic-container>
</template>

<script>
import { tree } from "@/api/system/dept";
// import buttonGroup from './button-group';
import buttonGroup from "C/button-group";
import grantTree from "./grant-tree";
import organForm from "./organ-form";
import addressForm from "./address-form";
import deptForm from "./dept-form";
import postTable from "./post-table";
import basics from "@/mixins/basics";
export default {
  name: "index",
  components: {
    buttonGroup,
    organForm,
    deptForm,
    grantTree,
    postTable,
    addressForm,
  },
  mixins: [basics],
  data() {
    return {
      // showAddress: true,
      formLoading: false,
      formType: "",
      formState: "",
      formData: {},
      treeNode: {},
      fileIds: [],
      isGrantTree: false,
      grantTreeState: "",
      topNode: "",
      node_had: "",
      resolve_had: "",
    };
  },
  computed: {
    nodeData() {
      return this.treeNode.data;
    },
    // nodeForm() {
    //   return this.treeNode.data;
    // },
    removeFileIds() {
      return this.fileIds;
    },
    state() {
      const type = this.formType;
      const isAdd = this.formState == "add";
      const isEdit = this.formState == "edit";
      // const isAddress = this.formState == "isAddress";
      // const address = type == "地址";
      const isOrgan = type == "机构";
      const isDept = type == "部门";
      const isPost = type == "岗位";
      const title = isAdd ? "新增" : "编辑";
      const iTest = type == "地址";
      const grantTreeState = this.grantTreeState;
      return {
        title,
        isAdd,
        isEdit,
        isOrgan,
        isDept,
        isPost,
        grantTreeState,
        // isAddress,
        iTest,
        // address
      };
    },
    buttonGroup() {
      let s = this.state;
      return [
        {
          text: "新增机构",
          action: "toAdd",
          param: "机构",
          show: s.isOrgan && s.isEdit,
        },
        {
          text: "新增部门",
          action: "toAdd",
          param: "部门",
          show: s.isOrgan && s.isEdit,
        },
        // {
        //   text: "绑定地址",
        //   action: "toAdd",
        //   param: "地址",
        //   show: s.isAddress
        //   // show: s.isEdit
        //   // show: s.isOrgan && s.isEdit
        // },
        {
          text: "新增岗位",
          action: "toAdd",
          param: "岗位",
          show: (s.isOrgan || s.isDept) && s.isEdit,
        },
        {
          text: "批量权限操作",
          action: "showGrantTree",
          param: {
            mark: 2,
            title: "批量权限操作",
          },
          show: (s.isOrgan || s.isDept) && s.isEdit,
        },
        // {
        //   text: "机构异动",
        //   action: "showGrantTree",
        //   param: {
        //     mark: 3,
        //     title: "机构异动",
        //   },
        //   show: s.isOrgan && s.isEdit,
        // },
        {
          text: "岗位权限",
          action: "showGrantTree",
          param: {
            mark: 1,
            title: "岗位权限",
          },
          show: s.isPost && s.isEdit,
        },
        // { text: "绑定地址", action: "toEdit", show: s.isAdd },
        { text: "返回编辑", action: "toEdit", show: s.isAdd },
        { text: "删除", action: "remove", show: s.isEdit },
        { text: "新增保存", action: "insert", show: s.isAdd },
        { text: "修改保存", action: "update", show: s.isEdit },
      ];
    },
  },
  methods: {
    // 懒加载树节点
    loadNode(node, resolve) {
      // 如果是第一级
      if (node.level === 0) {
        this.node_had = node; //这里是关键！在data里面定义一个变量，将node.level == 0的node存起来
        this.resolve_had = resolve; //同上，把node.level == 0的resolve也存起来
        return tree({
          postId: this.$store.getters.postId,
          deptId: "",
        }).then((res) => {
          let data = res.data.data;
          this.topNode = data[0];
          this.selectTopNode();
          resolve(data);
        });
      }
      // 不是第一级
      if (node.data.children.length > 0) {
        // 如果已经存在下级
        resolve(node.data.children);
      } else {
        tree({
          postId: "",
          deptId: node.data.id,
        }).then((res) => resolve(res.data.data));
      }
    },
    // 点击节点
    nodeChange(data, node) {
      this.treeNode = node;
      this.toEdit();
    },

    // 树懒加载刷新方法
    requestNewData() {
      this.node_had.childNodes = []; //把存起来的node的子节点清空，不然会界面会出现重复树！
      this.loadNode(this.node_had, this.resolve_had); //再次执行懒加载的方法
    },

    // 选则顶级节点
    selectTopNode() {
      this.$nextTick(() => {
        this.treeNode = this.$refs.tree.getNode(this.topNode);
        this.$refs.tree.setCurrentNode(this.topNode);
        this.toEdit();
      });
    },
    // 是否为叶子节点
    isLeaf(data) {
      return data.existChild === 0;
    },
    // 监听子组件提交的事件
    onAction({ action, param }) {
      this[action] && this[action](param);
    },
    // 获取当前form表单的配置
    getFormConfig({ config, data, ids }) {
      this.CONFIG = config;
      this.formData = data;
      this.fileIds = ids;
    },
    // 显示岗位权限树
    showGrantTree(state) {
      this.grantTreeState = state;
      this.isGrantTree = true;
    },
    // 表单-新增
    toAdd(type) {
      this.formState = "add";
      this.formType = type;
    },
    // 表单-编辑
    toEdit() {
      this.formState = "edit";
      this.formType = this.nodeData.extendType;
    },

    // 新增
    insert() {
      const callback = (res) => {
        let data = res.data.data;
        this.treeNode.data.existChild = 1;
        this.$refs.tree.append(data, this.nodeData);
        this.treeNode.isLeaf = false;
        this.toEdit();
      };
      this.formData.parentId = this.nodeData.id;
      this.formData.extendType = this.formType;
      this.rowSave(this.formData, callback, false);
    },
    // 更新
    update() {
      const callback = (res) => (this.treeNode.data = res.data.data);
      this.rowUpdate(this.formData, -1, callback, false);
      // window.location.reload();
    },
    // 删除
    remove() {
      const callback = () => {
        const children = this.treeNode.parent.childNodes;
        const index = children.findIndex((d) => d.data.id === this.nodeData.id);
        children.splice(index, 1);
        this.treeNode.parent.isLeaf = children.length == 0;
        this.selectTopNode();
        // window.location.reload();
      };
      this.rowDel(this.nodeData, callback, false);
    },
  },
};
</script>

<style lang="scss">
.organ {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  padding-bottom: 20px;
  .title {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
  }
  .tree {
    width: 30%;
    height: calc(100% - 60px);
    border: 1px solid #9e9e9e3d;
  }
  .form {
    width: 70%;
    height: calc(100% - 60px);
    border: 1px solid #9e9e9e3d;
    border-left: 0px;
    position: relative;
    .avue-form {
      padding-top: 15px;
    }
  }
  .button-group {
    padding: 0px 30px;
  }
}
</style>
