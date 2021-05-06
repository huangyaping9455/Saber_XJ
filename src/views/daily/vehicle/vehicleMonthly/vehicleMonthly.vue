<template>
  <basic-container>
    <div class="vehiclemonthly">
      <el-button type="primary" icon="el-icon-download">导入</el-button>
      <el-button
        type="primary"
        icon="el-icon-upload2"
        @click="befoExport"
        :loading="exportLoading"
        >导出</el-button
      >
      <el-button type="primary" icon="el-icon-search" @click="MonthlySearch"
        >查询</el-button
      >
    </div>
    <avue-crud
      v-if="ISLOAD"
      :data="vehicleSafeData"
      :option="option"
      :page="page"
      ref="table"
      v-model="form"
      :before-open="beforeOpen"
      @on-load="onLoad"
      @search-change="searchChange"
      @refresh-change="searchChange"
      @row-del="rowDel"
      @row-update="rowUpdate"
      @row-save="rowSave"
      :table-loading="loading"
    ></avue-crud>
    <search-dialog ref="searchdialog" @getList="getList"></search-dialog>
  </basic-container>
</template>

<script>
import vehicle from "@/mixins/vehicle";
import { getList } from "@/api/basics";
import { export_json_to_excel } from "../Export2Excel";
import searchDialog from "C/searchDialog/searchDialog";
export default {
  mixins: [vehicle],
  mounted() {
    this.INIT("/daily/vehicle/yuejian");
  },
  components: {
    searchDialog,
  },
  data() {
    return {
      exportLoading: false,
    };
  },
  methods: {
    // 显示查询
    MonthlySearch() {
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
        deptName: this.deptName,
        cheliangpaizhao: this.cheliangpaizhao,
        daoqishijian: this.daoqishijian,
        jiashiyuanxingming: this.jiashiyuan,
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
          "企业名称",
          "车辆牌照",
          "车牌颜色",
          "检查日期",
          "是否合格",
          "车辆里程数",
          "月检检查单位",
        ];
        const filterVal = [
          "deptName",
          "cheliangpaizhao",
          "chepaiyanse",
          "jianchariqi",
          "shifouhege",
          "chelianglichengshu",
          "yuejianjianchadanwei",
        ];
        const merges = [
          "A1:A2",
          "B1:B2",
          "C1:C2",
          "D1:D2",
          "E1:E2",
          "F1:F2",
          "G1:G2",
        ];
        const data = this.formatJson(filterVal, list);
        export_json_to_excel({
          multiHeader2,
          header: multiHeader2,
          data,
          filename: "车辆月检",
          merges,
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.vehiclemonthly {
  position: absolute;
  top: 0;
  left: 5.85rem;
  display: flex;
  z-index: 10;
  /deep/ .el-input {
    width: 150px;
    margin-left: 0.7rem;
  }
  /deep/ .el-button:last-of-type {
    margin-left: 0.7rem;
  }
}
</style>
