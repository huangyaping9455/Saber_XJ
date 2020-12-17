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
} from "@/api/basics";
// 定义全局变量 获取省市县id
let provinceId;
let provinceName;
let cityId;
let cityName;
let countryId;
let countryName;
export default {
  mixins: [iframe],
  data() {
    return {
      // 省市县 value 及 option
      value1: "",
      value2: "",
      value3: "",
      options2: [],
      options3: [],
      // testdata 用来存机构类型
      testdata: null,
      // provinceId: this.provinceId,
      // cityId: this.cityId,
      // countryId: this.countryId,

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
        pageSizes: [10, 20, 30, 50],
        total: 10,
        currentPage: 1,
        pageSize: 10,
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
        title: this.$store.getters.tag.label,
        dialogFullscreen: true,
        dialogHeight: "100%",
        border: true,
        viewBtn: true,
        submitBtn: true,
        emptyBtn: true,
        // excelBtn: true,
        searchBtn: false,
        height: 666,
        // maxHeight: 700,
        // menuPosition: "right",
        // searchGutter: "160",
        searchShow: false,
        labelWidth: 120,
        labelPosition: "left",
        menuWidth: 350,
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
      if (this.option.title == "机构管理") {
        postId = this.node.id;
      } else {
        postId = "";
      }
      let params = {
        deptId: this.deptId,
        postId,
        current: page.currentPage,
        size: page.pageSize,
        // size: 0,
        jiashiyuanxingming: this.driveSearchChange,
        cheliangpaizhao: this.tablechepai,
        deptName: this.tableDeptName,
        caozuoshijian: this.caozuoshijian,
        zongduanid: this.zongduanid,
        cheliangzhuangtai: this.cheliangzhuangtai,
        ...search,
        ...sort,
        ...other,
      };
      this.tableLoading = true;
      return getList(api, params).then((res) => {
        res.data.data.records = res.data.data.records.map((i) => {
          i.zhaopian = JSON.stringify(i.zhaopian);
          i.shenfenzhengfujian = JSON.stringify(i.shenfenzhengfujian);
          i.congyezhengfujian = JSON.stringify(i.congyezhengfujian);
          i.jiashizhengfujian = JSON.stringify(i.jiashizhengfujian);
          i.fuyinjian = JSON.stringify(i.fuyinjian);
          return i;
        })
        let data = res.data.data;
        this.tableLoading = false;
        if (JSON.stringify(data) == "{}") return;
        this.page.total = data.total;
        this.tableData = data.records.map((item) => this.receiveHandle(item));
      });
    },
    // change事件 省 data：省级选中的值
    changeA(data) {
      // 定义 remark 判断省市县（0）或运管局（1）
      let remark;
      // console.log("省级选中的值--", data);
      //testdata 判断是否为企业
      // 获取 市级数据
      if (this.testdata == "qiye" || this.testdata == "geti" || this.testdata == "qita") {
        remark = 1;
        // province 存 省当前选中的值
        provinceId = data.id;
        // 获取市 (企业)
        fetch(
            `/api/blade-system/dept/getDeptById?deptId=${data.id}&type=1&remark=${remark}`
          )
          .then(function (response) {
            return response.json();
          })
          .then((myJson) => {
            // console.log(myJson.data);
            this.options2 = myJson.data;
          });
      } else {
        // 获取市 (省市县)
        remark = 0;
        // province 存 省当前选中的值
        provinceName = data.deptName;
        // console.log(provinceName);
        fetch(
            `/api/blade-system/dept/getDeptById?deptId=${data.id}&type=1&remark=${remark}`
          )
          .then(function (response) {
            return response.json();
          })
          .then((myJson) => {
            // console.log(myJson.data);
            this.options2 = myJson.data;
          });
      }
    },
    // change事件 市  data：市级选中的值
    changeB(data) {
      // console.log("市级选中的值--", data);
      // 定义 remark 判断省市县（0）或运管局（1）
      let remark;
      // testdata  判断是否为企业
      // 获取 县级数据
      if (this.testdata == "qiye" || this.testdata == "geti" || this.testdata == "qita") {
        remark = 1;
        // cityId 存当前市级选中的县得id
        cityId = data.id;
        // 获取县（企业）
        fetch(
            `/api/blade-system/dept/getDeptById?deptId=${data.id}&type=2&remark=${remark}`
          )
          .then(function (response) {
            return response.json();
          })
          .then((myJson) => {
            // console.log(myJson.data);
            this.options3 = myJson.data;
          });
      } else {
        remark = 0;
        // cityName 存当前市级选中的县
        cityName = data.deptName;
        // 获取县（省市县）
        fetch(
            `/api/blade-system/dept/getDeptById?deptId=${data.id}&type=2&remark=${remark}`
          )
          .then(function (response) {
            return response.json();
          })
          .then((myJson) => {
            // console.log(myJson.data);
            this.options3 = myJson.data;
          });
      }
    },
    // change事件 区县  data：县级选中的值
    changeC(data) {
      // console.log(data);
      // testdata  判断是否为企业
      // 获取 县级数据
      if (this.testdata == "qiye" || this.testdata == "geti" || this.testdata == "qita") {
        // countryId 存当前县级选中的值
        countryId = data.id;
      } else {
        // countryId 存当前县级选中的值
        countryName = data.deptName;
      }

      // console.log("县级选中的值--", data);
    },
    // 选择框清空触发
    clearsheng() {
      this.value1 = "";
      if (this.testdata == "qiye" || this.testdata == "geti" || this.testdata == "qita") {
        provinceId = "";
      } else {
        provinceName = "";
      }
    },
    clearshi() {
      this.value2 = "";
      if (this.testdata == "qiye" || this.testdata == "geti" || this.testdata == "qita") {
        cityId = "";
      } else {
        cityName = "";
      }
    },
    clearxian() {
      this.value3 = "";
      if (this.testdata == "qiye" || this.testdata == "geti" || this.testdata == "qita") {
        countryId = "";
      } else {
        countryName = "";
      }
    },

    // 获取详情
    getDetail(id) {
      // console.log(id);
      // if (this.node.extendType === "机构") {
      return getDetail(this.CONFIG.detailModel, id).then((res) => {
        // console.log("---getdetails-----", res.data.data.jigouleixing)
        this.formData = this.receiveHandle(res.data.data);
        // testdata 存 机构类型
        this.testdata = res.data.data.jigouleixing;
        this.value1 = res.data.data.province;
        this.value2 = res.data.data.city;
        this.value3 = res.data.data.country;
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
      // this.tableLoading = true;
      // let data = {
      //   jiashiyuanxingming: this.driveSearchChange,
      //   cheliangpaizhao: this.tableSearch,
      //   deptName: this.tableDeptName,
      //   current: this.current,
      //   deptId: this.deptId,
      //   size: this.size,
      // };
      // const api = this.CONFIG.viewModel;
      // getList(api, data).then((res) => {
      //   let data = res.data.data;
      //   this.tableLoading = false;
      //   this.page.total = data.total;
      //   this.tableData = data.records.map((item) => this.receiveHandle(item));
      // });
    },
    // 刷新触发器
    refreshChange() {
      this.getList();
    },
    // 排序触发器
    sortChange(sort) {
      this.tableSort.orderColumn = sort.prop;
      this.tableSort.order = sort.order === "descending" ? 0 : 1;
      this.getList();
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
        let item = newData[key];
        if (!item) return;
        if (item.length && item.length > 0) {
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

    /**
     * 列表新增 or 表单新增
     * @param {Object} row 表单数据默认是 this.formData
     * @param {Function} callback 回调函数
     * @param {Boolean} list 是否更新列表
     * @returns {undefined}
     */
    rowSave(row = this.formData, callback, list = true) {
      row.deptId = this.deptId;
      // 修改时去除车辆牌照和终端id得首尾空格
      if (this.formData.cheliangpaizhao) {
        row.cheliangpaizhao = this.formData.cheliangpaizhao.replace(/(^\s*)|(\s*$)/g, "");
        row.zongduanid = this.formData.zongduanid.replace(/(^\s*)|(\s*$)/g, "");
      }
      // 新增 加省市县 字段
      if (this.formData.jigouleixing == "qiye" || this.formData.jigouleixing == "geti" || this.formData.jigouleixing == "qita") {
        this.formData.province = provinceId;
        this.formData.city = cityId;
        this.formData.country = countryId;
      } else {
        this.formData.province = provinceName;
        this.formData.city = cityName;
        this.formData.country = countryName;
      }
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
      // 修改时去除车辆牌照和终端id得首尾空格
      if (this.formData.cheliangpaizhao) {
        row.cheliangpaizhao = this.formData.cheliangpaizhao.replace(/(^\s*)|(\s*$)/g, "");
        row.zongduanid = this.formData.zongduanid.replace(/(^\s*)|(\s*$)/g, "");
      }
      // 修改 加 省市县字段
      if (this.formData.jigouleixing == "qiye" || this.formData.jigouleixing == "geti" || this.formData.jigouleixing == "qita") {
        this.formData.province = provinceId;
        this.formData.city = cityId;
        this.formData.country = countryId;
      } else {
        this.formData.province = provinceName;
        this.formData.city = cityName;
        this.formData.country = countryName;
      }
      update(this.CONFIG.updateModel, this.sendHandle(row)).then((res) => {
        this.$message({
          type: "success",
          message: res.data.msg,
        });
        list && this.getList();
        callback && callback(res);
        // this.requestNewData(); //树 懒加载刷新方法
      });
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