<template>
  <div class="wel">
    <div class="dataTabs">
      <div class="tabs1">
        <div class="tabs-head">
          <span class="tabs-text">本周注册</span>
          <div class="refresh-time">
            <span>刷新时间: </span>
            <span>{{day}}</span>
          </div>
        </div>
        <el-divider></el-divider>
        <div class="tabs-body">
          <div class="tabs-body-left">
            <div class="tabs-imgs">
              <img src="../assets/icon/cheliang.png" alt="" srcset="" />
              <span>车辆数</span>
            </div>
            <span class="tabs-num">{{ tabNum.vehicleNum }}</span>
          </div>
          <el-divider direction="vertical"></el-divider>
          <div class="tabs-body-right">
            <div class="tabs-imgs">
              <img src="../assets/icon/qiye.png" alt="" srcset="" />
              <span>注册企业数</span>
            </div>
            <span class="tabs-num">{{ tabNum.qiyeNum }}</span>
          </div>
        </div>
      </div>
      <div class="tabs2">
        <div class="tabs-head">
          <span class="tabs-text">总注册数</span>
          <div class="refresh-time">
            <span>刷新时间: </span>
            <span>{{day}}</span>
          </div>
        </div>
        <el-divider></el-divider>
        <div class="tabs-body">
          <div class="tabs-body-left">
            <div class="tabs-imgs">
              <img src="../assets/icon/qiye.png" alt="" srcset="" />
              <span>企业数</span>
            </div>
            <span class="tabs-num">{{ tabNum.qiyeZNum }}</span>
          </div>
          <el-divider direction="vertical"></el-divider>
          <div class="tabs-body-right">
            <div class="tabs-imgs">
              <img src="../assets/icon/jiashiyuan.png" alt="" srcset="" />
              <span>驾驶员数</span>
            </div>
            <span class="tabs-num">{{ tabNum.jiashiyuanZNum }}</span>
          </div>
          <el-divider direction="vertical"></el-divider>
          <div class="tabs-body-right">
            <div class="tabs-imgs">
              <img src="../assets/icon/cheliang.png" alt="" srcset="" />
              <span>车辆数</span>
            </div>
            <span class="tabs-num">{{ tabNum.vehicleZNum }}</span>
          </div>
        </div>
      </div>
      <div class="tabs3">
        <div class="tabs-head">
          <span class="tabs-text">其他企业数</span>
          <div class="refresh-time">
            <span>刷新时间: </span>
            <span>{{day}}</span>
          </div>
        </div>
        <el-divider></el-divider>
        <div class="tabs-body">
          <div class="tabs-body-left">
            <div class="tabs-imgs">
              <img src="../assets/icon/anquan.png" alt="" srcset="" />
              <span>安全标准化生产</span>
            </div>
            <span class="tabs-num">{{ tabNum.biaozhunhuaNum }}</span>
          </div>
          <el-divider direction="vertical"></el-divider>
          <div class="tabs-body-right">
            <div class="tabs-imgs">
              <img src="../assets/icon/qita.png" alt="" srcset="" />
              <span>未绑定地区</span>
            </div>
            <span class="tabs-num">{{ tabNum.weibangdingAreaNum }}</span>
          </div>
        </div>
      </div>
    </div>
    <basic-container>
      <avue-crud :option="option" :data="data" :page="page" style="height:60vh;"></avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import iframe from "@/mixins/iframe.js";
import { selectOperational,richengIndex } from "@/api/wel";
import dayjs from "dayjs";
export default {
  name: "wel",
  mixins: [iframe],
  data() {
    return {
      tabNum: "",
      day:dayjs().format('YYYY-MM-DD HH:mm'),
      page: {
          pageSize: 20,
          pagerCount:1
        },
      data: [
        {
          rw: "这是一条工作任务",
          nr: "这是一条很长很长很长很长很长很长很长很长很长的工作内容",
          sj: "2019-01-01",
        },
        {
          rw: "这是一条工作任务",
          nr: "这是一条很长很长很长很长很长很长很长很长很长的工作内容",
          sj: "2019-01-01",
        },
        {
          rw: "这是一条工作任务",
          nr: "这是一条很长很长很长很长很长很长很长很长很长的工作内容",
          sj: "2019-01-01",
        },
        {
          rw: "这是一条工作任务",
          nr: "这是一条很长很长很长很长很长很长很长很长很长的工作内容",
          sj: "2019-01-01",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
    option() {
      return {
        index: true,
        indexLabel:'序号',
        height: "auto",
        calcHeight: "41vh",
        border: false,
        addBtn: false,
        menu: false,
        page:true,
        align:'center',
        column: [
          {
            label: this.$t("wel.table.rw"),
            prop: "rw",
          },
          {
            width: 500,
            label: this.$t("wel.table.nr"),
            prop: "nr",
            overHidden: true,
          },
          {
            label: this.$t("wel.table.sj"),
            prop: "sj",
          },
        ],
      };
    },
  },
  mounted() {
    this.selectOperational();
    let _this = this;
    setInterval(function() {
      _this.day = dayjs().format('YYYY-MM-DD HH:mm');
    }, 60000);
    this.richengIndex();
  },
  methods: {
    selectOperational() {
      selectOperational(this.$store.getters.deptId).then((res) => {
        this.tabNum = res.data.data[0];
      });
    },
    richengIndex(){
      richengIndex(dayjs().format('YYYY-MM-DD'),this.$store.getters.deptId).then(res=>{
        this.data=res.data.data;
      })
    },
  },
};
</script>

<style scoped="scoped" lang="scss">
.wel {
  padding: 1vh;
  .dataTabs {
    display: flex;
    justify-content: space-between;
    padding-bottom: 2vh;
    // .tabs1,
    // .tabs2,
    // .tabs3 {
    //   flex: 0 0 33%;
    //   height: 20vh;
    // }
    .tabs1,
    .tabs2,
    .tabs3 {
      background-image: url("../assets/blue.png");
      background-size: 100% 100%;
      color: white;
      flex: 0 0 32.5%;
      height: 20vh;
      .tabs-head {
        display: flex;
        justify-content: space-between;
        padding: 1vh 2vh;
        .tabs-text {
          font-size: 16px;
        }
      }
      .el-divider--horizontal {
        margin: 0 4%;
        width: 92%;
        background-color: white;
      }
      .tabs-body {
        display: flex;
        .tabs-body-left,
        .tabs-body-right {
          width: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 3vh 1vh;
          line-height: 8vh;
          .tabs-imgs {
            display: flex;
            height: 3vh;
            line-height: 3vh;
            img {
              height: 100%;
              width: 3vh;
              background-color: white;
              border-radius: 50%;
              margin-right: 1vh;
              padding: 0.5vh;
            }
            span {
              font-size: 1.6vh;
            }
          }
          .tabs-num {
            font-size: 3.5vh;
            font-weight: 600;
          }
        }
        .el-divider--vertical {
          height: 10vh;
          margin: 2vh;
          background-color: white;
        }
      }
    }
    .tabs2 {
      background-image: url("../assets/yellow.png");
      background-size: 100% 100%;
    }
    .tabs3 {
      background-image: url("../assets/green.png");
      background-size: 100% 100%;
    }
  }
}
</style>
