<template>
  <el-dialog
    title="保费合计"
    :visible.sync="InsuranceVisible"
    width="75%"
    :before-close="handleClose"
  >
    <el-table :data="InsuranceData" border stripe style="width: 100%">
      <el-table-column prop="date" label="企业名称"> </el-table-column>
      <el-table-column prop="name" label="车辆牌照"> </el-table-column>
      <el-table-column prop="address" label="登记人"> </el-table-column>
      <el-table-column prop="date" label="等级时间"> </el-table-column>
      <el-table-column prop="name" label="保费合计"> </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="InsuranceVisible = false">取 消</el-button>
      <el-button type="primary" @click="InsuranceVisible = false"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      InsuranceVisible: false,
      InsuranceData: [],
    };
  },
  methods: {
    handleClose(done) {},
  },
};
</script>
<style lang="scss" scoped>
/deep/ .el-table th {
  color: rgba(0, 0, 0, 0.85);
  background-color: #fafafa;
}
</style>
