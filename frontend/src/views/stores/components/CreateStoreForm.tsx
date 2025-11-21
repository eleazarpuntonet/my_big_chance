import React from 'react'
import { Button, Form, FormItem, Input } from '@/components/ui'
import { Controller, useForm } from 'react-hook-form'
import { useStoreStore } from '../store/useStoreStore'
import { CreateStoreDto } from '../types/store.types'
import { TbBuildingStorefront, TbPlus } from 'react-icons/tb'
import { Notification, toast } from '@/components/ui'
import { AxiosError } from 'axios'

interface CreateStoreFormProps {
  onSubmit: (data: CreateStoreDto) => void
  onClear?: () => void
}

const CreateStoreForm: React.FC<CreateStoreFormProps> = ({
  onSubmit,
  onClear
}) => {
  const { loading } = useStoreStore()
  const { control, handleSubmit, reset, formState: { errors } } = useForm<CreateStoreDto>()

  const handleFormSubmit = async (data: CreateStoreDto) => {
    try {
      await onSubmit(data)
      reset()
      toast.push(
        <Notification type="success">
          Store created successfully
        </Notification>,
        { placement: 'top-center' }
      )
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.error
        if (Array.isArray(message)) {
          toast.push(
            <Notification type="danger">
              {message[0]}
            </Notification>,
            { placement: 'top-center' }
          )
        } else {
          toast.push(
            <Notification type="danger">
              {message || 'Error creating store'}
            </Notification>,
            { placement: 'top-center' }
          )
        }
      } else {
        toast.push(
          <Notification type="danger">
            Error: {error instanceof Error ? error.message : 'Unknown error'}
          </Notification>,
          { placement: 'top-center' }
        )
      }
      console.error('Error:', error)
    }
  }

  const handleClear = () => {
    reset()
    onClear?.()
  }

  return (
    <div className="mb-6 bg-white p-4 rounded-lg shadow">
      <div className="flex flex-row">
        <Form
          className="h-full w-full flex-row justify-end"
          containerClassName="flex flex-row justify-between w-full h-full"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <div className='flex flex-row gap-1'>
            <FormItem label="Name" error={errors.name?.message}>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Name is required' }}
                render={({ field }) => (
                  <Input
                    size="sm"
                    placeholder="Store name"
                    {...field}
                  />
                )}
              />
            </FormItem>

            <FormItem label="Description">
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Input
                    size="sm"
                    placeholder="Store description"
                    {...field}
                  />
                )}
              />
            </FormItem>

            <FormItem label="Address">
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <Input
                    size="sm"
                    placeholder="Store address"
                    {...field}
                  />
                )}
              />
            </FormItem>

            <FormItem label="Phone">
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input
                    size="sm"
                    placeholder="Store phone number"
                    {...field}
                  />
                )}
              />
            </FormItem>
          </div>
          <div className='flex flex-row gap-1'>
            <Button
              type="submit"
              shape='round'
              size="sm"
              icon={<TbPlus />}
              className="px-3 py-1 bg-blue-600 text-white hover:bg-blue-700"
              loading={loading}
            >
              Create Store
            </Button>
            <Button
              type='button'
              size="sm"
              icon={<TbBuildingStorefront />}
              onClick={handleClear}
              className="px-3 py-1 bg-gray-600 text-white hover:bg-gray-700"
            >
              Clear
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default CreateStoreForm