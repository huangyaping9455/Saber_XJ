<template>
  <div class="avue-sidebar">
    <logo></logo>
    <el-scrollbar style="height:100%">
      <div v-if="validatenull(menu)" class="avue-sidebar--tip">{{$t('menuTip')}}</div>
      <el-menu
        :default-active="nowTagValue"
        :show-timeout="200"
        :collapse="keyCollapse"
        unique-opened
        mode="vertical"
      >
        <sidebar-item
          :menu="menu"
          :screen="screen"
          :props="website.menu.props"
          :collapse="keyCollapse"
          first
        ></sidebar-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import logo from "../logo";
import sidebarItem from "./sidebarItem";
export default {
  name: "sidebar",
  components: { sidebarItem, logo },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["website", "menu", "tag", "keyCollapse", "screen"]),
    nowTagValue: function () {
      return this.$router.$avueRouter.getValue(this.$route);
    },
  },
  created() {
    this.$store.dispatch("GetMenu").then((data) => {
      if (data.length === 0) return;
      this.$router.$avueRouter.formatRoutes(data, true);
    });
  },
};
</script>
<style lang="scss" scoped>
</style>

