import LatestInvoices from '@/components/shared/dashboard/latest-invoices'
import RevenueChartWrapper from '@/components/shared/dashboard/revenue-chart-wrapper'
import StatCardsWrapper from '@/components/shared/dashboard/stat-cards-wrapper'
import { lusitana } from '@/components/shared/fonts'
import { CardsSkeleton, LatestInvoicesSkeleton, RevenueChartSkeleton } from '@/components/shared/skeletons'
import { fetchDashboardData } from '@/lib/actions/adminActions'
import React, { Suspense } from 'react'

const page =async () => {

  const {storeCount ,totalOrders ,userCount , totalRevenue , latestOrders ,monthlyRevenue} = await fetchDashboardData()



  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
     <StatCardsWrapper data={{storeCount ,totalOrders ,userCount , totalRevenue }} /> 
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
    </main>
  )
}

export default page