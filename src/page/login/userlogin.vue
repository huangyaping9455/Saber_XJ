<template>
  <el-form
    ref="loginForm"
    :rules="loginRules"
    :model="loginForm"
    class="login-form"
    status-icon
    label-width="0"
  >
    <el-form-item prop="username">
      <el-input
        v-model="loginForm.username"
        :placeholder="$t('login.username')"
        size="small"
        auto-complete="off"
        @keyup.enter.native="handleLogin"
      >
        <i slot="prefix" class="icon-yonghu"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        v-model="loginForm.password"
        :type="passwordType"
        :placeholder="$t('login.password')"
        size="small"
        auto-complete="off"
      >
        <i
          slot="suffix"
          class="el-icon-view el-input__icon"
          @click="showPassword"
        ></i>
        <i slot="prefix" class="icon-mima"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="vercode">
      <el-input
        v-model="loginForm.vercode"
        placeholder="验证码"
        size="small"
        auto-complete="off"
        @keyup.enter.native="handleLogin"
      >
        <template slot="prepend">
          <img :src="verCode" class="ver-code" @click="getVerCode" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        size="small"
        class="login-submit"
        :disabled="subDisabled"
        @click.native.prevent="handleLogin"
      >
        <!-- <span v-if="maxtime >= 0">{{ submsg }}</span> -->
        <span>{{ $t("login.submit") }}</span>
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { verificationCode } from "@/api/user";

export default {
  name: "userlogin",
  data() {
    return {
      verCode: "",
      subDisabled: false,
      submsg: "",
      loginForm: {
        vercode: "",
        username: "",
        password: "",
        type: 0,
      },
      loginRules: {
        verCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 5, message: "密码长度最少为6位", trigger: "blur" },
        ],
      },
      passwordType: "password",
      maxtime: 10,
    };
  },
  computed: {
    ...mapGetters(["tagWel"]),
  },
  mounted() {
    this.getVerCode();
    // this.timerCount();
    if (this.$dev) {
      this.loginForm.username = "admin";
      this.loginForm.password = "mxcx2019";
    }
  },
  methods: {
    // 获取验证码
    getVerCode() {
      verificationCode().then((res) => {
        this.verCode = res.data.data.account;
      });
    },
    showPassword() {
      this.passwordType == ""
        ? (this.passwordType = "password")
        : (this.passwordType = "");
    },
    // 倒计时
    CountDown() {
      if (this.maxtime >= 0) {
        this.subDisabled = true;
        let minutes = Math.floor(this.maxtime / 60);
        let seconds = Math.floor(this.maxtime % 60);
        this.submsg = "请在" + minutes + "分" + seconds + "秒后重新登录";
        // console.log(this.submsg);
        // if (this.maxtime == 5 * 60) alert("还剩5分钟");
        --this.maxtime;
      } else {
        clearInterval(this.timerCount());
        this.subDisabled = false;
        // console.log("时间到，结束!");
      }
    },
    // 倒计时定时器
    timerCount() {
      let _this = this;
      let timecount = setInterval(function() {
        _this.CountDown();
      }, 1000);
      return timecount;
    },
    // 登录
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$store
            .dispatch("LoginByUsername", this.loginForm)
            .then((res) => {
              // 登录时添加提示，若密码强度太低，提醒修改密码，3.5秒后自动消失
              if (this.$store.getters.userInfo.passWord === "123456") {
                this.$notify.warning({
                  title: "提示",
                  dangerouslyUseHTMLString: true,
                  message: `<div><span>您的密码强度太低，请</span>
                            <a style="margin-left:2px;cursor: pointer;color:#409EFF;" href="/#/info">修改密码</a>
                            </div>`,
                  duration: 3500,
                  offset: 40,
                });
              }
              // 跳转首页
              this.$router.push({ path: this.tagWel.value });
            })
            .catch((rej) => {
              // if (rej == "Error: 账户或密码错误,您还有2次登录机会") {
              //   this.subDisabled = true;
              // }
            })
            .finally(() => {
              this.getVerCode();
            });
        }
      });
    },
  },
};
</script>

<style></style>
