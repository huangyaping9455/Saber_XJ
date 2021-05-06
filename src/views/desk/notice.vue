<template>
  <basic-container>
    <avue-crud
      v-model="form"
      :option="option"
      :data="data"
      :page="page"
      :permission="permissionList"
      :before-open="beforeOpen"
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
          v-if="permission.notice_delete"
          type="danger"
          size="small"
          icon="el-icon-delete"
          plain
          @click="handleDelete"
        >删 除</el-button>
      </template>
      <template slot="category" slot-scope="{row}">
        <el-tag>{{row.categoryName}}</el-tag>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { getList, remove, update, add, getNotice } from "@/api/dept/notice";
import { mapGetters } from "vuex";
import dayjs from "dayjs";
export default {
  data() {
    return {
      form: {},
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      selectionList: [],
      option: {
        tip: false,
        border: true,
        index: true,
        indexLabel: "序号",
        viewBtn: true,
        selection: true,
        height:"auto",
        calcHeight:200,
        column: [
          {
            label: "通知标题",
            prop: "title",
            row: false,
            search: false,
            span:12,
            rules: [
              {
                required: true,
                message: "请输入通知标题",
                trigger: "blur",
              },
            ],
          },
          {
            label: "通知类型",
            type: "select",
            row: false,
            span:12,
            dicUrl: "/api/blade-system/dict/dictionary?code=notice",
            props: {
              label: "dictValue",
              value: "id",
            },
            slot: true,
            prop: "category",
            search: false,
            rules: [
              {
                required: true,
                message: "请输入通知类型",
                trigger: "blur",
              },
            ],
          },
          {
            label: "通知日期",
            prop: "releaseTime",
            type: "date",
            row:false,
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
            span:12,
            rules: [
              {
                required: true,
                message: "请输入通知日期",
                trigger: "blur",
              },
            ],
          },
          {
            label: "通知内容",
            prop: "content",
            span: 24,
            minRows: 6,
            type: "textarea",
          },
        ],
      },
      data: [],
      beginTime:dayjs().subtract(1, "day").format("YYYY-MM-DD"),
      endTime:dayjs().format( "YYYY-MM-DD"),
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.notice_add, false),
        viewBtn: this.vaildData(this.permission.notice_view, false),
        delBtn: this.vaildData(this.permission.notice_delete, false),
        editBtn: this.vaildData(this.permission.notice_edit, false),
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach((ele) => {
        ids.push(ele.id);
      });
      return ids.join(",");
    },
  },
  methods: {
    rowSave(row, loading) {
      add(row).then(() => {
        loading();
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "操作成功!",
        });
      });
    },
    rowUpdate(row, index, loading) {
      update(row).then(() => {
        loading();
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "操作成功!",
        });
      });
    },
    rowDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return remove(row.id,this.$store.getters.userInfo.userId);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
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
        this.$message.warning("请选择至少一条数据");
        return;
      }
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return remove(this.ids,this.$store.getters.userInfo.userId);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          this.$refs.crud.toggleSelection();
        });
    },

    beforeOpen(done, type) {
      if (["edit", "view"].includes(type)) {
        getNotice(this.form.id).then((res) => {
          this.form = res.data.data;
        });
      }
      done();
    },
    onLoad(page, params = {beginTime:this.beginTime,endTime:this.endTime}) {
      getList(params,page.currentPage, page.pageSize,).then((res) => {
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
