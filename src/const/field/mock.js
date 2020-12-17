export default {
  word: {
    label: '文字',
    value: 'word',
    config: {
      type: 'word',
      min: 5,
      max: 10
    }
  },
  phone: {
    label: '手机',
    value: 'phone',
    config: {
      type: 'phone'
    }
  },
  name: {
    label: '姓名',
    value: 'name',
    config: {
      type: 'name',
      en: false
    }
  },
  dic: {
    label: '字典',
    value: 'dic',
    config: {
      type: 'dic'
    }
  },
  number: {
    label: '数字',
    value: 'number',
    config: {
      type: 'number',
      max: 100,
      min: 0,
      precision: 2
    }
  },
  datetime: {
    label: '日期',
    value: 'datetime',
    config: {
      type: 'datetime',
      format: 'yyyy-MM-dd hh:mm:ss'
    }
  },
  url: {
    label: '链接',
    value: 'url',
    config: {
      type: 'url',
      header: true
    }
  },
  county: {
    label: '地址',
    value: 'county',
    config: {
      type: 'county'
    }
  }
};
