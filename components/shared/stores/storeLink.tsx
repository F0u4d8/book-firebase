"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

const StoreLink = ({ id , image , name , type }: { id: string , image?: string ,name?: string , type:string }) => {
    const router = useRouter();

    return (
        <td
            className="whitespace-nowrap py-5 pl-4 pr-3 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6 cursor-pointer"
            onClick={() => router.push(`/${type}/${id}`)}
        >
          <div className="flex items-center gap-3">
                                   <Image
                                     src={image || '/no-image.png'} 
                                     className="rounded-full"
                                     alt={`${name}'s profile picture`}
                                     width={28}
                                     height={28}
                                   />
                                   <p>{name}</p>
                                 </div>
        </td>
    );
};

export default StoreLink;
