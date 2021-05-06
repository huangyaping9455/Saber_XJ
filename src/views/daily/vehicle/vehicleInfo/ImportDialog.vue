<template
  ><el-dialog
    title="请确认导入信息"
    :visible.sync="centerDialogVisible"
    width="60%"
    top="10vh"
    @close="DialogQuXiao()"
    center
  >
    <el-table
      v-loading="tableUploadLoading"
      :data="tableDialogList"
      border
      :height="caleHeight"
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
      <el-table-column prop="shiyongxingzhi" label="使用性质"></el-table-column>
      <el-table-column
        prop="jiashiyuanxingming"
        width="90"
        label="驾驶员姓名"
      ></el-table-column>
      <el-table-column prop="xinghao" label="车辆类型"></el-table-column>
      <el-table-column prop="changpai" label="厂牌"></el-table-column>
      <el-table-column prop="chejiahao" label="车架号"></el-table-column>
      <el-table-column
        prop="yunyingshangmingcheng"
        width="90"
        label="运营商名称"
      ></el-table-column>
      <el-table-column prop="zongduanid" label="终端编号"></el-table-column>
      <el-table-column
        prop="yunyingshang"
        label="4G视频地址"
        width="90"
      ></el-table-column>
      <el-table-column
        prop="jiashiyuandianhua"
        width="90"
        label="驾驶员电话"
      ></el-table-column>
      <el-table-column
        prop="yayunyuanxingming"
        label="押运员"
      ></el-table-column>
      <el-table-column
        prop="yayunyuandianhua"
        width="90"
        label="押运员电话"
      ></el-table-column>
      <el-table-column prop="chezhu" label="车主"></el-table-column>
      <el-table-column prop="chezhudianhua" label="车主电话"></el-table-column>
    </el-table>
    <div class="dialog-message">
      验证信息：<span>{{ dialogMessage }}</span>
    </div>
    <span
      slot="footer"
      class="dialog-footer"
      style="display: flex; justify-content: center"
    >
      <el-button @click="DialogQuXiao">取 消</el-button>
      <el-button
        type="primary"
        @click="TrueClick"
        :loading="uploadtureloading"
        :disabled="disa"
        >确认上传</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    exceljson: {
      type: String,
      default: true,
    },
  },
  data() {
    return {
      centerDialogVisible: false,
      tableUploadLoading: false,
      tableDialogList: [],
      caleHeight: 490,
      dialogMessage: "",
      uploadtureloading: false,
      disa: false,
    };
  },
  methods: {
    // 导入弹出层 取消
    DialogQuXiao() {
      this.centerDialogVisible = false;
      this.tableDialogList = [];
      this.dialogMessage = "";
    },
    TrueClick() {
      this.uploadtureloading = true;
      if (this.disa == true) {
        this.$message.error("导入信息有误,请校验···");
      } else {
        let formData = new FormData();
        formData.append("userId", this.$store.getters.userInfo.userId);
        formData.append("userName", this.$store.getters.userInfo.userName);
        formData.append("vehicles", this.exceljson);
        let config = {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        };
        axios({
          url: "api/blade-platform/platform/vehicle/vehicleImportOk",
          method: "post",
          data: formData,
          config,
        })
          .then((res) => {
            if (res.status === 200) {
              this.$message.success("导入成功");
              this.uploadtureloading = false;
              this.centerDialogVisible = false;
              this.tableDialogList = [];
              this.dialogMessage = "";
              this.$emit("refreshChange");
            } else {
              this.uploadtureloading = false;
              this.$message.error(res.statusText);
            }
          })
          .catch(() => {
            this.uploadtureloading = false;
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-message {
  max-height: 7.5rem;
  overflow-y: auto;
  width: 100%;
  border: 1px solid #ebeef5;
  padding: 3px;
  span {
    color: red;
  }
}
</style>
