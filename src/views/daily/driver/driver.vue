<template>
  <basic-container class="drive">
    <div
      class="operation-model"
      :class="{ heightTop: clientHeight }"
      v-if="ISLOAD"
    >
      <el-upload
        style="
          margin-left: 5.7rem;
          width: auto;
          display: flex;
          margin-top: -1.2rem;
        "
        :action="baseUrl + '/blade-platform/platform/jiashiyuan/driverImport'"
        :data="pdata"
        name="file"
        ref="upload"
        :headers="headers"
        :show-file-list="false"
        :before-upload="beforeUpload"
        :on-change="onChange"
        :auto-upload="autoUpload"
        :on-success="uploadSuccess"
        :limit="100"
        :file-list="fileList"
      >
        <el-button size="small" type="primary">
          <i class="el-icon-download" />导入
        </el-button>
      </el-upload>
      <div
        style="
          display: flex;
          margin-top: -1.2rem;
          margin-left: 10.6rem;
          position: absolute;
        "
      >
        <el-button size="small" type="primary" @click="DowInfo">
          <i class="el-icon-upload" />下载模板
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="befoExport"
          :loading="exportLoading"
        >
          <i class="el-icon-upload2" />导出
        </el-button>
        <el-input
          v-model="driveSearchChange"
          clearable
          placeholder="请输入驾驶员姓名"
          style="width: 11rem; margin-left: 0.6rem"
        ></el-input>
        <el-input
          v-model="deptNamess"
          clearable
          placeholder="请输入企业名称"
          style="width: 11rem; margin-left: 0.6rem"
        ></el-input>
        <el-button
          type="primary"
          @click="searchChange"
          style="margin-left: 0.6rem"
        >
          <i class="el-icon-search"></i>搜索
        </el-button>
      </div>
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
      @sort-change="sortChange"
      @refresh-change="refreshChange"
    >
      <template slot-scope="scope" slot="menu">
        <el-button
          icon="el-icon-refresh-right"
          :type="scope.type"
          :size="scope.size"
          @click="JSYreset(scope)"
          >重置密码</el-button
        >
      </template>
    </avue-crud>
    <el-dialog
      title="重置密码"
      :visible.sync="resetDialogVisible"
      :destroy-on-close="true"
      :center="true"
      width="30%"
    >
      <span style="font-size: 20px"
        ><i style="color: red" class="el-icon-warning-outline"></i
        >确定重置密码吗？</span
      >
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="trueJSYreset" :loading="resetLoading"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <template>
      <!-- 导入 验证弹框 -->
      <DriverImport
        ref="driverMsgImport"
        :exceljson="exceljson"
        @refreshChange="refreshChange"
      ></DriverImport>
    </template>
  </basic-container>
</template>

<script>
import XLSX from "xlsx";
import driver from "@/mixins/driver";
import { getToken } from "@/util/auth";
import axios from "axios";
import { getJSYByVehicle, resetPassword } from "@/api/dept/noticelist";
import { export_json_to_excel } from "../vehicle/Export2Excel";
import DriverImport from "../vehicle/vehicleInfo/driverImport";
export default {
  name: "driver",
  mixins: [driver],
  components: { DriverImport },
  data() {
    return {
      exportLoading: false,
      headers: {
        "blade-auth": "Bearer " + getToken(),
      },
      fileList: [],
      // 上传 附加参数
      pdata: {
        userId: this.$store.getters.userInfo.userId,
        userName: this.$store.getters.userInfo.userName,
      },
      baseUrl: "/api",
      status: true,
      clientHeight: false,
      resetDialogVisible: false,
      resetmima: "",
      resetLoading: false,
      exceljson: "",
      autoUpload: false,
    };
  },
  created() {
    document.addEventListener("click", (e) => {
      if (e.target.className.indexOf("el-icon-search") != -1)
        this.clientHeight =
          document.getElementsByClassName("el-form").length === 0;
    });
  },
  mounted() {
    this.INIT("/daily/driver/driver");
  },
  methods: {
    onChange(files, fileList) {
      this.$refs.driverMsgImport.driverDialogVisible = true;
      this.$refs.upload.submit();
      this.$refs.driverMsgImport.tableUploadLoading = true;
      if (files.status === "ready") {
        return;
      }
      if (this.status) {
        this.status = false;
        if (files.status === "success") {
          this.$refs.driverMsgImport.tableUploadLoading = false;
          this.fileList = fileList.slice(1);
        } else {
          this.$message.error("导入失败,请校验模板数据···");
          this.$refs.driverMsgImport.disa = true;
          this.fileList = fileList.slice(1);
          this.$refs.driverMsgImport.tableUploadLoading = false;
        }
        setTimeout(() => {
          this.status = true;
        }, 500);
      }
    },
    // 上传前得方法
    beforeUpload(file) {
      // 将表格数据转化为json格式
      const fileReader = new FileReader();
      fileReader.onload = (ev) => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: "binary", // 以字符编码的方式解析
          });
          const exlname = workbook.SheetNames[0]; // 取第一张表
          const exl = XLSX.utils.sheet_to_json(workbook.Sheets[exlname]); // 生成json表格内容
          // this.exceljson = JSON.stringify(exl);
        } catch (e) {
          this.$message.error("出错了···");
          return false;
        }
      };
      fileReader.readAsBinaryString(file);
    },

    // 上传校验 成功
    uploadSuccess(res) {
      this.$refs.driverMsgImport.tableUploadLoading = false;
      this.$refs.driverMsgImport.tableDialogList = res.data;
      for (let i in res.data) {
        if (res.data[i].msg !== "") {
          this.$refs.driverMsgImport.tableDialogList[
            i
          ].msg2 = require("A/icon/no.png");
        } else {
          this.$refs.driverMsgImport.tableDialogList[
            i
          ].msg2 = require("A/icon/yes.png");
        }
      }
      if (res.code == 200) {
        this.$refs.driverMsgImport.disa = false;
        this.exceljson = JSON.stringify(res.data);
        this.$message.success("数据验证成功···");
      } else {
        this.$refs.driverMsgImport.disa = true;
        this.$message.error("导入数据有误，请重新校验···");
        this.$refs.driverMsgImport.dialogMessage = res.msg;
      }
    },
    // 弹出框beforeopen
    beforeOpen(done, type) {
      if (type === "view") {
        for (let i in this.FIELD) {
          this.FIELD[i].disabled = true;
        }
      } else {
        for (let j in this.FIELD) {
          this.FIELD[j].disabled = false;
        }
      }
      done();
    },
    // 重置密码 弹出层
    JSYreset(data) {
      this.resetmima = data.row;
      this.resetDialogVisible = true;
    },
    // 重置密码 确定
    trueJSYreset() {
      this.resetLoading = true;
      resetPassword(this.resetmima.id).then((res) => {
        if (res.data.code == 200) {
          this.resetDialogVisible = false;
          this.resetLoading = false;
          this.$message.success("密码重置成功···");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    befoExport() {
      this.exportLoading = true;
      axios({
        url: "/api/blade-platform/platform/jiashiyuan/list",
        method: "post",
        data: {
          current: 0,
          deptId: this.deptId,
          size: 0,
        },
      }).then((res) => {
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
          "驾驶员姓名",
          "性别",
          "身份证号",
          "手机号码",
          "创建时间",
        ];
        const filterVal = [
          "deptName",
          "jiashiyuanxingming",
          "xingbie",
          "shenfenzhenghao",
          "shoujihaoma",
          "createtime",
        ];
        const merges = ["A1:A2", "B1:B2", "C1:C2", "D1:D2", "E1:E2", "F1:F2"];
        // const list = this.goodsItems;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel({
          multiHeader2,
          header: multiHeader2,
          data,
          filename: "驾驶员信息",
          merges,
        });
      });
    },
    DowInfo() {
      window.open(
        this.$store.getters.userInfo.urlPrefix +
          "SafetyStandards/模板/导入驾驶员资料模板（跨公司）.xls"
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.drive {
  padding: 0 15px;
  .operation-model {
    display: flex;
    position: relative;
    top: 33px;
    left: 4px;
    z-index: 999;
    .el-button {
      cursor: pointer;
    }
  }
}
</style>
<style>
.el-table__row {
  height: 60px;
}
</style>
