'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {   UsersIcon } from 'lucide-react'


export default function StoreNavLinks(data :  {storeId : string | undefined}) {
  const pathname = usePathname()
const {storeId} = data

  const links = [
    { name: 'Clients', href: `${storeId}/clients`, icon: UsersIcon },
    
  ]

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon
        return (
          <Link
            key={link.name}
            href={link.href}
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'justify-start',
              pathname === link.href ? '' : 'text-muted-foreground'
            )}
          >
            <LinkIcon className="mr-2 h-6 w-6" />
            <span className="hidden md:block">{link.name}</span>
          </Link>
        )
      })}
    </>
  )
}