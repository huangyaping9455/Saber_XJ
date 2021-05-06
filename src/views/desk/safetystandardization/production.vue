<template>
  <div class="applist">
    <div class="app-text">
      <div style="display: flex; justify-content: space-between">
        <div class="head-btn">
          <el-button type="primary" @click="open">
            <i class="el-icon-plus"></i>新增
          </el-button>
          <div class="WDselect">
            <el-select
              v-model="WDselect"
              placeholder="请选择文件类型"
              clearable
              @change="WJsel"
            >
              <el-option
                v-for="item in WDselectes"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              ></el-option>
            </el-select>
            <!-- <el-select v-model="DeptNameSelect" placeholder="请选择公司" clearable>
            <el-option
              v-for="item in DeptNameSelects"
              :key="item.deptId"
              :label="item.deptName"
              :value="item.deptName"
            ></el-option>
            </el-select>-->
            <el-input
              v-model="DeptNameSelect"
              placeholder="请输入公司名称"
              style="margin: 0 0.6rem; margin-top: 0.3rem"
            ></el-input>
            <el-button type="primary" @click="WDselects">
              <i class="el-icon-search"></i>搜索
            </el-button>
          </div>
        </div>
        <el-tooltip content="刷新" placement="top" style="margin-right: 1rem">
          <el-button
            type="primary"
            icon="el-icon-refresh"
            circle
            @click="refreshList"
          ></el-button>
        </el-tooltip>
      </div>
      <el-table
        border
        :data="tableData"
        v-loading="loading"
        :height="caleHeight"
        ref="table"
      >
        <el-table-column
          prop="deptName"
          label="公司名称"
          width="300px"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="jigouleixing"
          label="机构类型"
          width
          align="center"
        ></el-table-column>
        <el-table-column
          prop="yunyingleixing"
          label="运营类型"
          width
          align="center"
        ></el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width
          align="center"
        ></el-table-column>
        <el-table-column
          prop="caozuoren"
          label="操作人"
          width
          align="center"
        ></el-table-column>
        <el-table-column
          prop="caozuoshijian"
          label="操作时间"
          width
          align="center"
        ></el-table-column>
        <el-table-column
          prop="leixing"
          label="类型"
          width
          align="center"
        ></el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="80">
          <template slot-scope="scope">
            <el-button type="text" @click="handleClick(scope.row)" size="small"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="float: right; padding: 10px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="current"
        :page-sizes="[10, 50, 100, 200]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog
      title="删除"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
    >
      <span>确定要删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="TrueDelete">确 定</el-button>
      </span>
    </el-dialog>
    <transition name="modal-fade" v-if="isModalVisible" @close="closeModal">
      <div class="modal-backdrop">
        <div
          class="modal"
          role="dialog"
          aria-labelledby="modalTitle"
          aria-describedby="modaldescription"
        >
          <header class="modal-header" id="modalTitle">
            <slot name="header">
              <span>新增</span>
              <button
                type="button"
                class="btn-close"
                @click="close"
                aria-label="Close modal"
              >
                X
              </button>
            </slot>
          </header>
          <section class="modal-body" id="modalDescription">
            <slot name="body">
              <el-form
                style="display: flex; flex-direction: column"
                :model="pojo"
                :rules="rules"
                ref="from"
              >
                <span class="qywenjian">企业文件</span>
                <div class="qylist">
                  <el-form-item
                    label="企业名称"
                    style="display: flex"
                    prop="WJdeptName"
                  >
                    <el-select
                      v-model="pojo.WJdeptName"
                      filterable
                      placeholder="请选择企业名称..."
                      @change="WJchange"
                      clearable
                    >
                      <el-option
                        v-for="(item, index) in WJdeptNames"
                        :label="item.deptName"
                        :value="item.deptId"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                  label="仅生成目录"
                  style="display: flex"
                  prop="WJisOnlyDir"
                >
                  <el-select
                    v-model="pojo.WJisOnlyDir"
                    placeholder="是否仅生成目录..."
                    @change="WJmulu"
                    clearable
                  >
                    <el-option
                      v-for="(item, index) in WJisOnlyDirs"
                      :label="item.label"
                      :value="item.value"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-form-item>
                </div>
              </el-form>
              <el-form
                style="display: flex"
                :model="pojo"
                :rules="rules"
                ref="from"
              >
                
                  <el-form-item
                    label="运营类型"
                    style="display: flex"
                    prop="yunyingleixing"
                  >
                    <el-select
                      v-model="pojo.yunyingleixing"
                      placeholder="请选择运营类型..."
                      @change="YYleixing"
                      clearable
                    >
                      <el-option
                        v-for="(item, index) in yunyingleixings"
                        :label="item.label"
                        :value="item.value"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
              </el-form>
              <el-form
                style="display: flex; flex-direction: column"
                :model="pojo"
                :rules="rules"
                ref="from"
              >
                <span class="qywenjian">企业文档</span>
                <div class="qylist">
                  <el-form-item
                    label="企业名称"
                    style="display: flex"
                    prop="WDdeptName"
                  >
                    <el-select
                      v-model="pojo.WDdeptName"
                      filterable
                      placeholder="请选择企业名称..."
                      @change="WDchange"
                      clearable
                    >
                      <el-option
                        v-for="(item, index) in WDdeptNames"
                        :label="item.deptName"
                        :value="item.deptId"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="仅生成目录"
                    style="display: flex"
                    prop="WDisOnlyDir"
                  >
                    <el-select
                      v-model="pojo.WDisOnlyDir"
                      placeholder="是否仅生成目录..."
                      @change="WDmulu"
                      clearable
                    >
                      <el-option
                        v-for="(item, index) in WDisOnlyDirs"
                        :label="item.label"
                        :value="item.value"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-form>
            </slot>
          </section>
          <footer class="modal-footer">
            <slot name="footer">
              <el-button
                type="primary"
                @click="rowSave"
                :loading="submitLoading"
                >提交</el-button
              >
              <el-button
                type="primary"
                class="btn-green"
                @click="close"
                aria-label="Close modal"
                >关闭</el-button
              >
            </slot>
          </footer>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import {
  getList,
  remove,
  update,
  addWJ,
  addWD,
  getNotice,
  getStatus,
  getfild,
  getQYWDList,
  getQYWJList,
  deleteBiaozhunhuamuban,
  deleteSafetyProductionFile,
} from "@/api/dept/productList";
export default {
  data() {
    return {
      current: 1,
      size: 10,
      total: 1,
      caleHeight: 641,
      loading: false,
      submitLoading: false,
      isModalVisible: false,
      centerDialogVisible: false,
      WJWDdelete: "",
      // 表单 :model
      pojo: {
        WJdeptName: [],
        WDdeptName: [],
        yunyingleixing: [],
        WDisOnlyDir: [],
        WJisOnlyDir: [],
      },
      // 搜索
      WDselect: [],
      WDselectes: [
        {
          label: "全部",
          value: 0,
        },
        {
          label: "安全标准化文件",
          value: 1,
        },
        {
          label: "安全管理标准文档",
          value: 2,
        },
      ],
      DeptNameSelect: "",
      // DeptNameSelects: [
      //   {
      //     label: "企业",
      //     value: 0,
      //   },
      // ],
      WDid: "",
      WJid: "",
      WDmuluid: "",
      WJmuluid: "",
      YYleixingid: "",
      WJsels: "",
      WDdeptNames: [
        {
          label: "灵宝市宝通汽车客运有限公司",
          value: "0",
        },
        {
          label: "三门峡运通公司",
          value: "1",
        },
      ],

      WJdeptNames: [
        {
          label: "灵宝市宝通汽车客运有限公司",
          value: "0",
        },
        {
          label: "三门峡运通公司",
          value: "1",
        },
      ],
      yunyingleixings: [
        {
          label: "危货",
          value: "1",
        },
        {
          label: "普货",
          value: "2",
        },
        {
          label: "客运",
          value: "3",
        },
      ],
      WDisOnlyDirs: [
        {
          label: "否",
          value: "0",
        },
        {
          label: "是",
          value: "1",
        },
      ],
      WJisOnlyDirs: [
        {
          label: "否",
          value: "0",
        },
        {
          label: "是",
          value: "1",
        },
      ],
      rules: {
        WJdeptName: [{ required: false, message: "不能为空", trigger: "blur" }],
        WDdeptName: [{ required: false, message: "不能为空", trigger: "blur" }],
        yunyingleixing: [
          { required: false, message: "不能为空", trigger: "blur" },
        ],
        WJisOnlyDir: [
          { required: false, message: "不能为空", trigger: "blur" },
        ],
        WDisOnlyDir: [
          { required: false, message: "不能为空", trigger: "blur" },
        ],
      },
      tableData: [{}],
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
    // 新增
    rowSave() {
      // this.loading = true;
      this.submitLoading = true;
      let dataWJ = {
        deptId: this.WJid,
        yunyingleixing: this.YYleixingid,
        caozuoren: this.$store.getters.userInfo.userName,
        caozuorenid: this.$store.getters.userInfo.userId,
        isOnlyDir: this.WJmuluid,
      };
      let dataWD = {
        deptId: this.WDid,
        caozuoren: this.$store.getters.userInfo.userName,
        caozuorenid: this.$store.getters.userInfo.userId,
        isOnlyDir: this.WDmuluid,
      };
      if (
        this.WJid != "" &&
        this.YYleixingid != "" &&
        this.WJmuluid != "" &&
        this.WDid == "" &&
        this.WDmuluid == ""
      ) {
        addWJ(dataWJ).then(() => {
          // this.loading = false;
          this.submitLoading = false;
          this.onLoad(this.current);
          this.pojo.WJdeptName = "";
          this.pojo.yunyingleixing = "";
          this.pojo.WJisOnlyDir = "";
          this.$refs.from.resetFields();
          this.isModalVisible = false;
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        });
      } else if (
        this.WJid == "" &&
        this.YYleixingid == "" &&
        this.WJmuluid == "" &&
        this.WDid != "" &&
        this.WDmuluid != ""
      ) {
        addWD(dataWD).then(() => {
          // this.loading = false;
          this.submitLoading = false;
          this.onLoad(this.current);
          this.$refs.from.resetFields();
          this.isModalVisible = false;
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        });
      } else if (
        this.WJid != "" &&
        this.YYleixingid != "" &&
        this.WJmuluid != "" &&
        this.WDid != "" &&
        this.WDmuluid != ""
      ) {
        addWJ(dataWJ).then(() => {
          // this.loading = false;
          this.submitLoading = false;
          this.pojo.WJdeptName = "";
          this.pojo.yunyingleixing = "";
          this.pojo.WJisOnlyDir = "";
        });
        addWD(dataWD).then(() => {
          // this.loading = false;
          this.submitLoading = false;
        });
        this.onLoad(this.current);
        this.$refs.from.resetFields();
        this.isModalVisible = false;
        this.$message({
          type: "success",
          message: "操作成功!",
        });
      } else {
        // this.loading = false;
        this.submitLoading = false;
        this.$message({
          type: "error",
          message: "数据不完整",
        });
      }
    },
    // 分页
    handleSizeChange(val) {
      this.size = val;
      this.onLoad();
    },
    handleCurrentChange(val) {
      this.current = val;
      this.onLoad();
    },
    // 获取列表数据
    onLoad() {
      this.loading = true;
      let dept = this.$store.getters.deptId;
      let current = this.current;
      let size = this.size;
      let leixing = this.WJsels;
      let deptName = this.DeptNameSelect;
      getList(dept, current, size, leixing, deptName).then((res) => {
        this.loading = false;
        const data = res.data.data;
        this.total = data.total;
        this.size = data.size;
        this.current = data.current;
        this.tableData = data.records;
        // this.DeptNameSelects = data.records.map((item) => {
        //   return item;
        // });
      });
    },
    // 列表 刷新
    refreshList() {
      this.current = 1;
      this.onLoad();
    },
    // 企业名称 文档
    WDchange(data) {
      this.WDid = data;
    },
    //企业名称 文件
    WJchange(data) {
      this.WJid = data;
    },
    // 生成目录 文档
    WDmulu(data) {
      this.WDmuluid = data;
    },
    // 生成目录 文件
    WJmulu(data) {
      this.WJmuluid = data;
    },
    // 运营类型
    YYleixing(data) {
      this.YYleixingid = data;
    },
    // 搜索
    WDselects() {
      this.onLoad();
    },
    WJsel(data) {
      if (data == "全部") {
        this.WJsels = "";
      } else {
        this.WJsels = data;
      }
    },
    // 列表 删除
    handleClick(data) {
      this.WJWDdelete = data;
      this.centerDialogVisible = true;
    },
    // 确认删除
    TrueDelete() {
      if (this.WJWDdelete.leixing === "安全标准化文件") {
        deleteBiaozhunhuamuban(
          this.$store.getters.userInfo.userName,
          this.$store.getters.userInfo.userId,
          this.WJWDdelete.deptId
        ).then((res) => {
          if (res.data.code == 200) {
            this.centerDialogVisible = false;
            this.onLoad();
            this.$message.success(res.data.msg);
          } else {
            this.centerDialogVisible = false;
            this.$message.error(res.data.msg);
          }
        });
      } else {
        deleteSafetyProductionFile(
          this.$store.getters.userInfo.userName,
          this.$store.getters.userInfo.userId,
          this.WJWDdelete.deptId
        ).then((res) => {
          if (res.data.code == 200) {
            this.centerDialogVisible = false;
            this.onLoad();
            this.$message.success(res.data.msg);
          } else {
            this.centerDialogVisible = false;
            this.$message.error(res.data.msg);
          }
        });
      }
    },
    // 弹出框
    open() {
      this.isModalVisible = true;
      let deptId = this.$store.getters.deptId;
      getQYWDList(deptId).then((res) => {
        this.WDdeptNames = res.data.data;
      });
      getQYWJList(deptId).then((res) => {
        this.WJdeptNames = res.data.data;
      });
    },
    closeModal() {
      this.isModalVisible = false;
    },
    close() {
      this.isModalVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.applist {
  border-radius: 15px;
  width: 100%;
  background: white;
  padding: 0 1rem;
  height: 100%;
  .app-text {
    padding: 0.5rem;
    .el-button {
      margin: 0.3rem 0;
    }
    .el-table {
      z-index: 0;
      margin-top: 0.3rem;
    }
    .head-btn {
      display: flex;
      .WDselect {
        display: flex;
        margin: 0 0.6rem;
        .el-select,
        .el-input {
          margin-top: 0.3rem;
        }
        .el-select {
          width: 9.5rem;
        }
        .el-input {
          width: 17.4rem;
        }
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
        padding: 0 1rem;
        .qywenjian {
          margin: 1rem auto;
        }
        .qylist {
          display: flex;
          justify-content: space-between;
        }
      }
    }
    .modal-fade-enter,
    .modal-dade-leave-active {
      opacity: 0;
    }
  }
  .el-form-item--small {
    margin: 0.5rem 1rem;
  }
}
</style>
<style>
.el-form-item__label {
  padding: 0 16px 0 0;
}
.el-table__row {
  height: 60px;
}
</style>
