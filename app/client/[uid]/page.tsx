
import StatCardsWrapper from '@/components/shared/dashboard/stat-cards-wrapper';
import { lusitana } from '@/components/shared/fonts';
import { CardsSkeleton } from '@/components/shared/skeletons';
import SideNav from '@/components/shared/stores/sidenav';
import { findClientAcrossStores } from '@/lib/actions/storesActions';
import React, { Suspense } from 'react'

const page =  async ({ params }: { params: Promise<{ uid: string }> }) => {

  const uid = (await params).uid;


  const result = await findClientAcrossStores(uid);
  console.log(result);
  
  if (result) {
    const { storeName, storeAddress, clientName, clientEmail, storeEmail, storeImage ,availableCups} = result
    return (
      <div className="flex flex-col h-screen md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-52 bg-secondary">
              <SideNav image={storeImage} name={storeName} email={storeEmail} address={storeAddress} />
            </div>
            <div className="grow p-6 md:overflow-y-auto ">  <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>{`${clientName} Dashboard`}
              
            </h1>
            <h1 className={`${lusitana.className} text-sm text-muted-foreground block  break-words mt-1 mb-2`}>
          {clientEmail}
              </h1>

         
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Suspense fallback={<CardsSkeleton />}>
           <StatCardsWrapper data={{availableCups}} /> 
              </Suspense>
            </div>
           
          </main></div>
          </div>
      
      
      
        
        )
  }

 
}

export default page