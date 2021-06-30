import basicsdept from '@/mixins/basicsdept';
import $axios from "axios";
import {
  getSheng
}
from "@/api/dept/productList";
export default {
  mixins: [basicsdept],
  data() {
    return {
      provinceId: null,
      cityId: null,
      countryId: null,
      baseOption: {
        submitBtn: false,
        emptyBtn: false,
        menuBtn: false,
      },
      options1: [],
      proviceRemark: 1,
    };
  },
  props: {
    value: Object,
    node: {
      type: Object,
      defalut: () => new Object()
    },
    state: {
      type: Object,
      defalut: () => new Object()
    }
  },
  watch: {
    'node.id'() {
      this.toggle();
    },
    'state.isAdd'() {
      this.toggle();
    },
    'state'() {
      if (this.state.isAdd == true && this.state.isDept == true) {
        this.formData.leixing = "部门"
      } else if (this.state.isAdd == true && this.state.isPost == true) {
        this.formData.leixing = "岗位"
      }
    },
    formData: {
      deep: true,
      handler() {
        this.emitConfig();
      }
    },
    "formData.jigouleixing"(jigouleixing) {
      if (jigouleixing === "qiye" || jigouleixing === "geti" || jigouleixing === "qita") {
        this.proviceRemark = 1
      } else {
        this.proviceRemark = 0
      }
      // 机构类型改变时 清空省市县的数据
      if (this.formData.province !== "" || this.formData.city !== "" || this.formData.country !== "") {
        if (this.state.title === "编辑") {
          if (this.formData.jigouleixing !== this.formOriginData.jigouleixing) {
            this.formData.province = "";
            this.formData.city = "";
            this.formData.country = "";
          } else {
            if (this.formData.province !== this.formOriginData.province) {
              this.formData.province = "";
              this.formData.city = "";
              this.formData.country = "";
            }
          }
        }
        if (this.state.title === "新增") {
          if (jigouleixing === "qiye" || jigouleixing === "geti" || jigouleixing === "qita") {
            if (this.formData.province === this.formData.$province) {
              this.formData.province = "";
              this.formData.city = "";
              this.formData.country = "";
            }
          } else {
            if (this.formData.province !== this.formData.$province) {
              this.formData.province = "";
              this.formData.city = "";
              this.formData.country = "";
            }
          }
        }
      }
      this.FIELD.province.dicData = [];
      getSheng(this.$store.getters.deptId, 0, this.proviceRemark).then(res => {
        // item.cascaderItem = ["shi", "xian"];
        this.FIELD.province.filterable = true;
        this.FIELD.province.dicData = res.data.data.map(el => {
          el.label = el.deptName;
          el.value = el.id;
          return el;
        });
      })
      immediate: false
    },
    // 监听数据切换
    "formData.province"(sheng) {
      // console.log(typeof sheng);
      // if (typeof sheng == "string") {
      //   console.log(sheng);
      // }
      this.FIELD.city.dicData = [];
      this.FIELD.country.dicData = [];
      if (this.formData.province == "") {
        this.formData.city = "";
        this.formData.country = "";
      }
      if (this.isNumber(sheng) === false) return;
      if (sheng != "" && sheng != undefined && sheng != null) {
        if (this.proviceRemark === 0) {
          this.FIELD.province.dicData.map(val => {
            if (val.id === sheng) {
              this.formData.province = val.deptName;
            }
          })
        }
        getSheng(sheng, 1, this.proviceRemark).then(res => {
          this.FIELD.city.filterable = true;
          this.FIELD.city.dicData = res.data.data.map(el => {
            el.label = el.deptName;
            el.value = el.id;
            return el;
          });
        })
      }
    },
    // 监听数据切换
    "formData.city"(city) {
      // console.log(city);
      this.FIELD.country.dicData = [];
      if (this.formData.city == "") {
        this.formData.country = "";
      }
      if (this.isNumber(city) === false) return;
      if (city != "" && city != undefined && city != null) {
        if (this.proviceRemark === 0) {
          this.FIELD.city.dicData.map(val => {
            if (val.id === city) {
              this.formData.city = val.deptName;
            }
          })
        }
        getSheng(city, 2, this.proviceRemark).then(res => {
          this.FIELD.country.filterable = true;
          this.FIELD.country.dicData = res.data.data.map(el => {
            el.label = el.deptName;
            el.value = el.id;
            return el;
          });
        })
      }
    },
    // 监听数据切换
    "formData.country"(country) {
      if (this.isNumber(country) === false) return;
      if (country != "" && country != undefined && country != null) {
        if (this.proviceRemark === 0) {
          this.FIELD.country.dicData.map(val => {
            if (val.id === country) {
              this.formData.country = val.deptName;
            }
          })
        }
      }
    },
  },
  methods: {
    // 获取表单数据
    getData() {
      if (this.node.extendType == "岗位" || this.node.extendType == "部门") {
        $axios({
          url: "/api/blade-platform/platform/departmentpost/detailPost",
          method: "GET",
          params: {
            id: this.node.id,
            deptId: this.node.id,
          }
        }).then(res => {
          this.formData.mingcheng = res.data.data.mingcheng;
          this.formData.leixing = res.data.data.leixing;
          this.formData.fuzeren = res.data.data.fuzeren
          this.formData.gangweizhize = res.data.data.gangweizhize;
          this.formData.anquanzhize = res.data.data.anquanzhize;
        })
      } else if (this.node.extendType === "机构") {
        this.getDetail(this.node.id);
      }
    },
    // 切换状态
    toggle() {
      if (!this.show) return;
      let toggle = () =>
        this.state.isAdd ? this.$refs.form.resetForm() : this.getData();
      this.ISLOAD ? toggle() : this.INIT(this.TOKEN).then(toggle);
    },
    // 提交当前表单的状态
    emitConfig() {
      this.$emit('action', {
        action: 'getFormConfig',
        param: {
          config: this.CONFIG || {},
          data: this.sendHandle(this.formData) || {},
          ids: this.removeFileIds
        }
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
  }
};