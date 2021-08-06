<template>
  <div class="applist">
    <div class="app-text">
      <div style="display: flex; justify-content: space-between">
        <el-button type="primary" @click="open">
          <i class="el-icon-plus"></i>新增
        </el-button>
        <el-tooltip content="刷新" placement="top" style="margin-right: 1rem">
          <el-button
            type="primary"
            icon="el-icon-refresh"
            circle
            @click="refreshList"
          ></el-button>
        </el-tooltip>
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
        <el-table-column prop="id" label="序号" width="50"></el-table-column>
        <el-table-column prop="type" label="类型" width="80"></el-table-column>
        <el-table-column
          prop="version"
          label="版本号"
          width="80"
        ></el-table-column>
        <el-table-column
          prop="createtime"
          label="创建日期"
          width="130"
        ></el-table-column>
        <el-table-column
          prop="createuser"
          label="创建人姓名"
          width="100"
        ></el-table-column>
        <el-table-column label="android地址" width="350">
          <template slot-scope="scope">
            <el-popover placement="top" width="160" trigger="hover">
              <span class="spanurl" slot="reference">{{
                scope.row.androidurl
              }}</span>
              <div
                :id="'qrcode' + scope.$index"
                :ref="'qrcode' + scope.$index"
              ></div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="ios地址" width="350">
          <template slot-scope="scope">
            <el-popover placement="top" width="160" trigger="hover">
              <span class="spanurl" slot="reference">{{
                scope.row.iosurl
              }}</span>
              <div
                :id="'qrcodes' + scope.$index"
                :ref="'qrcodes' + scope.$index"
              ></div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="描述"
          width="330"
        ></el-table-column>
        <el-table-column
          prop="isdeleted"
          label="状态"
          width="60"
        ></el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button
              @click="handleClick(scope.row)"
              type="primary"
              size="small"
              >{{ scope.row.isdeleted == "禁用" ? "启用" : "禁用" }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
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
    <!-- 弹窗  新增 -->
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
                style="display: flex; justify-content: space-between"
                :rules="rules"
              >
                <el-form-item
                  label="版本号"
                  style="padding: 0 0.3rem; display: flex"
                  prop="versionName"
                >
                  <el-input
                    v-model="version"
                    placeholder="请输入版本号..."
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="状态"
                  style="padding: 0 0.3rem; display: flex"
                >
                  <el-select
                    style="width: 180px"
                    v-model="isdeleted"
                    placeholder="请选择状态..."
                  >
                    <el-option
                      v-for="(item, index) in isdeleteds"
                      :label="item.label"
                      :value="item.value"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <el-form style="display: flex; justify-content: space-between">
                <el-form-item
                  label="android地址"
                  style="padding: 0 0.3rem; display: flex"
                >
                  <el-input
                    style="width: 130px"
                    v-model="upload1"
                    placeholder="请输入安卓地址..."
                  ></el-input>
                  <el-upload
                    class="upload-demo"
                    action="/api/blade-upload/upload/upload"
                    :data="dataupload"
                    :on-success="AndSuccess"
                    :before-upload="beforeUpload"
                    multiple
                    :limit="1"
                    :show-file-list="(showfile = false)"
                    style="margin-left: 130px; margin-top: -33px"
                  >
                    <el-button type="primary" style="width: 50px"
                      >上传</el-button
                    >
                  </el-upload>
                </el-form-item>
                <el-form-item
                  label="ios地址"
                  style="padding-right: 0.3rem; display: flex"
                >
                  <el-input
                    style="width: 130px"
                    v-model="upload2"
                    placeholder="请输入ios地址..."
                  ></el-input>
                  <el-upload
                    class="upload-demo"
                    action="/api/blade-upload/upload/upload"
                    :data="dataupload"
                    :on-success="IosSuccess"
                    :before-upload="beforeUpload"
                    multiple
                    :limit="1"
                    :show-file-list="(showfile = false)"
                    style="margin-left: 130px; margin-top: -33px"
                  >
                    <el-button type="primary" style="width: 50px"
                      >上传</el-button
                    >
                  </el-upload>
                </el-form-item>
              </el-form>
              <!--  -->
              <el-form
                style="display: flex; justify-content: space-between"
                :rules="rules"
              >
                <el-form-item
                  label="类型"
                  style="padding: 0 0.3rem; display: flex"
                >
                  <el-select
                    style="width: 180px"
                    v-model="type"
                    placeholder="请选择类型..."
                  >
                    <el-option
                      v-for="(item, index) in types"
                      :label="item.label"
                      :value="item.value"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="手机型号" style="display: flex">
                  <el-select
                    type="textarea"
                    style="width: 180px; margin-right: 5px"
                    v-model="modletype"
                    placeholder="请选择手机型号..."
                  >
                    <el-option
                      v-for="(item, index) in modletypes"
                      :label="item.label"
                      :value="item.value"
                      :key="index"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <el-form style="margin-left: 5px">
                <el-form-item label="描述">
                  <el-input
                    type="textarea"
                    style="width: 180px"
                    v-model="remark"
                    placeholder="请输入描述..."
                  ></el-input>
                </el-form-item>
              </el-form>
            </slot>
          </section>
          <footer class="modal-footer">
            <slot name="footer">
              <el-button
                type="primary"
                :loading="submitLoading"
                @click="rowSave"
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
  add,
  getNotice,
  getStatus,
  getfild,
} from "@/api/dept/noticelist";
import QRCode from "qrcodejs2";
let date = new Date();
export default {
  data() {
    return {
      loading: false,
      submitLoading: false,
      current: 1,
      size: 10,
      total: 1,
      status: "禁用",
      isModalVisible: false,
      caleHeight: 671,
      upload1: "",
      upload2: "",
      version: "",
      isdeleted: [],
      isdeleteds: [
        {
          label: "启用",
          value: 0,
        },
        {
          label: "禁用",
          value: 1,
        },
      ],
      type: "",
      types: [
        {
          label: "企业APP",
          value: 0,
        },
        {
          label: "司机APP",
          value: 1,
        },
      ],
      createName: "",
      remark: "",
      modletype: "",
      modletypes: [
        {
          label: "ios",
          value: 1,
        },
        { label: "安卓", value: 2 },
      ],
      rules: {},
      tableData: [
        {
          id: "0",
          type: "王小虎",
          version: "上海市",
          createtime: "上海市",
          createuser: "上海市",
          androidurl: "上海市",
          iosurl: "上海市",
          remark: "上海市",
        },
      ],
      dataupload: {
        fileId: date.toLocaleDateString(),
        table: "app",
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
    // 新增
    rowSave() {
      // this.loading = true;
      this.submitLoading = true;
      let data = {
        version: this.version,
        isdeleted: this.isdeleted,
        androidurl: this.upload1,
        iosurl: this.upload2,
        type: this.type,
        modletype: this.modletype,
        remark: this.remark,
        createtime: date.toLocaleDateString(),
        createuser: this.$store.getters.userInfo.userName,
        createuserid: this.$store.getters.userInfo.userId,
      };
      add(data).then(() => {
        this.submitLoading = false;
        this.onLoad(this.current);
        this.isModalVisible = false;
        // this.loading = false;
        this.version = "";
        this.isdeleted = "";
        this.upload1 = "";
        this.upload2 = "";
        this.type = "";
        this.modletype = "";
        this.remark = "";
        this.$message({
          type: "success",
          message: "操作成功!",
        });
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
    // 安卓 上传成功得方法
    AndSuccess(res, file, fileList) {
      this.upload1 = res.url;
      this.$message({
        type: "success",
        message: "上传成功!",
      });
    },
    // iOS上传成功得方法
    IosSuccess(res, file, fileList) {
      this.upload2 = res.url;
      this.$message({
        type: "success",
        message: "上传成功!",
      });
    },
    // 上传前的方法
    beforeUpload(file) {
      const isLt100M = file.size / 1024 / 1024 < 100;
      if (!isLt100M) {
        this.$message({
          message: "上传文件大小不能超过100MB",
          type: "error",
        });
        return false;
      }
      return isLt100M;
    },
    // 列表数据
    onLoad() {
      this.loading = true;
      let dept = this.$store.getters.deptId;
      let current = this.current;
      let size = this.size;
      getList(dept, current, size).then((res) => {
        this.loading = false;
        const data = res.data.data;
        this.total = data.total;
        this.size = data.size;
        this.current = data.current;
        this.tableData = data.records.map((el, index) => {
          if (el.androidurl !== "") {
            this.$nextTick(() => {
              this.qrcode(el.androidurl, index);
            });
          }
          if (el.iosurl !== "") {
            this.$nextTick(() => {
              this.qrcode2(el.iosurl, index);
            });
          }
          return el;
        });
      });
    },
    //列表 刷新
    refreshList() {
      this.current = 1;
      this.onLoad();
    },
    // 操作栏 点击（启用，禁用）
    handleClick(scope) {
      console.log(scope);
      let status;
      if (scope.isdeleted == "启用") {
        status = 0;
      } else {
        status = 1;
      }
      let id = scope.id;
      let isdeleted = status;
      let updateuser = this.$store.getters.userInfo.userName;
      getStatus(id, isdeleted, updateuser).then((res) => {
        if (scope.isdeleted == "启用") {
          scope.isdeleted = "禁用";
        } else {
          scope.isdeleted = "启用";
        }
      });
    },
    // 弹出框 点击方法
    open() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    close() {
      this.isModalVisible = false;
      this.version = "";
      this.isdeleted = "";
      this.upload1 = "";
      this.upload2 = "";
      this.type = "";
      this.modletype = "";
      this.remark = "";
    },
    // android二维码
    qrcode(url, index) {
      let qrcode = new QRCode(`qrcode${index}`, {
        width: 130, // 设置宽度，单位像素
        height: 130, // 设置高度，单位像素
        text: url, // 设置二维码内容或跳转地址
      });
    },
    // ios二维码
    qrcode2(url, index) {
      let qrcodes = new QRCode(`qrcodes${index}`, {
        width: 130, // 设置宽度，单位像素
        height: 130, // 设置高度，单位像素
        text: url, // 设置二维码内容或跳转地址
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
    .el-button {
      margin: 0.3rem 0;
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
<style>
.el-form-item__label {
  padding: 0 16px 0 0;
  width: 93px;
}
/* .el-table__row {
  height: 63px;
} */
</style>
