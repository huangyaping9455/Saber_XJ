<style lang="scss" scoped>
.schedule-list.new {
  .title-box {
    background-color: #ffffff !important;
    color: #666666;
  }
  .pointer {
    color: #01a0ff;
    font-size: 25px;
    width: 25px;
    height: 25px;
    margin-top: 10px;
    margin-left: 4px;
    cursor: pointer;
  }
  .tab-info {
    display: flex;
    align-items: center;
    .filter {
      height: auto;
      margin-left: 2.5vh;
    }
  }
  .tab-box {
    height: 40px;
    span {
      display: block;
      height: 40px;
      line-height: 30px;
    }
    &.checked {
      color: #01a0ff;
      background: transparent !important;
    }
    &.checked:after {
      position: absolute;
      left: 10%;
      content: "";
      display: inline-block;
      bottom: 0;
      width: 80%;
      height: 4px;
      border-radius: 2px;
      background: #01a0ff;
    }
  }
  .filter-input {
    display: flex;
    width: 100%;
    line-height: 5vh;
    span {
      width: 20%;
      white-space: nowrap;
    }
    .el-select,
    .el-input {
      width: 80%;
    }
  }
  /deep/ .el-dialog__footer {
    text-align: center;
  }
}
.nodata {
  height: 100%;
  text-align: center;
}
@media screen and (min-width: 1276px) and (max-width: 1528px) {
  .schedule-list.new {
    .title-box {
      height: 30px !important;
    }
    .time-title {
      font-size: 14px !important;
      line-height: 30px !important;
    }
    .pointer {
      width: 16px;
      height: 16px;
    }
    .tab-box {
      height: 20px;
      span {
        font-size: 12px;
        height: 20px;
        line-height: 10px;
      }
    }
    .content-box {
      height: 100% !important;
      overflow-y: auto;
    }
  }
}
</style>

<template>
  <div class="schedule-list new">
    <div class="title-box">
      <span class="time-title">
        {{ selectDay.date }} 待办事项
        <!-- <i class="el-icon-folder-add pointer" @click="toAdd"></i> -->
      </span>
      <div class="tab-info">
        <div
          v-for="(item, index) in todoTab"
          :key="index"
          :class="['tab-box', { checked: checkedindex == index }]"
          @click="changedaiban(index, item)"
        >
          <el-badge class="item badge" :max="99" :value="item.total">
            <span>{{ item.text }}</span>
          </el-badge>
        </div>
        <el-button type="primary" class="filter" @click="filterShow"
          >筛选</el-button
        >
      </div>
    </div>
    <div class="content-box">
      <p v-if="select.total == 0 && !loading" class="nodata">
        <img src="@/assets/nodata.png" />
      </p>
      <scroll v-else>
        <ul>
          <li
            v-for="(item, index) in select.list"
            :key="index"
            :class="getClass(item).name"
          >
            <img :src="getClass(item).img" class="grade-icon" />
            <span class="title-p">
              <span class="title">
                {{ item.renwubiaoti }}
                <!-- <span v-if="item.isZerenren" class="mark">责</span> -->
              </span>

              <!-- <span class="subtext">责任人: {{ item.zerenren }}</span> -->
              <span class="subtext">安排人: {{ item.anpairen }}</span>
              <span class="subtext">
                任务周期： {{ item.renwukaishishijian }} -
                {{ item.renwujiezhishijian }}
              </span>
            </span>
            <div class="remark">
              <div class="info">
                <span class="info-img">
                  <img src="@/assets/leixing.png" alt />
                  {{ item.renwuleixing }}
                </span>
                <!-- <span class="info-date">
                  任务周期：{{ item.renwukaishishijian }} -
                  {{ item.renwujiezhishijian }}
                </span> -->
                <span
                  v-if="!item.isFinish && item.chaoqitianshu > 0"
                  class="info-img num"
                >
                  {{ item.chaoqitianshu > 0 ? "超期" : "剩余" }}
                  <b>{{ Math.abs(item.chaoqitianshu) }}</b
                  >天
                </span>
              </div>
              <el-button
                type="text"
                style="margin-right:1vh;font-size:30px;"
                @click="removeShow(item)"
                icon="el-icon-delete-solid"
              ></el-button>
              <span
                v-if="!item.isFinish"
                class="edit-btn"
                @click="toEdit(item)"
              >
                <img src="@/assets/edit.png" alt />
              </span>
              <span v-else class="wancheng" @click="toView(item)">
                <img src="@/assets/wancheng.png" alt />
              </span>
            </div>
          </li>
        </ul>
      </scroll>
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>确定要删除此条事项吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deletTrue">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="筛选" :visible.sync="filterVisible" width="30%">
      <div class="filter-input">
        <span>任务标题：</span>
        <el-input v-model="renwubiaoti" clearable></el-input>
      </div>
      <div class="filter-input">
        <span>任务进度：</span>
        <el-select v-model="isFinish" clearable>
          <el-option
            v-for="(item, index) in finishList"
            :key="index"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
            >{{ item.label }}</el-option
          >
        </el-select>
      </div>
      <div class="filter-input">
        <span>任务类型：</span>
        <el-select v-model="renwuleixing" clearable>
          <el-option
            v-for="(item, index) in taskType"
            :key="index"
            :label="item.label"
            :value="item.value"
            >{{ item.label }}</el-option
          >
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="filterVisible = false">取 消</el-button>
        <el-button type="primary" @click="filterTrue">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getRichengList,
  getChaoqiRicheng,
  getAnpaiRicheng,
  removeRiChang,
} from "@/api/daily/schedule";
import { getDicData } from "@/api/basics";
export default {
  name: "schedule-todo",
  props: {
    value: Object,
    selectDay: Object,
  },
  data() {
    return {
      deptId: this.$store.getters.deptId,
      loading: false,
      checkedindex: 0,
      // myList: [],
      todayList: [],
      overdueList: [],
      dialogVisible: false,
      removeId: "",
      filterVisible: false,
      taskType: [],
      renwubiaoti: "",
      renwuleixing: "",
      isFinish: "",
      finishList: [
        { label: "未完成", value: 0 },
        { label: "完成", value: 1 },
        { label: "超期完成", value: 2 },
      ],
    };
  },
  computed: {
    todoTab() {
      return [
        {
          text: "今日",
          class: "bg-cyan",
          total: this.todayList.length ? this.todayList.length : 0,
          list: this.todayList,
        },
        // {
        //   text: "我的",
        //   class: "bg-cyan",
        //   total: this.myList.length,
        //   list: this.myList,
        // },
        {
          text: "超期",
          class: "bg-red",
          total: this.overdueList.length,
          list: this.overdueList,
        },
      ];
    },
    select() {
      return this.todoTab[this.checkedindex];
    },
  },
  watch: {
    "selectDay.date": {
      immediate: true,
      handler() {
        if (this.selectDay.date) {
          this.getRichengList();
          // this.getAnpaiRicheng();
          this.getChaoqiRicheng();
        }
      },
    },
    checkedindex() {
      //  this.renwubiaoti="";
      //  this.renwuleixing="";
      //  this.isFinish="";
      //  if (this.checkedindex == 0) {
      //     this.getRichengList();
      //   } else if (this.checkedindex == 1) {
      //     this.getAnpaiRicheng();
      //   } else {
      //     this.getChaoqiRicheng();
      //   }
    },
  },
  mounted() {
    // this.getChaoqiRicheng();
    // this.getAnpaiRicheng();
    this.getDicData();
  },
  methods: {
    getClass(item) {
      let name = "li-normal";
      let img = require("@/assets/todo-normal.png");
      if (item.isJinji == 1) {
        name = "li-orgin";
        img = require("@/assets/zhong.png");
      }
      if (item.isZhongyao == 1) {
        name = "li-blue";
        img = require("@/assets/ji.png");
      }
      if (item.isZhongyao == 1 && item.isJinji == 1) {
        name = "li-red";
        img = require("@/assets/zhong-ji.png");
      }
      if (item.isFinish == 3) {
        name = "li-wancheng";
        img = require("@/assets/todo-wancheng.png");
      }
      return { name, img };
      return name;
    },
    changedaiban(index) {
      this.checkedindex = index;
    },
    // 获取任务类型
    getDicData() {
      getDicData("taskType").then((res) => {
        this.taskType = res.data.data;
      });
    },
    toView(item) {
      this.$emit("to-detail", {
        state: "view",
        item,
      });
    },
    toAdd() {
      this.$emit("to-detail", {
        state: "add",
        item: {},
      });
    },
    toEdit(item) {
      this.$emit("to-detail", { state: "edit", item });
    },
    getRichengList() {
      this.loading = true;
      getRichengList(
        this.deptId,
        this.selectDay.date,
        0,
        0,
        this.renwubiaoti,
        this.isFinish,
        this.renwuleixing
      ).then((res) => {
        this.todayList = res.data.data.records;
        this.loading = false;
      });
    },
    // getAnpaiRicheng() {
    //   getAnpaiRicheng(
    //     this.deptId,
    //     this.selectDay.date,
    //     0,
    //     0,
    //     this.renwubiaoti,
    //     this.isFinish,
    //     this.renwuleixing
    //   ).then((res) => {
    //     this.myList = res.data.data.records;
    //   });
    // },
    getChaoqiRicheng() {
      getChaoqiRicheng(
        this.deptId,
        this.selectDay.date,
        0,
        0,
        this.renwubiaoti,
        this.isFinish,
        this.renwuleixing
      ).then((res) => {
        this.overdueList = res.data.data.records;
      });
    },
    // 删除弹框显示
    removeShow(item) {
      this.removeId = item.id;
      this.dialogVisible = true;
    },
    // 删除
    deletTrue() {
      removeRiChang(
        this.removeId,
        this.$store.state.user.userInfo.userId,
        this.$store.getters.userInfo.userName
      ).then((res) => {
        if (res.data.code == 200) {
          this.dialogVisible = false;
          this.$message.success(res.data.msg);
          if (this.checkedindex == 0) {
            this.getRichengList();
          }
          // else if (this.checkedindex == 1) {
          //   this.getAnpaiRicheng();
          // }
          else {
            this.getChaoqiRicheng();
          }
        } else {
          this.dialogVisible = false;
          this.$message.error(res.data.msg);
        }
      });
    },
    // 筛选 弹框显示
    filterShow() {
      this.filterVisible = true;
    },
    // 筛选 确定
    filterTrue() {
      if (this.checkedindex == 0) {
        this.getRichengList();
        this.filterVisible = false;
      }
      // else if (this.checkedindex == 1) {
      //   this.getAnpaiRicheng();
      //   this.filterVisible = false;
      // }
      else {
        this.getChaoqiRicheng();
        this.filterVisible = false;
      }
    },
  },
};
</script>
<style lang="scss"></style>
