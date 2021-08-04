<template>
  <el-dialog
    title="修改密码"
    :visible.sync="upasdVisible"
    @close="close"
    width="30%"
  >
    <el-form
      :label-position="left"
      label-width="100px"
      :model="form"
      :rules="rules"
      ref="ruleForm"
    >
      <el-form-item label="原密码" prop="oldpassword">
        <el-input
          type="password"
          v-model="form.oldpassword"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newpassword">
        <el-input
          type="password"
          v-model="form.newpassword"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="password">
        <el-input type="password" v-model="form.password" clearable></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="upasdVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { changepassword } from "@/api/user";

export default {
  props: {
    node: Object,
    tableRow: Object,
  },
  data() {
    const validatePass = (rule, value, callback) => {
      const pasd = /^\S*(?=\S{6,})(?=\S*\d)(?=\S*[a-zA-Z])\S*$/;
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else if (pasd.test(value) === false) {
        callback(new Error("强度不够 , 密码为字母和数字的组合 且不少于6位"));
      } else if (value === this.form.oldpassword) {
        callback(new Error("新密码与旧密码一致"));
      } else {
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value !== this.form.newpassword) {
        callback(new Error("确认密码与新密码不一致"));
      } else {
        callback();
      }
    };
    return {
      form: {
        oldpassword: "",
        newpassword: "",
        password: "",
      },
      upasdVisible: false,
      rules: {
        oldpassword: [
          { required: true, message: "请输入原密码", trigger: "blur" },
        ],
        newpassword: [
          { required: true, validator: validatePass, trigger: "blur" },
        ],
        password: [
          { required: true, validator: validatePass2, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    //   提交
    handleSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let userId = this.tableRow.userid;
          let oldpassword = this.form.oldpassword;
          let password = this.form.password;
          changepassword(userId, oldpassword, password).then((res) => {
            if (res.data.code === 200) {
              this.upasdVisible = false;
              this.$message({
                message: res.data.msg,
                type: "success",
              });
            } else {
              this.$message({
                message: res.data.msg,
                type: "error",
              });
            }
          });
        } else {
          this.$message.error("提交错误");
          return false;
        }
      });
    },
    close() {
      this.form.oldpassword = "";
      this.form.newpassword = "";
      this.form.password = "";
      this.$refs.ruleForm.clearValidate();
    },
  },
};
</script>

<style></style>
