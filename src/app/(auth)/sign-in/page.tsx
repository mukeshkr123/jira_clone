import { auth } from '@/auth';
import { SignInCard } from '@/features/auth/components/sign-in-card';
import { redirect } from 'next/navigation';

const SignIn = async () => {
    const session = await auth();

    if (session) {
        redirect("/")
    }

    return (
        <SignInCard />
    )
}

export default SignIn