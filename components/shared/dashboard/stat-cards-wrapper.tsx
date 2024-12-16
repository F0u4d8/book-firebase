import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { BanknoteIcon, ClockIcon, InboxIcon, UsersIcon ,StoreIcon ,CupSoda } from 'lucide-react'
import { lusitana } from '../fonts'

const iconMap = {
  collected: BanknoteIcon,
  customers: UsersIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
  store:StoreIcon ,
  cups : CupSoda
}

export default async function StatCardsWrapper({data} :{ data: Partial<{availableCups: number; storeCount: number; totalOrders: number; userCount: number; totalRevenue: number; totalClients: number }> }) {


  return (
    <>
   {data.totalRevenue !== undefined && 
        <StatCard
        title="Total"
        value={data.totalRevenue}
        type="collected"
      />
      }

      
      {data.totalOrders !== undefined && 
       <StatCard title="Total orders" value={data.totalOrders} type="invoices" />
      }

       {data.storeCount !== undefined && 
        <StatCard
        title="Total Stores"
        value={data.storeCount}
        type="store"
      />
      }

{data.availableCups !== undefined && 
        <StatCard
        title="Total available cups"
        value={data.availableCups}
        type="cups"
      />
      }


{data.userCount !== undefined && 
         <StatCard
         title="Total Users"
         value={data.userCount}
         type="customers"
       />
      }
      {data.totalClients !== undefined && 
        <StatCard
        title="Total Clients"
        value={data.totalClients}
        type="customers"
      />
     }
     
    </>
  )
}

export function StatCard({
  title,
  value,
  type,
}: {
  title: string
  value: number | string
  type: 'invoices' | 'customers' | 'pending' | 'collected' | 'store' | 'cups'
}) {
  const Icon = iconMap[type]

  return (
    <Card>
      <CardHeader className="flex flex-row  space-y-0 space-x-3 ">
        {Icon ? <Icon className="h-5 w-5" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </CardHeader>
      <CardContent>
        <p
          className={`${lusitana.className}
               truncate rounded-xl   p-4  text-2xl`}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  )
}