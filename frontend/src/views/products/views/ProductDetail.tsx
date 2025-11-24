import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProductStore } from '../store/useProductStore'
import { Button } from '@/components/ui'
import { TbArrowLeft, TbPackage, TbTag, TbCategory, TbCalendar } from 'react-icons/tb'
import { Notification, toast } from '@/components/ui'

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { currentProduct, loading, error, fetchProduct, clearError } = useProductStore()

  useEffect(() => {
    if (id) {
      fetchProduct(id)
    }
  }, [id, fetchProduct])

  useEffect(() => {
    if (error) {
      toast.push(
        <Notification type="danger">
          {error}
        </Notification>,
        { placement: 'top-center' }
      )
      clearError()
    }
  }, [error, clearError])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!currentProduct) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <TbPackage className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Producto no encontrado</h3>
        <p className="text-gray-500 mb-4">El producto que buscas no existe o ha sido eliminado.</p>
        <Button onClick={() => navigate('/stores')}>
          <TbArrowLeft className="w-4 h-4 mr-2" />
          Volver a Tiendas
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-[#FAA531] p-4 rounded-t-xl mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TbPackage className="w-6 h-6 text-[#111827] mr-3" />
            <h4 className="text-lg font-semibold text-[#111827]">{currentProduct.name}</h4>
          </div>
          <Button
            onClick={() => navigate('/stores')}
            className="bg-white/10 hover:bg-white/20 text-[#111827] border-white/20"
          >
            <TbArrowLeft className="w-4 h-4 mr-2" />
            Volver a Tiendas
          </Button>
        </div>
      </div>

      {/* Product Details Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image */}
            <div className="space-y-4">
              {currentProduct.imageUrl ? (
                <img
                  src={currentProduct.imageUrl}
                  alt={currentProduct.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <TbPackage className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Información del Producto</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <TbTag className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">Nombre:</span>
                    <span className="ml-2 font-medium">{currentProduct.name}</span>
                  </div>

                  {currentProduct.description && (
                    <div className="flex items-start">
                      <TbPackage className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <span className="text-sm text-gray-600">Descripción:</span>
                      <span className="ml-2">{currentProduct.description}</span>
                    </div>
                  )}

                  {currentProduct.category && (
                    <div className="flex items-center">
                      <TbCategory className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">Categoría:</span>
                      <span className="ml-2 font-medium">{currentProduct.category}</span>
                    </div>
                  )}

                  {currentProduct.basePrice && !isNaN(Number(currentProduct.basePrice)) && (
                    <div className="flex items-center">
                      <TbTag className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-600">Precio Base:</span>
                      <span className="ml-2 font-medium text-green-600">${Number(currentProduct.basePrice).toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex items-center">
                    <TbCalendar className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">Creado:</span>
                    <span className="ml-2">{new Date(currentProduct.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center">
                    <TbCalendar className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">Última Actualización:</span>
                    <span className="ml-2">{new Date(currentProduct.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail