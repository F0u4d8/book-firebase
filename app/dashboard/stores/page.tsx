import { lusitana } from '@/components/shared/fonts'
import Search from '@/components/shared/search'
import CustomersTable from '@/components/shared/stores/table'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Stores',
}

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string
    page?: string
  }
}) {
  const query = searchParams?.query || ''


  return (
    <main>    <div className="w-full">
    <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
      Stores
    </h1>

      <CustomersTable  />
 </div>   </main>
  )
}