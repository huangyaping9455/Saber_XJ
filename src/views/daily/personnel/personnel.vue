<template>
  <div class="applist">
    <div class="app-text">
      <div class="person-head">
        <div class="person-head-left">
          <div class="person-head-input">
            <span>单位查询：</span>
            <el-input
              v-model="deptname"
              placeholder="请输入单位"
              clearable
            ></el-input>
          </div>
          <div class="person-head-input">
            <span>登录账号：</span>
            <el-input
              v-model="account"
              placeholder="请输入账号"
              clearable
            ></el-input>
          </div>
          <div class="person-head-input">
            <span>姓 名：</span>
            <el-input
              v-model="name"
              placeholder="请输入姓名"
              clearable
            ></el-input>
          </div>
          <div class="person-head-input">
            <span>状 态：</span>
            <el-select v-model="zhuangtai" clearable placeholder="请选择状态">
              <el-option
                v-for="item in zhuangtais"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              >
              </el-option>
            </el-select>
          </div>
          <el-button type="primary" @click="refreshList">
            <i class="el-icon-search"></i>查询
          </el-button>
          <el-button type="primary" @click="enableShow">
            <i class="el-icon-unlock"></i>启用
          </el-button>
          <el-button type="primary" @click="disableShow">
            <i class="el-icon-lock"></i>禁用
          </el-button>
        </div>
        <div class="person-head-right">
          <el-button type="primary" @click="befoExport" :loading="exportLoading"
            ><i class="el-icon-download"></i>下载</el-button
          >
          <el-tooltip content="刷新" placement="top" style="margin-right: 1rem">
            <el-button
              type="primary"
              icon="el-icon-refresh"
              circle
              @click="refreshList"
            ></el-button>
          </el-tooltip>
        </div>
      </div>
      <!-- 表格 -->
      <el-table
        border
        :data="tableData"
        style="width: 100%"
        v-loading="loading"
        :height="caleHeight"
        ref="table"
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" width="30">
        </el-table-column>
        <el-table-column
          type="index"
          align="center"
          label="序号"
          width="50"
          :index="(current - 1) * size + 1"
        ></el-table-column>
        <!-- <el-table-column
          align="center"
          prop="id"
          label="人员ID"
          width="60"
        ></el-table-column> -->
        <el-table-column
          align="center"
          prop="deptName"
          label="所属单位"
          show-overflow-tooltip="true"
          width="270"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="姓名"
          show-overflow-tooltip="true"
          width="110"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="account"
          label="登录账号"
          width="110"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="postName"
          label="人员类型"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="zhuangtai"
          label="状态"
          width="60"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="phone"
          label="手机号码"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="createTimes"
          label="创建时间"
          show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="updateTimes"
          label="操作时间"
          show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column fixed="right" width="130" align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click.native.prevent="deleteRows(scope.$index, tableData)"
              size="small"
            >
              重置密码
            </el-button>
            <el-button
              type="text"
              @click="deleteRow(scope.$index, tableData)"
              size="small"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="删除"
        :visible.sync="centerDialogVisible"
        width="30%"
        center
      >
        <span style="font-size:20px;text-align:center;">
          <i style="color:red;" class="el-icon-warning-outline"></i>
          确定要删除吗？
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="trueDeleteRow">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="重置密码"
        :visible.sync="centerDialogVisibles"
        width="30%"
        center
      >
        <span style="font-size:20px;text-align:center;">
          <i style="color:red;" class="el-icon-warning-outline"></i>
          确定要重置密码吗？
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisibles = false">取 消</el-button>
          <el-button type="primary" @click="trueDeleteRows">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="启用"
        :visible.sync="enableDialogVisibles"
        width="30%"
        center
      >
        <span style="font-size:20px;text-align:center;">
          <i style="color:red;" class="el-icon-warning-outline"></i>
          确定要将选中项状态改为启用吗？
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="enableDialogVisibles = false">取 消</el-button>
          <el-button type="primary" @click="trueEnable">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="启用"
        :visible.sync="disableDialogVisibles"
        width="30%"
        center
      >
        <span style="font-size:20px;text-align:center;">
          <i style="color:red;" class="el-icon-warning-outline"></i>
          确定要将选中项状态改为禁用吗？
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="disableDialogVisibles = false">取 消</el-button>
          <el-button type="primary" @click="truedisable">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分页 -->
      <el-pagination
        style="float: right; padding: 10px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="current"
        :page-sizes="[20, 50, 100, 200]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import {
  getListProson,
  Prosonremove,
  Prosonrepsd,
  updateUserStatus,
} from "@/api/dept/noticelist";
import { getToken } from "@/util/auth";
import { export_json_to_excel } from "../vehicle/Export2Excel";
let date = new Date();
export default {
  data() {
    return {
      loading: false,
      exportLoading: false,
      current: 1,
      size: 20,
      total: 1,
      deptname: "",
      name: "",
      account: "",
      zhuangtai: "",
      zhuangtais: [
        { value: 0, label: "启用" },
        { value: 1, label: "禁用" },
      ],
      caleHeight: 670,
      centerDialogVisible: false,
      centerDialogVisibles: false,
      lineData: "",
      tableData: [{}],
      selectable: "",
      enableDialogVisibles: false,
      disableDialogVisibles: false,
    };
  },
  computed: {},
  mounted() {
    this.onLoad();
    this.$nextTick(function() {
      this.caleHeight =
        window.innerHeight - this.$refs.table.$el.offsetTop - 130;
      // 监听窗口大小变化
      let self = this;
      window.onresize = function() {
        self.caleHeight =
          window.innerHeight - self.$refs.table.$el.offsetTop - 130;
      };
    });
  },
  methods: {
    // 列表数据
    onLoad() {
      this.loading = true;
      let deptId = this.$store.getters.deptId;
      let current = this.current;
      let size = this.size;
      let deptName = this.deptname;
      let account = this.account;
      let realName = this.name;
      getListProson(
        deptId,
        current,
        size,
        deptName,
        account,
        realName,
        this.zhuangtai
      ).then((res) => {
        this.loading = false;
        const data = res.data.data;
        this.total = data.total;
        this.size = data.size;
        this.current = data.current;
        this.tableData = data.records;
      });
    },
    // 每页显示条数改变
    handleSizeChange(val) {
      this.size = val;
      this.onLoad();
    },
    // 当前页改变
    handleCurrentChange(val) {
      this.current = val;
      this.onLoad();
    },
    //列表 刷新
    refreshList() {
      this.current = 1;
      this.onLoad();
    },
    // 删除
    deleteRow(index, data) {
      this.centerDialogVisible = true;
      this.lineData = data[index];
    },
    // 重置密码
    deleteRows(index, data) {
      this.lineData = data[index];
      this.centerDialogVisibles = true;
    },
    // 确认删除
    trueDeleteRow() {
      let bladeUser = "Bearer " + getToken();
      updateUserStatus(this.lineData.id, "删除", bladeUser).then((res) => {
        if (res.data.code === 200) {
          this.$message.success(res.data.msg);
          this.centerDialogVisible = true;
          this.onLoad();
        } else {
          this.$message.success(res.data.msg);
          this.centerDialogVisible = true;
        }
      });
    },
    // 确认重置密码
    trueDeleteRows() {
      Prosonrepsd(this.lineData.id).then((res) => {
        if (res.data.code == 200) {
          this.centerDialogVisibles = false;
          this.refreshList();
        } else {
          this.$message.error("出错了");
        }
      });
    },
    // 勾选数据变化
    handleSelectionChange(val) {
      this.selectable = val;
    },
    // 启用 显示
    enableShow() {
      if (this.selectable.length == 0) {
        this.$message.warning("请先选择数据···");
      } else {
        let status = this.selectable.every((item) => {
          return item.zhuangtai == "禁用";
        });
        if (status) {
          this.enableDialogVisibles = true;
        } else {
          this.$message.warning("您选择得数据中包含‘已启用’的数据");
        }
      }
    },
    // 禁用 显示
    disableShow() {
      if (this.selectable.length == 0) {
        this.$message.warning("请先选择数据···");
      } else {
        let status = this.selectable.every((item) => {
          return item.zhuangtai == "启用";
        });
        if (status) {
          this.disableDialogVisibles = true;
        } else {
          this.$message.warning("您选择得数据中包含‘已禁用’的数据");
        }
      }
    },
    // 启用 确定
    trueEnable() {
      let userId = [];
      this.selectable.forEach((item) => (userId += `${item.id},`));
      let bladeUser = "Bearer " + getToken();
      // this.$store.getters.userInfo
      updateUserStatus(userId, "启用", bladeUser).then((res) => {
        if (res.data.code === 200) {
          this.$message.success(res.data.msg);
          this.enableDialogVisibles = false;
          this.$refs.table.clearSelection();
          this.onLoad();
        } else {
          this.$message.success(res.data.msg);
          this.enableDialogVisibles = false;
        }
      });
    },
    // 禁用 确定
    truedisable() {
      let userId = [];
      this.selectable.forEach((item) => (userId += `${item.id},`));
      let bladeUser = "Bearer " + getToken();
      // this.$store.getters.userInfo
      updateUserStatus(userId, "禁用", bladeUser).then((res) => {
        if (res.data.code === 200) {
          this.$message.success(res.data.msg);
          this.disableDialogVisibles = false;
          this.$refs.table.clearSelection();
          this.onLoad();
        } else {
          this.$message.success(res.data.msg);
          this.disableDialogVisibles = false;
        }
      });
    },
    //  导出表格
    befoExport() {
      this.exportLoading = true;
      let deptId = this.$store.getters.deptId;
      let current = 0;
      let size = 0;
      let deptName = this.deptname;
      let account = this.account;
      let realName = this.name;
      getListProson(deptId, current, size, deptName, account, realName).then(
        (res) => {
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
        }
      );
    },
    //处理下载数据
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    export2Excel(list) {
      require.ensure([], () => {
        const multiHeader2 = [
          "人员ID",
          "所属单位",
          "姓名",
          "登录账号",
          "人员类型",
          "状态",
          "手机号码",
          "创建时间",
          "操作时间",
        ];
        const filterVal = [
          "id",
          "deptName",
          "name",
          "account",
          "postName",
          "zhuangtai",
          "phone",
          "createTimes",
          "updateTimes",
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
        ];
        // const list = this.goodsItems;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel({
          multiHeader2,
          header: multiHeader2,
          data,
          filename: "人员信息",
          merges,
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.applist {
  border-radius: 15px;
  width: 100%;
  background: white;
  padding: 1rem;
  height: 100%;
  .app-text {
    padding: 0.5rem;
    .person-head {
      display: flex;
      justify-content: space-between;
      height: 33px;
      .person-head-left {
        display: flex;
        width: auto;
        .person-head-input {
          display: flex;
          margin-right: 10px;
          span {
            text-align: end;
            line-height: 30px;
            font-weight: 500;
          }
          .el-input {
            width: 12vh;
          }
          .el-select {
            width: 12vh;
          }
        }
        /deep/ .el-button {
          i {
            margin-right: 0.2vh;
          }
        }
      }
    }
    .el-table {
      z-index: 0;
      margin-top: 0.3rem;
    }
  }
  .modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    .modal {
      background: #ffffff;
      box-shadow: 2px 2px 20px 1px;
      overflow-x: auto;
      display: flex;
      flex-direction: column;
      .modal-header,
      .modal-footer {
        padding: 1.5rem;
        display: flex;
      }
      .modal-header {
        display: block;
        border-bottom: 1px solid #eeeeee;
        color: #4aae9b;
        justify-content: space-between;
        .btn-close {
          position: relative;
          float: right;
          border: none;
          font-size: 20px;
          margin-left: 5rem;
          margin-top: -10px;
          cursor: pointer;
          font-weight: bold;
          color: #4aae9b;
          background: transparent;
        }
      }
      .modal-footer {
        justify-content: center;
        align-items: flex-end;
        .btn-green {
          color: white;
          border-radius: 2px;
        }
      }
      .modal-body {
        padding: 0.5rem;
      }
    }
    .modal-fade-enter,
    .modal-dade-leave-active {
      opacity: 0;
    }
  }
}
</style>
