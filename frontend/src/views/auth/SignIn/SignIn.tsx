import { TbLogin, TbUserCheck } from 'react-icons/tb'
import Alert from '@/components/ui/Alert'
import SignInForm from './components/SignInForm'
import OauthSignIn from './components/OauthSignIn'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useThemeStore } from '@/store/themeStore'

type SignInProps = {
    signUpUrl?: string
    forgetPasswordUrl?: string
    disableSubmit?: boolean
}

export const SignInBase = ({
    signUpUrl = '/sign-up',
    forgetPasswordUrl = '/forgot-password',
    disableSubmit,
}: SignInProps) => {
    const [message, setMessage] = useTimeOutMessage()

    const mode = useThemeStore((state) => state.mode)

    return (
        <>
            <div className="mb-8 text-center">
                <div className="flex items-center justify-center mb-4">
                    <TbLogin className="w-12 h-12 text-black mr-3" />
                    <h2 className="text-2xl font-bold text-black">Bienvenido</h2>
                </div>
                <p className="text-black font-semibold">
                    Ingresa tus credenciales para iniciar sesión
                </p>
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}
            <SignInForm
                disableSubmit={disableSubmit}
                setMessage={setMessage}
                passwordHint={
                    <div className="mb-7 mt-2">
                        <ActionLink
                            to={forgetPasswordUrl}
                            className="font-semibold text-black underline"
                            themeColor={false}
                        >
                            ¿Olvidaste tu contraseña?
                        </ActionLink>
                    </div>
                }
            />
            <div className="mt-8">
                <div className="flex items-center gap-2 mb-6">
                    <div className="border-t border-black flex-1 mt-[1px]" />
                    <p className="font-semibold text-black">
                        o continúa con
                    </p>
                    <div className="border-t border-black flex-1 mt-[1px]" />
                </div>
            </div>
            <div>
                <div className="mt-6 text-center">
                    <span className="text-black">¿No tienes una cuenta aún? </span>
                    <ActionLink
                        to={signUpUrl}
                        className="text-black font-bold"
                        themeColor={false}
                    >
                        Regístrate
                    </ActionLink>
                </div>
            </div>
        </>
    )
}

const SignIn = () => {
    return <SignInBase />
}

export default SignIn
