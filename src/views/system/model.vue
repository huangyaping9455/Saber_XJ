<template>
  <basic-container>
    <div v-loading="isLoading" class="model-config">
      <p class="title">
        <b>模块配置 - {{ treeNode.data.muban }} - {{ state.title }}</b>
      </p>
      <!-- 模板树 -->
      <div class="tree">
        <el-input
          v-model="filterText"
          size="mini"
          placeholder="输入关键字进行过滤"
          prefix-icon="el-icon-search"
        ></el-input>
        <el-tree
          ref="tree"
          lazy
          :props="{ isLeaf: 'leaf', label: 'muban' }"
          :load="loadNode"
          :filter-node-method="filterNode"
          @node-click="selectedNode"
          highlight-current
          accordion
          empty-text="暂无数据"
          node-key="id"
          @current-change="nodeChange"
        ></el-tree>
      </div>

      <!-- 右侧表单 -->
      <div class="form">
        <button-group :group="buttonGroup" @action="onAction"></button-group>
        <avue-form
          ref="form"
          v-model="formData"
          :option="formOption"
          @submit="submit"
        ></avue-form>
      </div>
    </div>
  </basic-container>
</template>

<script>
import {
  getList,
  remove,
  insert,
  update,
  initField,
  initModel,
} from "@/api/system/model";
import buttonGroup from "C/button-group";
import CONFIG from "@/const/model/model";

export default {
  name: "model",
  components: {
    buttonGroup,
  },
  props: {
    value: Object,
  },
  data() {
    return {
      isLoading: true,
      stateText: "add",
      filterText: "",
      treeNode: {
        data: {},
      },
      topNode: "",
      formData: {},
      formState: {
        add: {
          submit: insert,
          params: {},
          title: "新增",
          message: "新增成功",
          callback: (data) => {
            this.$refs.tree.append(data, this.treeNode.data);
          },
        },
        edit: {
          submit: update,
          params: {},
          title: "编辑",
          message: "修改成功",
          callback: (data) => {
            this.treeNode.data = data;
          },
        },
      },
    };
  },
  computed: {
    state() {
      return this.formState[this.stateText];
    },
    // 是否存在下级
    isChildren() {
      let children = this.treeNode.childNodes;
      return children != undefined && children.length > 0;
    },
    // 表单配置
    formOption() {
      const { baseConfig, intensifyConfig } = CONFIG(this);
      const formIsMenuType = this.formData.leixing === 0;
      return {
        labelWidth: 120,
        labelPosition: "left",
        column: [...baseConfig, ...(formIsMenuType ? [] : intensifyConfig)],
      };
    },
    // 按钮组
    buttonGroup() {
      const isEdit = this.stateText === "edit";
      const nodeIsMenuType = this.treeNode.data.leixing === 0;
      return [
        {
          text: "返回编辑",
          action: "toEdit",
          show: !isEdit,
        },
        {
          text: "新增模块",
          action: "toAdd",
          show: isEdit && nodeIsMenuType,
        },
        {
          text: "删除模块",
          action: "toRmove",
          show: isEdit && !this.isChildren,
        },
        {
          text: "一键初始化模板",
          action: "toInitModel",
          show: isEdit && this.treeNode.level == 1,
        },
        {
          text: "配置初始化",
          action: "toInitField",
          show: isEdit && !nodeIsMenuType,
        },
        {
          text: "配置预览",
          action: "toPreview",
          show: isEdit && !nodeIsMenuType,
        },
        {
          text: "配置模块字段",
          action: "tofield",
          show: isEdit && !nodeIsMenuType,
        },
      ];
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    loadNode(node, resolve) {
      let id = node.level === 0 ? "" : node.data.id;
      getList(id).then((res) => {
        let data = res.data.data;
        data.forEach((item) => (item.leaf = item.existChild === 0));
        if (node.level === 0) {
          this.$nextTick(() => {
            this.isLoading = false;
            this.topNode = data[0];
            this.treeNode = this.$refs.tree.getNode(data[0]);
            this.$refs.tree.setCurrentNode(data[0]);
            this.toEdit();
          });
        }
        resolve(data);
      });
    },
    // 过滤节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 选中节点
    selectedNode(data) {
      this.treeNode.data = data;
      this.formData = data;
    },
    nodeChange(data, node) {
      this.treeNode = node;
      this.toEdit();
    },
    // 选则顶级节点
    selectTopNode() {
      this.$nextTick(() => {
        this.treeNode = this.$refs.tree.getNode(this.topNode);
        this.$refs.tree.setCurrentNode(this.topNode);
        this.toEdit();
      });
    },
    onAction(item) {
      this[item.action] && this[item.action](item);
    },
    thenCallback(message, callback) {
      this.$message({
        type: "success",
        message,
      });
      callback && callback();
    },
    // ---------------------- 按钮组相关函数 ----------------------
    toAdd() {
      this.stateText = "add";
      this.state.params.parentId = this.treeNode.data.id;
      this.formData.parentId = this.treeNode.data.id;
      // this.$refs.form.resetForm;
      this.$refs.form.resetForm();
    },
    toEdit() {
      this.stateText = "edit";
      this.formData = this.treeNode.data;
      // this.treeNode = node;
      // this.formData = node.data;
    },
    // 提交
    submit() {
      let state = this.state;
      let params = Object.assign(state.params, this.formData);
      params.is_deleted = 0;
      state.submit(params).then((res) => {
        this.thenCallback(state.message, () => {
          state.callback(res.data.data);
          this.$refs.form.allDisabled = false;
        });
      });
    },
    toRmove() {
      this.$confirm("此操作将删除该模板, 是否继续?", "提示", {
        type: "warning",
      }).then(() => {
        remove(this.treeNode.data.id).then(() => {
          this.thenCallback("删除成功", () => {
            const children = this.treeNode.parent.childNodes;
            const index = children.findIndex(
              (d) => d.data.id === this.treeNode.data.id
            );
            children.splice(index, 1);
            this.selectTopNode();
          });
        });
      });
    },
    toInitField() {
      this.$confirm("确定要初始化该模块？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let tableName = this.formData.biaoming;
        if (tableName.trim() == "") {
          return this.$message({
            type: "error",
            message: "初始失败，未找到模块表名",
          });
        }
        initField(this.$store.getters.deptId, tableName).then((res) => {
          if (res.data.success) {
            this.thenCallback(res.data.msg);
          }
        });
      });
    },
    toInitModel() {
      this.$confirm("确定要初始化所有模块？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        initModel(this.$store.getters.deptId).then((res) => {
          if (res.data.success) {
            this.thenCallback(res.data.msg);
          }
        });
      });
    },
    tofield() {
      this.$store.commit("SET_MODEL", this.treeNode.data);
      this.$router.push({
        path: `/system/field?id=${this.treeNode.data.id}`,
      });
    },
    toPreview() {
      this.$store.commit("SET_MODEL", this.treeNode.data);
      this.$router.push({
        path: `/system/preview?id=${this.treeNode.data.id}`,
      });
    },
  },
};
</script>

<style lang="scss">
.model-config {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-wrap: wrap;

  .title {
    width: 100%;
  }

  .tree {
    width: 35%;
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
    }
  }

  .form {
    flex-grow: 1;
    width: 65%;
    .button-group {
      padding: 0px 20px;
      margin-bottom: 15px;
    }
    .el-col {
      margin-bottom: 0px;
    }
  }

  .list {
    flex-grow: 1;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;

    .el-tag {
      cursor: pointer;
      margin: 0px 10px;

      span {
        margin-right: 10px;
      }
    }
  }
  .item {
    cursor: pointer;
    text-align: center;
  }
}
</style>
