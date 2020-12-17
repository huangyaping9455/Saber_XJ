<template>
  <basic-container>
    <div
      class="operation-model"
      :class="{ heightTop: clientHeight }"
      v-if="ISLOAD"
    >
      <el-upload
        style="margin-left: 6rem; display: flex; margin-top: -1.2rem"
        :action="baseUrl + '/blade-platform/platform/vehicle/vehicleImport'"
        :data="pdata"
        name="file"
        :show-file-list="false"
        :headers="headers"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :on-change="onChange"
        :on-exceed="handleExceed"
        :on-success="uploadSuccess"
        :file-list="fileList"
        :before-upload="beforeUpload"
        :auto-upload="autoUpload"
        :limit="100"
        ref="upload"
      >
        <el-button size="small" type="primary" @click="befoUpload">
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
        <el-input
          style="margin-left: 0.63rem; line-height: 33px;width:150px;"
          v-model="tableDeptName"
          placeholder="请输入企业名称"
          clearable
        ></el-input>
        <el-input
          v-model="tablechepai"
          placeholder="请输入车辆牌照"
          style="margin: 0 0.6rem; line-height: 33px;width:150px;"
          clearable
        ></el-input>
        <el-date-picker
          v-model="caozuoshijian"
          type="date"
          style="line-height: 33px;width:155px;"
          value-format="yyyy-MM-dd"
          placeholder="请选择操作时间"
        >
        </el-date-picker>
        <el-input
          v-model="zongduanid"
          placeholder="请输入终端id"
          style="margin: 0 0.6rem; line-height: 33px;width:150px;"
          clearable
        ></el-input>
        <el-button type="primary" @click="searchChange">
          <i class="el-icon-search"></i>搜索
        </el-button>
      </div>
    </div>

    <el-dialog
      title="请确认导入信息"
      :visible.sync="centerDialogVisible"
      width="60%"
      center
    >
      <el-table
        v-loading="tableUploadLoading"
        :data="tableDialogList"
        @cell-mouse-enter="cellMouseEnter"
        border
        style="width: 100%; max-height: 494px; overflow-y: scroll"
      >
        <el-table-column label="状态" width="55px">
          <template slot-scope="scope">
            <el-popover placement="right" width="200" trigger="hover">
              <img
                slot="reference"
                :src="scope.row.msg2"
                style="width: 1.5rem"
                alt
              />
              <span style="max-height: 50px; color: red">
                {{ scope.row.msg }}
              </span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="deptName" label="机构名称"></el-table-column>
        <el-table-column
          prop="cheliangpaizhao"
          label="车辆牌照"
        ></el-table-column>
        <el-table-column prop="chepaiyanse" label="车牌颜色"></el-table-column>
        <el-table-column
          prop="shiyongxingzhi"
          label="使用性质"
        ></el-table-column>
        <el-table-column
          prop="jiashiyuanxingming"
          label="驾驶员姓名"
        ></el-table-column>
        <el-table-column prop="xinghao" label="车辆类型"></el-table-column>
        <el-table-column prop="changpai" label="厂牌"></el-table-column>
        <el-table-column prop="chejiahao" label="车架号"></el-table-column>
        <el-table-column
          prop="yunyingshangmingcheng"
          label="运营商名称"
        ></el-table-column>
        <el-table-column prop="zongduanid" label="终端编号"></el-table-column>
        <el-table-column
          prop="yunyingshang"
          label="4G视频地址"
        ></el-table-column>
        <el-table-column
          prop="jiashiyuandianhua"
          label="驾驶员电话"
        ></el-table-column>
        <el-table-column
          prop="yayunyuanxingming"
          label="押运员"
        ></el-table-column>
        <el-table-column
          prop="yayunyuandianhua"
          label="押运员电话"
        ></el-table-column>
        <el-table-column prop="chezhu" label="车主"></el-table-column>
        <el-table-column
          prop="chezhudianhua"
          label="车主电话"
        ></el-table-column>
      </el-table>
      <div class="dialog-message">
        验证信息：<span>{{ dialogMessage }}</span>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
        style="display: flex; justify-content: center"
      >
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-upload
          style="width: 100px"
          :action="baseUrl + '/blade-platform/platform/vehicle/vehicleImport'"
          :data="pdata2"
          name="file"
          :show-file-list="false"
          :headers="headers"
          :auto-upload="true"
          :on-success="uploadSu"
          :on-error="uploadEr"
          :limit="100"
          ref="uploads"
          :disabled="disa"
        >
          <el-button
            type="primary"
            @click="TrueClick"
            :loading="uploadtureloading"
            :disabled="disa"
            >确认上传</el-button
          >
        </el-upload>
      </span>
    </el-dialog>
    <avue-crud
      v-if="ISLOAD"
      v-model="formData"
      :table-loading="tableLoading"
      :data="tableData"
      :page="page"
      :option="option"
      :searchShow="true"
      @rowExcel="rowExcel"
      @row-del="rowDel"
      @row-update="rowUpdate"
      @row-save="rowSave"
      @on-load="onLoad"
      @sort-change="sortChange"
      @refresh-change="refreshChange"
      @cell-click="cellClick"
    >
      <template slot-scope="{ type, size }" slot="menu">
        <el-button
          icon="el-icon-sort"
          :size="size"
          :type="type"
          @click="cheliangyidong"
          >异动</el-button
        >
      </template>
    </avue-crud>
    <template>
      <el-dialog title="车辆异动" :visible.sync="dialogVisible" width="50%">
        <div style="display: flex; flex-direction: column">
          <el-tree
            style="max-height: 600px; overflow: auto"
            :data="treeData"
            :props="defaultProps"
            :show-checkbox="showBox"
            node-key="id"
            v-loading="loading"
            @check="checkNode"
            :check-strictly="true"
            ref="tree"
          ></el-tree>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="moveTreeOrgan">异 动</el-button>
          </span>
        </div>
      </el-dialog>
    </template>
  </basic-container>
</template>

<script>
import basics from "@/mixins/basics";
import { getToken } from "@/util/auth";
import axios from "axios";
import { export_json_to_excel } from "./Export2Excel";

export default {
  mixins: [basics],
  data() {
    return {
      tablechepai: "",
      tableDeptName: "",
      caozuoshijian: "",
      zongduanid: "",
      // 导入 弹出层
      centerDialogVisible: false,
      // 异动 弹出层
      dialogVisible: false,
      // 异动 树
      defaultProps: {
        children: "children",
        label: "title",
        disabled: this.disabledFN,
      },
      treeData: [
        {
          id: 1,
          label: "一级 2",
          children: [
            {
              id: 3,
              label: "二级 2-1",
              children: [
                {
                  id: 4,
                  label: "三级 3-1-1",
                },
                {
                  id: 5,
                  label: "三级 3-1-2",
                },
              ],
            },
            {
              id: 2,
              label: "二级 2-2",
              children: [
                {
                  id: 6,
                  label: "三级 3-2-1",
                },
                {
                  id: 7,
                  label: "三级 3-2-2",
                },
              ],
            },
          ],
        },
      ],
      loading: false,
      tableUploadLoading: false,
      exportLoading: false,
      uploadtureloading: false,
      carID: "",
      qiyeId: "",
      showBox: true,
      disabled: true,
      exceljson: "",
      dialogMessage: "",
      // 表格附加请求头
      headers: {
        "blade-auth": "Bearer " + getToken(),
      },
      tableDialogList: [{}],
      autoUpload: false,
      disa: false,
      fileList: [],
      // 上传 附加参数
      pdata: {
        type: 0,
        userId: this.$store.getters.userInfo.userId,
        userName: this.$store.getters.userInfo.userName,
      },
      pdata2: {
        type: 1,
        userId: this.$store.getters.userInfo.userId,
        userName: this.$store.getters.userInfo.userName,
      },
      baseUrl: "/api",
      status: true,
      clientHeight: false,
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
    handleRemove() {},
    handlePreview() {},
    handleExceed() {},
    beforeRemove() {},
    befoUpload() {},
    // 上传文件改变时得钩子
    onChange(files, fileList) {
      this.centerDialogVisible = true;
      this.$refs.upload.submit();
      this.tableUploadLoading = true;
      if (files.status === "ready") {
        return;
      }
      if (this.status) {
        this.status = false;
        if (files.status === "success") {
          this.$message.success("验证结束···"); //files.response.msg
          this.tableUploadLoading = false;
          this.fileList = fileList.slice(1);
        } else {
          this.$message.warning("导入失败");
          this.fileList = fileList.slice(1);
          this.tableUploadLoading = false;
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
          console.log("出错了···");
          return false;
        }
      };
      fileReader.readAsBinaryString(file);
    },
    // 上传校验 成功
    uploadSuccess(res) {
      this.tableUploadLoading = false;
      this.tableDialogList = res.data;
      for (let i in res.data) {
        if (res.data[i].msg !== "") {
          this.tableDialogList[
            i
          ].msg2 = require("../../../../src/assets/icon/no.png");
        } else {
          this.tableDialogList[
            i
          ].msg2 = require("../../../../src/assets/icon/yes.png");
        }
      }
      if (res.code == 200) {
        this.disa = false;
        this.$message.success("数据验证成功···");
      } else {
        this.disa = true;
        this.$message.error("导入数据有误，请重新校验···");
        this.dialogMessage = res.msg;
      }
    },
    //  上传 成功
    uploadSu(res) {
      if (res.code === 200) {
        this.centerDialogVisible = false;
        this.refreshChange();
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    },
    // 上传 失败
    uploadEr(rej) {
      this.$message.error("导入失败···");
    },
    // 确认上传
    TrueClick() {
      this.uploadtureloading = true;
      if (this.disa == true) {
        this.$message.error("导入信息有误,请校验···");
      } else {
        this.uploadtureloading = false;
      }
    },
    // 鼠标移入 行 时触发
    cellMouseEnter(row) {
      // this.$message.warning(row.msg);
    },
    // 表格模板下载
    DowInfo() {
      window.open(
        this.$store.getters.userInfo.urlPrefix +
          "SafetyStandards/模板/导入车辆资料模板（跨公司）.xls"
      );
    },
    rowExcel() {
      console.log("7");
    },
    // 操作栏 异动 获取车辆异动树
    cheliangyidong() {
      this.loading = true;
      this.dialogVisible = true;
      axios({
        method: "get",
        url: "/api/blade-system/dept/YDtree",
        params: {
          postId: this.postId,
        },
      }).then((res) => {
        this.treeData = res.data.data;
        this.loading = false;
      });
    },
    // 车辆异动 点击事件
    moveTreeOrgan() {
      if (!this.qiyeId) {
        return this.$message.warning("必须选中一条机构信息");
      }
      this.loading = true;
      axios({
        method: "post",
        url: "/api/blade-platform/platform/vehicle/updateDeptId",
        params: {
          deptId: this.qiyeId,
          id: this.carID,
        },
      }).then((res) => {
        let is = res.data.success;
        this.loading = false;
        this.dialogVisible = false;
        this.refreshChange();
        this.$message({
          type: is ? "success" : "error",
          message: res.data.msg,
        });
      });
    },
    // 树结构 父节点禁用方法
    disabledFN(treedata) {
      if (treedata.children.length !== 0) {
        return true;
      } else {
        return false;
      }
    },
    // 当前车辆异动树 选择得机构id
    checkNode(data, val) {
      this.qiyeId = data.id;
      let checkedkeys = val.checkedkeys;
      let currkey = data.id;
      this.$refs.tree.setCheckedKeys([currkey]);
    },
    // 当前单元格被点击 获取车辆id
    cellClick(row, colm) {
      this.carID = row.id;
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
          deptName: this.tableDeptName,
          cheliangpaizhao: this.tablechepai,
          caozuoshijian: this.caozuoshijian,
          zongduanid: this.zongduanid,
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
        // const list = this.goodsItems;
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
.operation-model {
  display: flex;
  position: relative;
  top: 83px;
  // left: 100px;
  z-index: 999;
  .el-button {
    cursor: pointer;
  }
}
// .heightTop {
//   top: 116px;
// }
.changeClass {
  color: red;
}
.dialog-message {
  height: 3rem;
  width: 100%;
  border: 1px solid #ebeef5;
  padding: 3px;
  span {
    color: red;
  }
}
.dialog-footer {
  margin: 0.1rem auto;
}
.el-button + .el-button {
  margin-left: 11px;
}

@media screen and (max-height: 1920px) {
  // .el-upload {
  //   // margin-top: 6.5px;
  // }
}
</style>
<style>
/* .el-table__body-wrapper,
.el-table__fixed-body-wrapper {
  max-height: 65vh;
  overflow: scroll;
}

.el-table__body-wrapper {
  width: 102%;
} */
.el-table__row {
  height: 60px;
}
</style>
