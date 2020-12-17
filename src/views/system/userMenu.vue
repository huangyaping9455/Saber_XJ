<template>
  <basic-container class="user-menu">
    <avue-crud
      ref="crud"
      v-model="form"
      :option="option"
      :data="data"
      :permission="permissionList"
      @row-del="rowDel"
      @row-update="rowUpdate"
      @row-save="rowSave"
      @search-change="searchChange"
      @search-reset="searchReset"
      @selection-change="selectionChange"
      @on-load="onLoad"
    >
      <template slot="menuLeft">
        <el-button
          v-if="permission.menu_delete"
          type="danger"
          size="small"
          icon="el-icon-delete"
          plain
          @click="handleDelete"
        >删 除</el-button>
      </template>

      <template slot="roleId" slot-scope="{row}">
        <el-tag>{{row.roleName}}</el-tag>
      </template>

      <template slot="source" slot-scope="{row}">
        <div v-if="row.source" class="source-form">
          <img :src="row.source" />
        </div>
      </template>

      <template slot="deptId" slot-scope="{row}">
        <el-tag>{{row.deptName}}</el-tag>
      </template>

      <div slot="sourceForm" slot-scope="{row}">
        <div v-if="row.source" class="source-form">
          <img :src="row.source" />
        </div>
        <el-button size="mini" @click="dialog=true">选择</el-button>
        <el-button size="mini" @click="delIcon(row)">删除</el-button>
      </div>
    </avue-crud>

    <el-dialog title="选择图标" :visible.sync="dialog" width="50%" class="icon-list">
      <el-radio-group v-model="selectIconIndex" class="icon-content">
        <el-radio v-for="(img,index) in iconList" :key="index" class="icon-group" :label="index">
          <img :src="img" />
        </el-radio>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialog = false">取消</el-button>
        <el-button type="primary" size="mini" @click="selectIcon">确 定</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
import { getList, remove, update, add } from '@/api/system/userMenu';
import iconList from '@/config/iconPng.js';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      iconList,
      dialog: false,
      selectIconIndex: -1,
      form: {},
      selectionList: [],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      option: {
        tip: false,
        dialogWidth: '60%',
        tree: true,
        border: true,
        index: true,
        selection: true,
        viewBtn: true,
        column: [
          {
            label: '菜单名称',
            prop: 'name',
            search: true,
            overHidden: true,
            rules: [
              {
                required: true,
                message: '请输入菜单名称',
                trigger: 'blur'
              }
            ]
          },

          {
            label: '路由地址',
            prop: 'path',
            overHidden: true,
            rules: [
              {
                required: true,
                message: '请输入路由地址',
                trigger: 'blur'
              }
            ]
          },

          {
            label: '上级菜单',
            prop: 'parentId',
            type: 'tree',
            dicUrl: '/api/blade-system/menu/ABtree',
            hide: true,
            props: {
              label: 'title'
            },
            rules: [
              {
                required: false,
                message: '请选择上级菜单',
                trigger: 'click'
              }
            ]
          },
          {
            label: '路由类型',
            prop: 'routerType',
            type: 'select',
            dicData: [
              {
                label: '运维端',
                value: 1
              },
              {
                label: '用户端',
                value: 2
              }
            ],
            hide: true,
            valueDefault: 2
          },
          {
            label: '菜单排序',
            prop: 'sort',
            type: 'number',
            rules: [
              {
                required: true,
                message: '请输入菜单排序',
                trigger: 'blur'
              }
            ]
          },
          {
            label: '菜单类型',
            prop: 'category',
            type: 'radio',
            dicData: [
              {
                label: '菜单',
                value: 1
              },
              {
                label: '按钮',
                value: 2
              }
            ],
            hide: true,
            rules: [
              {
                required: true,
                message: '请选择菜单类型',
                trigger: 'blur'
              }
            ]
          },
          {
            label: '菜单图标',
            prop: 'source',
            slot: true,
            formslot: true,
            valueDefault: ''
          }
        ]
      },
      data: []
    };
  },

  computed: {
    ...mapGetters(['permission']),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.menu_add, false),
        viewBtn: this.vaildData(this.permission.menu_view, false),
        delBtn: this.vaildData(this.permission.menu_delete, false),
        editBtn: this.vaildData(this.permission.menu_edit, false)
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(',');
    }
  },
  methods: {
    rowSave(row, loading) {
      add(row).then(() => {
        loading();
        this.onLoad(this.page);
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
      });
    },
    rowUpdate(row, index, loading) {
      update(row).then(() => {
        loading();
        this.onLoad(this.page);
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
      });
    },
    rowDel(row) {
      this.$confirm('确定将选择数据删除?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: 'success',
            message: '操作成功!'
          });
        });
    },
    selectIcon() {
      let img = this.iconList[this.selectIconIndex];
      if (img) {
        this.form.source = img;
        this.dialog = false;
      } else {
        this.$message('请先选择图标');
      }
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
    delIcon(row) {
      row.source = '';
    },
    handleDelete() {
      if (this.selectionList.length === 0) {
        this.$message.warning('请选择至少一条数据');
        return;
      }
      this.$confirm('确定将选择数据删除?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return remove(this.ids);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: 'success',
            message: '操作成功!'
          });
          this.$refs.crud.toggleSelection();
        });
    },
    onLoad(page, params = {}) {
      getList(page.currentPage, page.pageSize, params).then(res => {
        let data = res.data.data;
        data.forEach(item => item.routerType == 0 && (item.routerType = 2));
        this.data = data;
      });
    }
  }
};
</script>

<style lang='scss'>
.user-menu {
  .icon-list {
    .el-dialog__body {
      background: #93c1ea7a;
    }

    .icon-content {
      display: flex;
      flex-wrap: wrap;

      .el-radio {
        display: flex;
        align-items: center;
      }
    }
  }
}
.source-form {
  display: inline-flex;
  align-items: center;
  img {
    background: #93c1ea7a;
    margin: 0px 5px;
  }
}
</style>
