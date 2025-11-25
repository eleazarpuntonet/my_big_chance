import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProductStore } from '../store/useProductStore'
import { GetProductsQueryDto } from '../types/product.types'
import { Button, Input, Pagination } from '@/components/ui'
import { TbSearch, TbPackage, TbPlus } from 'react-icons/tb'
import { Notification, toast } from '@/components/ui'

const ProductsList = () => {
  const navigate = useNavigate()
  const { products, loading, error, pagination, fetchProducts, clearError } = useProductStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchProducts({ q: searchQuery, page: currentPage, limit: 10 })
  }, [fetchProducts, searchQuery, currentPage])

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
    setCurrentPage(1) // Reset to first page when searching
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-[#FAA531] p-4 rounded-t-xl mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TbPackage className="w-6 h-6 text-[#111827] mr-3" />
            <h4 className="text-lg font-semibold text-[#111827]">Productos</h4>
          </div>
          <Button
            onClick={() => navigate('/products/admin')}
            className="bg-white/10 hover:bg-white/20 text-[#111827] border-white/20"
          >
            <TbPlus className="w-4 h-4 mr-2" />
            Agregar Producto
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="max-w-md">
          <Input
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            prefix={<TbSearch className="text-gray-400" />}
          />
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TbPackage className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
          <p className="text-gray-500">Intenta ajustar tu búsqueda o agrega un nuevo producto.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <div className="bg-[#FAA531] p-4">
                  <div className="flex items-center">
                    <TbPackage className="w-6 h-6 text-[#111827] mr-3" />
                    <h4 className="text-lg font-semibold text-[#111827] truncate">{product.name}</h4>
                  </div>
                </div>
                <div className="p-4">
                  {product.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  )}
                  <div className="space-y-2">
                    {product.category && (
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          {product.category}
                        </span>
                      </div>
                    )}
                    {product.basePrice && (
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="font-medium text-green-600">${Number(product.basePrice).toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.total > pagination.limit && (
            <div className="flex justify-center">
              <Pagination
                currentPage={currentPage}
                total={pagination.total}
                pageSize={pagination.limit}
                onChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ProductsList