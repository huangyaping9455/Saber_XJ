<template>
  <div class="applist">
    <div class="app-text">
      <div class="person-head">
        <div class="person-head-left">
          <div class="person-head-input">
            <span>统计时间段：</span>
            <el-date-picker
              v-model="begintime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择开始日期"
            >
            </el-date-picker
            ><span class="_date">-</span>
            <el-date-picker
              v-model="endtime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择结束日期"
            >
            </el-date-picker>
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
          prop="areaName"
          label="地区"
          width="270"
        ></el-table-column>
        <el-table-column align="center" label="道路货物运输">
          <el-table-column
            align="center"
            prop="dlhwxzshu"
            label="新增"
            width="100"
          ></el-table-column>
          <el-table-column align="center" label="停用/删除">
            <template slot-scope="scope">
              <span>{{ scope.row.dlhwtyshu }}/{{ scope.row.dlhwscshu }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="dlhwzyshu" label="当前总数">
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="道路旅客运输">
          <el-table-column
            align="center"
            prop="dllkxzshu"
            label="新增"
            width="100"
          >
          </el-table-column>
          <el-table-column align="center" label="停用/删除">
            <template slot-scope="scope">
              <span>{{ scope.row.dllktyshu }}/{{ scope.row.dllkscshu }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="dllkzyshu" label="当前总数">
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="道路危险品运输">
          <el-table-column
            align="center"
            prop="dlwxpxzshu"
            label="新增"
            width="100"
          ></el-table-column>
          <el-table-column align="center" prop="dlwxpscshu" label="停用/删除">
            <template slot-scope="scope">
              <span>{{ scope.row.dlwxptyshu }}/{{ scope.row.dlwxpscshu }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="dlwxpzyshu" label="当前总数">
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="所有车辆">
          <el-table-column
            align="center"
            prop="xzshu"
            label="新增"
            width="100"
          ></el-table-column>
          <el-table-column align="center" prop="scshu" label="停用/删除">
            <template slot-scope="scope">
              <span>{{ scope.row.tyshu }}/{{ scope.row.scshu }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="zyshu" label="当前总数">
          </el-table-column>
        </el-table-column>
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
import dayjs from "dayjs";
import { getGDSVehicleList } from "@/api/dept/noticelist";
import { export_json_to_excel } from "./Export2Excel";
export default {
  data() {
    return {
      loading: false,
      exportLoading: false,
      current: 1,
      size: 20,
      total: 1,
      caleHeight: 670,
      tableData: [],
      begintime: dayjs()
        .subtract(1, "day")
        .format("YYYY-MM-DD"),
      endtime: dayjs().format("YYYY-MM-DD"),
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
      let deptId = this.$store.getters.deptId;
      let begintime = this.begintime;
      let endtime = this.endtime;
      let current = this.current;
      let size = this.size;
      getGDSVehicleList(deptId, begintime, endtime, current, size).then(
        (res) => {
          this.loading = false;
          const data = res.data.data;
          this.total = data.total;
          this.size = data.size;
          this.current = data.current;
          this.tableData = data.records;
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
    //  导出表格
    befoExport() {
      this.exportLoading = true;
      let deptId = this.$store.getters.deptId;
      let begintime = this.begintime;
      let endtime = this.endtime;
      let current = 0;
      let size = 0;
      getGDSVehicleList(deptId, begintime, endtime, current, size).then(
        (res) => {
          if (res.data.code == 200) {
            res.data.data = res.data.data.records.map((el, index) => {
              return {
                ...el,
                index: index + 1,
                dlhwscshu: `${el.dlhwtyshu}/${el.dlhwscshu}`,
                dllkscshu: `${el.dllktyshu}/${el.dllkscshu}`,
                dlwxpscshu: `${el.dlwxptyshu}/${el.dlwxpscshu}`,
                scshu: `${el.tyshu}/${el.scshu}`,
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
        let multiHeader, tHeader, filterVal, merges, filename;
        multiHeader = [
          "地区",
          "道路货物运输",
          "",
          "",
          "道路旅客运输",
          "",
          "",
          "道路危险品运输",
          "",
          "",
          "所有车辆",
          "",
          "",
        ];
        tHeader = [
          "",
          "新增",
          "停用/删除",
          "当前总数",
          "新增",
          "停用/删除",
          "当前总数",
          "新增",
          "停用/删除",
          "当前总数",
          "新增",
          "停用/删除",
          "当前总数",
        ];
        filterVal = [
          "areaName",
          "dlhwxzshu",
          "dlhwscshu",
          "dlhwzyshu",
          "dllkxzshu",
          "dllkscshu",
          "dllkzyshu",
          "dlwxpxzshu",
          "dlwxpscshu",
          "dlwxpzyshu",
          "xzshu",
          "scshu",
          "zyshu",
        ];
        merges = ["A1:A2", "B1:D2", "E1:G2", "H1:J2", "K1:M2"];
        const data = this.formatJson(filterVal, list);
        export_json_to_excel({
          multiHeader: multiHeader,
          header: tHeader,
          data,
          merges,
          filename: "各地市车辆变更统计",
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
          span:first-of-type {
            text-align: end;
            line-height: 30px;
            font-weight: 500;
          }
          ._date {
            line-height: 30px;
          }
          .el-date-editor {
            width: 150px;
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
