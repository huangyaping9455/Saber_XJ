import fieldTypeOptions from './field-type';

export const fieldType = fieldTypeOptions();

// 字段默认配置数据
export const defalutValue = () => {
  return {
    type: 'input',
    span: 12,
    listType: 'file',
    trigger: 'submit',
    loadText: '附件上传中，请稍等',
    align: 'left',
    ratio: 0.7,
    multiple: false,
    display: true,
    addDisplay: true,
    editDisplay: true,
    viewDisplay: true
  };
};

/**
 * 字段配置项
 * @param {Object} SELF vue的this指向
 * @returns {Object} {基础配置，增强配置}
 */
export const fieldConfig = () => {
  const baseConfig = [
    {
      label: '字段ID',
      prop: 'prop',
      type: 'input',
      span: 24,
      rules: [
        {
          required: true,
          message: '字段ID必填',
          trigger: 'submit'
        }
      ]
    },
    {
      label: '字段名称',
      prop: 'label',
      type: 'input',
      span: 24,
      rules: [
        {
          required: true,
          message: '字段名称必填',
          trigger: 'submit'
        }
      ]
    },
    {
      label: '字段排序',
      prop: 'sort',
      type: 'number',
      span: 24,
      rules: [
        {
          required: true,
          message: '字段排序必填',
          trigger: 'submit'
        }
      ],
      tipPlacement: 'left'
    },
    {
      label: '字段类型',
      prop: 'type',
      type: 'select',
      span: 24,
      dicData: fieldType,
      rules: [
        {
          required: true,
          message: '字典参数必填',
          trigger: 'submit'
        }
      ]
    }
  ];
  const intensifyConfig = [
    {
      label: '栅格宽度',
      prop: 'span',
      type: 'number',
      span: 24,
      minRows: 1,
      maxRows: 24,
      tip: '在表单中占据的宽度，一行等分为24列',
      tipPlacement: 'left'
    },
    {
      label: '悬浮提示',
      prop: 'tip',
      type: 'input',
      span: 24,
      tip: '鼠标移上去就显示的悬浮提示',
      tipPlacement: 'left'
    },
    {
      label: '悬浮位置',
      prop: 'tipPlacement',
      type: 'select',
      span: 24,
      dicData: [
        {
          label: '上',
          value: 'top'
        },
        {
          label: '下',
          value: 'bottom'
        },
        {
          label: '左',
          value: 'left'
        },
        {
          label: '右',
          value: 'right'
        }
      ],
      tip: '悬浮提示的可选位置',
      tipPlacement: 'left'
    },
    {
      label: '默认数据',
      prop: 'valueDefault',
      type: 'input',
      span: 24,
      tip: '该字段在表单中的默认数据',
      tipPlacement: 'left'
    },
    {
      label: '验证触发',
      prop: 'trigger',
      type: 'select',
      span: 24,
      dicData: [
        {
          label: '失去焦点触发',
          value: 'blur'
        },
        {
          label: '提交表单触发',
          value: 'submit'
        },
        {
          label: '内容发生变动触发',
          value: 'change'
        }
      ],
      tip: '在何时进行验证字段',
      tipPlacement: 'left'
    },
    {
      label: '列宽度',
      prop: 'width',
      type: 'number',
      span: 24,
      tip: '在列表中占据的的宽度',
      tipPlacement: 'left'
    },
    {
      label: '列最小宽度',
      prop: 'minWidth',
      type: 'number',
      span: 24,
      tip: '在列表中占据的最小宽度',
      tipPlacement: 'left'
    },
    {
      label: '列对齐方式',
      prop: 'align',
      type: 'select',
      span: 24,
      dicData: [
        { label: '居左', value: 'left' },
        { label: '居中', value: 'center' },
        { label: '居右', value: 'right' }
      ],
      tip: '在列表中的对齐方式',
      tipPlacement: 'left'
    },
    {
      label: '列排序',
      prop: 'sortable',
      type: 'switch',
      span: 24,
      tip: '是否在列表中显示该字段的排序标识',
      tipPlacement: 'left'
    },
    {
      label: '列动态现隐',
      prop: 'showColumn',
      type: 'switch',
      span: 24,
      tip: '是否加入动态现隐列',
      tipPlacement: 'left'
    },
    {
      label: '列搜索',
      prop: 'search',
      type: 'switch',
      span: 24,
      tip: '在列表中是否开启该字段的搜索条件',
      tipPlacement: 'left'
    },
    {
      label: '列超出隐藏',
      prop: 'overHidden',
      type: 'switch',
      span: 24,
      tip: '在列表中是否超出显示省略号',
      tipPlacement: 'left'
    },
    {
      label: '列冻结',
      prop: 'fixed',
      type: 'switch',
      span: 24,
      tip: '在列表中是否冻结该列',
      tipPlacement: 'left'
    },
    {
      label: '列隐藏',
      prop: 'hide',
      type: 'switch',
      span: 24,
      tip: '是否在列表中隐藏该字段',
      tipPlacement: 'left'
    },
    {
      label: '列自定义',
      prop: 'solt',
      type: 'switch',
      span: 24,
      tip: '在列表中是否自定义渲染内容',
      tipPlacement: 'left'
    },
    {
      label: '字段是否必填',
      prop: 'required',
      type: 'switch',
      span: 24,
      tip: '在表单中是否必填',
      tipPlacement: 'left'
    },
    {
      label: '字段是否只读',
      prop: 'readonly',
      type: 'switch',
      span: 24,
      tip: '在表单中是否只读',
      tipPlacement: 'left'
    },
    {
      label: '字段是否禁止',
      prop: 'disabled',
      type: 'switch',
      span: 24,
      tip: '是否在所有表单中禁用该字段',
      tipPlacement: 'left'
    },
    {
      label: '字段新增禁止',
      prop: 'addDisabled',
      type: 'switch',
      span: 24,
      tip: '是否在新增表单中禁用该字段',
      tipPlacement: 'left'
    },
    {
      label: '字段编辑禁止',
      prop: 'editDisabled',
      type: 'switch',
      span: 24,
      tip: '是否在编辑表单中禁用该字段',
      tipPlacement: 'left'
    },
    {
      label: '字段是否可见',
      prop: 'display',
      type: 'switch',
      span: 24,
      tip: '是否在所有表单中可见',
      tipPlacement: 'left'
    },
    {
      label: '字段新增可见',
      prop: 'addDisplay',
      type: 'switch',
      span: 24,
      tip: '是否在新增表单中可见',
      tipPlacement: 'left'
    },
    {
      label: '字段编辑可见',
      prop: 'editDisplay',
      type: 'switch',
      span: 24,
      tip: '是否在编辑表单中可见',
      tipPlacement: 'left'
    },
    {
      label: '字段查看可见',
      prop: 'viewDisplay',
      type: 'switch',
      span: 24,
      tip: '是否在查看表单中可见',
      tipPlacement: 'left'
    }
  ];
  return { baseConfig, intensifyConfig };
};
