export const toDoRuleValidate = {
  anpairen: {
    required: true,
    message: '请填写所属单位',
    trigger: 'blur'
  },
  anpairen: {
    required: true,
    message: '请填写安排人',
    trigger: 'blur'
  },
  // zerenrenId: {
  //   required: true,
  //   type: 'number',
  //   message: '请选择责任人',
  //   trigger: 'change'
  // },
  zhixingrenIds: {
    required: true,
    type: 'array',
    min: 1,
    message: '请选择执行人',
    trigger: 'change'
  },
  renwubiaoti: {
    required: true,
    message: '请输入任务标题',
    trigger: 'blur'
  },
  // renwuneirong: {
  //   required: true,
  //   message: '请输入任务内容',
  //   trigger: 'blur'
  // },
  // renwudidian: {
  //   required: true,
  //   message: '请输入任务地点',
  //   trigger: 'blur'
  // },
  renwukaishishijian: {
    required: true,
    // type: 'array',
    min: 2,
    message: '请选择开始时间',
    trigger: 'change'
  },
  renwujiezhishijian: {
    required: true,
    // type: 'array',
    min: 2,
    message: '请选择结束时间',
    trigger: 'change'
  },
  renwuleixing: {
    required: true,
    message: '请选择任务类型',
    trigger: 'change'
  },
  isFinish: {
    required: true,
    type: 'number',
    message: '请选择任务进度',
    trigger: 'change'
  }
};