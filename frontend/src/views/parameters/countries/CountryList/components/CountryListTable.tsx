import { useMemo, useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import useCountryList from '../hooks/useCountryList'
import { Link, useNavigate } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep'
import { TbPencil, TbEye, TbTrash } from 'react-icons/tb'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { Country } from '../types'
import type { TableQueries } from '@/@types/common'
import CountryDeleteConfimation from '../../CountryDeleteConfirmation/CountryDeleteConfimation'

const statusColor: Record<string, string> = {
    active: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
    blocked: 'bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900',
}

const NameColumn = ({ row }: { row: Country }) => {
    const flag = `/img/countries/${row.code}.png`
    return (
        <div className="flex items-center">
            <img src={flag} alt="" className='w-10'/>
            {/* <Avatar size={40} shape="circle" src={row.emoji} /> */}
            {/* <Link
                className={`hover:text-primary ml-2 rtl:mr-2 font-semibold text-gray-900 dark:text-gray-100`}
                to={`/concepts/customers/customer-details/${row.code}`}
            > */}
            {/* </Link> */}
            <span className={`ml-2 rtl:mr-2 font-semibold text-gray-900 dark:text-gray-100`}>
                {row.name}
            </span>
        </div>
    )
}


const ActionColumn = ({
    onEdit,
    onDelete,
}: {
    onEdit: () => void
    onDelete: () => void
}) => {
    return (
        <div className="flex items-center gap-3">
            <Tooltip title="Edit">
                <div
                    className={`text-xl cursor-pointer select-none font-semibold`}
                    role="button"
                    onClick={onEdit}
                >
                    <TbPencil />
                </div>
            </Tooltip>
            <Tooltip title="Eliminar">
                <div
                    className={`text-xl cursor-pointer select-none font-semibold`}
                    role="button"
                    onClick={onDelete}
                >
                    <TbTrash />
                </div>
            </Tooltip>
            {/* <CountryDeleteConfimation 
            isOpen={deleteConfirmationOpen}
            selectedMailCount={selectedMailId.length}
            onClose={handleClose}
            onConfirmDelete={handleConfirmDelete}/> */}
        </div>
    )
}

const CountryListTable = () => {
    const navigate = useNavigate()
    
    let {
        countryList,
        countryListTotal,
        tableData,
        isLoading,
        setTableData,
        setSelectAllCountry,
        setSelectedCountry,
        selectedCustomer,
        toggleMessageDialog,
        mutate,
    } = useCountryList()
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [countrySelect, setCountrySelect] = useState({} as Country)
    const handleEdit = (country: Country) => {
        toggleMessageDialog({
            open: true,
            mode: 'edit',
            country: country,
        })
    }
    const handleClose = () => {
        setDeleteConfirmationOpen(false)
    }
    const handleOpen = (country: Country) => {
        setCountrySelect(country);
        setDeleteConfirmationOpen(true)
    }

    const handleConfirmDelete = () => {
        const remain = countryList.filter((country) => country.code !== countrySelect.code)
        mutate(
            {
                countries: remain,
                total: countryListTotal - 1,
            },
            false,
        )
        handleClose()
    }


    const columns: ColumnDef<Country>[] = useMemo(
        () => [
            {
                header: 'Nombre',
                accessorKey: 'name',
                cell: (props) => {
                    const row = props.row.original
                    return <NameColumn row={row} />
                },
            },
            {
                header: 'Capital',
                accessorKey: 'capital',
            },
            {
                header: 'Region',
                accessorKey: 'awsRegion',
            },
            // {
            //     header: 'Status',
            //     accessorKey: 'status',
            //     cell: (props) => {
            //         const row = props.row.original
            //         return (
            //             <div className="flex items-center">
            //                 <Tag className={statusColor[row.status]}>
            //                     <span className="capitalize">{row.status}</span>
            //                 </Tag>
            //             </div>
            //         )
            //     },
            // },
            // {
            //     header: 'Spent',
            //     accessorKey: 'totalSpending',
            //     cell: (props) => {
            //         return <span>${props.row.original.totalSpending}</span>
            //     },
            // },
            {
                header: '',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        onEdit={() => handleEdit(props.row.original)}
                        onDelete={() => {handleOpen(props.row.original)}}
                    />
                ),
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    )

    const handleSetTableData = (data: TableQueries) => {
        setTableData(data)
        if (selectedCustomer.length > 0) {
            setSelectAllCountry([])
        }
    }

    const handlePaginationChange = (page: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = page
        handleSetTableData(newTableData)
    }

    const handleSelectChange = (value: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageSize = Number(value)
        newTableData.pageIndex = 1
        handleSetTableData(newTableData)
    }

    const handleSort = (sort: OnSortParam) => {
        const newTableData = cloneDeep(tableData)
        newTableData.sort = sort
        handleSetTableData(newTableData)
    }

    const handleRowSelect = (checked: boolean, row: Country) => {
        setSelectedCountry(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Country>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllCountry(originalRows)
        } else {
            setSelectAllCountry([])
        }
    }
    return (
        <>
            <DataTable
                selectable
                columns={columns}
                data={countryList}
                noData={!isLoading && countryList.length === 0}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 28, height: 28 }}
                loading={isLoading}
                pagingData={{
                    total: countryListTotal,
                    pageIndex: tableData.pageIndex as number,
                    pageSize: tableData.pageSize as number,
                }}
                checkboxChecked={(row) =>
                    selectedCustomer.some((selected: any) => selected.code === row.code)
                }
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                onSort={handleSort}
                onCheckBoxChange={handleRowSelect}
                onIndeterminateCheckBoxChange={handleAllRowSelect}
            />
            <CountryDeleteConfimation 
                isOpen={deleteConfirmationOpen}
                onClose={handleClose}
                onConfirmDelete={handleConfirmDelete}/>
            
        </>
    )
}

export default CountryListTable
