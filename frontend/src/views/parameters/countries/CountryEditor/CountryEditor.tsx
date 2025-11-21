import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import RichTextEditor from '@/components/shared/RichTextEditor'
import { FormItem, Form } from '@/components/ui/Form'
import sleep from '@/utils/sleep'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import { useCountryListStore } from '../CountryList/store/countryListStore'
import { Validations } from '@/utils/validations'
import { FormSchema } from '../CountryList/types'



const CountryEditor = () => {
    const { country, messageDialog, toggleMessageDialog, storeCountry } = useCountryListStore()

    const [formSubmiting, setFormSubmiting] = useState(false)

    const { required } = Validations

    const validationSchema: ZodType<FormSchema> = z.object({
        code: z.string().min(1, { message: required }),
        name: z.string().min(1, { message: required }),
        capital: z.string().min(1, { message: required }),
        awsRegion: z.string().min(1, { message: required }),
    })

    const {
        handleSubmit,
        reset,
        formState,
        control,
    } = useForm<FormSchema>({
        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        if (messageDialog.mode === 'edit') {
            reset({
                code: country.code,
                name: country.name,
                capital: country.capital,
                awsRegion: country.awsRegion,
            })
        } else {
            reset({
                code: '',
                name: '',
                capital: '',
                awsRegion: '',
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messageDialog.mode])

    const handleDialogClose = () => {
        toggleMessageDialog({
            mode: '',
            open: false,
        })
    }

    const onSubmit = async (value: FormSchema) => {
        setFormSubmiting(true)
        storeCountry(value)
        await sleep(500)
        toast.push(<Notification type="success">Pais guardado correctamente!</Notification>, {
            placement: 'top-center',
        })
        setFormSubmiting(false)
        handleDialogClose()
    }

    return (
        <Dialog
            isOpen={messageDialog.open}
            onClose={handleDialogClose}
            onRequestClose={handleDialogClose}
        >
            <h4 className="mb-4">
                {messageDialog.mode === 'new' && 'Nuevo Pais'}
                {messageDialog.mode === 'edit' && 'Editar Pais'}
            </h4>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <FormItem
                    label="Código:"
                    invalid={Boolean(formState.errors.code)}
                    errorMessage={formState.errors.code?.message}
                >
                    <Controller
                        name="code"
                        control={control}
                        render={({ field }) => (
                            <Input autoComplete="off" {...field} 
                                placeholder="Código"/>
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Nombre:"
                    invalid={Boolean(formState.errors.name)}
                    errorMessage={formState.errors.name?.message}
                >
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                autoComplete="off"
                                placeholder="Nombre del pais"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                
                <FormItem
                    label="Capital:"
                    invalid={Boolean(formState.errors.capital)}
                    errorMessage={formState.errors.capital?.message}
                >
                    <Controller
                        name="capital"
                        control={control}
                        render={({ field }) => (
                            <Input autoComplete="off" {...field} 
                                placeholder="Capital"/>
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Región:"
                    invalid={Boolean(formState.errors.awsRegion)}
                    errorMessage={formState.errors.awsRegion?.message}
                >
                    <Controller
                        name="awsRegion"
                        control={control}
                        render={({ field }) => (
                            <Input
                                autoComplete="off"
                                placeholder="Región"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <div className="text-right mt-4">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        type="button"
                        onClick={handleDialogClose}
                    >
                        Descartar
                    </Button>
                    <Button
                        variant="solid"
                        loading={formSubmiting}
                        type="submit"
                    >
                        Guardar
                    </Button>
                </div>
            </Form>
        </Dialog>
    )
}

export default CountryEditor
