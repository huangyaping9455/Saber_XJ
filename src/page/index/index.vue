<template>
  <div class="avue-contail" :class="{ 'avue--collapse': isCollapse }">
    <template v-if="isIframe">
      <router-view class="avue-view" />
    </template>
    <template v-else>
      <div class="avue-header">
        <!-- 顶部导航栏 -->
        <top></top>
      </div>

      <div class="avue-layout">
        <div class="avue-left">
          <!-- 左侧导航栏 -->
          <sidebar></sidebar>
        </div>
        <div class="avue-main">
          <!-- 顶部标签卡 -->
          <tags></tags>
          <!-- 主体视图层 -->
          <div class="route-view">
            <keep-alive>
              <router-view class="avue-view" v-if="$route.meta.$keepAlive" />
            </keep-alive>
            <router-view class="avue-view" v-if="!$route.meta.$keepAlive" />
          </div>
        </div>
      </div>
      <div class="avue-shade" @click="showCollapse"></div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import tags from "./tags";
import top from "./top/";
import sidebar from "./sidebar/";
import admin from "@/util/admin";
export default {
  name: "index",
  components: {
    top,
    tags,
    sidebar,
  },
  data() {
    return {
      inlaying: true,
    };
  },
  computed: mapGetters(["isLock", "isCollapse", "website", "isIframe"]),
  mounted() {
    this.init();
  },
  methods: {
    showCollapse() {
      this.$store.commit("SET_COLLAPSE");
    },
    // 屏幕检测
    init() {
      this.$store.commit("SET_SCREEN", admin.getScreen());
      window.onresize = () => {
        setTimeout(() => {
          this.$store.commit("SET_SCREEN", admin.getScreen());
        }, 0);
      };
    },
  },
};
</script>
