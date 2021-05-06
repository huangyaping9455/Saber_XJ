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
    <div
      v-if="$store.state.tags.tag.label === '押运员信息'"
      class="dialog-input"
    >
      <span class="dialogname">押运员：</span>
      <el-input
        placeholder="请输入押运员"
        v-model="searchMsg.jiashiyuanmingcheng"
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
    <div
      v-if="$store.state.tags.tag.label === '押运员信息'"
      class="dialog-input"
    >
      <span class="dialogname">手机号码：</span>
      <el-input
        placeholder="请输入手机号码"
        v-model="searchMsg.shoujihaoma"
        clearable
      ></el-input>
    </div>
    <div
      v-if="$store.state.tags.tag.label === '押运员信息'"
      class="dialog-input"
    >
      <span class="dialogname">身份证号：</span>
      <el-input
        placeholder="请输入身份证号"
        v-model="searchMsg.shenfenzhenghao"
        clearable
      ></el-input>
    </div>
    <div
      v-if="$store.state.tags.tag.label === '押运员信息'"
      class="dialog-input"
    >
      <span class="dialogname">是否离职：</span>
      <el-select v-model="searchMsg.shifoulizhi" placeholder="请选择">
        <el-option
          v-for="item in shifoulizhis"
          :key="item.value"
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
        jiashiyuanmingcheng: "",
        cheliangpaizhao: "",
        shoujihaoma: "",
        shenfenzhenghao: "",
        shifoulizhi: "",
      },
      shifoulizhis: [
        { value: "", label: "全部" },
        { value: "离职", label: "离职" },
        { value: "在职", label: "在职" },
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
