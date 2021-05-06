<template>
  <div class="dictads" style="display:flex;">
    <basic-container>
      <div class="box">
        <el-tree
          ref="tree"
          lazy
          :load="loadNode"
          :props="treeOption.props"
          :expand-on-click-node="false"
          empty-text="暂无数据"
          @node-click="nodeClick"
        ></el-tree>
      </div>
    </basic-container>
    <div class="dictads-right">
      <el-button-group>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-delete"
          @click="handleDelete"
          >删除</el-button
        >
        <el-button
          v-if="perReturnAdd"
          type="primary"
          size="small"
          icon="el-icon-arrow-left"
          @click="ReturnAdd"
          >返回新增</el-button
        >
      </el-button-group>
      <basic-container>
        <avue-form
          ref="form"
          :option="regionOption"
          v-model="regionForm"
          @submit="handleSubmit"
        >
        </avue-form>
      </basic-container>
    </div>
  </div>
</template>

<script>
import {
  getAddressList,
  getAdsChildrenList,
  remove,
  update,
  add,
  getDict,
  getDictTree,
} from "@/api/system/dict";
import { mapGetters } from "vuex";
import { validatenull } from "@/util/validate";

export default {
  data() {
    return {
      topCode: "其他",
      treeCode: "",
      perReturnAdd: false,
      treeOption: {
        props: {
          label: "dictValue",
          value: "id",
          children: "children",
        },
      },
      regionForm: {},
      regionOption: {
        labelWidth: 100,
        column: [
          {
            label: "字典名称",
            prop: "dictValue",
            span: 24,
            disabled: false,
            rules: [
              {
                required: true,
                message: "请输入字典名称",
                trigger: "blur",
              },
            ],
          },
          {
            label: "字典编号",
            prop: "code",
            span: 24,
            disabled: false,
            rules: [
              {
                required: true,
                message: "请输入字典编号",
                trigger: "blur",
              },
            ],
          },
          {
            label: "上级字典",
            prop: "parentId",
            type: "tree",
            span: 24,
            disabled: false,
            dicData: [],
            hide: true,
            props: {
              label: "title",
            },
            rules: [
              {
                required: false,
                message: "请选择上级字典",
                trigger: "click",
              },
            ],
          },
          {
            label: "字典键值",
            prop: "dictKey",
            span: 24,
            disabled: false,
            rules: [
              {
                required: true,
                message: "请输入字典键值",
                trigger: "blur",
              },
            ],
          },
          {
            label: "字典排序",
            prop: "sort",
            type: "number",
            span: 24,
            disabled: false,
            rules: [
              {
                required: true,
                message: "请输入字典排序",
                trigger: "blur",
              },
            ],
          },
        ],
      },
      node_had: "",
      resolve_had: "",
    };
  },
  computed: {
    ids() {
      let ids = [];
      this.selectionList.forEach((ele) => {
        ids.push(ele.id);
      });
      return ids.join(",");
    },
  },
  mounted() {},
  methods: {
    // 节点被点击
    nodeClick(data) {
      this.treeCode = data.id;
      getDict(this.treeCode).then((res) => {
        this.regionForm = res.data.data;
        this.$refs.form.clearValidate();
        this.perReturnAdd = true;
      });
    },
    // 懒加载树节点
    loadNode(node, resolve) {
      // 如果是第一级
      if (node.level === 0) {
        this.node_had = node; //这里是关键！在data里面定义一个变量，将node.level == 0的node存起来
        this.resolve_had = resolve; //同上，把node.level == 0的resolve也存起来
        return getAddressList(1, 10, this.topCode).then((res) => {
          let data = res.data.data;
          getDictTree(this.topCode).then((res) => {
            const data = res.data.data;
            const index = this.findObject(this.regionOption.column, "parentId");
            index.dicData = data;
            // const index = this.$refs.form.findColumnIndex("parentId");
            // this.regionOption.column[index].dicData = data;
          });
          resolve(data);
        });
      }
      // 不是第一级
      if (node.data.childrens === 1) {
        // 如果已经存在下级
        getAdsChildrenList(node.data.id).then((res) => {
          resolve(res.data.data);
        });
      } else {
        getAdsChildrenList(node.data.id).then((res) => resolve(res.data.data));
      }
    },
    // 树懒加载刷新方法
    requestNewData() {
      this.node_had.childNodes = []; //把存起来的node的子节点清空，不然会界面会出现重复树！
      this.loadNode(this.node_had, this.resolve_had); //再次执行懒加载的方法
    },
    // 返回新增
    ReturnAdd() {
      this.perReturnAdd = false;
      this.$refs.form.clearValidate();
      this.$refs.form.resetForm();
      this.$refs.form.form = {};
      // console.log(this.$refs.form);
      // console.log(this);
    },
    // 提交
    handleSubmit(form, done) {
      update(form).then(
        () => {
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          this.requestNewData();
          this.$refs.form.resetForm();
          done();
        },
        (error) => {
          window.console.log(error);
        }
      );
    },
    // 删除
    handleDelete() {
      if (validatenull(this.regionForm.code)) {
        this.$message.warning("请先选择一项区划");
        return;
      }
      this.$confirm(`确定将 [${this.regionForm.dictKey}] 数据删除?`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return remove(this.treeCode);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          this.requestNewData();
          this.$refs.form.resetForm();
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.dictads {
  display: flex;
  width: 100%;
  height: 100%;
  .basic-container:first-of-type {
    width: 25%;
    height: 100%;
    margin-right: 1rem;
    .box {
      width: 100%;
      height: 100%;
      padding: 10px;
      background-color: #fff;
      overflow: auto;
    }
  }
  .dictads-right {
    width: 75%;
    .el-button-group {
      display: flex;
      width: 100%;
      height: 3rem;
      padding: 0.4rem;
      border-radius: 5px;
      background-color: #fff;
      .el-button {
        margin-right: 0.5rem;
      }
    }
    .basic-container:last-of-type {
      margin-top: 1rem;
      padding: 2rem 0;
      height: calc(100% - 65px);
      background-color: #fff;
    }
  }
}
</style>
