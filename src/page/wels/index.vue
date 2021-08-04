<template>
  <div class="wel-body">
    <span>加载中，请稍后···</span>
    <img src="@/assets/loading2.gif" alt="" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["tagWel"]),
  },
  mounted() {
    setTimeout(this.login(), 5000);
    // this.login();
  },
  methods: {
    login() {
      let formData = {
        username: this.GetParameter("username"),
        password: this.GetParameter("password"),
        vercode: "",
        type: 1,
      };
      this.$store.dispatch("LoginByUsername", formData).then((res) => {
        // this.$router.push({ path: this.tagWel.value });
        window.location.href = "/";
      });
    },
    // 解析url地址
    GetParameter(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    },
  },
};
</script>

<style lang="scss" scoped>
.wel-body {
  width: 100%;
  height: 100vh;
  background-image: url("../../assets/wel.png");
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  span {
    font-size: 5vmin;
    color: white;
  }
  img {
    width: 20%;
    height: 17vmin;
  }
}
</style>
