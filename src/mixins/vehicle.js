import mockMap from "@/const/field/mock";
import dateMap from "@/const/field/date";
import ruleMap from "@/const/field/rule";
import {
    getConfig,
    getField,
    getList,
    insert,
    update,
    remove,
    getDicData
} from "@/api/basics";
import {
    getByIdDeptList,
    getByIdVehicleLis,
    getByIdJiaShiYuanList
}
from "@/api/dept/productList";
export default {
    data() {
        return {
            page: {
                pageSizes: [20, 30, 50, 100],
                total: 10,
                currentPage: 1,
                pageSize: 20,
            },
            vehicleSafeData: [],
            searchData: [],
            // 模块配置项
            CONFIG: {},
            // 模块字段项
            FIELD: [],
            ISLOAD: false,
            loading: false,
            form: "",
        };
    },
    computed: {
        VehicleSafe() {
            return Object.keys(this.FIELD)
                .map((key) => this.FIELD[key])
                .sort((a, b) => a.sort - b.sort);
        },
        option() {
            let VehicleSafeOption = {
                // title: this.$store.getters.tag.label,
                height: "auto",
                calcHeight: 105,
                align: "center",
                menuAlign: "center",
                border: true,
                submitBtn: true,
                dialogWidth: "75%",
                dialogHeight: 550,
                searchBtn: false,
                searchShow: false,
                columnBtn: false,
                viewBtn: true,
                labelWidth: 125,
            };
            return {
                ...VehicleSafeOption,
                column: this.VehicleSafe,
            };
        },
    },
    watch: {
        // 获取单位名称的 value值传给车辆牌照的接口 获取车辆牌照
        "form.deptName": {
            handler(val) {
                this.FIELD.cheliangpaizhao.dicData = [];
                if (this.isNumber(val) === false) return;
                this.form.cheliangpaizhao = "";
                this.form.chepaiyanse = "";
                if (val != "" && val != undefined && val != null) {
                    getByIdVehicleLis(val).then((res) => {
                        this.FIELD.cheliangpaizhao.dicData = res.data.data.map((el) => {
                            el.label = el.cheliangpaizhao;
                            el.value = el.cheliangpaizhao;
                            el.props = {
                                label: el.cheliangpaizhao,
                                value: el.cheliangpaizhao,
                            };
                            return el;
                        });
                        this.FIELD.cheliangpaizhao.filterable = true;
                    });
                    getByIdJiaShiYuanList(val).then((res) => {
                        this.FIELD.jiashiyuanxingming.dicData = res.data.data.map((el) => {
                            el.label = el.jiashiyuanxingming;
                            el.value = el.jiashiyuanxingming;
                            return el;
                        });
                        this.FIELD.jiashiyuanxingming.filterable = true;
                    });
                }
            },
            immediate: false,
        },
        // 获取车辆牌照的value值判断此车牌是否有车牌颜色
        "form.cheliangpaizhao": {
            handler(val) {
                this.FIELD.chepaiyanse.dicData = [];
                // this.form.chepaiyanse = "";
                //第一次进入显示 val为企业名称label值
                if (val != "" && val != undefined && val != null) {
                    this.FIELD.cheliangpaizhao.dicData.map(el => {
                        if (el.cheliangpaizhao === val) {
                            this.form.chepaiyanse = el.chepaiyanse;
                            this.form.cheliangid = el.id;
                            if (el.chepaiyanse !== "") {
                                this.FIELD.chepaiyanse.dicData = [{
                                    label: el.chepaiyanse,
                                    value: el.chepaiyanse,
                                }];
                            } else {
                                this.FIELD.chepaiyanse.dicKey = "colour";
                                getDicData(this.FIELD.chepaiyanse.dicKey).then((res) => {
                                    this.FIELD.chepaiyanse.dicData = res.data.data;
                                });
                            }
                        }
                    })
                }
            },
            immediate: false,
        },
        // 获取车辆牌照的value值判断此车牌是否有车牌颜色
        "form.jiashiyuanxingming": {
            handler(val) {
                if (val != "" && val != undefined && val != null) {
                    this.FIELD.jiashiyuanxingming.dicData.map(el => {
                        if (el.jiashiyuanxingming === val) {
                            this.form.jiashiyuandianhua = el.shoujihaoma;
                        }
                    })
                }
            },
            immediate: false,
        },
    },
    methods: {
        // 初始化
        INIT(token) {
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
        // 判断是否为 数字
        isNumber(val) {
            let regPos = /^\d+(\.\d+)?$/; //非负浮点数
            let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
            if (regPos.test(val) || regNeg.test(val)) {
                return true;
            } else {
                return false;
            }
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
                    if (item.dicKey === "deptName") {
                        item.dicData = [];
                        getByIdDeptList(this.$store.getters.deptId).then(res => {
                            item.cascaderItem = ["cheliangpaizhao", "chepaiyanse"];
                            item.filterable = true;
                            item.dicData = res.data.data.map(el => {
                                el.label = el.deptName;
                                el.value = el.id;
                                el.props = {
                                    label: el.label,
                                    value: el.id,
                                }
                                return el;
                            });
                        })
                    } else {
                        item.dicData = [];
                        getDicData(item.dicKey).then((res) => {
                            item.dicData = res.data.data;
                        });
                    }
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
        getList({
            page = this.page,
            searchMsg
        } = {}) {
            const api = this.CONFIG.viewModel;
            if (!api) return;
            let params = {
                deptId: this.deptId,
                current: page.currentPage,
                size: page.pageSize,
                ...searchMsg
                // deptName: this.deptName,
                // cheliangpaizhao: this.cheliangpaizhao,
                // daoqishijian: this.daoqishijian,
                // jiashiyuanxingming: this.jiashiyuan,
                // chejiahao: this.chejiahao,
                // cheliangzhuangtai: this.cheliangzhuangtai,
                // deptName: searchMsg.deptName ? searchMsg.deptName : "",
                // cheliangpaizhao: searchMsg.cheliangpaizhao,
                // chejiahao: searchMsg.chejiahao,
                // cheliangzhuangtai: searchMsg.cheliangzhuangtai,
            };
            this.loading = true;
            return getList(api, params).then((res) => {
                this.searchData = res.data.data;
                let data = res.data.data;
                this.loading = false;
                if (JSON.stringify(data) == "{}") return;
                this.page.total = data.total;
                // this.tableData = data.records.map((item) => this.receiveHandle(item));
                // this.tableData = this.receiveHandle(data.records);
                this.vehicleSafeData = data.records;
            });
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
        // 弹出框beforeopen
        beforeOpen(done, type) {
            if (type === "view") {
                for (let i in this.FIELD) {
                    this.FIELD[i].disabled = true;
                }
            } else {
                for (let j in this.FIELD) {
                    this.FIELD[j].disabled = false;
                }
            }
            done();
        },
        // 字段为上传组件的 keys 集合
        uploadKeys() {
            let kyes = [];
            this.VehicleSafe.forEach((item) => {
                if (item.type == "upload") kyes.push(item.prop);
            });
            return kyes;
        },
        // 发送数据前的处理
        sendHandle(data) {
            // 转换 upload 参数, 取所有附件的 saveId 拼接成 ids 字符串
            let newData = Object.assign({}, data);
            this.uploadKeys().forEach((key) => {
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
        /**
         * 列表新增 or 表单新增
         * @param {Object} row 表单数据默认是 this.formData
         * @param {Function} callback 回调函数
         * @param {Boolean} list 是否更新列表
         * @returns {undefined}
         */
        rowSave(row = this.vehicleSafeData, callback, list = true) {
            row.deptId = row.deptName;
            insert(this.CONFIG.insertModel, this.sendHandle(row)).then((res) => {
                this.$message({
                    type: "success",
                    message: res.data.msg,
                });
                list && this.getList();
                callback && callback(res);
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

        rowUpdate(row = this.vehicleSafeData, index, callback, list = true) {
            if (row.deptName !== row.$deptName) {
                row.deptId = row.deptName;
            }
            update(this.CONFIG.updateModel, this.sendHandle(row)).then((res) => {
                this.$message({
                    type: "success",
                    message: res.data.msg,
                });
                list && this.getList();
                callback && callback(res);
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
        rowDel(row = this.vehicleSafeData, callback, list = true) {
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
                });
        },
    },
};