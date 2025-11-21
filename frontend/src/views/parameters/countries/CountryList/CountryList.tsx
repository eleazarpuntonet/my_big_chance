import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Container from '@/components/shared/Container'
import CountryListTable from './components/CountryListTable'
import CountryListActionTools from './components/CountryListActionTools'
import CountryListSelected from './components/CountryListSelected'
import CountryEditor from '../CountryEditor/CountryEditor'

const CountryList = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Paises</h3>
                            <CountryListActionTools />
                        </div>
                        <CountryListTable />
                        <CountryEditor />
                    </div>
                </AdaptiveCard>
            </Container>
            <CountryListSelected />
        </>
    )
}

export default CountryList
