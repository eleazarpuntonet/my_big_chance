import ConfirmDialog from '@/components/shared/ConfirmDialog'

type CountryDeleteConfimationProps = {
    isOpen: boolean
    onClose: () => void
    onConfirmDelete: () => void
}

const CountryDeleteConfimation = ({
    isOpen,
    onClose,
    onConfirmDelete,
}: CountryDeleteConfimationProps) => {
    return (
        <ConfirmDialog
            isOpen={isOpen}
            type="danger"
            title="Eliminar pais"
            onClose={onClose}
            onRequestClose={onClose}
            onCancel={onClose}
            onConfirm={onConfirmDelete}
        >
            <p>¿Esta seguro que desea inhabilitar el pais?</p>
        </ConfirmDialog>
    )
}

export default CountryDeleteConfimation
