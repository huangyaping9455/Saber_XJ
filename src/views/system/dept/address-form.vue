<template>
  <div class="provinceInput" v-if="this.state.isOrgan" ref="form">
    <div class="provinceInput-left">
      <span>地址</span>
    </div>
    <div class="provinceInput-right">
      <el-select
        v-model="value1"
        clearable
        @clear="clearsheng"
        placeholder="请选择省份"
        @change="changeA"
        value-key="id"
        filterable
      >
        <el-option
          v-for="item in options1"
          :key="item.id"
          :label="item.title"
          :value="item"
        ></el-option>
      </el-select>
      <el-select
        v-model="value2"
        clearable
        @clear="clearshi"
        placeholder="请选择市"
        @change="changeB"
        value-key="id"
        filterable
      >
        <el-option
          v-for="item in options2"
          :key="item.id"
          :label="item.title"
          :value="item"
        ></el-option>
      </el-select>
      <el-select
        v-model="value3"
        clearable
        @clear="clearxian"
        placeholder="请选择县"
        @change="changeC"
        value-key="id"
        filterable
      >
        <el-option
          v-for="item in options3"
          :key="item.id"
          :label="item.title"
          :value="item"
        ></el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import basics from "./form-mixin";
import basic from "@/mixins/basics";

export default {
  mixins: [basics, basic],
  data: function () {
    return {
      TOKEN: "organ-config",
      // show: false
    };
  },

  methods: {
    // 当前实例 的显示方法
    show() {
      // show: true;
      let s = this.state;
      // return this.s.isAddress;

      return s.isOrgan;
    },
  },
};
</script>
<style lang="scss" scoped>
.provinceInput {
  display: flex;
  margin-top: -20px;
  padding: 20px 0;
  .provinceInput-left {
    width: 14%;
    span {
      font-size: 14px;
      color: #606266;
      padding: 0 1.8rem;
    }
  }
  .provinceInput-right {
    width: 86%;
    display: flex;
  }
}
</style>
