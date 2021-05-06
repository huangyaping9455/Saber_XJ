<template>
  <div v-if="state" class="todo-detail">
    <el-form
      ref="form"
      class="form"
      :model="form"
      :disabled="disabled"
      :rules="ruleValidate"
    >
      <scroll>
        <div class="row">
          <el-form-item class="input-box" label="所属单位：" prop="anpairen">
            <el-select
              ref="selectDept"
              v-model="form.deptId"
              placeholder="请选择所属单位"
              @change="danwei"
              @focus="blurDept"
              filterable
              :filter-method="filterMethod"
            >
              <!-- <el-option
                v-for="item in deptList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option> -->
              <el-option :value="valuedept" :label="labeldept">
                <el-tree
                  ref="deptTree"
                  :data="deptList"
                  :props="deptProps"
                  node-key="id"
                  :filter-node-method="filterNode"
                  @node-click="onDeptNodeClick"
                ></el-tree>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="input-box" label="安 排 人：" prop="anpairen">
            <el-input v-model="form.anpairenId" readonly></el-input>
          </el-form-item>
          <!-- <el-form-item class="input-box" label="责 任 人：" prop="zerenrenId">
            <el-select v-model="form.zerenrenId" @on-change="zerenrenChange">
              <el-option
                v-for="(item, index) in userList"
                :key="index"
                :label="item.label"
                :value="item.value"
                >{{ item.label }}</el-option
              >
            </el-select>
          </el-form-item> -->
          <el-form-item
            class="input-box"
            label=" 执  行  人 ："
            prop="anpairen"
          >
            <el-select
              v-model="form.zhixingrenIds"
              multiple
              collapse-tags
              @change="zhixingrensChange"
              value-key="label"
            >
              <el-option
                v-for="(item, index) in zhixingren"
                :key="index"
                :label="item.label"
                :value="item.value"
                >{{ item.label }}</el-option
              >
            </el-select>
          </el-form-item>
          <el-form-item
            class="input-box check-leave"
            label="任务标题："
            prop="renwubiaoti"
          >
            <el-input v-model="form.renwubiaoti"></el-input>
          </el-form-item>
          <el-form-item
            class="input-box"
            label="任务类型："
            prop="renwuleixing"
          >
            <el-select v-model="form.renwuleixing">
              <el-option
                v-for="(item, index) in taskType"
                :key="index"
                :label="item.label"
                :value="item.value"
                >{{ item.label }}</el-option
              >
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="form.renwuleixing == '安全标准化建设'"
            class="input-box"
            label="标准化节点："
          >
            <el-select
              v-model="form.tier"
              ref="select"
              @focus="blurTier"
              filterable
              :filter-method="filterMethodTier"
            >
              <!-- <el-option
                v-for="(item, index) in tiers"
                :key="index"
                :label="item.name"
                :value="item.tier"
                >{{ item.name }}</el-option
              > -->
              <el-option :value="valueModel" :label="labelModel">
                <el-tree
                  :data="tiers"
                  :props="defaultProps"
                  :filter-node-method="filterNodeTier"
                  @node-click="onNodeClick"
                  ref="treeTier"
                ></el-tree>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="input-box" label="任务进度：" prop="isFinish">
            <el-select v-model="form.isFinish">
              <el-option
                v-for="(item, index) in finishList"
                :key="index"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
                >{{ item.label }}</el-option
              >
            </el-select>
          </el-form-item>
          <el-form-item
            class="input-box"
            label="开始时间："
            prop="renwukaishishijian"
          >
            <el-date-picker
              v-model="form.renwukaishishijian"
              type="date"
              :picker-options="pickerOptionsBegin"
              value-format="yyyy-MM-dd"
              placeholder="请选择开始时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            class="input-box"
            label="结束时间："
            prop="renwujiezhishijian"
          >
            <el-date-picker
              v-model="form.renwujiezhishijian"
              type="date"
              :picker-options="pickerOptionsEnd"
              value-format="yyyy-MM-dd"
              placeholder="请选择结束时间"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            class="input-box check-leave"
            label="紧急程度："
            style="width:41%;"
          >
            <el-checkbox v-model="form.$isZhongyao">重要</el-checkbox>
            <el-checkbox v-model="form.$isJinji">紧急</el-checkbox>
          </el-form-item>
          <el-form-item
            class="input-box check-leave"
            label="任务内容："
            prop="renwuneirong"
          >
            <el-input
              v-model="form.renwuneirong"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 6 }"
            ></el-input>
          </el-form-item>
          <div v-if="form.isFinish == 1" class="row" style="margin:0;">
            <el-form-item class="input-box" label="是否完成：">
              <el-select v-model="form.finishstatus" placeholder="请选择">
                <el-option
                  v-for="item in isOkArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="input-box" label="完成人：">
              <el-select v-model="form.finishuserid">
                <el-option
                  v-for="(item, index) in zhixingren"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                  >{{ item.label }}</el-option
                >
              </el-select>
            </el-form-item>
            <el-form-item class="input-box" label="完成附件：">
              <el-upload
                class="upload-demo"
                action="/api/blade-upload/upload/upload"
                :on-success="handleAvatarSuccess"
                multiple
                :limit="3"
                :file-list="fileList"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item class="input-box" label="完成时间：">
              <el-date-picker
                v-model="form.finishtime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择完成时间"
              ></el-date-picker>
            </el-form-item>
            <el-form-item class="input-box" label="完成描述：">
              <el-input
                v-model="form.finishremark"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6 }"
              ></el-input>
            </el-form-item>
          </div>
        </div>
      </scroll>
    </el-form>
    <div class="btn-panel">
      <el-button
        v-if="state.submit"
        type="primary"
        icon="md-checkmark"
        @click="submit"
        >{{ state.title }}</el-button
      >
      <el-button
        v-if="backShow"
        type="primary"
        icon="el-icon-arrow-left"
        @click="backToAdd"
        >返回新增</el-button
      >
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { getDicData } from "@/api/basics";
import { getUsersByDept } from "@/api/user";
import { getListTree } from "@/api/daily/schedule";
import {
  getRichengDetail,
  updateRicheng,
  addRicheng,
} from "@/api/daily/schedule";
import { getByIdDeptList } from "@/api/dept/productList";
import { getListProson } from "@/api/dept/noticelist";
import { toDoRuleValidate } from "@/const/schedule/todo";
import { getYDtree } from "@/api/daily/vehicle";
export default {
  name: "todo-detail",
  props: {
    value: Object,
  },
  data() {
    return {
      deptId: this.$store.getters.deptId,
      form: {},
      ruleValidate: toDoRuleValidate,
      add: {
        title: "新增",
        to: this.toInit,
        submit: addRicheng,
      },
      edit: {
        title: "编辑",
        to: this.toEdit,
        submit: updateRicheng,
      },
      view: {
        title: "查看",
        to: this.toEdit,
      },
      loading: false,
      taskType: [],
      userList: [],
      finishList: [
        { label: "未完成", value: 0 },
        { label: "完成", value: 1, disabled: true },
        { label: "超期完成", value: 2 },
      ],
      tiers: [],
      labelModel: "", // 输入框显示值
      valueModel: "", // 实际请求传值
      labeldept: "", // 输入框显示值
      valuedept: "", // 实际请求传值
      defaultProps: {
        children: "children",
        label: "name",
        value: "tier",
      },
      deptProps: {
        children: "children",
        label: "deptName",
      },
      isOkArr: [
        { label: "是", value: 1 },
        { label: "否", value: 0 },
      ],
      fileList: [],
      backShow: false,
      deptList: "",
      zhixingren: "",
      danweiid: "",
      disabled: false,
      pickerOptionsBegin: {
        disabledDate() {
          return;
        },
      },
      pickerOptionsEnd: {
        disabledDate() {
          return;
        },
      },
    };
  },
  computed: {
    state() {
      return this[this.value.state];
    },
  },
  watch: {
    value() {
      if (this.taskType.length == 0) {
        this.getDicData();
      }
      if (this.userList.length == 0) {
        this.getUsersByDept();
      }
      this.state.to();
    },
    danweiid() {
      this.getListProson(this.danweiid);
      this.getListTree(this.danweiid);
    },
    valuedept() {
      this.getListProson(this.valuedept);
      this.getListTree(this.valuedept);
    },
    "form.renwukaishishijian"(val) {
      this.pickerOptionsEnd.disabledDate = function(time) {
        return time.getTime() < dayjs(val);
      };
    },
    "form.renwujiezhishijian"(val) {
      this.pickerOptionsBegin.disabledDate = function(time) {
        return time.getTime() > dayjs(val);
      };
    },
  },
  mounted() {
    this.toInit();
    this.getUsersByDept();
    // this.getByIdDeptList();
    this.getYDtreeList();
  },
  methods: {
    // 获取所属单位
    // getByIdDeptList() {
    //   getByIdDeptList(this.$store.getters.deptId).then((res) => {
    //     this.deptList = res.data.data.map((el) => {
    //       el.label = el.deptName;
    //       el.value = el.id;
    //       return el;
    //     });
    //   });
    // },
    // 树 的数据
    getYDtreeList() {
      getYDtree(this.$store.getters.postId).then((res) => {
        this.deptList = res.data.data;
      });
    },
    // 获取执行人
    getListProson(deptId) {
      // let deptId = this.danweiid;
      // let current = 0;
      // let size = 0;
      // let deptName = "";
      // let account = "";
      // let realName = "";
      getListProson(deptId, 0, 0, "", "", "", "").then((res) => {
        this.zhixingren = res.data.data.records.map((el) => {
          el.label = el.name;
          el.value = el.id;
          return el;
        });
      });
    },
    // 获取标准化节点
    getListTree(deptId) {
      getListTree(deptId).then((res) => {
        this.tiers = res.data.data;
      });
    },
    // 切换选项
    onNodeClick(data, node) {
      this.labelModel = node.label;
      this.valueModel = data.tier;
      this.form.tier = this.valueModel;
      // this.$emit('selected', node.key);
      // this.$emit('change', node.data, node);
      this.$refs.select.blur(); // 收起下拉框
      this.$refs.select.focus(); // 获取焦点
    },
    // 切换选项
    onDeptNodeClick(data, node) {
      this.labeldept = node.label;
      this.valuedept = data.id;
      this.form.deptId = this.valuedept;
      this.$refs.selectDept.blur(); // 收起下拉框
      this.$refs.selectDept.focus(); // 获取焦点
    },
    // 选择器检索过滤方法
    filterMethod(query) {
      // 调用树形控件的过滤
      this.$refs.deptTree.filter(query);
      return true;
    },
    filterMethodTier(query) {
      // 调用树形控件的过滤
      this.$refs.treeTier.filter(query);
      return true;
    },
    // 失去焦点去除过滤方法
    blurDept() {
      this.$refs.deptTree.filter();
    },
    blurTier() {
      this.$refs.treeTier.filter();
    },
    // 树节点 过滤方法
    filterNode(value, data) {
      if (!value) return true;
      return data.deptName.indexOf(value) !== -1;
    },
    filterNodeTier(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 获取任务类型
    getDicData() {
      getDicData("taskType").then((res) => {
        this.taskType = res.data.data;
      });
    },
    // 获取所属人员
    getUsersByDept() {
      getUsersByDept(this.deptId).then((res) => {
        this.userList = res.data.data.map((item) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
      });
    },
    // 初始化表单
    toInit() {
      this.form = {
        // deptId: this.deptId,
        anpairen: this.$store.getters.userInfo.userName,
        anpairenId: this.$store.getters.userInfo.userName,
        $isJinji: 0,
        $isZhongyao: 0,
        tier: "",
        tiername: "",
        isFinish: 0,
      };
      this.valueModel = "";
      this.labelModel = "";
    },
    // 返回新增
    backToAdd() {
      this.$emit("to-detail", {
        state: "add",
        item: {},
      });
      this.finishList[2].disabled = true;
      this.$refs.form.resetFields();
      this.toInit();
      this.backShow = false;
    },
    // 编辑
    toEdit() {
      this.loading = true;
      this.backShow = true;
      this.finishList[1].disabled = false;
      this.disabled = false;
      getRichengDetail(this.value.item.id).then((res) => {
        let data = res.data.data;
        data.$isZhongyao = data.isZhongyao == 1;
        data.$isJinji = data.isJinji == 1;
        data.zhixingrenIds = data.zhixingrenIds
          .split(",")
          .map((n) => Number(n));
        // data.$taskTime = [data.renwukaishishijian, data.renwujiezhishijian];
        if (data.isFinish == 1) {
          this.disabled = true;
        } else {
          this.disabled = false;
        }
        if (data.anpairenId == this.$store.getters.userInfo.userId) {
          data.anpairenId = this.$store.getters.userInfo.userName;
        }
        this.getListProson(data.deptId);
        this.getListTree(data.deptId);
        this.labelModel = data.tiername;
        this.valueModel = data.tier;
        this.deptList.map((el) => {
          if (el.id == data.deptId) {
            data.deptId = el.deptName;
          } else if (el.children.length > 0) {
            el.children.map((val) => {
              if (val.id == data.deptId) {
                data.deptId = val.deptName;
              } else if (val.children.length > 0) {
                val.children.map((vac) => {
                  if (vac.id == data.deptId) {
                    data.deptId = vac.deptName;
                  } else if (vac.children.length > 0) {
                    vac.children.map((four) => {
                      if (four.id == data.deptId) {
                        data.deptId = four.deptName;
                      } else if (four.children.length > 0) {
                        four.children.map((five) => {
                          if (five.id == data.deptId) {
                            data.deptId = five.deptName;
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
        this.form = data;
        this.loading = false;
      });
    },
    // 责任人变化
    // zerenrenChange(item) {
    //   if (item) {
    //     this.form.zerenren = item.label;
    //   }
    // },
    // 所属单位
    danwei(val) {
      console.log(val);
      this.danweiid = val;
    },
    // 执行人变化
    zhixingrensChange(arr) {
      // this.form.zhixingrenIds = arr.map((item) => item.value).join();
      this.form.zhixingrenIds = arr;
    },
    // 提交
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.form.zhixingrenIds += this.form.zhixingrenIds.forEach((item) => {
            item = `${item},`;
            return item;
          });
          if (this.form.zhixingrenIds !== "") {
            this.form.zhixingrenIds = this.form.zhixingrenIds
              .split("undefined")
              .join("");
          }
          this.form.anpairenId = this.$store.getters.userInfo.userId;
          this.form.isDeleted = 0;
          this.form.tier =
            this.valueModel == "" ? this.form.tier : this.valueModel;
          this.form.tiername = this.labelModel;
          this.deptList.map((el) => {
            if (el.deptName == this.form.deptId) {
              this.form.deptId = el.id;
            } else if (el.children.length > 0) {
              el.children.map((val) => {
                if (val.deptName == this.form.deptId) {
                  this.form.deptId = val.id;
                } else if (val.children.length > 0) {
                  val.children.map((vac) => {
                    if (vac.deptName == this.form.deptId) {
                      this.form.deptId = vac.id;
                    } else if (vac.children.length > 0) {
                      vac.children.map((four) => {
                        if (four.deptName == this.form.deptId) {
                          this.form.deptId = four.id;
                        } else if (four.children.length > 0) {
                          four.children.map((five) => {
                            if (five.deptName == this.form.deptId) {
                              this.form.deptId = five.id;
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
          let data = this.form;
          data.isZhongyao = data.$isZhongyao ? 1 : 0;
          data.isJinji = data.$isJinji ? 1 : 0;
          // data.renwukaishishijian = dayjs(data.$taskTime[0]).format(
          //   "YYYY-MM-DD"
          // );
          // data.renwujiezhishijian = dayjs(data.$taskTime[1]).format(
          //   "YYYY-MM-DD"
          // );

          this.state.submit(data).then((res) => {
            let type = res.data.success ? "success" : "error";
            this.$message[type](res.data.msg);
            this.$refs.form.resetFields();
            this.toInit();
            this.$emit("update");
          });
        } else {
          this.$message.warning("请正确填写表单信息!");
        }
      });
    },
    // 附件上传成功后得方法
    handleAvatarSuccess(res) {
      this.form.finishimg = res.url;
    },
  },
};
</script>

<style lang="scss">
@import "./index.scss";

.todo-detail {
  $label-w: 90px;
  height: 100%;
  .row {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 0px 0px 20px 0px;
    .el-form-item {
      .el-form-item__label {
        padding: 0;
        // white-space: nowrap;
      }
      input {
        min-width: 220px;
      }
      // .el-textarea
      textarea {
        width: 32vw;
      }
      @media screen and (max-width: 1900px) {
        textarea {
          width: 31vw;
        }
      }
      @media screen and (max-width: 1776px) {
        textarea {
          width: 29vw;
        }
      }
      @media screen and (max-width: 1570px) {
        textarea {
          width: 21vw;
        }
      }
      .el-date-editor {
        width: 220px;
      }
      // label {
      //   width: 40%;
      // }
      // div {
      //   width: 100%;
      // }
    }
  }

  .ivu-form-item-content,
  .ivu-date-picker-rel,
  .ivu-date-picker {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }

  .check-leave {
    .ivu-form-item-content {
      justify-content: flex-end;
    }
    .ivu-checkbox {
      margin-right: 5px;
    }
  }
  .ivu-input,
  .ivu-select-selection {
    font-size: 15px;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #ddd;
    &:focus {
      border-bottom: 1px solid black !important;
      outline: none;
      box-shadow: none;
    }
  }
  .ivu-select-selected-value {
    font-size: 15px !important;
  }
  .ivu-form-item-label {
    // width: $label-w;
    font-weight: 800;
    white-space: nowrap;
    font-size: 15px;
  }

  .input-box {
    display: flex;
    align-items: center;
    margin-bottom: 30px;

    .label + div {
      width: calc(100% - #{$label-w});
    }
  }
  table {
    border-collapse: collapse;
    margin-bottom: 30px;
    tr,
    td {
      border: 1px solid #ddd;
    }
    td:nth-child(1) {
      @extend .ivu-form-item-label;
      padding: 0px 10px;
    }

    .ivu-input {
      border-bottom: none;
      height: 40px;
    }
    .ivu-form-item {
      margin-bottom: 0;
    }
    .ivu-form-item-error-tip {
      position: static;
    }
  }
  .form {
    height: calc(100% - 60px);
    padding: 20px 0px;
  }
  .btn-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    button {
      margin-right: 10px;
    }
  }
}
</style>
