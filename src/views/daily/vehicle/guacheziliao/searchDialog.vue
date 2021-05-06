<template>
  <el-dialog title="查询" :visible.sync="searchVisible" width="30%">
    <div class="dialog-input">
      <span class="dialogname">企业名称：</span>
      <el-input
        placeholder="请输入企业名称"
        v-model="searchMsg.deptName"
        clearable
      ></el-input>
    </div>
    <div class="dialog-input">
      <span class="dialogname">车辆牌照：</span>
      <el-input
        placeholder="请输入车辆牌照"
        v-model="searchMsg.cheliangpaizhao"
        clearable
      ></el-input>
    </div>

    <div class="dialog-input">
      <span class="dialogname">车架号：</span>
      <el-input
        placeholder="请输入车架号"
        v-model="searchMsg.chejiahao"
        clearable
      ></el-input>
    </div>
    <div class="dialog-input">
      <span class="dialogname">车辆状态：</span>
      <el-select
        v-model="searchMsg.cheliangzhuangtai"
        clearable
        placeholder="请选择车辆状态"
      >
        <el-option
          v-for="(item, index) in cheliangzhuangtais"
          :key="index"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="searchVisible = false">取 消</el-button>
      <el-button type="primary" @click="searchTrue">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      searchVisible: false,
      searchMsg: {
        deptName: "",
        cheliangpaizhao: "",
        chejiahao: "",
        cheliangzhuangtai: "",
      },
      cheliangzhuangtais: [
        { value: "", label: "全部" },
        { value: "在用", label: "正在监控" },
        { value: "停用", label: "停止监控" },
        { value: "报废", label: "报废" },
      ],
    };
  },
  mounted() {},
  methods: {
    searchTrue() {
      this.searchVisible = false;
      this.$emit("getList", { searchMsg: this.searchMsg });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog {
  .dialog-input {
    display: flex;
    margin-top: 1rem;
    .dialogname {
      width: 20%;
    }
    .el-input,
    .el-select {
      width: 100%;
    }
  }
}
</style>
