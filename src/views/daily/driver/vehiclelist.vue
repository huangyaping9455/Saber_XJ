<template>
  <div class="applist">
    <div class="app-text">
      <div class="person-head">
        <div class="person-head-left">
          <div class="person-head-input">
            <span>单位名称：</span>
            <el-input
              v-model="deptname"
              placeholder="请输入单位名称"
              clearable
            ></el-input>
          </div>
          <div class="person-head-input">
            <span>驾驶员名称：</span>
            <el-input
              v-model="jiashiyuanxingming"
              placeholder="请输入驾驶员名称"
              clearable
            ></el-input>
          </div>
          <div class="person-head-input-last">
            <span>标&nbsp;&nbsp;&nbsp;识：</span>
            <el-select v-model="biaoshi" placeholder="请选择">
              <el-option
                v-for="item in biaoshilist"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
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
          type="index"
          align="center"
          label="序号"
          width="50"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="deptName"
          label="单位名称"
          width="270"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="jiashiyuanxingming"
          label="驾驶员姓名"
          width="110"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="shoujihaoma"
          label="手机号码"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="cheliangpaizhao"
          label="车辆牌照"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="chepaiyanse"
          label="车牌颜色"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="shiyongxingzhi"
          label="使用性质"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="caozuoshijian"
          label="创建时间"
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
import { getJSYVehiclelist } from "@/api/dept/noticelist";
import { export_json_to_excel } from "../vehicle/Export2Excel";
export default {
  data() {
    return {
      loading: false,
      exportLoading: false,
      current: 1,
      size: 20,
      total: 1,
      deptname: "",
      caleHeight: 670,
      tableData: [],
      jiashiyuanxingming: "",
      biaoshi: "",
      biaoshilist: [
        {
          value: "",
          label: "全部",
        },
        {
          value: "已绑车",
          label: "已绑车",
        },
        {
          value: "未绑车",
          label: "未绑车",
        },
      ],
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
      let jiashiyuanleixing = 1;
      let current = this.current;
      let size = this.size;
      let deptName = this.deptname;
      let jiashiyuanxingming = this.jiashiyuanxingming;
      let biaoshi = this.biaoshi;
      getJSYVehiclelist(
        deptId,
        jiashiyuanleixing,
        current,
        size,
        deptName,
        jiashiyuanxingming,
        biaoshi
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
    //  导出表格
    befoExport() {
      this.exportLoading = true;
      let deptId = this.$store.getters.deptId;
      let jiashiyuanleixing = 1;
      let current = 0;
      let size = 0;
      let deptName = this.deptname;
      let jiashiyuanxingming = this.jiashiyuanxingming;
      let biaoshi = this.biaoshi;
      getJSYVehiclelist(
        deptId,
        jiashiyuanleixing,
        current,
        size,
        deptName,
        jiashiyuanxingming,
        biaoshi
      ).then((res) => {
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
          "驾驶员姓名",
          "手机号码",
          "车辆牌照",
          "车牌颜色",
          "使用性质",
          "创建时间",
        ];
        const filterVal = [
          "deptName",
          "jiashiyuanxingming",
          "shoujihaoma",
          "cheliangpaizhao",
          "chepaiyanse",
          "shiyongxingzhi",
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
        ];
        // const list = this.goodsItems;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel({
          multiHeader2,
          header: multiHeader2,
          data,
          filename: "绑定车辆",
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
