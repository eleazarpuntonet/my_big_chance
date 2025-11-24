import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useStoreStore } from '../store/useStoreStore'
import { GetStoreProductsQueryDto } from '../types/store.types'
import { Button, Input, Pagination, Switcher } from '@/components/ui'
import { TbArrowLeft, TbBuildingStore, TbMapPin, TbPhone, TbPackage, TbTag, TbSearch } from 'react-icons/tb'
import { Notification, toast } from '@/components/ui'

const StoreDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    currentStore,
    storeProducts,
    loading,
    error,
    productsPagination,
    fetchStore,
    fetchStoreProducts,
    clearError
  } = useStoreStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (id) {
      fetchStore(id)
    }
  }, [id, fetchStore])

  useEffect(() => {
    if (id) {
      fetchStoreProducts(id, {
        q: searchQuery,
        inStock: inStockOnly,
        page: currentPage,
        limit: 10
      })
    }
  }, [id, fetchStoreProducts, searchQuery, inStockOnly, currentPage])

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

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleInStockToggle = (checked: boolean) => {
    setInStockOnly(checked)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (loading && !currentStore) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!currentStore) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <TbBuildingStore className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Tienda no encontrada</h3>
        <p className="text-gray-500">La tienda que buscas no existe o ha sido eliminada.</p>
        <Button onClick={() => navigate('/stores')} className="mt-4">
          <TbArrowLeft className="w-4 h-4 mr-2" />
          Volver a Tiendas
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Store Header */}
      <div className="bg-[#FAA531] p-4 rounded-t-xl mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TbBuildingStore className="w-6 h-6 text-[#111827] mr-3" />
            <h4 className="text-lg font-semibold text-[#111827]">{currentStore.name}</h4>
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

      {/* Store Info */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-6">
        <div className="bg-[#FAA531] p-4">
          <div className="flex items-center">
            <TbBuildingStore className="w-6 h-6 text-[#111827] mr-3" />
            <h4 className="text-lg font-semibold text-[#111827]">Información de la Tienda</h4>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentStore.description && (
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Descripción</h5>
                <p className="text-gray-600">{currentStore.description}</p>
              </div>
            )}
            <div className="space-y-3">
              {currentStore.address && (
                <div className="flex items-center">
                  <TbMapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">{currentStore.address}</span>
                </div>
              )}
              {currentStore.phone && (
                <div className="flex items-center">
                  <TbPhone className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-600">{currentStore.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-[#FAA531] p-4">
          <div className="flex items-center">
            <TbPackage className="w-6 h-6 text-[#111827] mr-3" />
            <h4 className="text-lg font-semibold text-[#111827]">Productos</h4>
          </div>
        </div>
        <div className="p-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                prefix={<TbSearch className="text-gray-400" />}
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Solo en Stock</span>
              <Switcher checked={inStockOnly} onChange={handleInStockToggle} />
            </div>
          </div>

          {/* Products List */}
          {storeProducts.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TbPackage className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
              <p className="text-gray-500">Intenta ajustar tu búsqueda o filtros.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {storeProducts.map((storeProduct) => (
                  <div
                    key={storeProduct.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-gray-900">{storeProduct.product.name}</h5>
                      <span className={`text-sm px-2 py-1 rounded ${
                        storeProduct.stock > 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {storeProduct.stock > 0 ? `${storeProduct.stock} en stock` : 'Agotado'}
                      </span>
                    </div>
                    {storeProduct.product.description && (
                      <p className="text-gray-600 text-sm mb-2">{storeProduct.product.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <TbTag className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="font-medium text-green-600">${Number(storeProduct.price).toFixed(2)}</span>
                      </div>
                      {storeProduct.product.category && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {storeProduct.product.category}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {productsPagination.total > productsPagination.limit && (
                <div className="flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    total={productsPagination.total}
                    pageSize={productsPagination.limit}
                    onChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default StoreDetail