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
      <template slot-scope="{}" slot="menu">
        <el-button
          size="small"
          type="primary"
          @click.native="tip()"
          style="width:4rem;"
          >{{ status }}</el-button
        >
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import {
  getList,
  remove,
  update,
  add,
  getNotice,
  getStatus,
  getfild,
} from "@/api/dept/noticelist";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      status: "禁用",
      // scope: "{}",
      // menuForm: "menu",
      statu: "",
      data: [],
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
        // index: true,
        // viewBtn: true,
        menu: true,
        menuWidth: 80,
        menuPosition: "center",
        menuAlign: "center",
        menuType: "button",
        menuBtnTitle: "",
        menuTitle: "",
        editBtn: false,
        delBtn: false,
        selection: false,
        // page: false,
        align: "center",
        menuAlign: "center",
        column: [
          // {
          //   label: "类型",
          //   prop: "title",
          //   row: true,
          //   search: true,
          //   rules: [
          //     {
          //       required: true,
          //       message: "请输入...",
          //       trigger: "blur",
          //     },
          //   ],
          // },
          {
            label: "id",
            prop: "id",
            type: "text",
            width: 50,
          },
          {
            label: "类型",
            type: "text",
            prop: "type",
            width: 80,
            // row: true,
            // props: {
            //   label: "dictValue",
            //   value: "dictKey",
            // },
            // slot: true,
            // prop: "category",
            // search: true,
            // rules: [
            //   {
            //     required: true,
            //     message: "请输入通知类型",
            //     trigger: "blur",
            //   },
            // ],
          },
          {
            label: "版本号",
            prop: "version",
            type: "text",
            width: 80,
          },
          {
            label: "创建日期",
            prop: "createtime",
            type: "date",
            format: "yyyy-MM-dd hh:mm:ss",
            valueFormat: "yyyy-MM-dd hh:mm:ss",
            width: 130,
            rules: [
              {
                required: true,
                message: "请输入通知日期",
                trigger: "blur",
              },
            ],
          },
          {
            label: "创建人姓名",
            prop: "createuser",
            type: "text",
            width: 100,
          },
          {
            label: "android地址",
            prop: "androidurl",
            // type: "input",
            // type: "text",
            type: "upload",
            // append: "upload",
            width: 200,
            data: {
              // file,
              // fileld,
              // table,
            },
            // headers: "multipart/form-data",
            // action: "/api/blade-upload/upload/upload",
          },
          {
            label: "ios地址",
            prop: "iosurl",
            // type: "text",
            type: "upload",
            width: 200,
            headers: "multipart/form-data",
            action: "/api/blade-upload/upload/upload",
          },
          {
            label: "描述",
            prop: "remark",
            type: "textarea",
            width: 200,
          },
          {
            label: "状态",
            prop: "isdeleted",
            type: "text",
            // dicUrl: "/api/blade-platform/platform/appVersionInfo/update",
            // dicMethod: "post",
            // dicQuery: {
            //   isdeleted: "启用",
            //   updateuser: "安全管理平台",
            //   updatetime: "2020-07-27 17:38:30",
            // },
            props: {
              // label: "dictValue",
              // value: "dictKey",
            },
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.notice_add, false),
        // viewBtn: this.vaildData(this.permission.notice_view, false),
        // delBtn: this.vaildData(this.permission.notice_delete, false),
        // editBtn: this.vaildData(this.permission.notice_edit, false),
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
      console.log(row);
      // row = this.form;
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
          return remove(row.id);
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
          return remove(this.ids);
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
      // console.log(this);
      // console.log(done, type);
      if (["edit", "view"].includes(type)) {
        getNotice(this.form.id).then((res) => {
          this.form = res.data.data;
        });
        // let data = {
        // file,
        // fileld,
        // table,
        // };
        // getfild(data).then((res) => {});
      }
      done();
    },
    onLoad(page, params = {}) {
      let dept = this.$store.getters.deptId;
      let current = page.currentPage;
      let size = page.pageSize;
      getList(dept, current, size).then((res) => {
        const data = res.data.data;
        // console.log(res);
        this.page.total = data.total;
        this.page.pageSize = data.size;
        this.page.currentPage = data.current;
        this.data = data.records;
        for (let i in data.records) {
          if (data.records[i].isdeleted == "启用") {
            this.status = "禁用";
          } else {
            this.status = "启用";
          }
        }
      });
    },
    tip() {
      let isdeleted = this.status;
      getStatus(isdeleted).then((res) => {
        for (let j in this.data) {
          if (this.data[j].isdeleted == "启用") {
            this.data[j].isdeleted = "禁用";
            this.status = "启用";
          } else {
            this.data[j].isdeleted = "启用";
            this.status = "禁用";
          }
        }
      });
    },
  },
};
</script>

<style></style>
