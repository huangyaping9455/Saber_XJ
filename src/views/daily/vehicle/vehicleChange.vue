<template>
  <div class="applist">
    <div class="app-text">
      <div class="person-head">
        <div class="person-head-left">
          <div class="person-head-input">
            <span>车辆牌照：</span>
            <el-input
              v-model="cheliangpaizhao"
              placeholder="请输入车辆牌照"
              clearable
            ></el-input>
          </div>
          <div class="person-head-input">
            <span>变更时间：</span>
            <el-input
              v-model="caozuoshijian"
              placeholder="请输入变更时间"
              clearable
            ></el-input>
          </div>
          <el-button type="primary" @click="refreshList">
            <i class="el-icon-search"></i>查询
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
      >
        <el-table-column
          align="center"
          prop="cheliangpaizhao"
          label="车辆牌照"
          width="100"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="chepaiyanse"
          label="车牌颜色"
          width="90"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="outOfDeptName"
          label="迁出企业"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="inOfDeptName"
          label="迁入企业"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="updateTime"
          label="变更时间"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="updateUser"
          label="操作人"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="fuJian"
          label="附件"
        ></el-table-column>
      </el-table>
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
import { getYDList } from "@/api/daily/vehicle";
import { export_json_to_excel } from "../vehicle/Export2Excel";
export default {
  data() {
    return {
      loading: false,
      exportLoading: false,
      current: 1,
      size: 20,
      total: 1,
      cheliangpaizhao: "",
      caleHeight: 670,
      tableData: [],
      caozuoshijian: "",
    };
  },
  computed: {},
  mounted() {
    this.onLoad();
    this.$nextTick(function() {
      this.caleHeight =
        window.innerHeight - this.$refs.table.$el.offsetTop - 141;
      // 监听窗口大小变化
      let self = this;
      window.onresize = function() {
        self.caleHeight =
          window.innerHeight - self.$refs.table.$el.offsetTop - 141;
      };
    });
  },
  methods: {
    // 列表数据
    onLoad() {
      this.loading = true;
      let data = {
        deptId: this.$store.getters.deptId,
        current: this.current,
        size: this.size,
        cheliangpaizhao: this.cheliangpaizhao,
        caozuoshijian: this.caozuoshijian,
      };
      getYDList(data).then((res) => {
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
    //  导出表格
    befoExport() {
      this.exportLoading = true;
      let deptId = this.$store.getters.deptId;
      let current = 0;
      let size = 0;
      let cheliangpaizhao = this.cheliangpaizhao;
      let caozuoshijian = this.caozuoshijian;
      getYDList(deptId, current, size, cheliangpaizhao, caozuoshijian).then(
        (res) => {
          if (res.data.code == 200) {
            res.data.data = res.data.data.records.map((el, index) => {
              return {
                ...el,
                index: index + 1,
              };
            });
            this.export2Excel(res.data.data);
            this.exportLoading = false;
          } else {
            this.$message.error("下载失败···");
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
          "车辆牌照",
          "车牌颜色",
          "迁出企业",
          "迁入企业",
          "变更时间",
          "操作人",
          "附件",
        ];
        const filterVal = [
          "cheliangpaizhao",
          "chepaiyanse",
          "outOfDeptName",
          "inOfDeptName",
          "updateTime",
          "updateUser",
          "fuJian",
        ];
        const merges = [
          "A1:A2",
          "B1:B2",
          "C1:C2",
          "D1:D2",
          "E1:E2",
          "F1:F2",
          "G1:G2",
        ];
        const data = this.formatJson(filterVal, list);
        export_json_to_excel({
          multiHeader2,
          header: multiHeader2,
          data,
          filename: "车辆变更",
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
            width: 50%;
            text-align: end;
            line-height: 30px;
            font-weight: 500;
          }
        }
        .person-head-input-last {
          display: flex;
          margin-right: 10px;
          span {
            width: 25%;
            text-align: end;
            line-height: 30px;
            font-weight: 500;
          }
        }
      }
    }
    /deep/ .el-table {
      z-index: 0;
      margin-top: 0.3rem;
      th {
        color: rgba(0, 0, 0, 0.85);
      }
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
