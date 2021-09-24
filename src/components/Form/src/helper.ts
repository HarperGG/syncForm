import { ValidationRule } from "ant-design-vue/lib/form/Form"
import { ComponentType } from "./types/index"
import moment from "moment"
import { isNumber, isObject } from "./utils/is"

/**
 * @description: 生成placeholder
 */

const DATE_TYPE = ["DatePicker", "MonthPicker", "WeekPicker", "TimePicker"]

function genType() {
  return [...DATE_TYPE, "RangePicker"]
}

export function setComponentRuleType(
  rule: ValidationRule,
  component: ComponentType,
  valueFormat: string
) {
  if (["DatePicker", "MonthPicker", "WeekPicker", "TimePicker"].includes(component)) {
    rule.type = valueFormat ? "string" : "object"
  } else if (["RangePicker", "Upload", "CheckboxGroup", "TimePicker"].includes(component)) {
    rule.type = "array"
  } else if (["InputNumber"].includes(component)) {
    rule.type = "number"
  }
}

export function processDateValue(attr: Recordable, component: string) {
  const { valueFormat, value } = attr
  if (valueFormat) {
    attr.value = isObject(value) ? moment(value).format(valueFormat) : value
  } else if (DATE_TYPE.includes(component) && value) {
    attr.value = moment(attr.value)
  }
}

export function handleInputNumberValue(component?: ComponentType, val?: any) {
  if (!component) return val
  if (["Input", "InputPassword", "InputSearch", "InputTextArea"].includes(component)) {
    return val && isNumber(val) ? `${val}` : val
  }
  return val
}

/**
 * 时间字段
 */
export const dateItemType = genType()
