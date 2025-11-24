import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStoreStore } from '../store/useStoreStore'
import { GetStoresQueryDto } from '../types/store.types'
import { Button, Input, Pagination } from '@/components/ui'
import { TbSearch, TbBuildingStore, TbMapPin, TbPhone, TbPlus } from 'react-icons/tb'
import { Notification, toast } from '@/components/ui'

const StoresList = () => {
  const navigate = useNavigate()
  const { stores, loading, error, storesPagination, fetchStores, clearError } = useStoreStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchStores({ q: searchQuery, page: currentPage, limit: 10 })
  }, [fetchStores, searchQuery, currentPage])

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

  if (loading && stores.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 rounded-t-xl mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TbBuildingStore className="w-6 h-6 text-white mr-3" />
            <h4 className="text-lg font-semibold text-white">Stores</h4>
          </div>
          <Button
            onClick={() => navigate('/admin/stores')}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            <TbPlus className="w-4 h-4 mr-2" />
            Add Store
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="max-w-md">
          <Input
            placeholder="Search stores..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            prefix={<TbSearch className="text-gray-400" />}
          />
        </div>
      </div>

      {/* Stores Grid */}
      {stores.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TbBuildingStore className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No stores found</h3>
          <p className="text-gray-500">Try adjusting your search or add a new store.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {stores.map((store) => (
              <div
                key={store.id}
                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => navigate(`/stores/${store.id}`)}
              >
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4">
                  <div className="flex items-center">
                    <TbBuildingStore className="w-6 h-6 text-white mr-3" />
                    <h4 className="text-lg font-semibold text-white truncate">{store.name}</h4>
                  </div>
                </div>
                <div className="p-4">
                  {store.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{store.description}</p>
                  )}
                  <div className="space-y-2">
                    {store.address && (
                      <div className="flex items-center text-sm text-gray-500">
                        <TbMapPin className="w-4 h-4 mr-2" />
                        <span className="truncate">{store.address}</span>
                      </div>
                    )}
                    {store.phone && (
                      <div className="flex items-center text-sm text-gray-500">
                        <TbPhone className="w-4 h-4 mr-2" />
                        <span>{store.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {storesPagination.total > storesPagination.limit && (
            <div className="flex justify-center">
              <Pagination
                currentPage={currentPage}
                total={storesPagination.total}
                pageSize={storesPagination.limit}
                onChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default StoresList