<template>
  <n-form v-bind="getBindValue" ref="formElRef" :model="formModel">
    <n-grid v-bind="getRow">
      <slot name="formHeader"></slot>
      <template v-for="schema in getSchema" :key="schema.field">
        <FormItem
          :table-action="tableAction"
          :form-action-type="formActionType"
          :schema="schema"
          :form-props="getProps"
          :all-default-values="defaultValueRef"
          :form-model="formModel"
          :set-form-model="setFormModel"
        >
          <template v-for="item in Object.keys($slots)" #[item]="data">
            <slot :name="item" v-bind="data || {}"></slot>
          </template>
        </FormItem>
      </template>
      <slot name="formFooter"></slot>
    </n-grid>
  </n-form>
</template>
<script lang="ts">
import type { FormActionType, FormProps, FormSchema } from "./types/form"
import type { AdvanceState } from "./types/hooks"
import type { Ref } from "vue"

import { defineComponent, reactive, ref, computed, unref, onMounted, watch, nextTick } from "vue"
import { Form, Row } from "ant-design-vue"
import { NForm, NRow } from "naive-ui"
import FormItem from "./components/FormItem"
// import FormAction from "./components/FormAction.vue"

import { dateItemType } from "./helper"
import moment from "moment"

import { deepMerge } from "./utils"

import { useFormValues } from "./hooks/useFormValues"
// import useAdvanced from "./hooks/useAdvanced"
import { useFormEvents } from "./hooks/useFormEvents"
import { createFormContext } from "./hooks/useFormContext"
import { useAutoFocus } from "./hooks/useAutoFocus"
// import { useModalContext } from "/@/components/Modal"

import { basicProps } from "./props"
// import { useDesign } from "/@/hooks/web/useDesign"
import { Recordable, Nullable } from "./types/base"
import { cloneDeep } from "lodash-es"
export default defineComponent({
  name: "BasicForm",
  components: { FormItem, NForm },
  props: basicProps,
  emits: ["advanced-change", "reset", "submit", "register"],
  setup(props, { emit, attrs }) {
    // const modalFn = useModalContext()
    const formModel = reactive(props.model)
    const advanceState = reactive<AdvanceState>({
      isAdvanced: true,
      hideAdvanceBtn: false,
      isLoad: false,
      actionSpan: 6
    })

    const defaultValueRef = ref<Recordable>({})
    const isInitedDefaultRef = ref(false)
    const propsRef = ref<Partial<FormProps>>({})
    const schemaRef = ref<Nullable<FormSchema[]>>(null)
    const formElRef = ref<Nullable<FormActionType>>(null)

    const prefixCls = "basic-form"

    // Get the basic configuration of the form
    const getProps = computed((): FormProps => {
      return { ...props, ...unref(propsRef) } as FormProps
    })

    const getFormClass = computed(() => {
      return [
        prefixCls,
        {
          [`${prefixCls}--compact`]: unref(getProps).compact
        }
      ]
    })

    // Get uniform row style and Row configuration for the entire form
    const getRow = computed((): Recordable => {
      const { baseRowStyle = {}, rowProps } = unref(getProps)
      return {
        style: baseRowStyle,
        ...rowProps
      }
    })

    const getBindValue = computed(() => ({ ...attrs, ...props, ...unref(getProps) } as Recordable))
    console.log(getBindValue, attrs, props, getProps)

    const getSchema = computed((): FormSchema[] => {
      const schemas: FormSchema[] = unref(schemaRef) || (unref(getProps).schemas as any)
      // console.log(dateItemType)
      for (const schema of schemas) {
        const { defaultValue, component } = schema
        // handle date type
        if (defaultValue && dateItemType.includes(component)) {
          if (!Array.isArray(defaultValue)) {
            schema.defaultValue = moment(defaultValue)
          } else {
            const def = []
            defaultValue.forEach((item) => {
              def.push(moment(item))
            })
            schema.defaultValue = def
          }
        }
      }
      if (unref(getProps).showAdvancedButton) {
        return schemas.filter((schema) => schema.component !== "Divider") as FormSchema[]
      } else {
        return schemas as FormSchema[]
      }
    })

    // const { handleToggleAdvanced } = useAdvanced({
    //   advanceState,
    //   emit,
    //   getProps,
    //   getSchema,
    //   formModel,
    //   defaultValueRef
    // })

    const { handleFormValues, initDefault } = useFormValues({
      getProps,
      defaultValueRef,
      getSchema,
      formModel
    })

    useAutoFocus({
      getSchema,
      getProps,
      isInitedDefault: isInitedDefaultRef,
      formElRef: formElRef as Ref<FormActionType>
    })

    const {
      handleSubmit,
      setFieldsValue,
      clearValidate,
      validate,
      validateFields,
      getFieldsValue,
      updateSchema,
      resetSchema,
      appendSchemaByField,
      removeSchemaByFiled,
      replaceSchemaByField,
      resetFields,
      scrollToField
    } = useFormEvents({
      emit,
      getProps,
      formModel,
      getSchema,
      defaultValueRef,
      formElRef: formElRef as Ref<FormActionType>,
      schemaRef: schemaRef as Ref<FormSchema[]>,
      handleFormValues
    })

    createFormContext({
      resetAction: resetFields,
      submitAction: handleSubmit
    })

    watch(
      () => unref(getProps).model,
      () => {
        const { model } = unref(getProps)
        if (!model) return
        setFieldsValue(model)
      },
      {
        immediate: true
      }
    )

    watch(
      () => unref(getProps).schemas,
      (schemas) => {
        resetSchema(schemas ?? [])
      }
    )

    watch(
      () => getSchema.value,
      (schema) => {
        nextTick(() => {
          //  Solve the problem of modal adaptive height calculation when the form is placed in the modal
          // modalFn?.redoModalHeight?.()
        })
        if (unref(isInitedDefaultRef)) {
          return
        }
        if (schema?.length) {
          initDefault()
          isInitedDefaultRef.value = true
        }
      }
    )

    async function setProps(formProps: Partial<FormProps>): Promise<void> {
      console.log(formProps)
      propsRef.value = deepMerge(unref(propsRef) || {}, formProps)
      console.log(propsRef.value)
    }

    function setFormModel(key: string, value: any) {
      formModel[key] = value
      const { validateTrigger } = unref(getBindValue)
      if (!validateTrigger || validateTrigger === "change") {
        validateFields([key]).catch((_) => {})
      }
    }

    function handleEnterPress(e: KeyboardEvent) {
      const { autoSubmitOnEnter } = unref(getProps)
      if (!autoSubmitOnEnter) return
      if (e.key === "Enter" && e.target && e.target instanceof HTMLElement) {
        const target: HTMLElement = e.target as HTMLElement
        if (target && target.tagName && target.tagName.toUpperCase() == "INPUT") {
          handleSubmit()
        }
      }
    }

    const formActionType: Partial<FormActionType> = {
      getFieldsValue,
      setFieldsValue,
      resetFields,
      updateSchema,
      resetSchema,
      setProps,
      removeSchemaByFiled,
      appendSchemaByField,
      replaceSchemaByField,
      clearValidate,
      validateFields,
      validate,
      submit: handleSubmit,
      scrollToField: scrollToField
    }

    onMounted(() => {
      initDefault()
      emit("register", formActionType)
    })

    return {
      getBindValue,
      handleEnterPress,
      formModel,
      defaultValueRef,
      advanceState,
      getRow,
      getProps,
      formElRef,
      getSchema,
      formActionType: formActionType as any,
      setFormModel,
      getFormClass,
      getFormActionBindProps: computed((): Recordable => ({ ...getProps.value, ...advanceState })),
      ...formActionType
    }
  }
})
</script>
