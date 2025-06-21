import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useErrorMessage from "@/hooks/use-error-message"
import useInput from "@/hooks/use-input"
import { useAppDispatch } from "@/states/hooks"
import { useLoginUserMutation } from "@/states/slices/login/loginApiSlice"
import { putAccessToken } from "@/utils/localStorage"
import { useEffect } from "react"
import { showLoading } from "react-redux-loading-bar"
import { useNavigate } from "react-router-dom"

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, onEmailChange] = useInput();
  const [password, onPasswordChange] = useInput();

  const dispatch = useAppDispatch()
  const {
    showErrorToast
  } = useErrorMessage()

  const [loginUser, { isLoading, error: onError }] = useLoginUserMutation();

  const handleLogin = async () => {
    await loginUser({ email, password }).then((res) => {
      const at = res.data?.access_token;
      if (at) {
        putAccessToken(at)
        navigate("/user")
      }
    })
  }

  useEffect(() => {
    if (isLoading) dispatch(showLoading())
  }, [isLoading, dispatch])

  useEffect(() => {
    if (onError) {
      showErrorToast(onError)
    }
  }, [onError])

  return (
    <div className="flex justify-center items-center mx-auto min-h-screen px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          {/* <CardAction>
            <Button variant="link">Sign Up</Button>
          </CardAction> */}
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@gmail.com"
                  value={email}
                  onChange={onEmailChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {/* <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a> */}
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={onPasswordChange}
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            className="w-full"
            onClick={handleLogin}
          >
            Login
          </Button>
          {/* <Button variant="outline" className="w-full">
            Login with Google
          </Button> */}
        </CardFooter>
      </Card>
    </div>
  )
}
