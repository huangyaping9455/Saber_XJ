<template>
  <basic-container>
    <!-- 按钮组 -->
    <div class="guachezilaio">
      <el-button type="primary" icon="el-icon-download">导入</el-button>
      <el-button type="primary" icon="el-icon-document">安全模板绑定</el-button>
      <el-button type="primary" icon="el-icon-document">三检模板绑定</el-button>
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
    <!-- 表格 -->
    <avue-crud
      v-if="ISLOAD"
      v-model="form"
      :data="vehicleSafeData"
      :option="option"
      :page="page"
      ref="table"
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
// import searchDialog from "./searchDialog.vue";
import searchDialog from "C/searchDialog/searchDialog";
export default {
  components: { searchDialog },
  mixins: [vehicle],
  data() {
    return {
      exportLoading: false,
    };
  },
  mounted() {
    this.INIT("/daily/vehicle/guacheziliao");
  },
  methods: {
    // 显示搜索框
    searchShow() {
      this.$refs.searchdialog.searchVisible = true;
      this.$refs.searchdialog.searchMsg.deptName = this.searchData.deptName;
      this.$refs.searchdialog.searchMsg.chejiahao = this.searchData.chejiahao;
      this.$refs.searchdialog.searchMsg.cheliangpaizhao = this.searchData.cheliangpaizhao;
      this.$refs.searchdialog.searchMsg.cheliangzhuangtai = this.searchData.cheliangzhuangtai;
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
          "企业名称",
          "车辆牌照",
          "车牌颜色",
          "登记证书编号",
          "注册登记时间",
          "强制报废时间",
          "车辆状态",
          "档案号",
          "车辆类型",
          "驾驶员",
          "驾驶员电话",
          "责任经营者姓名",
          "责任经营者电话",
        ];
        const filterVal = [
          "deptName",
          "cheliangpaizhao",
          "chepaiyanse",
          "dengjizhengshubianhao",
          "zhucedengjiriqi",
          "qiangzhibaofeishijian",
          "cheliangzhuangtai",
          "danganhao",
          "cheliangleixing",
          "jiashiyuanxingming",
          "jiashiyuandianhua",
          "zerenjingyingzhexingming",
          "zerenjingyingzhedianhua",
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
        ];
        const data = this.formatJson(filterVal, list);
        export_json_to_excel({
          multiHeader2,
          header: multiHeader2,
          data,
          filename: "挂车资料",
          merges,
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.guachezilaio {
  position: absolute;
  top: 0;
  left: 5.85rem;
  display: flex;
  z-index: 10;
  // /deep/ .el-input {
  //   width: 140px;
  //   margin-left: 0.7rem;
  // }
  /deep/ .el-button:last-of-type {
    margin-left: 0.7rem;
  }
}
</style>
