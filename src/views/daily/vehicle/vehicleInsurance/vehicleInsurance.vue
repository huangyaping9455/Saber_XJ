<template>
  <basic-container>
    <div class="vehicleinsurance">
      <el-button type="primary" icon="el-icon-download">导入</el-button>
      <el-button type="primary" icon="el-icon-document" @click="baofeiTotal"
        >保费合计</el-button
      >
      <el-button
        type="primary"
        icon="el-icon-upload2"
        @click="befoExport"
        :loading="exportLoading"
        >导出</el-button
      >
      <el-button type="primary" icon="el-icon-search" @click="InsuuranceSearch"
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
    >
      <template slot-scope="" slot="baoxianmingxiLabel">
        <span class="mingxi">保险明细</span>
      </template>
      <template slot-scope="" slot="cheliangbaoxianLabel">
        <span class="mingxi">车辆保险</span>
      </template>
    </avue-crud>
    <insurance-dialog ref="insurance"></insurance-dialog>
    <search-dialog ref="searchdialog" @getList="getList"></search-dialog>
  </basic-container>
</template>

<script>
import insurance from "@/mixins/insurance";
import { getList } from "@/api/basics";
import { export_json_to_excel } from "../Export2Excel";
import InsuranceDialog from "./InsuranceDialog";
import SearchDialog from "C/searchDialog/searchDialog";
export default {
  components: { InsuranceDialog, SearchDialog },
  mixins: [insurance],
  data() {
    return {
      exportLoading: false,
      user: {},
    };
  },
  mounted() {
    this.INIT("/daily/vehicle/baoxian");
    this.INITMinXi("/daily/vehicle/baoxianmingxi");
  },
  methods: {
    // 保费合计 显示
    baofeiTotal() {
      this.$refs.insurance.InsuranceVisible = true;
    },
    // 查询 显示
    InsuuranceSearch() {
      this.$refs.searchdialog.searchVisible = true;
      this.$refs.searchdialog.searchMsg.deptName = this.searchData.deptName;
      this.$refs.searchdialog.searchMsg.daoqishijian = this.searchData.daoqishijian;
      this.$refs.searchdialog.searchMsg.cheliangpaizhao = this.searchData.cheliangpaizhao;
      this.$refs.searchdialog.searchMsg.jiashiyuanxingming = this.searchData.jiashiyuanxingming;
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
          "车辆类型",
          "驾驶员",
          "驾驶员电话",
          "责任经营者姓名",
          "责任经营者电话",
          "吨位",
          "核定载客",
          "入户时间",
          "长期停放区",
          "投保公司",
          "投保类型",
          "购买项目",
          "保费",
          "保额",
          "生效日期",
          "到期时间",
          "备注",
        ];
        const filterVal = [
          "deptName",
          "cheliangpaizhao",
          "chepaiyanse",
          "cheliangleixing",
          "jiashiyuanxingming",
          "jiashiyuandianhua",
          "zerenjingyingzhexingming",
          "zerenjingyingzhedianhua",
          "dunwei",
          "hedingzaike",
          "ruhushijian",
          "changqidingfangqu",
          "toubaogongsi",
          "toubaoleixing",
          "goumaixiangmu",
          "baofei",
          "baoe",
          "shengxiaoriqi",
          "daoqishijian",
          "beizhu",
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
          "L1:L2",
          "M1:M2",
          "N1:N2",
          "O1:O2",
          "P1:P2",
          "Q1:Q2",
          "R1:R2",
          "S1:S2",
          "T1:T2",
        ];
        const data = this.formatJson(filterVal, list);
        export_json_to_excel({
          multiHeader2,
          header: multiHeader2,
          data,
          filename: "车辆保险",
          merges,
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.vehicleinsurance {
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
.mingxi {
  font-size: 17px;
  font-weight: 600;
}
</style>
