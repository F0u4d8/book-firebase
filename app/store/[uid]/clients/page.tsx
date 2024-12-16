import { lusitana } from '@/components/shared/fonts';
import ClientTable from '@/components/shared/stores/clientTable';
import SideNav from '@/components/shared/stores/sidenav';
import { fetchStoreData } from '@/lib/actions/storesActions';
import React from 'react'

const page =  async ({ params }: { params: Promise<{ uid: string }> }) => {
  const uid = (await params).uid;

  const {clients ,storeEmail , storeImage ,storeName ,storeAddress ,storeId } = await fetchStoreData(uid)
  
  console.log(uid);
  
return (
<div className="flex flex-col h-screen md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-52 bg-secondary">
        <SideNav storeId={storeId} image={storeImage} name={storeName} email={storeEmail} address={storeAddress} />
      </div>
     <main className='w-full '>   
      
      
      
       <div className="w-full flex flex-col justify-center items-center content-center  ">
        <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl mt-10`}>
          Clients
        </h1>
    <div className='flex items-center  mx-auto'>
          <ClientTable clients={clients}  /></div>
     </div>   </main>
    </div>



  
  )
}

export default page