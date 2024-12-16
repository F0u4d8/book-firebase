import { fetchStores } from '@/lib/actions/adminActions'
import Image from 'next/image'
import Link from 'next/link'
import StoreLink from './storeLink'
export default async function CustomersTable() {

    const { stores} =await fetchStores()

  return (

      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md  p-2 md:pt-0">
              <div className="md:hidden">
                {stores?.map((customer) => ( 
                  <div
                    key={customer.id}
                    className="mb-2 w-full rounded-md  p-4"
                  >
                    {customer.userType === "store" ? (<Link href={`store/${customer.id}`}><div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <div className="flex items-center gap-3">
                            <Image
                              src={customer.image || '/no-image.png'} 
                              className="rounded-full"
                              alt={`${customer.name}'s profile picture`}
                              width={28}
                              height={28}
                            />
                            <p>{customer.name}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted">{customer.email}</p>
                      </div>
                    </div></Link> ) :  (<Link href={`client/${customer.id}`}> <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <div className="flex items-center gap-3">
                            <Image
                              src={customer.image || '/no-image.png'} 
                              className="rounded-full"
                              alt={`${customer.name}'s profile picture`}
                              width={28}
                              height={28}
                            />
                            <p>{customer.name}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted">{customer.email}</p>
                      </div>
                    </div> </Link>)}
                   
                    <div className="flex w-full items-center justify-between border-b py-5">
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Pending</p>
                        <p className="font-medium">{customer.clientCount}</p>
                      </div>
                      <div className="flex w-1/2 flex-col">
                        <p className="text-xs">Paid</p>
                        <p className="font-medium">{customer.orderCount}</p>
                      </div>
                    </div>
                    <div className="pt-4 text-sm">
                      <p>{customer.totalRevenue} sar</p>
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
Clients                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
Orders                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      Total 
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {stores.map((customer) => (
                    <tr key={customer.id} className="group">
                        {customer.userType === "store" ? (<StoreLink type='store' id={customer.id} image={customer.image} name={customer.name} />
                       
                      ): (<StoreLink type='client' id={customer.id} image={customer.image} name={customer.name} />) }
                      
                      <td className="whitespace-nowrap  px-4 py-5 text-sm">
                        {customer.email}
                      </td>
                      <td className="whitespace-nowrap   px-4 py-5 text-sm">
                        {customer.clientCount}
                      </td>
                      <td className="whitespace-nowrap   px-4 py-5 text-sm">
                        {customer.orderCount}
                      </td>
                      <td className="whitespace-nowrap   px-4 py-5 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md">
                        {customer.totalRevenue} sar
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