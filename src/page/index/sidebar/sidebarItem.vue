<template>
  <div class="menu-wrapper">
    <template v-for="item in menu">
      <el-menu-item
        v-if="validatenull(item[childrenKey]) && vaildRoles(item)"
        v-show="isHide(item)"
        :key="item[labelKey]"
        :index="item[pathKey]"
        :class="{ 'is-active': vaildAvtive(item) }"
        @click="open(item)"
      >
        <i :class="item[iconKey]"></i>
        <span slot="title" :alt="item[pathKey]">{{ generateTitle(item) }}</span>
      </el-menu-item>

      <el-submenu
        v-else-if="!validatenull(item[childrenKey]) && vaildRoles(item)"
        v-show="isHide(item)"
        :key="item[labelKey]"
        :index="item[pathKey]"
      >
        <template slot="title">
          <i :class="item[iconKey]"></i>
          <span
            slot="title"
            :class="{ 'el-menu--display': collapse && first }"
          >{{ generateTitle(item) }}</span>
        </template>
        <template v-for="(child, cindex) in item[childrenKey]">
          <el-menu-item
            v-if="validatenull(child[childrenKey])"
            v-show="isHide(child)"
            :key="child[labelKey]"
            :index="child[pathKey]"
            :class="{ 'is-active': vaildAvtive(child) }"
            @click="open(child)"
          >
            <i :class="child[iconKey]"></i>
            <span slot="title">{{ generateTitle(child) }}</span>
          </el-menu-item>
          <!-- 循环 -->
          <sidebar-item
            v-else
            :key="cindex"
            :menu="[child]"
            :props="props"
            :screen="screen"
            :collapse="collapse"
          ></sidebar-item>
        </template>
      </el-submenu>
    </template>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { validatenull } from "@/util/validate";
import config from "./config.js";
export default {
  name: "sidebarItem",
  props: {
    menu: {
      type: Array,
    },
    screen: {
      type: Number,
    },
    first: {
      type: Boolean,
      default: false,
    },
    props: {
      type: Object,
      default: () => {
        return {};
      },
    },
    collapse: {
      type: Boolean,
    },
  },
  data() {
    return {
      config: config,
    };
  },
  computed: {
    ...mapGetters(["roles"]),
    labelKey() {
      return this.props.label || this.config.propsDefault.label;
    },
    pathKey() {
      return this.props.path || this.config.propsDefault.path;
    },
    iconKey() {
      return this.props.icon || this.config.propsDefault.icon;
    },
    childrenKey() {
      return this.props.children || this.config.propsDefault.children;
    },
    nowTagValue() {
      return this.$router.$avueRouter.getValue(this.$route);
    },
  },
  created() {},
  mounted() {},
  methods: {
    isHide(item) {
      return item.hideMenu != 1;
    },
    generateTitle(item) {
      return this.$router.$avueRouter.generateTitle(
        item[this.labelKey],
        (item.meta || {}).i18n
      );
    },
    vaildAvtive(item) {
      const groupFlag = (item["group"] || []).some((ele) =>
        this.$route.path.includes(ele)
      );
      return this.nowTagValue === item[this.pathKey] || groupFlag;
    },
    vaildRoles(item) {
      item.meta = item.meta || {};
      return item.meta.roles ? item.meta.roles.includes(this.roles) : true;
    },
    validatenull(val) {
      return validatenull(val);
    },
    open(item) {
      if (this.screen <= 1) this.$store.commit("SET_COLLAPSE");
      this.$router.$avueRouter.group = item.group;
      this.$router.$avueRouter.meta = item.meta;
      const path = this.$router.$avueRouter.getPath({
        name: item[this.labelKey],
        src: item[this.pathKey],
        i18n: (item.meta || {}).i18n,
      });
      this.$router.push({
        path,
      });
    },
  },
};
</script>

