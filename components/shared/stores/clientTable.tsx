
import Link from 'next/link'
import StoreLink from './storeLink'
import {  ClientType } from '@/lib/dashboardTypes'


type ClientTableProps = {
    clients: ClientType[];
  };

  
export default async function ClientTable({ clients }: ClientTableProps) {


  return (

      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md  p-2 md:pt-0">
              <div className="md:hidden">
                {clients?.map((customer) => ( 
                  <div
                    key={customer.id}
                    className="mb-2 w-full rounded-md  p-4"
                  >
                 <Link href={`client/${customer.id}`}> <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <div className="flex items-center gap-3">
                            
                            <p>{customer.name}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted">{customer.email}</p>
                      </div>
                    </div> </Link>
                   
                    <div className="flex w-full items-center justify-between border-b py-5">
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">   Available Cups    </p>
                        <p className="font-medium">{customer.availableCups}</p>
                      </div>
                     
                    </div>
                   
                  </div>
                ))}
              </div>
              <table className="hidden min-w-full rounded-md  md:table">
                <thead className="rounded-md  text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                    Available Cups                    </th>
                  
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {clients.map((customer) => (
                    <tr key={customer.id} className="group">
                     <StoreLink type='client' id={customer.id} name={customer.name} />
                      
                      <td className="whitespace-nowrap  px-4 py-5 text-sm">
                        {customer.email}
                      </td>
                     
                      <td className="whitespace-nowrap   px-4 py-5 text-sm">
                        {customer.availableCups}
                      </td>
                     
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  )
}