<template>
  <basic-container class="vehicle">
    <!-- 头部 按钮组  -->
    <div
      class="operation-model"
      :class="{ heightTop: clientHeight }"
      v-if="ISLOAD"
    >
      <el-upload
        style="margin-left: 5.8rem; display: flex; margin-top: -1.2rem"
        :action="baseUrl + '/blade-platform/platform/vehicle/vehicleImport'"
        :data="pdata"
        name="file"
        :show-file-list="false"
        :headers="headers"
        :on-change="onChange"
        :on-success="uploadSuccess"
        :file-list="fileList"
        :before-upload="beforeUpload"
        :auto-upload="autoUpload"
        :limit="100"
        ref="upload"
      >
        <el-button size="small" type="primary">
          <i class="el-icon-download" />导入
        </el-button>
        <el-button size="small" type="primary" @click="DowInfo">
          <i class="el-icon-upload" />下载模板
        </el-button>
      </el-upload>
      <div
        style="
          display: flex;
          margin-top: -1.2rem;
          margin-left: 17.3rem;
          position: absolute;
        "
      >
        <el-button
          size="small"
          type="primary"
          @click="befoExport"
          :loading="exportLoading"
        >
          <i class="el-icon-upload2" />导出
        </el-button>
        <el-button
          icon="el-icon-delete-location"
          type="primary"
          @click="qiyongShow"
          >启用</el-button
        >
        <el-button
          icon="el-icon-warning-outline"
          type="primary"
          @click="tingyongShow"
          >停用</el-button
        >
        <el-button type="primary" @click="searDialogShow">
          <i class="el-icon-search"></i>搜索
        </el-button>
      </div>
    </div>
    <!-- 表格 -->
    <avue-crud
      v-if="ISLOAD"
      v-model="formData"
      :table-loading="tableLoading"
      :data="tableData"
      :page="page"
      :option="option"
      :searchShow="true"
      :before-open="beforeOpen"
      @row-del="rowDel"
      @row-update="rowUpdate"
      @row-save="rowSave"
      @on-load="onLoad"
      @sort-change="sortChange"
      @refresh-change="refreshChange"
      @cell-click="cellClick"
      @selection-change="selectionChange"
    >
      <template slot-scope="{ type, size }" slot="menu">
        <el-button
          icon="el-icon-sort"
          :size="size"
          :type="type"
          @click="cheliangyidong"
          >异动</el-button
        >
        <el-button
          icon="el-icon-edit"
          :size="size"
          :type="type"
          @click="TerminalShow"
          >终端编号</el-button
        >
      </template>
    </avue-crud>
    <!-- 弹框  -->
    <template>
      <!-- 搜索 弹框 -->
      <search-dialog ref="searchdialog" @getList="getList"></search-dialog>
      <!-- 导入 验证弹框 -->
      <import-dialog
        ref="importdialog"
        :exceljson="exceljson"
        @refreshChange="refreshChange"
      ></import-dialog>
      <!-- 异动 弹框 -->
      <y-ddialog
        :carID="carID"
        v-if="carRow"
        :carRow="carRow"
        ref="ydDialog"
      ></y-ddialog>
      <!-- 启用 弹框 -->
      <el-dialog :visible.sync="qiyongDialogVisible" width="23%" top="30vh">
        <span style="font-size: 17px;"
          ><i style="color:#E6A23C;" class="el-icon-warning"></i
          >确定将已选车辆状态改为
          <strong>在用</strong>
          吗？</span
        >
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="qiyongDialogVisible = false"
            >取 消</el-button
          >
          <el-button
            type="primary"
            :loading="qiyongLoading"
            @click="QiYongClick"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 停用 弹框 -->
      <el-dialog :visible.sync="tingyongDialogVisible" width="23%" top="30vh">
        <span style="font-size: 17px;"
          ><i style="color:#E6A23C;" class="el-icon-warning"></i
          >确定将已选车辆状态改为
          <strong>停用</strong>
          吗？</span
        >
        <span slot="footer" class="dialog-footer">
          <el-button @click="tingyongDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            :loading="tingyongLoading"
            @click="TingYongClick"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 终端编号 弹框 -->
      <el-dialog
        :visible.sync="TerminalVisible"
        width="27%"
        title="修改终端编号"
        top="30vh"
      >
        <div class="terminal">
          <div class="terminal-box">
            <span>原终端编号：</span>
            <el-input v-model="carRow.zongduanid" disabled></el-input>
          </div>
          <div class="terminal-box">
            <span>新终端编号：</span>
            <el-input
              v-model="terminalId"
              placeholder="请输入新终端编号"
            ></el-input>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="TerminalVisible = false">取 消</el-button>
          <el-button type="primary" @click="TerminalTrue">确 定</el-button>
        </span>
      </el-dialog>
    </template>
  </basic-container>
</template>

<script>
import XLSX from "xlsx";
import basics from "@/mixins/basics";
import { getToken } from "@/util/auth";
import axios from "axios";
import {
  getUpdateVehicleOutStatus,
  getUpdateVehicleScrapStatus,
  updateVehicleZongDuanId,
  getupdateVehicleSignStatus,
} from "@/api/basics";
import { export_json_to_excel } from "../Export2Excel";
import YDdialog from "./YDdialog";
import searchDialog from "./searchDialog";
import ImportDialog from "./ImportDialog";
export default {
  mixins: [basics],
  components: { YDdialog, searchDialog, ImportDialog },
  data() {
    return {
      treeData: [],
      exportLoading: false,
      carID: "",
      carRow: "",
      disabled: true,
      exceljson: "",
      // 表格附加请求头
      headers: {
        "blade-auth": "Bearer " + getToken(),
      },
      autoUpload: false,
      fileList: [],
      // 上传 附加参数
      pdata: {
        type: 0,
        userId: this.$store.getters.userInfo.userId,
        userName: this.$store.getters.userInfo.userName,
      },
      baseUrl: "/api",
      status: true,
      clientHeight: false,
      tingyongDialogVisible: false,
      qiyongDialogVisible: false,
      vehiclestatus: "",
      tingyunId: "",
      qiyongLoading: false,
      tingyongLoading: false,
      selectionId: "",
      TerminalVisible: false,
      terminalId: "",
    };
  },
  mounted() {
    this.INIT("vehicle-config");
  },
  created() {
    document.addEventListener("click", (e) => {
      if (e.target.className.indexOf("el-icon-search") != -1)
        this.clientHeight =
          document.getElementsByClassName("el-form").length === 0;
    });
  },
  computed: {},
  methods: {
    // 上传文件改变时得钩子
    onChange(files, fileList) {
      this.$refs.importdialog.centerDialogVisible = true;
      this.$refs.upload.submit();
      this.$refs.importdialog.tableUploadLoading = true;
      if (files.status === "ready") {
        return;
      }
      if (this.status) {
        this.status = false;
        if (files.status === "success") {
          this.$refs.importdialog.tableUploadLoading = false;
          this.fileList = fileList.slice(1);
        } else {
          this.$message.error("导入失败,请校验模板数据···");
          this.$refs.importdialog.disa = true;
          this.fileList = fileList.slice(1);
          this.$refs.importdialog.tableUploadLoading = false;
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
          this.exceljson = JSON.stringify(exl);
        } catch (e) {
          this.$message.error("出错了···");
          return false;
        }
      };
      fileReader.readAsBinaryString(file);
    },
    // 上传校验 成功
    uploadSuccess(res) {
      this.$refs.importdialog.tableUploadLoading = false;
      this.$refs.importdialog.tableDialogList = res.data;
      for (let i in res.data) {
        if (res.data[i].msg !== "") {
          this.$refs.importdialog.tableDialogList[
            i
          ].msg2 = require("A/icon/no.png");
        } else {
          this.$refs.importdialog.tableDialogList[
            i
          ].msg2 = require("A/icon/yes.png");
        }
      }
      if (res.code == 200) {
        this.$refs.importdialog.disa = false;
        this.$message.success("数据验证成功···");
      } else {
        this.$refs.importdialog.disa = true;
        this.$message.error("导入数据有误，请重新校验···");
        this.$refs.importdialog.dialogMessage = res.msg;
      }
    },
    // 搜索弹出框
    searDialogShow() {
      this.$refs.searchdialog.searchVisible = true;
    },
    // 表格模板下载
    DowInfo() {
      window.open(
        this.$store.getters.userInfo.urlPrefix +
          "SafetyStandards/模板/导入车辆资料模板（跨公司）.xls"
      );
    },
    // 操作栏 异动 获取车辆异动树
    cheliangyidong() {
      this.$refs.ydDialog.dialogVisible = true;
      this.$refs.ydDialog.getYDtreeList();
    },
    // 当前单元格被点击 获取车辆id
    cellClick(row, colm) {
      this.carID = row.id;
      this.carRow = row;
    },
    // 多选框 选中数据
    selectionChange(list) {
      this.selectionId = list;
      // list.forEach((item) => (this.selectionId += `${item.id},`));
    },
    // 启用 弹出框显示
    qiyongShow() {
      if (this.selectionId.length == 0) {
        this.$message.warning("请先选择数据···");
      } else {
        let status = this.selectionId.every((item) => {
          return item.cheliangzhuangtai == "1";
        });
        if (status) {
          this.qiyongDialogVisible = true;
        } else {
          this.$message.warning("您选择得数据中包含‘在用’车辆");
        }
      }
    },
    // 停用 弹出框显示
    tingyongShow() {
      if (this.selectionId.length == 0) {
        this.$message.warning("请先选择数据···");
      } else {
        let status = this.selectionId.every((item) => {
          return item.cheliangzhuangtai == "0";
        });
        if (status) {
          this.tingyongDialogVisible = true;
        } else {
          this.$message.warning("您选择得数据中包含‘停用’车辆");
        }
      }
    },
    // 终端编号 弹出框显示
    TerminalShow() {
      this.TerminalVisible = true;
    },
    // 终端编号 确定
    TerminalTrue() {
      if (this.terminalId == "") return this.$message.warning("请输入终端编号");
      if (this.terminalId !== this.carRow.zongduanid) {
        updateVehicleZongDuanId(
          this.carID,
          this.terminalId,
          this.$store.state.user.userInfo.userId,
          this.$store.getters.userInfo.userName
        ).then((res) => {
          this.TerminalVisible = false;
          this.terminalId = "";
          this.$message({
            message: res.data.msg,
            type: "success",
          });
          this.getList({ searchMsg: this.$refs.searchdialog.searchMsg });
        });
      } else {
        this.terminalId = "";
        this.$message.warning("原终端编号与新终端编号一致，请重新输入");
      }
    },
    // 启用 弹出框点击事件
    QiYongClick() {
      this.qiyongLoading = true;
      let vehicleId = [];
      this.selectionId.forEach((item) => (vehicleId += `${item.id},`));
      getupdateVehicleSignStatus(vehicleId).then((res) => {
        if (res.data.code == 200) {
          this.$message.success(res.data.msg);
          this.qiyongLoading = false;
          this.qiyongDialogVisible = false;
          this.getList({ searchMsg: this.$refs.searchdialog.searchMsg });
        } else {
          this.$message.error("出错了···");
          this.qiyongLoading = false;
        }
      });
    },
    // 停用 弹出框点击事件
    TingYongClick() {
      this.tingyongLoading = true;
      let vehicleId = [];
      this.selectionId.forEach((item) => (vehicleId += `${item.id},`));
      getUpdateVehicleOutStatus(vehicleId).then((res) => {
        if (res.data.code == 200) {
          this.$message.success(res.data.msg);
          this.tingyongLoading = false;
          this.tingyongDialogVisible = false;
          this.getList({ searchMsg: this.$refs.searchdialog.searchMsg });
        } else {
          this.$message.error("出错了···");
          this.tingyongLoading = false;
        }
      });
    },
    //  导出表格
    befoExport() {
      this.exportLoading = true;
      axios({
        url: "/api/blade-platform/platform/vehicle/list",
        method: "post",
        data: {
          current: 0,
          deptId: this.deptId,
          size: 0,
          deptName: this.$refs.searchdialog.searchMsg.deptName,
          cheliangpaizhao: this.$refs.searchdialog.searchMsg.cheliangpaizhao,
          caozuoshijian: this.$refs.searchdialog.searchMsg.caozuoshijian,
          zongduanid: this.$refs.searchdialog.searchMsg.zongduanid,
          cheliangzhuangtai: this.$refs.searchdialog.searchMsg
            .cheliangzhuangtai,
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
          "车辆牌照",
          "车牌颜色",
          "使用性质",
          "驾驶员名称",
          "车辆类型",
          "厂牌",
          "运营商",
          "终端id",
          "车架号",
          "4G视频地址",
          "驾驶员电话",
          "押运员",
          "押运员电话",
          "车主",
          "车主电话",
          "创建时间",
        ];
        const filterVal = [
          "deptName",
          "cheliangpaizhao",
          "chepaiyanse",
          "shiyongxingzhi",
          "jiashiyuanxingming",
          "xinghao",
          "changpai",
          "yunyingshangmingcheng",
          "zongduanid",
          "chejiahao",
          "yunyingshang",
          "jiashiyuandianhua",
          "yayunyuanxingming",
          "yayunyuandianhua",
          "chezhu",
          "chezhudianhua",
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
          "I1:I2",
          "J1:J2",
          "K1:K2",
          "L1:L2",
          "M1:M2",
          "N1:N2",
          "O1:O2",
          "P1:P2",
          "Q1:Q2",
        ];
        const data = this.formatJson(filterVal, list);
        export_json_to_excel({
          multiHeader2,
          header: multiHeader2,
          data,
          filename: "车辆信息",
          merges,
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.vehicle {
  padding: 0 15px;
  .operation-model {
    display: flex;
    position: relative;
    top: 33px;
    left: 2px;
    z-index: 999;
    .el-button {
      cursor: pointer;
    }
  }
  .changeClass {
    color: red;
  }
  .dialog-footer {
    margin: 0.1rem auto;
  }
  .el-button + .el-button {
    margin-left: 11px;
  }
  .terminal {
    width: 100%;
    display: flex;
    flex-direction: column;
    .terminal-box {
      width: 100%;
      display: flex;
      line-height: 6vh;
      span {
        white-space: nowrap;
        line-height: 6vh;
      }
    }
  }
}
</style>
<style>
.el-table__row {
  height: 60px;
}
.el-message-box__wrapper {
  top: -15rem;
}
.el-message-box__message p {
  font-size: 17px;
}
.el-message-box__content {
  padding: 23px 15px;
}
</style>
