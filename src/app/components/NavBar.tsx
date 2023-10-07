import Link from "next/link";

import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import {LoginLink, RegisterLink} from "@kinde-oss/kinde-auth-nextjs/server"

const NavBar = () => {
    return ( 
        <nav className='sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all'>
            <MaxWidthWrapper>
                <div className='flex h-14 items-center justify-between border-b border-zinc-200' >
                    <div className="">
                <Link
            href='/'
            className='flex items-start z-40 font-semibold '>
            <span className="flex items-start">docxy.</span>
          </Link>
          </div>
                <div className='hidden items-center space-x-4 sm:flex'>
                    <>
                    <Link
                  href='/about'
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}>
                    <span>about</span>
                    
                  
                </Link>
                    <LoginLink className={buttonVariants({
                        variant:"ghost",
                        size:'sm',
                    })}>
                        log in

                    </LoginLink>
                    <RegisterLink className={buttonVariants({
                       
                        size:'sm',
                    })}>
                        get started

                    </RegisterLink>
                    </>
                </div>

        </div>
            </MaxWidthWrapper>
        </nav>
     );
}
 
export default NavBar;