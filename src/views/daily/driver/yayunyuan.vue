<template>
  <basic-container>
    <!-- 按钮组 -->
    <div class="yayunyuan">
      <el-button type="primary" icon="el-icon-download">导入</el-button>
      <el-button
        type="primary"
        icon="el-icon-upload2"
        @click="befoExport"
        :loading="exportLoading"
        >导出</el-button
      >
      <el-button type="primary" icon="el-icon-search" @click="searchShow"
        >查询</el-button
      >
    </div>
    <avue-crud
      v-if="ISLOAD"
      v-model="formData"
      :table-loading="tableLoading"
      :data="tableData"
      :page="page"
      :option="option"
      :before-open="beforeOpen"
      @row-del="rowDel"
      @row-update="rowUpdate"
      @row-save="rowSave"
      @on-load="onLoad"
      @search-change="searchChange"
      @sort-change="sortChange"
      @refresh-change="refreshChange"
    ></avue-crud>
    <search-dialog ref="searchdialog" @getList="getList"></search-dialog>
  </basic-container>
</template>

<script>
import zhengjian from "@/mixins/zhengjian";
import { getList } from "@/api/basics";
import { export_json_to_excel } from "../vehicle/Export2Excel";
import searchDialog from "./searchDialog";
export default {
  name: "yayunyuan",
  mixins: [zhengjian],
  components: {
    searchDialog,
  },
  data() {
    return {
      exportLoading: false,
    };
  },
  mounted() {
    this.INIT("/daily/driver/yayunyuan");
  },
  methods: {
    // 查询 显示
    searchShow() {
      this.$refs.searchdialog.searchVisible = true;
    },
    //  导出表格
    befoExport() {
      this.exportLoading = true;
      const api = this.CONFIG.viewModel;
      if (!api) return;
      let params = {
        deptId: this.deptId,
        current: 1,
        size: 10,
        ...this.$refs.searchdialog.searchMsg,
      };
      getList(api, params).then((res) => {
        if (res.data.success == true) {
          res.data.data = res.data.data.records.map((el, index) => {
            return {
              ...el,
              index: index + 1,
            };
          });
          this.export2Excel(res.data.data);
          this.exportLoading = false;
        } else {
          this.$message.error(err);
        }
      });
    },
    //处理下载数据
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    export2Excel(list) {
      require.ensure([], () => {
        const multiHeader2 = [
          "单位名称",
          "押运员姓名",
          "身份证号",
          "出生日期",
          "手机号码",
          "从业人员类型",
          "从业资格证号",
          "从业类别",
          "从业有效期",
          "是否离职",
          "发证机关",
        ];
        const filterVal = [
          "deptName",
          "jiashiyuanxingming",
          "shenfenzhenghao",
          "chushengshijian",
          "shoujihaoma",
          "congyerenyuanleixing",
          "congyezigezhenghao",
          "congyeleibie",
          "congyezhengyouxiaoqi",
          "shifoulizhi",
          "fazhengjiguan",
        ];
        const merges = [
          "A1:A2",
          "B1:B2",
          "C1:C2",
          "D1:D2",
          "E1:E2",
          "F1:F2",
          "G1:G2",
          "H1:H2",
          "I1:I2",
          "J1:J2",
          "K1:K2",
        ];
        const data = this.formatJson(filterVal, list);
        export_json_to_excel({
          multiHeader2,
          header: multiHeader2,
          data,
          filename: "押运员信息",
          merges,
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.yayunyuan {
  position: absolute;
  top: 0;
  left: 5.85rem;
  display: flex;
  z-index: 10;
  /deep/ .el-button:last-of-type {
    margin-left: 0.7rem;
  }
}
</style>
