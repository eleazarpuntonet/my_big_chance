import { useEffect } from 'react'
import { useProductStore } from '../store/useProductStore'
import CreateProductForm from '../components/CreateProductForm'
import { CreateProductDto } from '../types/product.types'
import { Button } from '@/components/ui'
import { TbPackage, TbPlus, TbEdit, TbTrash } from 'react-icons/tb'
import { Notification, toast } from '@/components/ui'

const ProductAdmin = () => {
  const { products, loading, createProduct, fetchProducts, deleteProduct, clearError } = useProductStore()

  useEffect(() => {
    fetchProducts({ page: 1, limit: 50 }) // Load all for admin
  }, [fetchProducts])

  const handleCreateProduct = async (data: CreateProductDto) => {
    await createProduct(data)
    fetchProducts({ page: 1, limit: 50 }) // Refresh list
  }

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await deleteProduct(id)
        toast.push(
          <Notification type="success">
            Producto eliminado exitosamente
          </Notification>,
          { placement: 'top-center' }
        )
        fetchProducts({ page: 1, limit: 50 }) // Refresh list
      } catch (error) {
        toast.push(
          <Notification type="danger">
            Error al eliminar el producto
          </Notification>,
          { placement: 'top-center' }
        )
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-[#FAA531] p-4 rounded-t-xl mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TbPackage className="w-6 h-6 text-[#111827] mr-3" />
            <h4 className="text-lg font-semibold text-[#111827]">Administración de Productos</h4>
          </div>
        </div>
      </div>

      {/* Create Product Form */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-[#FAA531] p-4">
          <div className="flex items-center">
            <TbPlus className="w-6 h-6 text-[#111827] mr-3" />
            <h4 className="text-lg font-semibold text-[#111827]">Crear Nuevo Producto</h4>
          </div>
        </div>
        <div className="p-6">
          <CreateProductForm onSubmit={handleCreateProduct} />
        </div>
      </div>

      {/* Product Management */}
      <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-[#FAA531] p-4">
          <div className="flex items-center">
            <TbPackage className="w-6 h-6 text-[#111827] mr-3" />
            <h4 className="text-lg font-semibold text-[#111827]">Gestión de Productos</h4>
          </div>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FAA531]"></div>
            </div>
          ) : products.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay productos registrados aún.</p>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{product.name}</h5>
                    {product.description && (
                      <p className="text-gray-600 text-sm mt-1">{product.description}</p>
                    )}
                    <div className="flex items-center space-x-4 mt-2">
                      {product.category && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {product.category}
                        </span>
                      )}
                      {product.basePrice && (
                        <span className="text-sm font-medium text-green-600">
                          ${Number(product.basePrice).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="plain"
                      icon={<TbEdit />}
                      onClick={() => {
                        // TODO: Implement edit functionality
                        toast.push(
                          <Notification type="info">
                            Funcionalidad de edición próximamente
                          </Notification>,
                          { placement: 'top-center' }
                        )
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="plain"
                      color="red"
                      icon={<TbTrash />}
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductAdmin