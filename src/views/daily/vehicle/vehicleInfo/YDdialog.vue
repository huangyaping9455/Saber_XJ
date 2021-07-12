<template>
  <el-dialog title="车辆异动" :visible.sync="dialogVisible" width="50%">
    <div class="yidong">
      <div class="YD-head">
        <span>车辆牌照：</span>
        <span>{{ carRow.cheliangpaizhao }}</span>
      </div>
      <div class="YD-head">
        <span>车牌颜色：</span>
        <span>{{ carRow.chepaiyanse }}</span>
      </div>
      <div class="YD-head">
        <span>迁出单位：</span>
        <span>{{ carRow.deptName }}</span>
      </div>
      <div class="YD-head">
        <span>变更时间：</span>
        <span>{{ carRow.caozuoshijian }}</span>
      </div>
    </div>
    <div class="yidongtree">
      <span>选择迁入单位：</span>
      <el-input placeholder="输入关键字进行过滤" v-model="filterText">
      </el-input>
      <el-tree
        style="height: 250px; overflow: auto"
        :data="treeData"
        :props="defaultProps"
        :show-checkbox="showBox"
        node-key="id"
        v-loading="loading"
        @check="checkNode"
        class="filter-tree"
        :filter-node-method="filterNode"
        :check-strictly="true"
        ref="tree"
      ></el-tree>
    </div>
    <div class="beizhu">
      填写备注信息：
      <el-input type="textarea" placeholder="请输入内容" v-model="textarea">
      </el-input>
    </div>
    <div class="fujian">
      <span>附件：</span>
      <el-upload
        class="upload-demo"
        action="/api/blade-upload/upload/upload"
        :on-success="UpSuccess"
        :data="dataupload"
      >
        <el-button size="small" type="primary">附件上传</el-button>
      </el-upload>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="moveTreeOrgan">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getYDtree, getYDTrueTree, getYDUpdateTree } from "@/api/daily/vehicle";
export default {
  props: {
    carID: {
      type: String,
      default: () => {
        return {};
      },
    },
    carRow: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      treeData: [],
      // 异动 弹出层
      dialogVisible: false,
      loading: false,
      showBox: true,
      // 异动 树
      defaultProps: {
        children: "children",
        label: "title",
        disabled: this.disabledFN,
      },
      qiyeId: "",
      filterText: "",
      textarea: "",
      uplodAddress: "",
      dataupload: {
        fileId: new Date().toLocaleDateString(),
        table: "jigouyidong",
      },
      upsuccess: "",
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  mounted() {},
  methods: {
    // 树 的数据
    getYDtreeList() {
      this.loading = true;
      getYDtree(this.$store.getters.postId).then((res) => {
        this.treeData = res.data.data;
        this.loading = false;
      });
    },
    // 树节点的 筛选
    filterNode(value, data) {
      if (!value) return true;
      return data.deptName.indexOf(value) !== -1;
    },
    // 树结构 父节点禁用方法
    disabledFN(treedata) {
      // if (treedata.children.length !== 0 || treedata.jigouleixing !== "qiye") {
      //   return true;
      // } else {
      //   return false;
      // }
      if (
        treedata.jigouleixing !== "qiye" &&
        treedata.jigouleixing !== "shi" &&
        treedata.children.length !== 0
      ) {
        return true;
      } else {
        return false;
      }
    },
    UpSuccess(res, file, fileList) {
      this.upsuccess = res.url;
      this.$message({
        type: "success",
        message: "上传成功!",
      });
    },
    // 车辆异动 点击事件
    moveTreeOrgan() {
      if (!this.qiyeId) {
        return this.$message.warning("必须选中一条机构信息");
      }
      this.loading = true;
      let params = {
        deptId: this.qiyeId,
        id: this.carID,
      };
      getYDUpdateTree(params).then((res) => {
        if (res.data.code == 200) {
          this.$message.success("操作成功··");
        } else {
          this.$message.error("操作失败··");
        }
      });
      let data = {
        outOfDeptId: this.carRow.deptId,
        updateUserId: this.$store.getters.deptId,
        updateUser: this.$store.getters.userInfo.userName,
        updateTime: this.dataupload.fileId,
        inOfDeptId: this.qiyeId,
        vehId: this.carID,
        remark: this.textarea,
        fuJian: this.upsuccess,
      };
      getYDTrueTree(data).then((res) => {
        if (res.data.code == 200) {
          this.$message.success("操作成功··");
        } else {
          this.$message.error("操作失败··");
        }
      });
      this.loading = false;
      this.dialogVisible = false;
      this.refreshChange();
    },
    // 当前车辆异动树 选择得机构id
    checkNode(data, val) {
      this.qiyeId = data.id;
      let checkedkeys = val.checkedkeys;
      let currkey = data.id;
      this.$refs.tree.setCheckedKeys([currkey]);
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .el-dialog {
  .yidong {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .YD-head {
      span:first-of-type {
        font-size: 15px;
        font-weight: 600;
      }
    }
    .dialog-footer {
      margin: 0.1rem auto;
    }
  }
  .yidongtree {
    padding: 1rem;
    margin-top: 1rem;
    border: 1px solid gainsboro;
    span:first-of-type {
      font-size: 15px;
      font-weight: 600;
    }
  }
  .beizhu {
    font-size: 15px;
    font-weight: 600;
    margin-top: 1rem;
    padding: 1rem;
    border: 1px solid gainsboro;
  }
  .fujian {
    display: flex;
    margin-top: 1rem;
    font-size: 15px;
    font-weight: 600;
  }
}
</style>
