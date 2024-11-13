
"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { TriangleAlert } from "lucide-react"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useState } from "react"
import { FaGithub } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"
import { useSignup } from "../hooks/use-sign-up"

export const SignUpCard = () => {
    const mutation = useSignup()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const onCredentialsSignUp = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        mutation.mutate({
            name,
            email,
            password
        }, {
            onSuccess: () => {
                signIn("credentials", {
                    email: email,
                    password: password,
                    callbackUrl: "/"
                })
            }
        })
    }

    const onProviderSignIn = (provider: "github" | "google") => {
        signIn(provider, {
            callbackUrl: "/"
        })
    }

    return (
        <Card className="w-full h-full p-8">
            <CardHeader className="px-0 pt-0">
                <CardTitle>
                    Create an account
                </CardTitle>
                <CardDescription>
                    Use your email or another service to continue
                </CardDescription>
            </CardHeader>
            {!!mutation.error && (
                <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
                    <TriangleAlert className="size-4" />
                    <p>Something went wrong</p>
                </div>
            )}
            <CardContent className="space-y-5 px-0 pb-0">
                <form action="" onSubmit={onCredentialsSignUp} className="space-y-2.5">
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        type="text"
                        required
                    />
                    <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        type="email"
                        required
                    />
                    <Input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        type="password"
                        required
                        minLength={3}
                        maxLength={20}
                    />
                    <Button type="submit" className="w-full" size="lg">Continue</Button>
                </form>
                <Separator />
                <div className="gap-y-2.5 flex flex-col">
                    <Button variant="outline" size="lg" className="w-full relative"
                        onClick={() => onProviderSignIn("github")}
                    >
                        <FaGithub className="mr-2 size-5 top-2.5 left-2.5 absolute" />
                        Continue with Github
                    </Button>
                    <Button variant="outline" size="lg" className="w-full relative"
                        onClick={() => onProviderSignIn("google")}
                    >
                        <FcGoogle className="mr-2 size-5 top-2.5 left-2.5 absolute" />
                        Continue with Google
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                    Already have an account? <Link href="/sign-in"><span className="text-sky-700 hover:underline">Sign in</span></Link>
                </p>
            </CardContent>
        </Card>
    )
}
