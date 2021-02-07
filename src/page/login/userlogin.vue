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
        @click.native.prevent="handleLogin"
        >{{ $t("login.submit") }}</el-button
      >
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
      loginForm: {
        vercode: "",
        username: "",
        password: "",
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
    };
  },
  computed: {
    ...mapGetters(["tagWel"]),
  },
  mounted() {
    this.getVerCode();
    if (this.$dev) {
      this.loginForm.username = "admin";
      this.loginForm.password = "mxcx2019";
    }
  },
  methods: {
    getVerCode() {
      verificationCode().then((res) => {
        this.verCode = res.data.data;
      });
    },
    showPassword() {
      this.passwordType == ""
        ? (this.passwordType = "password")
        : (this.passwordType = "");
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$store
            .dispatch("LoginByUsername", this.loginForm)
            .then(() => {
              this.$router.push({ path: this.tagWel.value });
            })
            .catch(() => {})
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
