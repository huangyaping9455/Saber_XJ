<template>
  <basic-container>
    <avue-crud ref="crud"
               v-model="form"
               :option="option"
               :data="data"
               :permission="permissionList"
               :page="page"
               :before-open="beforeOpen"
               @search-change="searchChange"
               @search-reset="searchReset"
               @on-load="onLoad">
      <template slot="roleId"
                slot-scope="{row}">
        <el-tag>{{row.roleName}}</el-tag>
      </template>
      <template slot="deptId"
                slot-scope="{row}">
        <el-tag>{{row.deptName}}</el-tag>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getUsualList, getUsualLogs,} from '@/api/logs';
  import {mapGetters,} from 'vuex';

  export default {
    data() {
      return {
        form: {},
        selectionList: [],
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0,
        },
        option: {
          tip: false,
          border: true,
          index: true,
          viewBtn: true,
          editBtn: false,
          addBtn: false,
          delBtn: false,
          menuWidth: 120,
          column: [
            {
              label: '服务id',
              prop: 'serviceId',
              search: true,
            },
            {
              label: '服务host',
              prop: 'serverHost',
              search: true,
            },
            {
              label: '服务ip',
              prop: 'serverIp',
            },
            {
              label: '软件环境',
              prop: 'env',
            },
            {
              label: '日志级别',
              prop: 'logLevel',
            },
            {
              label: '日志id',
              prop: 'logId',
            },
            {
              label: '请求接口',
              prop: 'requestUri',
            },
            {
              label: '日志时间',
              prop: 'logData',
            },
            {
              label: '用户代理',
              prop: 'userAgent',
              span: 24,
              hide: true,
            },
            {
              label: '请求数据',
              prop: 'params',
              type: 'textarea',
              span: 24,
              minRows: 2,
              hide: true,
            },
          ],
        },
        data: [],
      };
    },
    computed: {
      ...mapGetters(['permission',]),
      permissionList() {
        return {
          viewBtn: this.vaildData(this.permission.log_usual_view, false),
        };
      },
    },
    methods: {
      searchReset() {
        this.onLoad(this.page);
      },
      searchChange(params) {
        this.onLoad(this.page, params);
      },
      beforeOpen(done, type) {
        if (['edit', 'view',].includes(type)) {
          getUsualLogs(this.form.strId).then(res => {
            this.form = res.data.data;
          });
        }
        done();
      },
      onLoad(page, params = {}) {
        getUsualList(page.currentPage, page.pageSize, params).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
        });
      },
    },
  };
</script>

<style>
</style>
