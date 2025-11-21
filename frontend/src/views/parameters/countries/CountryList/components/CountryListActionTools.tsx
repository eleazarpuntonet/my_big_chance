import Button from '@/components/ui/Button'
import { TbCloudDownload, TbFlagPlus, TbUserPlus } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import useCountryList from '../hooks/useCountryList'
import { CSVLink } from 'react-csv'
import CustomerListTableFilter from './CustomerListTableFilter'

const CountryListActionTools = () => {
    const navigate = useNavigate()

    const { countryList, toggleMessageDialog } = useCountryList()

    return (
        <div className="flex flex-col md:flex-row gap-3">
            
            <CustomerListTableFilter />
            <Button
                variant="solid"
                icon={<TbFlagPlus className="text-xl" />}
                size="sm"
                onClick={() =>
                    toggleMessageDialog({
                        open: true,
                        mode: 'new',
                    })
                }
            >
                Nuevo pais
            </Button>
        </div>
    )
}

export default CountryListActionTools
