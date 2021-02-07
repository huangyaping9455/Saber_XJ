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
      <span class="dialogname">入网时间：</span>
      <el-date-picker
        v-model="searchMsg.caozuoshijian"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择到期时间"
      >
      </el-date-picker>
    </div>
    <div class="dialog-input">
      <span class="dialogname">终端ID：</span>
      <el-input
        placeholder="请输入终端ID"
        v-model="searchMsg.zongduanid"
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
    <div class="dialog-input">
      <span class="dialogname">所属地市：</span>
      <el-select
        v-model="searchMsg.areaName"
        clearable
        placeholder="请选择车辆状态"
      >
        <el-option
          v-for="(item, index) in areaNames"
          :key="index"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div class="dialog-input">
      <span class="dialogname">运营类型：</span>
      <el-select
        v-model="searchMsg.shiyongxingzhi"
        clearable
        placeholder="请选择车辆状态"
      >
        <el-option
          v-for="(item, index) in shiyongxingzhis"
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
import { getDicData } from "@/api/basics";
export default {
  data() {
    return {
      searchVisible: false,
      searchMsg: {
        deptName: "",
        cheliangpaizhao: "",
        caozuoshijian: "",
        cheliangzhuangtai: "",
        zongduanid: "",
        areaName: "",
        shiyongxingzhi: "",
      },
      cheliangzhuangtais: [
        { value: "", label: "全部" },
        { value: "0", label: "在用" },
        { value: "1", label: "停用" },
        // { value: "2", label: "报废" },
      ],
      areaNames: [],
      shiyongxingzhis: [],
    };
  },
  mounted() {
    this.getArea();
    this.getYunYing();
  },
  methods: {
    // 所属地市
    getArea() {
      getDicData("area").then((res) => {
        this.areaNames = res.data.data;
      });
    },
    getYunYing() {
      getDicData("shiyongxingzhi").then((res) => {
        this.shiyongxingzhis = res.data.data;
      });
    },
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
