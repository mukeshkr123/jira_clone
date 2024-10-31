
import React from 'react';

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        <div className='h-full bg-[url(/bg.jpg)] bg-top bg-cover flex-col flex'>
            <div className='flex z-[4] flex-col items-center justify-center w-full h-full'>
                <div className='w-full h-full md:h-auto md:w-[420px]'>
                    {children}
                </div>
            </div>
            <div className="fixed inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.8),rgba(0,0,0,.4),rgba(0,0,0,.8))] z-[1]" />
        </div>
    )
}

export default AuthLayout
