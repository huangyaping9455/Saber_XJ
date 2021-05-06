<template>
  <basic-container>
    <p v-if="!node">请先在模块管理选择要配置字段的模块</p>
    <div v-else class="field-config">
      <!-- 当前模块名称 -->
      <div class="title">
        <b
          >模块字段管理 {{ node.label }} {{ state.title }}
          {{ fieldData.label }}</b
        >
        <el-button size="mini" icon="el-icon-back" @click="toModel"
          >返回模块管理</el-button
        >
      </div>

      <!-- 字段列表 -->
      <div class="list">
        <el-input
          v-model="filterText"
          size="mini"
          placeholder="输入关键字进行过滤"
          prefix-icon="el-icon-search"
        ></el-input>
        <el-tag
          v-show="filterList.length == 0"
          type="info"
          class="side-leave-active"
          >暂无数据</el-tag
        >
        <transition-group name="side">
          <el-tag
            v-for="item in filterList"
            :key="item.prop"
            closable
            @close="toRemove(item)"
            @click="toEdit(item)"
          >
            <span>{{ item.sort }} {{ item.label }}</span>
          </el-tag>
        </transition-group>
      </div>

      <!-- 字段表单 -->
      <div class="form">
        <button-group :group="buttonGroup" @action="onAction"></button-group>
        <avue-form
          ref="form"
          v-model="fieldData"
          class="form"
          :option="fielddOption"
          @submit="submit"
        ></avue-form>
      </div>
    </div>
  </basic-container>
</template>

<script>
import buttonGroup from "C/button-group";
import { mapGetters } from "vuex";
import { getList, remove, insert, update } from "@/api/system/felid";
import {
  fieldConfig,
  defalutValue,
  fieldType,
} from "@/const/field/field-config";

export default {
  name: "field",
  components: {
    buttonGroup,
  },
  data() {
    return {
      filterText: "",
      stateText: "add",
      formState: {
        add: {
          submit: insert,
          id: "",
          url: "",
          title: "新增",
          message: "新增成功",
        },
        edit: {
          submit: update,
          id: "",
          url: "",
          title: "编辑",
          message: "修改成功",
        },
      },
      fieldList: [],
      fieldData: defalutValue(),
    };
  },
  computed: {
    ...mapGetters(["postId", "deptId"]),
    // 当前配置模板相关信息
    node() {
      let id = this.$route.query.id;
      return this.$store.state.models.models[id];
    },
    // 状态
    state() {
      return this.formState[this.stateText];
    },
    // 过滤字段列表
    filterList() {
      return this.fieldList.filter(
        (item) => item.label.indexOf(this.filterText) != -1
      );
    },
    // 当前字段类型
    typeConfig() {
      return this.fieldData.type
        ? fieldType.find((item) => item.value == this.fieldData.type).config
        : [];
    },
    // 表单配置
    fielddOption() {
      let { baseConfig, intensifyConfig } = fieldConfig(this);
      return {
        size: "mini",
        submitBtn: true,
        emptyBtn: true,
        menuPostion: "left",
        labelWidth: 120,
        labelPosition: "left",
        // 基础配置，字段类型配置，其它配置
        column: [...baseConfig, ...this.typeConfig, ...intensifyConfig],
      };
    },
    // 按钮组
    buttonGroup() {
      const isEdit = this.stateText == "edit";
      const isPreview = this.filterList.length > 0;
      return [
        {
          text: "配置预览",
          action: "toPreview",
          show: isPreview,
        },
        {
          text: "返回新增",
          action: "toAdd",
          show: isEdit,
        },
      ];
    },
  },
  mounted() {
    if (!this.node) return;
    this.initState();
    this.getList();
  },
  methods: {
    // 初始化状态
    initState() {
      this.formState.edit.url = this.node.updateField;
      this.formState.add.url = this.node.insertField;
      this.formState.add.id = this.deptId;
    },
    // 获取所有字段
    getList() {
      getList(this.node.viewField, this.deptId).then((res) => {
        this.fieldList = res.data.data.sort((a, b) => a.sort - b.sort);
        this.toAdd();
      });
    },
    // 获取要上传的字段配置
    getFielddConfg() {
      let config = {};
      this.fielddOption.column.forEach((item) => {
        const key = item.prop;
        const value = this.fieldData[key];
        // 忽略无效的属性
        const isInvalid =
          value === "" ||
          value === undefined ||
          key.indexOf("$") != -1 ||
          (key == "display" && value === true) ||
          (key == "width" && value == 0) ||
          (key == "minWidth" && value == 0);
        if (!isInvalid) config[key] = value.trim ? value.trim() : value;
      });
      return config;
    },
    // 更新或新增字段
    submit() {
      let config = this.getFielddConfg();
      let state = this.state;
      state.submit(state.url, state.id, config).then(() => {
        this.thenCallback(state.message);
        // 表单禁用
        this.$refs.form.allDisabled = false;
      });
    },
    toAdd() {
      this.stateText = "add";
      // this.$refs.form.resetForm;
      this.$refs.form.resetForm();
      this.$nextTick(() => {
        this.fieldData = defalutValue();
        // 取最后一位的排序+1
        let list = this.fieldList;
        if (list.length > 0) {
          this.fieldData.sort = list[list.length - 1].sort + 1;
        }
      });
    },
    toEdit(item) {
      this.stateText = "edit";
      // this.$refs.form.resetForm;
      this.$refs.form.resetForm();
      this.state.id = item.id;
      this.$nextTick(() => {
        this.fieldData = item;
      });
    },
    toRemove(item) {
      this.$confirm("此操作将删除该字段, 是否继续?", "提示", {
        type: "warning",
      }).then(() => {
        remove(this.node.removeField, item.id).then(() => {
          this.thenCallback("删除成功");
        });
      });
    },
    toPreview() {
      this.$router.push({
        path: `/system/preview?id=${this.$route.query.id}`,
      });
    },
    toModel() {
      this.$router.push({
        path: "/system/model",
      });
    },
    onAction(item) {
      this[item.action] && this[item.action](item);
    },
    thenCallback(message) {
      this.$message({
        type: "success",
        message,
      });
      this.getList();
    },
  },
};
</script>

<style lang="scss">
.field-config {
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 40px;

  .title {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .button-group {
    padding: 0px 20px;
    margin-bottom: 15px;
  }

  .list {
    width: 35%;
    overflow: hidden;
    position: relative;
    .el-input {
      margin-bottom: 10px;
    }
    .el-tag {
      width: 100%;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.3s;
    }
    .side-enter,
    .side-leave-to {
      opacity: 0;
    }
    .side-leave-active {
      position: absolute;
    }
  }

  .form {
    width: 65%;

    .el-col {
      margin-bottom: 0px;
    }
  }
}
</style>
