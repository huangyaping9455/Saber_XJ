import {
  mapGetters
} from "vuex";
import {
  deepClone
} from "@/util/util";
import mockMap from "@/const/field/mock";
import ruleMap from "@/const/field/rule";
import dateMap from "@/const/field/date";
import iframe from "./iframe";
import {
  getConfig,
  getDicData,
  getList,
  getDetail,
  getField,
  insert,
  update,
  remove,
  removeFiles,
}
from "@/api/basics";
import {
  getByIdDeptList,
}
from "@/api/dept/productList";
import {
  getSheng
}
from "@/api/dept/productList";
export default {
  mixins: [iframe],
  data() {
    return {
      // testdata 用来存机构类型
      testdata: null,
      // 是否初始化完毕
      ISLOAD: false,
      // 模块配置项
      CONFIG: {},
      // 模块字段项
      FIELD: [],
      // 表单数据
      formData: {
        id: -1,
      },

      // 表单源数据
      formOriginData: {},
      // 表格 loading data 搜素参数 排序参数 分页参数
      tableLoading: false,
      tableData: [],
      tableSearch: "",
      driveSearchChange: "",
      tableSort: {
        orderColumn: "",
        order: 0,
      },
      page: {
        pageSizes: [20, 30, 50, 100],
        total: 10,
        currentPage: 1,
        pageSize: 20,
      },
    };
  },
  computed: {
    // 岗位id 企业id
    ...mapGetters(["postId", "deptId"]),
    // curd form 字段配置
    fieldColumn() {
      return Object.keys(this.FIELD)
        .map((key) => this.FIELD[key])
        .sort((a, b) => a.sort - b.sort);
    },
    // curd form 主配置
    option() {
      let isIframe = this.$store.state.common.isIframe;
      let iframeOption = {
        addBtn: true,
        viewBtn: true,
        editBtn: true,
        delBtn: true,
        menuWidth: 150,
        ...(this.iframeOption || {}),
      };
      let baseOption = {
        // title: this.$store.getters.tag.label,
        dialogFullscreen: false,
        dialogHeight: 600,
        dialogWidth: "75%",
        border: true,
        viewBtn: true,
        submitBtn: true,
        emptyBtn: true,
        selection: true,
        reserveSelection: false,
        tip: false,
        // excelBtn: true,
        searchBtn: false,
        // height: 666,
        height: "auto",
        calcHeight: 240,
        searchShow: false,
        labelWidth: 125,
        labelPosition: "left",
        menuWidth: 250,
        ...(this.baseOption || {}),
        ...(isIframe ? iframeOption : {}),
      };

      return {
        ...baseOption,
        mock: process.env.NODE_ENV !== "production",
        column: this.fieldColumn,
      };
    },
    // 字段为上传组件的 keys 集合
    uploadKeys() {
      let kyes = [];
      this.fieldColumn.forEach((item) => {
        if (item.type == "upload") kyes.push(item.prop);
      });
      return kyes;
    },
    removeFileIds() {
      return this.getRmoveFileIds();
    },
  },
  watch: {
    // 监听数据切换
    "formData.id"(newV) {
      if (newV) {
        this.setOriginData(this.formData);
      } else {
        this.setOriginData({}, false);
      }
    },
  },
  methods: {
    // 初始化
    INIT(token) {
      // console.log("初始化", token);
      return this.getConfig(token).then(this.getField);
    },
    // 获取配置
    getConfig(token) {
      token = token || this.$route.path;
      return getConfig(token).then((res) => {
        this.CONFIG = res.data.data;
      });
    },
    // 获取字段
    getField() {
      return getField(this.CONFIG.viewField, this.deptId).then((res) => {
        this.FIELD = this.buildFieldMap(res.data.data);
      });
    },
    // 获取数据
    getList({
      page = this.page,
      search = this.tableSearch,
      sort = this.tableSort,
      other = {},
    } = {}) {
      const api = this.CONFIG.viewModel;
      if (!api) return;
      let postId;
      // if (this.option.title == "机构管理") {
      postId = this.node.id;
      // } else {
      //   postId = "";
      // }
      let params = {
        deptId: this.deptId,
        postId,
        current: page.currentPage,
        size: page.pageSize,
        ...search,
        ...sort,
        ...other,
      };
      this.tableLoading = true;
      return getList(api, params).then((res) => {
        res.data.data.records = res.data.data.records.map((i) => {
          if (i.ranliaoxiaohaofujian) {
            i.ranliaoxiaohaofujian = eval(i.ranliaoxiaohaofujian);
          }
          if (i.cheliangzhaopian) {
            i.cheliangzhaopian = eval(i.cheliangzhaopian);
          }
          if (i.fujian) {
            i.fujian = eval(i.fujian);
          }
          if (i.jidongchejiashizheng) {
            i.jidongchejiashizheng = eval(i.jidongchejiashizheng);
          }
          return i;
        })
        let data = res.data.data;
        this.tableLoading = false;
        if (JSON.stringify(data) == "{}") return;
        this.page.total = data.total;
        this.page.currentPage = data.current;
        // this.tableData = data.records.map((item) => this.receiveHandle(item));
        this.tableData = this.receiveHandle(data.records);
        // this.tableData = data.records;
      });
    },
    // 获取详情
    getDetail(id) {
      return getDetail(this.CONFIG.detailModel, id).then((res) => {
        this.formData = this.receiveHandle(res.data.data);
        // testdata 存 机构类型
        this.testdata = res.data.data.jigouleixing;
      });
      // }
    },
    // 分页触发器，初始化加载数据，
    onLoad(page) {
      this.$nextTick(() =>
        this.getList({
          page,
        })
      );
    },
    // 搜索触发器
    searchChange() {
      this.getList();
    },
    // 刷新触发器
    refreshChange() {
      this.getList(this.page.currentPage = 1);
    },
    // 排序触发器
    sortChange(sort) {
      this.tableSort.orderColumn = sort.prop;
      this.tableSort.order = sort.order === "descending" ? 0 : 1;
      this.getList();
    },
    // 弹出框beforeopen
    beforeOpen(done, type) {
      if (type == "add") {
        this.FIELD.password.value = "123456"
      }
      done();
    },
    // 设置源数据
    setOriginData(data, isDeepClone = true) {
      this.formOriginData = isDeepClone ? deepClone(data) : data;
    },
    // 接收数据前的处理
    receiveHandle(data) {
      // 转换 upload 参数，将 json字符串 转成 json 数组
      this.uploadKeys.forEach((key) => {
        let item = data[key];
        if (!item) return;
        let i = JSON.parse(item, function (k, v) {
          return v;
        })
        try {
          data[key] = item.length == 0 ? [] : i;
        } catch (error) {
          data[key] = [];
          console.error(key + "报错：" + error);
        }
      });
      return data;
    },
    // 发送数据前的处理
    sendHandle(data) {
      // 转换 upload 参数, 取所有附件的 saveId 拼接成 ids 字符串
      let newData = Object.assign({}, data);
      this.uploadKeys.forEach((key) => {
        let ids = "";
        // let item = newData[key];
        // if (!item) return;
        if (!newData[key]) return;
        if (newData[key].length && newData[key].length != 0) {
          newData[key].forEach((file) => {
            ids += `${file.url.split("/").pop()},`;
          });
        }
        newData[key] = ids;
      });
      return newData;
    },
    // 获取被移除文件的 ids
    getRmoveFileIds() {
      let originIds = [];
      let currentIds = [];
      this.uploadKeys.forEach((key) => {
        let origin = this.formOriginData[key];
        let data = this.formData[key];
        if (origin && data) {
          origin.forEach((file) => originIds.push(file.id));
          data.forEach((file) => currentIds.push(file.id));
        }
      });
      return originIds.filter((id) => !currentIds.includes(id)) || [];
    },
    // 删除被移除的附件
    removeFiles(ids = this.removeFileIds) {
      if (ids.length > 0) {
        removeFiles(ids.join(","));
      }
    },
    // 获取当前时间
    getNowFormatDate() { //获取当前时间
      let date = new Date();
      let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1; //获取月,如果小于10,前面补个0
      let strDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate(); //获取日,如果小于10,前面补个0
      let strHours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(); //获取小时,如果小于10,前面补个0
      let strMinutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(); //获取分,如果小于10,前面补个0
      let strSeconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds(); //获取秒,如果小于10,前面补个0
      let currentdate = date.getFullYear() + "-" + month + "-" + strDate + " " + strHours + ":" + strMinutes + ":" + strSeconds;
      return currentdate; //返回
    },

    /**
     * 列表新增 or 表单新增
     * @param {Object} row 表单数据默认是 this.formData
     * @param {Function} callback 回调函数
     * @param {Boolean} list 是否更新列表
     * @returns {undefined}
     */
    rowSave(row = this.formData, callback, list = true) {
      if (row.jigouleixing == "") return this.$message.warning("请选择机构类型");
      if ((row.jigouleixing == "qiye" || row.jigouleixing == "shiZF" || row.jigouleixing == "xianZF" || row.jigouleixing == "shengZF") && row.province == "") return this.$message.warning("请绑定 省 市 县 ");
      row.deptId = this.deptId;
      // 修改时去除车辆牌照和终端id得首尾空格
      if (this.formData.cheliangpaizhao) {
        row.cheliangpaizhao = this.formData.cheliangpaizhao.replace(/(^\s*)|(\s*$)/g, "");
        row.zongduanid = this.formData.zongduanid.replace(/(^\s*)|(\s*$)/g, "");
      }
      delete row.id;
      delete row.isdelete;
      insert(this.CONFIG.insertModel, this.sendHandle(row)).then((res) => {
        this.$message({
          type: "success",
          message: res.data.msg,
        });
        list && this.getList();
        callback && callback(res);
        // this.requestNewData(); //树 懒加载刷新方法
      });
    },

    /**
     * 列表更新 or 表单更新
     * @param {Object} row 表单数据默认是 this.formData
     * @param {Number} index 列表中当前更新行索引
     * @param {Function} callback 回调函数
     * @param {Boolean} list 是否更新列表
     * @returns {undefined}
     */

    rowUpdate(row = this.formData, index, callback, list = true) {
      if (row.jigouleixing == "") return this.$message.warning("请选择机构类型");
      if ((row.jigouleixing == "qiye" || row.jigouleixing == "shiZF" || row.jigouleixing == "xianZF" || row.jigouleixing == "shengZF") && row.province == "") return this.$message.warning("请绑定 省 市 县 ");
      // 修改时去除车辆牌照和终端id得首尾空格
      if (this.formData.cheliangpaizhao) {
        row.cheliangpaizhao = this.formData.cheliangpaizhao.replace(/(^\s*)|(\s*$)/g, "");
        row.zongduanid = this.formData.zongduanid.replace(/(^\s*)|(\s*$)/g, "");
      }
      row.caozuoren = this.$store.getters.userInfo.userName;
      row.caozuorenid = this.$store.getters.userInfo.userId;
      if (row.caozuoshijian == "" || row.createtime == "") {
        row.caozuoshijian = this.getNowFormatDate();
        row.createtime = this.getNowFormatDate();
      }
      row.isdelete = 0;
      if (this.nodeData.extendType == "岗位" || this.nodeData.extendType == "部门") {
        row.deptId = this.nodeData.id;
        row.id = this.nodeData.id;
      }
      if (row.jigouleixing === "qiye" || row.jigouleixing === "geti" || row.jigouleixing === "qita") {
        if (row.province !== row.$province || row.province == "") {
          update(this.CONFIG.updateModel, this.sendHandle(row)).then((res) => {
            this.$message({
              type: "success",
              message: res.data.msg,
            });
            list && this.getList();
            callback && callback(res);
          });
        } else {
          getSheng(this.$store.getters.deptId, 0, 1).then(res => {
            res.data.data.map(el => {
              if (el.deptName === row.province) {
                row.province = el.id;
                if (row.city !== "") {
                  getSheng(el.id, 1, 1).then(ren => {
                    ren.data.data.map(val => {
                      if (val.deptName === row.city) {
                        row.city = val.id;
                        if (row.country !== "") {
                          getSheng(val.id, 2, 1).then(rec => {
                            rec.data.data.map(vac => {
                              if (vac.deptName === row.country) {
                                row.country = vac.id;
                                update(this.CONFIG.updateModel, this.sendHandle(row)).then((res) => {
                                  this.$message({
                                    type: "success",
                                    message: res.data.msg,
                                  });
                                  list && this.getList();
                                  callback && callback(res);
                                });
                              }
                            });
                          })
                        } else {
                          update(this.CONFIG.updateModel, this.sendHandle(row)).then((res) => {
                            this.$message({
                              type: "success",
                              message: res.data.msg,
                            });
                            list && this.getList();
                            callback && callback(res);
                          });
                        }
                      }
                    });
                  })
                } else {
                  update(this.CONFIG.updateModel, this.sendHandle(row)).then((res) => {
                    this.$message({
                      type: "success",
                      message: res.data.msg,
                    });
                    list && this.getList();
                    callback && callback(res);
                  });
                }
              }
            });
          })
        }
      } else {
        update(this.CONFIG.updateModel, this.sendHandle(row)).then((res) => {
          this.$message({
            type: "success",
            message: res.data.msg,
          });
          list && this.getList();
          callback && callback(res);
          // this.requestNewData(); //树 懒加载刷新方法
        });
      }
      this.removeFiles();
    },

    /**
     * 列表删除 or 表单删除
     * @param {Object} row 表单数据默认是 this.formData
     * @param {Function} callback 回调函数
     * @param {Boolean} list 是否更新列表
     * @returns {undefined}
     */
    rowDel(row = this.formData, callback, list = true) {
      this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => remove(this.CONFIG.removeModel, row.id))
        .then((res) => {
          this.$message({
            type: "success",
            message: res.data.msg,
          });
          list && this.getList();
          if (callback && typeof callback == "function")
            callback && callback(res);
          // this.requestNewData(); //树 懒加载刷新方法
        });
    },

    /**
     * 构建字段 Map 对象
     * @param {Array} fieldList 字段数组
     * @returns {Object} 字段对象
     */
    buildFieldMap(fieldList) {
      let map = {};
      fieldList.forEach((item) => {
        // 设置字段模拟数据
        if (item.mockKey) item.mock = mockMap[item.mockKey].config;
        // 设置字段字典数据
        if (item.dicKey) {
          item.dicData = [];
          getDicData(item.dicKey).then((res) => {
            item.dicData = res.data.data;
          });
        }
        // 设置 uoload 组件参数
        if (item.type == "upload") {
          item.props = {
            label: "name",
            value: "url",
          };
          const action = "/api/blade-upload/upload/upload";
          item.action = `${action}?fileId=${item.prop}&table=${item.table}`;
        }
        // 设置字段校验规则
        if (item.required || item.ruleKey) {
          let rule = {
            trigger: item.trigger || "submit",
          };
          if (item.required) {
            rule.required = true;
            rule.message = `${item.label} 为必填字段`;
          }
          if (item.ruleKey) {
            rule.validator = ruleMap[item.ruleKey].validator;
            rule.regx = ruleMap[item.ruleKey].regx;
            rule.message = ruleMap[item.ruleKey].message;
          }
          item.rules = [rule];
        }
        // 设置日期类型的格式化
        let dateType = ["date", "datetime", "time"];
        if (dateType.includes(item.type)) {
          item.format = dateMap[item.type];
          item.valueFormat = dateMap[item.type];
          item.mock.format = dateMap[item.type];
        }

        // 设置自定义规则
        item = this.customSetField ? this.customSetField(item) : item;
        // 设置字段索引对象
        map[item.prop] = item;
      });
      // 构建结束
      this.ISLOAD = true;
      return map;
    },
  },
};