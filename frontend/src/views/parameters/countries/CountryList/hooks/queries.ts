import { gql } from 'graphql-tag';

export const GET_COUNTRIES = gql`
    query GetCountries($filter: CountryFilterInput) {
        countries(filter: $filter) {
            code
            name
            emoji
            capital
            awsRegion
        }
    }
`;

export const STORE_COUNTRY = `
    query StoreCountries(objects: CountryInput) {
        countries(objects: $objects) {
            code
            name
            emoji
            capital
            awsRegion
        }
    }
`;