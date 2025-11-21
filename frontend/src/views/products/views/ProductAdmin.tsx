import { useEffect } from 'react'
import { useProductStore } from '../store/useProductStore'
import CreateProductForm from '../components/CreateProductForm'
import { CreateProductDto } from '../types/product.types'
import { TbPackage, TbPlus } from 'react-icons/tb'

const ProductAdmin = () => {
  const { createProduct } = useProductStore()

  const handleCreateProduct = async (data: CreateProductDto) => {
    await createProduct(data)
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 p-4 rounded-t-xl mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TbPackage className="w-6 h-6 text-white mr-3" />
            <h4 className="text-lg font-semibold text-white">Product Administration</h4>
          </div>
        </div>
      </div>

      {/* Create Product Form */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-blue-600 p-4">
          <div className="flex items-center">
            <TbPlus className="w-6 h-6 text-white mr-3" />
            <h4 className="text-lg font-semibold text-white">Create New Product</h4>
          </div>
        </div>
        <div className="p-6">
          <CreateProductForm onSubmit={handleCreateProduct} />
        </div>
      </div>

      {/* Future: Product List for editing/deleting */}
      <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
          <div className="flex items-center">
            <TbPackage className="w-6 h-6 text-white mr-3" />
            <h4 className="text-lg font-semibold text-white">Product Management</h4>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-500">Product list and management features coming soon...</p>
        </div>
      </div>
    </div>
  )
}

export default ProductAdmin