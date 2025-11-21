import React from 'react'
import { Button, Form, FormItem, Input } from '@/components/ui'
import { Controller, useForm } from 'react-hook-form'
import { useProductStore } from '../store/useProductStore'
import { CreateProductDto } from '../types/product.types'
import { TbPackage, TbPlus } from 'react-icons/tb'
import { Notification, toast } from '@/components/ui'
import { AxiosError } from 'axios'

interface CreateProductFormProps {
  onSubmit: (data: CreateProductDto) => void
  onClear?: () => void
}

const CreateProductForm: React.FC<CreateProductFormProps> = ({
  onSubmit,
  onClear
}) => {
  const { loading } = useProductStore()
  const { control, handleSubmit, reset, formState: { errors } } = useForm<CreateProductDto>()

  const handleFormSubmit = async (data: CreateProductDto) => {
    try {
      await onSubmit(data)
      reset()
      toast.push(
        <Notification type="success">
          Product created successfully
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
              {message || 'Error creating product'}
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
                    placeholder="Product name"
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
                    placeholder="Product description"
                    {...field}
                  />
                )}
              />
            </FormItem>

            <FormItem label="Category">
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Input
                    size="sm"
                    placeholder="Product category"
                    {...field}
                  />
                )}
              />
            </FormItem>

            <FormItem label="Base Price">
              <Controller
                name="basePrice"
                control={control}
                rules={{
                  min: { value: 0, message: 'Price must be positive' }
                }}
                render={({ field }) => (
                  <Input
                    type="number"
                    size="sm"
                    placeholder="0.00"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                )}
              />
            </FormItem>

            <FormItem label="Image URL">
              <Controller
                name="imageUrl"
                control={control}
                render={({ field }) => (
                  <Input
                    size="sm"
                    placeholder="https://example.com/image.jpg"
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
              Create Product
            </Button>
            <Button
              type='button'
              size="sm"
              icon={<TbPackage />}
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

export default CreateProductForm