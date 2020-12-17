<template>
  <basic-container>
    <div
      class="operation-model"
      :class="{ heightTop: clientHeight }"
      v-if="ISLOAD"
    >
      <el-upload
        style="
          margin-left: 5.85rem;
          width: auto;
          display: flex;
          margin-top: -1.2rem;
        "
        :action="baseUrl + '/blade-platform/platform/jiashiyuan/driverImport'"
        :data="pdata"
        name="file"
        :headers="headers"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :on-change="onChange"
        :limit="1"
        :on-exceed="handleExceed"
        :file-list="fileList"
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
          margin-left: 17.1rem;
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
        <el-input
          v-model="driveSearchChange"
          placeholder="请输入搜索内容"
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
      @row-del="rowDel"
      @row-update="rowUpdate"
      @row-save="rowSave"
      @on-load="onLoad"
      @sort-change="sortChange"
      @refresh-change="refreshChange"
    >
      <template slot-scope="scope" slot="menu">
        <!-- <el-button
          icon="el-icon-tickets"
          :type="scope.type"
          :size="scope.size"
          @click="JSYVehicle(scope)"
          >绑定车辆</el-button
        > -->
        <el-button
          icon="el-icon-refresh-right"
          :type="scope.type"
          :size="scope.size"
          @click="JSYreset(scope)"
          >重置密码</el-button
        >
      </template>
    </avue-crud>
    <!-- <el-dialog
      title="绑定车辆"
      :visible.sync="vehicleDialogVisible"
      :destroy-on-close="true"
      :center="true"
      width="30%"
    >
      <el-table
        :data="vehicletableData"
        border
        v-loading="vehicleLoading"
        height="342"
        style="width: 100%"
      >
        <el-table-column prop="cheliangpaizhao" align="center" label="车辆牌照">
        </el-table-column>
        <el-table-column prop="chepaiyanse" align="center" label="车牌颜色">
        </el-table-column>
        <el-table-column prop="shiyongxingzhi" align="center" label="使用性质">
        </el-table-column>
      </el-table>
    </el-dialog> -->
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
  </basic-container>
</template>

<script>
import basics from "@/mixins/basics";
// import store from "@/store/";
import { getToken } from "@/util/auth";
// import request from "@/router/axios";
import axios from "axios";
import { getJSYByVehicle, resetPassword } from "@/api/dept/noticelist";
import { export_json_to_excel } from "../vehicle/Export2Excel";
export default {
  name: "driver",
  mixins: [basics],
  data() {
    return {
      exportLoading: false,
      headers: {
        "blade-auth": "Bearer " + getToken(),
      },
      fileList: [],
      pdata: {
        // deptId: "",
        // deptName: ""
      },
      // baseUrl: "http://60.171.241.126:8200",
      baseUrl: "/api",
      // baseUrl: "http://36.133.38.92:8200",
      status: true,
      clientHeight: false,
      // vehicleDialogVisible: false,
      resetDialogVisible: false,
      // vehicletableData: [],
      resetmima: "",
      // vehicleLoading: false,
      resetLoading: false,
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
    this.INIT();
  },
  methods: {
    handleRemove(file, fileList) {},
    handlePreview(file) {},
    handleExceed(files, fileList) {},
    beforeRemove(file, fileList) {},
    onChange(files, fileList) {
      if (files.status === "ready") {
        return;
      }
      if (this.status) {
        this.status = false;
        if (files.status === "success") {
          this.$message.success(files.response.msg);
        } else {
          this.$message.warning("导入失败");
        }
        setTimeout(() => {
          this.status = true;
        }, 1500);
      }
    },
    // 绑定车辆
    // JSYVehicle(data) {
    //   this.vehicleDialogVisible = true;
    //   this.vehicleLoading = true;
    //   getJSYByVehicle(data.row.id).then((res) => {
    //     if (res.data.code == 200) {
    //       this.vehicleLoading = false;
    //       this.vehicletableData = res.data.data;
    //     } else {
    //       this.vehicleLoading = false;
    //       this.$message.error(res.data.msg);
    //       this.vehicletableData = [];
    //     }
    //   });
    // },
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
.operation-model {
  display: flex;
  position: relative;
  top: 83px;
  // left: 1vw;
  z-index: 999;
  .el-button {
    cursor: pointer;
  }
}
// .heightTop {
//   top: 116px;
// }
</style>
<style>
.el-table__row {
  height: 60px;
}
</style>
