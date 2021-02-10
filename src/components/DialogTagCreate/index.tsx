import {yupResolver} from '@hookform/resolvers/yup'
import {Box, Dialog, Flex} from '@sanity/ui'
import {DialogTagCreate} from '@types'
import React, {FC, ReactNode, useEffect} from 'react'
import {useForm} from 'react-hook-form'
import {useDispatch} from 'react-redux'
import * as yup from 'yup'

import useTypedSelector from '../../hooks/useTypedSelector'
import {dialogClear} from '../../modules/dialog'
import {tagsCreate} from '../../modules/tags'
import sanitizeFormData from '../../utils/sanitizeFormData'
import FormFieldInputText from '../FormFieldInputText'
import FormSubmitButton from '../FormSubmitButton'

type Props = {
  children: ReactNode
  dialog: DialogTagCreate
}

type FormData = yup.InferType<typeof formSchema>

const formSchema = yup.object().shape({
  name: yup.string().required('Name cannot be empty')
})

const DialogTagCreate: FC<Props> = (props: Props) => {
  const {
    children,
    dialog: {id}
  } = props

  // Redux
  const dispatch = useDispatch()

  // State
  const creating = useTypedSelector(state => state.tags.creating)
  const creatingError = useTypedSelector(state => state.tags.creatingError)

  // react-hook-form
  const {
    // Read the formState before render to subscribe the form state through Proxy
    formState: {errors, isDirty, isValid},
    handleSubmit,
    register,
    setError
  } = useForm({
    defaultValues: {
      name: ''
    },
    mode: 'onChange',
    resolver: yupResolver(formSchema)
  })

  const formUpdating = creating

  // Callbacks
  const handleClose = () => {
    dispatch(dialogClear())
  }

  // - submit react-hook-form
  const onSubmit = async (formData: FormData) => {
    const sanitizedFormData = sanitizeFormData(formData)

    dispatch(tagsCreate({name: sanitizedFormData.name}))
  }

  // Effects
  useEffect(() => {
    if (creatingError) {
      setError('name', {
        message: creatingError?.message
      })
    }
  }, [creatingError])

  const Footer = () => (
    <Box padding={3}>
      <Flex justify="flex-end">
        {/* Submit button */}
        <FormSubmitButton
          disabled={formUpdating || !isDirty || !isValid}
          isDirty={isDirty}
          isValid={isValid}
          onClick={handleSubmit(onSubmit)}
        />
      </Flex>
    </Box>
  )

  return (
    <Dialog
      footer={<Footer />}
      header="Create Tag"
      id={id}
      onClose={handleClose}
      scheme="dark"
      width={1}
    >
      {/* Form fields */}
      <Box as="form" padding={4} onSubmit={handleSubmit(onSubmit)}>
        {/* Hidden button to enable enter key submissions */}
        <button style={{display: 'none'}} tabIndex={-1} type="submit" />

        {/* Title */}
        <FormFieldInputText
          disabled={formUpdating}
          error={errors?.name}
          label="Name"
          name="name"
          ref={register}
        />
      </Box>

      {children}
    </Dialog>
  )
}

export default DialogTagCreate
