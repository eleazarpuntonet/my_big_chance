import React, { useEffect } from 'react'
import { Button, Form, FormItem, Input, Select } from '@/components/ui'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useProductStore } from '../store/useProductStore'
import { useStoreStore } from '../../stores/store/useStoreStore'
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
  const { stores, loading: storesLoading, fetchStores } = useStoreStore()
  const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<CreateProductDto>()

  const selectedStoreId = watch('storeId')

  useEffect(() => {
    fetchStores()
  }, [fetchStores])

  const handleFormSubmit = async (data: CreateProductDto) => {
    try {
      await onSubmit(data)
      reset()
      toast.push(
        <Notification type="success">
          Producto creado exitosamente
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
              {message || 'Error al crear el producto'}
            </Notification>,
            { placement: 'top-center' }
          )
        }
      } else {
        toast.push(
          <Notification type="danger">
            Error: {error instanceof Error ? error.message : 'Error desconocido'}
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
            <FormItem label="Nombre" error={errors.name?.message}>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'El nombre es obligatorio' }}
                render={({ field }) => (
                  <Input
                    size="sm"
                    placeholder="Nombre del producto"
                    {...field}
                  />
                )}
              />
            </FormItem>

            <FormItem label="Descripción">
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Input
                    size="sm"
                    placeholder="Descripción del producto"
                    {...field}
                  />
                )}
              />
            </FormItem>

            <FormItem label="Categoría">
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Input
                    size="sm"
                    placeholder="Categoría del producto"
                    {...field}
                  />
                )}
              />
            </FormItem>

            <FormItem label="Precio Base">
              <Controller
                name="basePrice"
                control={control}
                rules={{
                  min: { value: 0, message: 'El precio debe ser positivo' }
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

            <FormItem label="URL de Imagen">
              <Controller
                name="imageUrl"
                control={control}
                render={({ field }) => (
                  <Input
                    size="sm"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    {...field}
                  />
                )}
              />
            </FormItem>

            <FormItem label="Asociar con Tienda (Opcional)">
              <Controller
                name="storeId"
                control={control}
                render={({ field }) => {
                  const options = stores.map(store => ({
                    label: store.name,
                    value: store.id
                  }))
                  const selectedValue = options.find(option => option.value === field.value)

                  return (
                    <Select
                      options={options}
                      value={selectedValue}
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption?.value)
                        // Clear store-specific fields if no store selected
                        if (!selectedOption?.value) {
                          setValue('storePrice', undefined)
                          setValue('storeStock', undefined)
                        }
                      }}
                      placeholder={storesLoading ? "Cargando tiendas..." : "Seleccionar una tienda (opcional)"}
                      disabled={storesLoading}
                    />
                  )
                }}
              />
            </FormItem>

            {selectedStoreId && (
              <>
                <FormItem label="Precio en Tienda" error={errors.storePrice?.message}>
                  <Controller
                    name="storePrice"
                    control={control}
                    rules={{
                      required: 'El precio en tienda es obligatorio al asociar con una tienda',
                      min: { value: 0, message: 'El precio debe ser positivo' }
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

                <FormItem label="Stock Inicial" error={errors.storeStock?.message}>
                  <Controller
                    name="storeStock"
                    control={control}
                    rules={{
                      required: 'El stock inicial es obligatorio al asociar con una tienda',
                      min: { value: 0, message: 'El stock debe ser no negativo' }
                    }}
                    render={({ field }) => (
                      <Input
                        type="number"
                        size="sm"
                        placeholder="0"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    )}
                  />
                </FormItem>
              </>
            )}
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
              Crear Producto
            </Button>
            <Button
              type='button'
              size="sm"
              icon={<TbPackage />}
              onClick={handleClear}
              className="px-3 py-1 bg-gray-600 text-white hover:bg-gray-700"
            >
              Limpiar
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default CreateProductForm