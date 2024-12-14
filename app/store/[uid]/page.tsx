import LatestInvoices from '@/components/shared/dashboard/latest-invoices';
import RevenueChartWrapper from '@/components/shared/dashboard/revenue-chart-wrapper';
import StatCardsWrapper from '@/components/shared/dashboard/stat-cards-wrapper';
import { lusitana } from '@/components/shared/fonts';
import { CardsSkeleton, LatestInvoicesSkeleton, RevenueChartSkeleton } from '@/components/shared/skeletons';
import SideNav from '@/components/shared/stores/sidenav';
import { fetchStoreData } from '@/lib/actions/storesActions';
import React, { Suspense } from 'react'

const page =  async ({ params }: { params: Promise<{ uid: string }> }) => {

  const uid = (await params).uid;


const {totalClients ,totalOrders  , totalRevenue , latestOrders ,monthlyRevenue,storeEmail , storeImage ,storeName ,storeAddress } = await fetchStoreData(uid)


  return (
<div className="flex flex-col h-screen md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-52 bg-secondary">
        <SideNav image={storeImage} name={storeName} email={storeEmail} address={storeAddress} />
      </div>
      <div className="grow p-6 md:overflow-y-auto ">  <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>{`${storeName} Dashboard`}
        
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
     <StatCardsWrapper data={{totalClients ,totalOrders , totalRevenue }} /> 
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
      <RevenueChartWrapper revenue={monthlyRevenue} />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
      <LatestInvoices orders={latestOrders} />    
        </Suspense>
      </div>
    </main></div>
    </div>



  
  )
}

export default page