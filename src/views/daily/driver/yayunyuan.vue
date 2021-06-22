<template>
  <basic-container>
    <!-- 按钮组 -->
    <div class="yayunyuan">
      <el-upload
        action="/api/blade-platform/platform/yayunyuan/driverImport"
        :data="pdata"
        name="file"
        ref="upload"
        :headers="headers"
        :show-file-list="false"
        :on-change="onChange"
        :auto-upload="false"
        :on-success="uploadSuccess"
        :limit="100"
        :file-list="fileList"
      >
        <el-button size="small" type="primary">
          <i class="el-icon-download" />导入
        </el-button>
      </el-upload>
      <el-button size="small" type="primary" @click="DowInfo">
          <i class="el-icon-upload" />下载模板
        </el-button>
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
    <yayunyuan-import ref="yayunyuanMsgImport" :exceljson="exceljson" @refreshChange="refreshChange"></yayunyuan-import>
  </basic-container>
</template>

<script>
import zhengjian from "@/mixins/zhengjian";
import { getToken } from "@/util/auth";
import { getList } from "@/api/basics";
import { export_json_to_excel } from "../vehicle/Export2Excel";
import searchDialog from "./searchDialog";
import yayunyuanImport from "../vehicle/vehicleInfo/yayunyuanImport"

export default {
  name: "yayunyuan",
  mixins: [zhengjian],
  components: {
    searchDialog,
    yayunyuanImport
  },
  data() {
    return {
      exportLoading: false,// 上传 附加参数
      pdata: {
        userId: this.$store.getters.userInfo.userId,
        userName: this.$store.getters.userInfo.userName,
      },
      headers: {
        "blade-auth": "Bearer " + getToken(),
      },
      fileList: [],
      exceljson: "",
    };
  },
  mounted() {
    this.INIT("/daily/driver/yayunyuan");
  },
  methods: {
    onChange(files, fileList) {
      this.$refs.yayunyuanMsgImport.driverDialogVisible = true;
      this.$refs.upload.submit();
      // this.$refs.yayunyuanMsgImport.tableUploadLoading = true;
      if (files.status === "ready") {
        return;
      }
      if (this.status) {
        this.status = false;
        if (files.status === "success") {
          // this.$refs.yayunyuanMsgImport.tableUploadLoading = false;
          this.fileList = fileList.slice(1);
        } else {
          this.$message.error("导入失败,请校验模板数据···");
          this.$refs.yayunyuanMsgImport.disa = true;
          this.fileList = fileList.slice(1);
          // this.$refs.yayunyuanMsgImport.tableUploadLoading = false;
        }
        setTimeout(() => {
          this.status = true;
        }, 500);
      }
    },
    // 上传校验 成功
    uploadSuccess(res) {
      // this.$refs.yayunyuanMsgImport.tableUploadLoading = false;
      this.$refs.yayunyuanMsgImport.tableDialogList = res.data;
      for (let i in res.data) {
        if (res.data[i].msg !== "") {
          this.$refs.yayunyuanMsgImport.tableDialogList[
            i
          ].msg2 = require("A/icon/no.png");
        } else {
          this.$refs.yayunyuanMsgImport.tableDialogList[
            i
          ].msg2 = require("A/icon/yes.png");
        }
      }
      if (res.code == 200) {
        this.$refs.yayunyuanMsgImport.disa = false;
        this.exceljson= JSON.stringify(res.data);
        // this.$refs.yayunyuanMsgImport.tableUploadLoading = false;
        this.$message.success("数据验证成功···");
      } else {
        this.$refs.yayunyuanMsgImport.disa = true;
        // this.$refs.yayunyuanMsgImport.tableUploadLoading = false;
        this.$message.error("导入数据有误，请重新校验···");
        this.$refs.yayunyuanMsgImport.dialogMessage = res.msg;
      }
    },
    // 查询 显示
    searchShow() {
      this.$refs.searchdialog.searchVisible = true;
    },
    // 下载模板
    DowInfo() {
      window.open(
        this.$store.getters.userInfo.urlPrefix +
          "SafetyStandards/模板/导入押运员资料模板（跨公司）.xls"
      );
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
  /deep/ .el-upload{
        margin-left:-0.7rem;
        margin-right:0.7rem;
  }
  /deep/ .el-button:last-of-type {
    margin-left: 0.7rem;
  }
}
</style>
