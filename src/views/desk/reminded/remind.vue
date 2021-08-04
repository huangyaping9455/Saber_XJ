<template>
  <div class="applist">
    <div class="app-text">
      <div class="person-head">
        <div class="person-head-left">
          <div class="person-head-input">
            <span>预警项：</span>
            <el-input
              v-model="account"
              placeholder="请输入预警项"
              clearable
            ></el-input>
          </div>
          <div class="person-head-input">
            <el-button type="primary" @click="refreshList">
              <i class="el-icon-search"></i>查询
            </el-button>
            <el-button type="primary" @click="addRow" size="small">
              <i class="el-icon-plus"></i>新增
            </el-button>
            <el-button type="primary" @click="showPostTree">
              <i class="el-icon-setting"></i>权限
            </el-button>
          </div>
        </div>
        <div class="person-head-right">
          <el-button
            type="primary"
            :disabled="true"
            @click="befoExport"
            :loading="exportLoading"
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
        <el-table-column
          align="center"
          type="selection"
          width="50"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="yujingxiang"
          label="预警项"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="yujingfenlei"
          label="预警分类"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="title"
          label="说明"
          width=""
        ></el-table-column>
        <el-table-column
          align="center"
          prop="caozuoshijian"
          label="更新时间"
          width="270"
        ></el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="230">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="viewRow(scope.$index, tableData)"
              size="small"
            >
              查看
            </el-button>
            <el-button
              type="text"
              @click="updateRow(scope.$index, tableData)"
              size="small"
            >
              编辑
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
      <!-- 删除弹框 -->
      <el-dialog
        title="删除"
        :visible.sync="centerDialogVisible"
        width="30%"
        center
      >
        <span style="font-size:20px;text-align:center;"
          ><i style="color:red;" class="el-icon-warning-outline"></i
          >确定要删除吗？</span
        >
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="trueDeleteRow">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 查看和编辑弹框 -->
      <el-dialog
        :title="headtext"
        :visible.sync="addDialogVisible"
        width="30%"
        center
      >
        <el-form
          :label-position="labelPosition"
          label-width="80px"
          :model="formLabelAlign"
          :rules="rules"
          ref="remindform"
        >
          <el-form-item label="预警项" prop="name">
            <el-input
              v-model="formLabelAlign.name"
              :disabled="disabled"
            ></el-input>
          </el-form-item>
          <el-form-item label="预警分类" prop="region">
            <el-input
              v-model="formLabelAlign.region"
              :disabled="disabled"
            ></el-input>
          </el-form-item>
          <el-form-item label="说明" prop="type">
            <el-input
              v-model="formLabelAlign.type"
              type="textarea"
              :disabled="disabled"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addTrue" :disabled="disabled"
            >确 定</el-button
          >
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
      <alarm-tree ref="posttree"></alarm-tree>
    </div>
  </div>
</template>

<script>
import { getallyujing } from "@/api/dept/noticelist";
import { export_json_to_excel } from "../../daily/vehicle/Export2Excel";
import AlarmTree from "./alarm-tree";
export default {
  components: {
    AlarmTree,
  },
  data() {
    return {
      loading: false,
      exportLoading: false,
      current: 1,
      size: 20,
      total: 1,
      account: "",
      caleHeight: 670,
      tableData: [],
      centerDialogVisible: false,
      addDialogVisible: false,
      disabled: false,
      labelPosition: "right",
      headtext: "",
      formLabelAlign: {
        name: "",
        region: "",
        type: "",
      },
      multipleSelection: [],
      rules: {
        name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        region: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
        type: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
      },
    };
  },
  computed: {},
  mounted() {
    this.onLoad();
    this.$nextTick(function() {
      this.caleHeight =
        window.innerHeight - this.$refs.table.$el.offsetTop - 137;
      // 监听窗口大小变化
      let self = this;
      window.onresize = function() {
        self.caleHeight =
          window.innerHeight - self.$refs.table.$el.offsetTop - 137;
      };
    });
  },
  methods: {
    // 列表数据
    onLoad() {
      this.loading = true;
      let deptId = this.$store.getters.deptId;
      getallyujing(deptId, this.current, this.size, this.account).then(
        (res) => {
          this.loading = false;
          const data = res.data.data.records;
          this.total = res.data.data.total;
          this.tableData = data;
        }
      );
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
    // 勾选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 显示岗位树
    showPostTree() {
      if (this.multipleSelection.length > 0) {
        this.$refs.posttree.show(this.multipleSelection);
      } else {
        this.$message.warning("请先选择你需要处理得数据");
      }
    },
    // 新增
    addRow() {
      this.headtext = "新增";
      this.addDialogVisible = true;
      this.formLabelAlign.name = "";
      this.formLabelAlign.region = "";
      this.formLabelAlign.type = "";
      this.disabled = false;
      this.$refs.remindform.resetFields();
    },
    // 确认新增
    addTrue() {
      this.$refs.remindform.validate((valid) => {
        if (valid) {
          // alert("submit!");
        }
      });
    },
    // 查看
    viewRow(index, data) {
      this.headtext = "查看";
      this.addDialogVisible = true;
      this.formLabelAlign.name = data[index].yujingxiang;
      this.formLabelAlign.region = data[index].title;
      this.formLabelAlign.type = data[index].title;
      this.disabled = true;
    },
    // 编辑
    updateRow(index, data) {
      this.headtext = "编辑";
      this.addDialogVisible = true;
      this.formLabelAlign.name = data[index].yujingxiang;
      this.formLabelAlign.region = data[index].title;
      this.formLabelAlign.type = data[index].title;
      this.disabled = false;
    },
    // 删除
    deleteRow(index, data) {
      this.centerDialogVisible = true;
      this.headtext = "删除";
    },
    // 确认删除
    trueDeleteRow() {},
    //  导出表格
    befoExport() {
      this.exportLoading = true;
      let deptId = this.$store.getters.deptId;
      let current = 0;
      let size = 0;
      let account = this.account;
      getallyujing(deptId, current, size, account).then((res) => {
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
        const multiHeader2 = ["预警项", "预警分类", "说明", "创建时间"];
        const filterVal = ["account", "yujingfenlei", "title", "caozuoshijian"];
        const merges = ["A1:A2", "B1:B2", "C1:C2", "D1:D2"];
        // const list = this.goodsItems;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel({
          multiHeader2,
          header: multiHeader2,
          data,
          filename: "预警管理菜单",
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
      .person-head-left {
        display: flex;
        .person-head-input {
          display: flex;
          margin-right: 10px;
          span {
            width: 35%;
            text-align: end;
            line-height: 30px;
            font-weight: 500;
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
