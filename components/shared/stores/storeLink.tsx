"use client";

import { useRouter } from 'next/navigation';
import React from 'react';

const StoreLink = ({ id, name , type }: { id: string , image?: string ,name?: string , type:string }) => {
    const router = useRouter();

    return (
        <td
            className="whitespace-nowrap py-5 pl-4 pr-3 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6 cursor-pointer"
            onClick={() => router.push(`/${type}/${id}`)}
        >
          <div className="flex items-center gap-3">
                                 
                                   <p>{name}</p>
                                 </div>
        </td>
    );
};

export default StoreLink;
