import { NamePath } from "ant-design-vue/lib/form/interface"
import { ColProps } from "ant-design-vue/lib/grid/Col"
import { HTMLAttributes, VNodeChild } from "vue"

export interface FormItem {
  /**
   * Used with validateStatus, this option specifies the validation status icon. Recommended to be used only with Input.
   * @default false
   * @type boolean
   */
  feedback?: boolean

  /**
   *
   */
  first?: boolean
  /**
   * The prompt message. If not provided, the prompt message will be generated by the validation rule.
   * @type any (string | slot)
   */
  help?: string | VNodeChild | JSX.Element

  /**
   * Label test
   * @type any (string | slot)
   */
  label?: string | VNodeChild | JSX.Element

  /**
   * The layout of label. You can set span offset to something like {span: 3, offset: 12} or sm: {span: 3, offset: 12} same as with <Col>
   * @type Col
   */
  labelCol?: ColProps & HTMLAttributes

  /**
   * Whether provided or not, it will be generated by the validation rule.
   * @default false
   * @type boolean
   */
  required?: boolean

  /**
   * The validation status. If not provided, it will be generated by validation rule. options: 'success' 'warning' 'error' 'validating'
   * @type string
   */
  validateStatus?: "" | "success" | "warning" | "error" | "validating"

  /**
   * The layout for input controls, same as labelCol
   * @type Col
   */
  wrapperCol?: ColProps
  /**
   * Set sub label htmlFor.
   */
  htmlFor?: string
  /**
   * text align of label
   */
  labelAlign?: "left" | "right"
  /**
   * a key of model. In the setting of validate and resetFields method, the attribute is required
   */
  path?: NamePath
  /**
   * validation rules of form
   */
  rule?: object | object[]
  /**
   * Whether to automatically associate form fields. In most cases, you can setting automatic association.
   * If the conditions for automatic association are not met, you can manually associate them. See the notes below.
   */
  autoLink?: boolean
  /**
   * Whether stop validate on first rule of error for this field.
   */
  validateFirst?: boolean
  /**
   * When to validate the value of children node
   */
  validateTrigger?: string | string[] | false
}
