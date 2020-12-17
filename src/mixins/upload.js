export default {
  data() {
    return {
      formOriginData: {}
    };
  },
  methods: {
    getRemoveFileIds({
      list = this.FILED,
      data = this.formData,
      origin = this.formOriginData
    } = {}) {
      let removeIds = [];
      let uploadArr = [];
      list.forEach((item) => {
        if (item.type == 'upload') uploadArr.push(item.props);
      });
      uploadArr.forEach((props) => {
        let originIds = [];
        let submitIds = [];
        origin[props].forEach((item) => {
          originIds.push(item.id);
        });
        data[props].forEach((item) => {
          submitIds.push(item.id);
        });
        this.originIds.forEach((id) => {
          if (!this.submitIds.includes(id)) {
            removeIds.push(id);
          }
        });
      });
      return removeIds.split(',');
    }
  }
};
