import { create } from 'zustand'
import type { TableQueries } from '@/@types/common'
import type { Country, Filter, FormSchema } from '../types'

type MessageDialog = {
    mode: '' | 'edit' | 'new'
    open: boolean,
    country?: Country
}

export const initialTableData: TableQueries = {
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
        order: '',
        key: '',
    },
}

export const initialFilterData = {
    name: '',
    code: '',
}

export type CountryListState = {
    tableData: TableQueries
    filterData: Filter
    selectedCustomer: Partial<Country>[]
    messageDialog: MessageDialog,
    country: Partial<Country>
}

type CountryListAction = {
    setFilterData: (payload: Filter) => void
    setTableData: (payload: TableQueries) => void
    setSelectedCountry: (checked: boolean, country: Country) => void
    setSelectAllCountry: (country: Country[]) => void,
    toggleMessageDialog: (payload: MessageDialog) => void
    storeCountry: (country: FormSchema) => void
}

const initialState: CountryListState = {
    tableData: initialTableData,
    filterData: initialFilterData,
    selectedCustomer: [],
    messageDialog: {
        mode: '',
        open: false,
    },
    country: {},
}

export const useCountryListStore = create<
    CountryListState & CountryListAction
>((set) => ({
    ...initialState,
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setTableData: (payload) => set(() => ({ tableData: payload })),
    setSelectedCountry: (checked, row) =>
        set((state) => {
            const prevData = state.selectedCustomer
            if (checked) {
                return { selectedCustomer: [...prevData, ...[row]] }
            } else {
                if (
                    prevData.some((prevCustomer) => row.code === prevCustomer.code)
                ) {
                    return {
                        selectedCustomer: prevData.filter(
                            (prevCustomer) => prevCustomer.code !== row.code,
                        ),
                    }
                }
                return { selectedCustomer: prevData }
            }
        }),
    toggleMessageDialog: (payload) => set(() => ({ 
        messageDialog: payload, 
        country: payload.country 
    })),
    setSelectAllCountry: (row) => set(() => ({ selectedCustomer: row })),
    storeCountry: (payload) => {
        console.log('storeCountry', payload);
        
        //const response = await storeCountry(payload);
        // set((state) => ({
        //     country: {...state.country, payload},
        // }));
    },
}))
