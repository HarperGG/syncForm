import { PropType, Ref, h, resolveComponent } from "vue"
import { FormActionType, FormProps } from "../types/form"
import { FormSchema } from "../types/form"
import { defineComponent, computed, unref, toRefs } from "vue"
import { NFormItemGi, NCol, NRow, NInput, FormItemRule, FormRules } from "naive-ui"
import { isBoolean, isFunction, isNull } from "../utils/is"
import { getSlot } from "../utils/index"
import { upperFirst, cloneDeep } from "lodash-es"
import { useItemLabelWidth } from "../hooks/useLabelWidth"
import { componentMap } from "../componentMap"
import { EventTypes } from "../types/event"

export default defineComponent({
  name: "BasicFormItem",
  components: {
    NInput
  },
  inheritAttrs: false,
  props: {
    schema: {
      type: Object as PropType<FormSchema>,
      default: () => ({})
    },
    formProps: {
      type: Object as PropType<FormProps>,
      default: () => ({})
    },
    allDefaultValues: {
      type: Object as PropType<Recordable>,
      default: () => ({})
    },
    formModel: {
      type: Object as PropType<Recordable>,
      default: () => ({})
    },
    setFormModel: {
      type: Function as PropType<(key: string, value: any) => void>,
      default: null
    },
    registerField: {
      type: Function as PropType<(field: string, type: EventTypes) => void>,
      default: null
    }
  },
  setup(props, { slots }) {
    const { schema, formProps } = toRefs(props) as {
      schema: Ref<FormSchema>
      formProps: Ref<FormProps>
    }

    const itemLabelWidthProp = useItemLabelWidth(schema, formProps)

    const getValues = computed(() => {
      const { allDefaultValues, formModel, schema } = props
      // const { mergeDynamicData } = props.formProps
      return {
        field: schema.field,
        model: formModel,
        values: {
          // ...mergeDynamicData,
          ...allDefaultValues,
          ...formModel
        } as Recordable,
        schema: schema
      }
    })
    const initRegister = () => {
      const { field } = unref(getValues)
      props.registerField(field, "fieldChange")
    }
    const getComponentsProps = computed(() => {
      const { schema, formModel } = props
      const { componentProps = {} } = schema
      if (!isFunction(componentProps)) {
        return componentProps
      }
      return componentProps({ schema, formModel }) ?? {}
    })

    const getDisable = computed(() => {
      const { disabled: globDisabled } = props.formProps
      const { dynamicDisabled } = props.schema
      const { disabled: itemDisabled = false } = unref(getComponentsProps)
      let disabled = !!globDisabled || itemDisabled
      if (isBoolean(dynamicDisabled)) {
        disabled = dynamicDisabled
      }
      if (isFunction(dynamicDisabled)) {
        disabled = dynamicDisabled(unref(getValues))
      }
      return disabled
    })

    function getShow(): { isShow: boolean; isIfShow: boolean } {
      const { show, ifShow } = props.schema
      const { showAdvancedButton } = props.formProps
      const itemIsAdvanced = showAdvancedButton
        ? isBoolean(props.schema.isAdvanced)
          ? props.schema.isAdvanced
          : true
        : true

      let isShow = true
      let isIfShow = true

      if (isBoolean(show)) {
        isShow = show
      }
      if (isBoolean(ifShow)) {
        isIfShow = ifShow
      }
      if (isFunction(show)) {
        isShow = show(unref(getValues))
      }
      if (isFunction(ifShow)) {
        isIfShow = ifShow(unref(getValues))
      }
      isShow = isShow && itemIsAdvanced
      return { isShow, isIfShow }
    }

    function handleRules(): FormItemRule[] {
      const {
        rules: defRules = [],
        component,
        useDefaultRules,
        label,
        field,
        dynamicRules,
        required
      } = props.schema

      if (isFunction(dynamicRules)) {
        return dynamicRules(unref(getValues)) as FormItemRule[]
      }

      let rules: FormItemRule[] = cloneDeep(defRules) as FormItemRule[]

      const getRequired = isFunction(required) ? required(unref(getValues)) : required
      function validator(rule: any, value: any) {
        if (!value.trim()) {
          return new Error(`请输入${label}`)
        }
        return true
      }
      // 默认规则
      if ((!rules || rules.length === 0) && getRequired) {
        rules = [{ required: getRequired, validator, trigger: ["blur", "input"] }]
      }
      return rules
    }

    function renderComponent() {
      const {
        renderComponentContent,
        component,
        field,
        changeEvent = "updateValue",
        valueField,
        valuePropsName = "value",
        effect = () => {}
      } = props.schema
      const { schema, formModel } = props

      const isCheck = component && ["n-switch", "n-checkbox"].includes(component)

      const eventKey = `on${upperFirst(changeEvent)}`

      function setFieldValue(args: Nullable<Recordable>[]) {
        const [e] = args
        if (propsData[eventKey]) {
          propsData[eventKey](...args)
        }
        const target = e ? e.target : null
        const value = target ? (isCheck ? target.checked : target.value) : e
        props.setFormModel(field, value)
        console.log(value)
      }
      const on = {
        [eventKey]: (...args: Nullable<Recordable>[]) => {
          effect({ schema, formModel }, ...args)
          setFieldValue(args)
        },
        [`onUpdate:${valuePropsName}`]: (...args: Nullable<Recordable>[]) => {
          effect({ schema, formModel }, ...args)
          setFieldValue(args)
        }
      }

      const Comp =
        typeof component === "string"
          ? componentMap.has(component)
            ? (componentMap.get(component) as ReturnType<typeof defineComponent>)
            : resolveComponent(component)
          : component

      const { size } = props.formProps
      const propsData: Recordable = {
        allowClear: true,
        getPopupContainer: (trigger: Element) => trigger.parentNode,
        size,
        ...unref(getComponentsProps),
        disabled: unref(getDisable)
      }

      propsData.codeField = field
      propsData.formValues = unref(getValues)

      const bindValue: Recordable = {
        [valueField || (isCheck ? "checked" : "value")]: props.formModel[field]
      }

      const compAttr: Recordable = {
        ...propsData,
        ...on,
        ...bindValue
      }
      // if (!renderComponentContent) {
      //   // return <Comp v-model:value="model.age"/>;
      //   return <NInput></NInput>
      // }
      const compSlot = isFunction(renderComponentContent)
        ? { ...renderComponentContent(unref(getValues)) }
        : {
            default: () => renderComponentContent
          }
      return h(
        Comp,
        {
          ...compAttr
        },
        compSlot
      )
    }

    function renderItem() {
      const { itemProps, slot, render, field, suffix, label } = props.schema

      const getContent = () => {
        return slot
          ? getSlot(slots, slot, unref(getValues))
          : render
          ? render(unref(getValues))
          : renderComponent()
      }

      const showSuffix = !!suffix
      const getSuffix = isFunction(suffix) ? suffix(unref(getValues)) : suffix
      return (
        <NFormItemGi
          path={field}
          class={{ "suffix-item": showSuffix }}
          {...(itemProps as Recordable)}
          label={label}
          ref={"formItem"}
          // rule-path={handleRules()}
        >
          <div style="display:flex;width:100%">
            {getContent()}
            {showSuffix && <span class="suffix">{getSuffix}</span>}
          </div>
        </NFormItemGi>
      )
    }
    initRegister()

    return () => {
      const { colProps = {}, colSlot, renderColContent, component } = props.schema
      // if (!componentMap.has(component)) {
      //   return null
      // }

      // const { baseColProps = {} } = props.formProps
      const realColProps = { ...colProps }
      const { isIfShow, isShow } = getShow()
      const values = unref(getValues)
      const getContent = () => {
        return colSlot
          ? getSlot(slots, colSlot, values)
          : renderColContent
          ? renderColContent(values)
          : renderItem()
      }

      return isIfShow && <div v-show={isShow}>{getContent()}</div>
    }
  }
})
