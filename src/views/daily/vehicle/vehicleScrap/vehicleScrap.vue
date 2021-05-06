<template>
  <basic-container>
    <div class="vehiclescrap">
      <el-button type="primary" icon="el-icon-download">导入</el-button>
      <el-button
        type="primary"
        icon="el-icon-upload2"
        @click="befoExport"
        :loading="exportLoading"
        >导出</el-button
      >
      <el-button type="primary" icon="el-icon-search" @click="ScrapDialog"
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
  components: {
    searchDialog,
  },
  data() {
    return {
      exportLoading: false,
    };
  },
  mounted() {
    this.INIT("/daily/vehicle/baofei");
  },
  methods: {
    // 查询
    ScrapDialog() {
      this.$refs.searchdialog.searchVisible = true;
      this.$refs.searchdialog.searchMsg.deptName = this.searchData.deptName; //searchData为getList的res.data
    },
    // 下载
    befoExport() {
      this.exportLoading = true;
      const api = this.CONFIG.viewModel;
      if (!api) return;
      let params = {
        deptId: this.deptId,
        current: 0,
        size: 0,
        deptName: this.deptName,
        cheliangpaizhao: this.cheliangpaizhao,
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
          "驾驶员",
          "强制报废日期",
          "实际报废日期",
          "报废人",
          "操作时间",
        ];
        const filterVal = [
          "deptName",
          "cheliangpaizhao",
          "chepaiyanse",
          "jiashiyuan",
          "qiangzhibaofeiriqi",
          "shijibaofeiriqi",
          "baofeiren",
          "caozuoshijian",
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
        ];
        const data = this.formatJson(filterVal, list);
        export_json_to_excel({
          multiHeader2,
          header: multiHeader2,
          data,
          filename: "车辆报废",
          merges,
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.vehiclescrap {
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
