'use client';

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { ChevronLeftIcon, MenuIcon } from 'lucide-react';
import ReddishLogo from '@/images/Reddish Full.png'
import ReddishLogoOnly from '@/images/Reddish Logo Only.png'
import Image from 'next/image';
import React from 'react'
import { Button } from './ui/button';
import CreatePost from './CreatePost';
import { useSidebar } from '@/components/ui/sidebar';

const Header = () => {
    const { toggleSidebar, open, isMobile } = useSidebar();

  return (
    <header className='flex items-center justify-between p-4 border-b border-gray-200'>
        <div className='h-10 flex items-center'>
            {open && !isMobile ? (
                <ChevronLeftIcon className='w-6 h-6' onClick={toggleSidebar}/>
            ) : (
                <div className='flex items-center gap-2'>
                    <MenuIcon className='w-6 h-6' onClick={toggleSidebar}/>
                    <Image 
                        src={ReddishLogo}
                        alt='Reddish Logo'
                        width={150}
                        height={150}
                        className='hidden md:block'
                    />
                    <Image 
                        src={ReddishLogoOnly}
                        alt='Reddish Logo'
                        width={40}
                        height={40}
                        className='block md:hidden'
                    />
                </div>
            )}
        </div>

        <div className='flex items-center gap-2'>
            <CreatePost />

            <SignedIn>
                <UserButton />
            </SignedIn>

            <SignedOut>
                <Button asChild variant='outline'>
                    <SignInButton mode='modal' />
                </Button>
            </SignedOut>
        </div>
    </header>
  )
}

export default Header