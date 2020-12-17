import basics from '@/mixins/basics';
import $axios from "axios";
import {
  get
} from 'js-cookie';
export default {
  mixins: [basics],
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
    formData: {
      deep: true,
      handler() {
        this.emitConfig();
      }
    },
    // 监听省级 输入框内变化
    testdata(newData) {
      // 定义remark 判断省市县（0）或运管局（1）
      let remark;
      if (newData === "qiye" || newData === "geti" || newData === "qita") {
        remark = 1;
        // 获取省 （企业）  
        fetch(
            `/api/blade-system/dept/getDeptById?deptId=1&type=0&remark=${remark}`
          )
          .then(function (response) {
            return response.json();
          })
          .then(myJson => {
            //console.log(myJson.data);
            this.options1 = myJson.data;
            //console.log(this.options1);
          });
      } else {
        remark = 0;
        // 获取省 （省市县）
        fetch(
            `/api/blade-system/dept/getDeptById?deptId=1&type=0&remark=${remark}`
          )
          .then(function (response) {
            return response.json();
          })
          .then(myJson => {
            //console.log(myJson.data);
            this.options1 = myJson.data;
            //console.log(this.options1);
          });
      }
    }
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
            deptId: 1
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
        this.state.isAdd ? (this.clearsheng()&this.clearshi()&this.clearxian()&this.$refs.form.resetForm()) : this.getData();
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
    }
  }
};