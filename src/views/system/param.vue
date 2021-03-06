<template>
  <basic-container>
    <avue-crud ref="crud"
               v-model="form"
               :option="option"
               :data="data"
               :page="page"
               :permission="permissionList"
               @row-del="rowDel"
               @row-update="rowUpdate"
               @row-save="rowSave"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-button v-if="permission.param_delete"
                   type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   @click="handleDelete">删 除
        </el-button>
      </template>
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
  import {getList, remove, update, add,} from '@/api/system/param';
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
          selection: true,
          viewBtn: true,
          column: [
            {
              label: '参数名称',
              prop: 'paramName',
              search: true,
              rules: [{
                required: true,
                message: '请输入参数名称',
                trigger: 'blur',
              },],
            },
            {
              label: '参数键名',
              prop: 'paramKey',
              search: true,
              rules: [{
                required: true,
                message: '请输入参数键名',
                trigger: 'blur',
              },],
            },
            {
              label: '参数键值',
              prop: 'paramValue',
              rules: [{
                required: true,
                message: '请输入参数键值',
                trigger: 'blur',
              },],
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
          addBtn: this.vaildData(this.permission.param_add, false),
          viewBtn: this.vaildData(this.permission.param_view, false),
          delBtn: this.vaildData(this.permission.param_delete, false),
          editBtn: this.vaildData(this.permission.param_edit, false),
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(',');
      },
    },
    methods: {
      rowSave(row, loading) {
        add(row).then(() => {
          loading();
          this.onLoad(this.page);
          this.$message({
            type: 'success',
            message: '操作成功!',
          });
        });
      },
      rowUpdate(row, index, loading) {
        update(row).then(() => {
          loading();
          this.onLoad(this.page);
          this.$message({
            type: 'success',
            message: '操作成功!',
          });
        });
      },
      rowDel(row) {
        this.$confirm('确定将选择数据删除?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            return remove(row.id);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: 'success',
              message: '操作成功!',
            });
          });
      },
      searchReset() {
        this.onLoad(this.page);
      },
      searchChange(params) {
        this.onLoad(this.page, params);
      },
      selectionChange(list) {
        this.selectionList = list;
      },
      handleDelete() {
        if (this.selectionList.length === 0) {
          this.$message.warning('请选择至少一条数据');
          return;
        }
        this.$confirm('确定将选择数据删除?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            return remove(this.ids);
          })
          .then(() => {
            this.$message({
              type: 'success',
              message: '操作成功!',
            });
            this.$refs.crud.toggleSelection();
          });
      },
      onLoad(page, params = {}) {
        getList(page.currentPage, page.pageSize, params).then(res => {
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
