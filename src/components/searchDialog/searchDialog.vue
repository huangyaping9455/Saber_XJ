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
    <div v-if="$store.state.tags.tag.label === '车辆安全'" class="dialog-input">
      <span class="dialogname">车架号：</span>
      <el-input
        placeholder="请输入车架号"
        v-model="searchMsg.chejiahao"
        clearable
      ></el-input>
    </div>
    <div
      v-if="
        $store.state.tags.tag.label !== '车辆月检' ||
          $store.state.tags.tag.label !== '罐车检查'
      "
      class="dialog-input"
    >
      <span class="dialogname">驾驶员：</span>
      <el-input
        placeholder="请输入驾驶员"
        v-model="searchMsg.jiashiyuanxingming"
        clearable
      >
      </el-input>
    </div>
    <div v-if="$store.state.tags.tag.label === '挂车资料'" class="dialog-input">
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
    <div v-if="$store.state.tags.tag.label === '车辆保险'" class="dialog-input">
      <span class="dialogname">到期时间：</span>
      <el-date-picker
        v-model="searchMsg.daoqishijian"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择到期时间"
      >
      </el-date-picker>
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
        jiashiyuanxingming: "",
        cheliangzhuangtai: "",
        daoqishijian: "",
      },
      cheliangzhuangtais: [
        { value: "", label: "全部" },
        { value: "0", label: "在用" },
        { value: "1", label: "停用" },
        // { value: "2", label: "报废" },
      ],
    };
  },
  mounted() {
    // console.log(this.$store.state.tags.tag.label);
  },
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
