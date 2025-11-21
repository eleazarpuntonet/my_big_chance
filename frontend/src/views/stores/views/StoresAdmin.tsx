import { useEffect } from 'react'
import { useStoreStore } from '../store/useStoreStore'
import CreateStoreForm from '../components/CreateStoreForm'
import { CreateStoreDto } from '../types/store.types'
import { TbBuildingStorefront, TbPlus } from 'react-icons/tb'

const StoresAdmin = () => {
  const { createStore } = useStoreStore()

  const handleCreateStore = async (data: CreateStoreDto) => {
    await createStore(data)
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 p-4 rounded-t-xl mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TbBuildingStorefront className="w-6 h-6 text-white mr-3" />
            <h4 className="text-lg font-semibold text-white">Store Administration</h4>
          </div>
        </div>
      </div>

      {/* Create Store Form */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-blue-600 p-4">
          <div className="flex items-center">
            <TbPlus className="w-6 h-6 text-white mr-3" />
            <h4 className="text-lg font-semibold text-white">Create New Store</h4>
          </div>
        </div>
        <div className="p-6">
          <CreateStoreForm onSubmit={handleCreateStore} />
        </div>
      </div>

      {/* Future: Store List for editing/deleting */}
      <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
          <div className="flex items-center">
            <TbBuildingStorefront className="w-6 h-6 text-white mr-3" />
            <h4 className="text-lg font-semibold text-white">Store Management</h4>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-500">Store list and management features coming soon...</p>
        </div>
      </div>
    </div>
  )
}

export default StoresAdmin