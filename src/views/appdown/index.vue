<template>
  <div class="head">
    <div class="head-text">
      <img src="../../assets/icon/司机app服务端.png" alt />
      <span>司机APP服务端</span>
    </div>
    <div>
      <el-button class="button" @click="down">下载</el-button>
    </div>
    <div class="weixin-tip">
      <p>点击右上角 选择 在浏览器中打开</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    // this.INIT("vehicle-config");
  },
  methods: {
    down() {
      function is_weixin() {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
          return true;
        } else {
          return false;
        }
      }
      var isWeixin = is_weixin();
      if (isWeixin) {
        let weixintip = document.getElementsByClassName("weixin-tip")[0];
        weixintip.style.display = "block";
      } else {
        window.location.href =
        this.$store.getters.userInfo.urlPrefix+"AttachFiles/2020/09/app/1601351606864.apk";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}

.head {
  background: #f5f5f5;
  padding-top: 10vh;
  /* height: 63.5rem; */
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
}

.head-text {
  display: flex;
  flex-direction: column;
}

img {
  width: 18rem;
}

span {
  font-family: "幼圆";
  font-size: 38px;
  margin: 3rem auto;
}

.button {
  margin: 45px auto 20px;
  width: 150px;
  height: 70px;
  line-height: 70px;
  text-align: center;
  font-size: 30px;
  color: #fff;
  border-radius: 10rem;
  background-color: rgb(89, 126, 212);
}

.weixin-tip {
  display: none;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  filter: alpha(opacity=80);
  height: 100%;
  width: 100%;
  z-index: 100;
}

.weixin-tip p {
  color: white;
  font-size: 30px;
  font-weight: 600;
  font-family: Georgia, "Times New Roman", Times, serif;
  border: 2px double #fff;
  border-width: 10px;
  margin: 22vh auto;
  padding: 1.5rem;
  width: 68vw;
  text-align: center;
}
</style>
