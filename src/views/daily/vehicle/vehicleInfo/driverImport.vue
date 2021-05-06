<template>
  <el-dialog
    title="请确认导入信息"
    :visible.sync="driverDialogVisible"
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
        prop="jiashiyuanxingming"
        width="90"
        label="驾驶员姓名"
      ></el-table-column>
      <el-table-column
        prop="shenfenzhenghao"
        label="身份证号"
      ></el-table-column>
      <el-table-column prop="shoujihaoma" label="手机号码"></el-table-column>
      <el-table-column prop="jiashizhenghao" label="驾驶证号"></el-table-column>
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
      driverDialogVisible: false,
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
      this.driverDialogVisible = false;
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
        formData.append("drivers", this.exceljson);
        let config = {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        };
        axios({
          url: "api/blade-platform/platform/jiashiyuan/driverImportOk",
          method: "post",
          data: formData,
          config,
        })
          .then((res) => {
            if (res.status === 200) {
              this.$message.success("导入成功");
              this.uploadtureloading = false;
              this.driverDialogVisible = false;
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
