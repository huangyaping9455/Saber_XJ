<template>
  <div>
    <basic-container>
      <avue-tabs v-model="form" :option="option" @change="handleChange" @submit="handleSubmit"></avue-tabs>
    </basic-container>
  </div>
</template>

<script>
import option from '@/const/user/info';
import { changepassword } from '@/api/user';

export default {
  data() {
    return {
      type: 'info',
      option: option,
      form: {}
    };
  },
  created() {
    this.handleWitch();
  },
  methods: {
    handleSubmit() {
      let userId = this.$store.state.user.userInfo.userId;
      let oldpassword = this.form.oldpassword;
      let password = this.form.newpassword;
      if (!this.form) return;
      if (password === this.form.newpasswords) {
        changepassword(userId, oldpassword, password).then(res => {
          this.$message({
            message: res.data.msg,
            type: 'success'
          });
        });
      } else {
        this.$message({
          message: '确认密码和新密码不相同',
          type: 'error'
        });
      }
    },
    handleWitch() {},
    handleChange(item) {
      this.type = item.prop;
      this.handleWitch();
    }
  }
};
</script>

<style>
</style>
