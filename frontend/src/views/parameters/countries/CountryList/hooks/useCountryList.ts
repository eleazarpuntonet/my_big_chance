import useSWR from 'swr'
import { request } from 'graphql-request'
import { useCountryListStore } from '../store/countryListStore'
import type { CountriesResponse } from '../types'
import { useMemo } from 'react'
import { GET_COUNTRIES } from './queries';


export default function useCountryList() {
   
    const {
        tableData,
        filterData,
        setTableData,
        selectedCustomer,
        setSelectedCountry,
        setSelectAllCountry,
        setFilterData,
        toggleMessageDialog,
        storeCountry
    } = useCountryListStore((state: any) => state)

    const fetcher = (query: string, params: any): Promise<CountriesResponse> => 
        request(import.meta.env.VITE_API_URL, query, params);
    
    const query = useMemo(() => GET_COUNTRIES, []);
    
    const filters = useMemo(() => {
        const filterConditions: { [key: string]: any } = {};
    
        if (filterData.name) {
            filterConditions.name = { regex: filterData.name };
        }
    
        if (filterData.code) {
            filterConditions.code = { regex: filterData.code.toUpperCase() };
        }
    
        return { filter: filterConditions };
    }, [filterData]);
    
    const { data, error, isLoading, mutate } = useSWR<CountriesResponse>(
        [query, filters],
        ([query, filters]) => fetcher(query, filters),
        {
            revalidateOnFocus: false,
        }
    );

    const insertCountry = async (countryInput: any) => {
        console.log('countryInput', countryInput);
        
        // const params = { input: countryInput };
        // const response = await request(import.meta.env.VITE_API_URL, STORE_COUNTRY, params);
        storeCountry(countryInput);
        return countryInput;
    };

    const countryList = data?.countries || []

    const countryListTotal = countryList.length || 0

    return {
        countryList,
        countryListTotal,
        error,
        isLoading,
        tableData,
        filterData,
        mutate,
        setTableData,
        selectedCustomer,
        setSelectedCountry,
        setSelectAllCountry,
        setFilterData,
        toggleMessageDialog,
        insertCountry
    }
}
