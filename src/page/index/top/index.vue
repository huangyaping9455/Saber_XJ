<template>
  <div class="avue-top">
    <div class="top-bar__left">
      <div
        v-if="showCollapse"
        :class="[{ 'avue-breadcrumb--active': isCollapse }]"
        class="avue-breadcrumb"
      >
        <i class="icon-navicon" @click="setCollapse"></i>
      </div>
    </div>
    <div class="top-bar__title">
      <div v-if="showMenu" class="top-bar__item top-bar__item--show">
        <top-menu></top-menu>
      </div>
      <span v-if="showSearch" class="top-bar__item">
        <top-search></top-search>
      </span>
    </div>
    <div class="top-bar__right">
      <el-tooltip v-if="showColor" :content="$t('navbar.color')" effect="dark" placement="bottom">
        <div class="top-bar__item">
          <top-color></top-color>
        </div>
      </el-tooltip>
      <el-tooltip
        v-if="showDebug"
        :content="logsFlag ? $t('navbar.bug') : logsLen + $t('navbar.bugs')"
        effect="dark"
        placement="bottom"
      >
        <div class="top-bar__item">
          <top-logs></top-logs>
        </div>
      </el-tooltip>
      <el-tooltip v-if="showLock" :content="$t('navbar.lock')" effect="dark" placement="bottom">
        <div class="top-bar__item">
          <top-lock></top-lock>
        </div>
      </el-tooltip>
      <el-tooltip v-if="showTheme" :content="$t('navbar.theme')" effect="dark" placement="bottom">
        <div class="top-bar__item top-bar__item--show">
          <top-theme></top-theme>
        </div>
      </el-tooltip>
      <el-tooltip :content="$t('navbar.language')" effect="dark" placement="bottom">
        <div class="top-bar__item top-bar__item--show">
          <top-lang></top-lang>
        </div>
      </el-tooltip>
      <el-tooltip
        v-if="showFullScren"
        :content="
          isFullScren ? $t('navbar.screenfullF') : $t('navbar.screenfull')
        "
        effect="dark"
        placement="bottom"
      >
        <div class="top-bar__item">
          <i :class="isFullScren ? 'icon-tuichuquanping' : 'icon-quanping'" @click="handleScreen"></i>
        </div>
      </el-tooltip>
      <el-dropdown>
        <div class="menu">
          <img :src="userInfo.avatar" class="top-bar__img" />
          <span class="el-dropdown-link">
            {{ userInfo.userName }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
        </div>

        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <router-link to="/info/index">
              {{
              $t("navbar.userinfo")
              }}
            </router-link>
          </el-dropdown-item>
          <el-dropdown-item @click.native="checkPost">{{ $t("navbar.switchPost") }}</el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            {{
            $t("navbar.logOut")
            }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog :title="$t('navbar.switchPost')" :visible.sync="isSwitch">
      <el-table v-loading="loading" :data="postData" size="mini" style="width: 100%">
        <el-table-column prop="postName" label="岗位名称"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="{ row }">
            <el-button
              v-if="userInfo.postId == row.postId"
              disabled
              icon="el-icon-success"
              size="mini"
              @click="switchPost(row)"
            >当前</el-button>
            <el-button v-else icon="el-icon-setting" size="mini" @click="switchPost(row)">切换</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex';
import { fullscreenToggel, listenfullscreen } from '@/util/util';
import topLock from './top-lock';
import topMenu from './top-menu';
import topSearch from './top-search';
import topTheme from './top-theme';
import topLogs from './top-logs';
import topColor from './top-color';
import topLang from './top-lang';
import { checkPost } from '@/api/system/dept';
export default {
  name: 'top',
  components: {
    topLock,
    topMenu,
    topSearch,
    topTheme,
    topLogs,
    topColor,
    topLang
  },
  filters: {},
  data() {
    return {
      loading: false,
      isSwitch: false,
      postData: []
    };
  },
  computed: {
    ...mapState({
      showDebug: state => state.common.showDebug,
      showTheme: state => state.common.showTheme,
      showLock: state => state.common.showLock,
      showFullScren: state => state.common.showFullScren,
      showCollapse: state => state.common.showCollapse,
      showSearch: state => state.common.showSearch,
      showMenu: state => state.common.showMenu,
      showColor: state => state.common.showColor
    }),
    ...mapGetters([
      'userInfo',
      'isFullScren',
      'tagWel',
      'tagList',
      'isCollapse',
      'tag',
      'logsLen',
      'logsFlag'
    ])
  },
  created() {},
  mounted() {
    listenfullscreen(this.setScreen);
  },
  methods: {
    handleScreen() {
      fullscreenToggel();
    },
    setCollapse() {
      this.$store.commit('SET_COLLAPSE');
    },
    setScreen() {
      this.$store.commit('SET_FULLSCREN');
    },
    logout() {
      this.$confirm(this.$t('logoutTip'), this.$t('tip'), {
        confirmButtonText: this.$t('submitText'),
        cancelButtonText: this.$t('cancelText'),
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('FedLogOut');
        this.$router.push({ path: '/login' });
      });
    },
    checkPost() {
      this.isSwitch = true;
      this.loading = true;
      checkPost().then(({ data }) => {
        this.postData = data.data;
        this.loading = false;
      });
    },
    switchPost(row) {
      this.isSwitch = true;
      this.$store.dispatch('GetUserInfo', row.postId).then(() => {
        this.$message({
          message: `${row.postName}，切换成功`,
          type: 'success'
        });
        this.isSwitch = false;
        this.loading = false;
        setTimeout(() => {
          location.reload();
        }, 500);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.menu {
  cursor: pointer;
}
.el-popper[x-placement^='bottom'] {
  margin-top: 0px;
}
</style>
