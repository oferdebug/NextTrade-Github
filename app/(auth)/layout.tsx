'use client';


import Link from "next/link";

import  Image from "next/image";
import type {ReactNode} from 'react';
function Layout({children}:{children:ReactNode}) {
    return (
        <main className='auth-layout'>
            <section className='auth-left-section scrollbar-hide-default'>
                <Link href={'/'} className={'auth-logo'}>
                    <Image src='/assets/icons/tradeiq_logo.svg' alt='logo' width={140} height={160} className={'h-8 w-auto'}/>
                </Link>
                <div className={'pb-7 lg:pb-9 flex-1'}>
                    {children}
                </div>
            </section>
            <section className={'auth-right-section'}>
                <div className={'z-10 relative lg:mt-4 lg:mb-16'}>
                    <blockquote className={'auth-blockquote'}>

                    </blockquote>
                </div>
            </section>
        </main>
    )
}

export default Layout
