import { useEffect } from 'react'
import { useStoreStore } from '../store/useStoreStore'
import CreateStoreForm from '../components/CreateStoreForm'
import { CreateStoreDto } from '../types/store.types'
import { Button } from '@/components/ui'
import { TbBuildingStore, TbPlus, TbEdit, TbTrash, TbMapPin, TbPhone } from 'react-icons/tb'
import { Notification, toast } from '@/components/ui'

const StoresAdmin = () => {
  const { stores, loading, createStore, fetchStores, deleteStore, clearError } = useStoreStore()

  useEffect(() => {
    fetchStores({ page: 1, limit: 50 }) // Load all for admin
  }, [fetchStores])

  const handleCreateStore = async (data: CreateStoreDto) => {
    await createStore(data)
    fetchStores({ page: 1, limit: 50 }) // Refresh list
  }

  const handleDeleteStore = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tienda?')) {
      try {
        await deleteStore(id)
        toast.push(
          <Notification type="success">
            Tienda eliminada exitosamente
          </Notification>,
          { placement: 'top-center' }
        )
        fetchStores({ page: 1, limit: 50 }) // Refresh list
      } catch (error) {
        toast.push(
          <Notification type="danger">
            Error al eliminar la tienda
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
            <TbBuildingStore className="w-6 h-6 text-[#111827] mr-3" />
            <h4 className="text-lg font-semibold text-[#111827]">Administración de Tiendas</h4>
          </div>
        </div>
      </div>

      {/* Create Store Form */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-[#FAA531] p-4">
          <div className="flex items-center">
            <TbPlus className="w-6 h-6 text-[#111827] mr-3" />
            <h4 className="text-lg font-semibold text-[#111827]">Crear Nueva Tienda</h4>
          </div>
        </div>
        <div className="p-6">
          <CreateStoreForm onSubmit={handleCreateStore} />
        </div>
      </div>

      {/* Store Management */}
      <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-[#FAA531] p-4">
          <div className="flex items-center">
            <TbBuildingStore className="w-6 h-6 text-[#111827] mr-3" />
            <h4 className="text-lg font-semibold text-[#111827]">Gestión de Tiendas</h4>
          </div>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FAA531]"></div>
            </div>
          ) : stores.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay tiendas registradas aún.</p>
          ) : (
            <div className="space-y-4">
              {stores.map((store) => (
                <div
                  key={store.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{store.name}</h5>
                    {store.description && (
                      <p className="text-gray-600 text-sm mt-1">{store.description}</p>
                    )}
                    <div className="flex items-center space-x-4 mt-2">
                      {store.address && (
                        <div className="flex items-center text-sm text-gray-500">
                          <TbMapPin className="w-4 h-4 mr-1" />
                          <span>{store.address}</span>
                        </div>
                      )}
                      {store.phone && (
                        <div className="flex items-center text-sm text-gray-500">
                          <TbPhone className="w-4 h-4 mr-1" />
                          <span>{store.phone}</span>
                        </div>
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
                      onClick={() => handleDeleteStore(store.id)}
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

export default StoresAdmin