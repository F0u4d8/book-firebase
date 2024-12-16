import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { lusitana } from "../fonts";
import { cn } from "@/lib/utils";
import { latestOrdersType } from "@/lib/dashboardTypes";

export default async function LatestInvoices({
  orders,
}: {
  orders: latestOrdersType[];
}) {
  return (
    <Card className="flex w-full flex-col md:col-span-4">
      <CardHeader>
        <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
          Latest Orders
        </h2>
      </CardHeader>
      <CardContent>
        <div>
          <div>
            {orders.map((invoice: latestOrdersType, i: number) => {
              return (
                <div
  key={invoice.id}
  className={cn(
    "flex flex-row items-center justify-between py-4",
    {
      "border-t": i !== 0,
    }
  )}
>
  <div className="flex items-center flex-1">
    <div className="min-w-0">
      <p className="truncate text-sm font-semibold md:text-base">
        {invoice.storeName}
      </p>
      <p className="hidden text-sm text-gray-500 sm:block">
        {invoice.storeEmail}
      </p>
    </div>
  </div>

  <div className="flex items-center justify-start flex-1">
    <p
      className={`${lusitana.className} truncate text-sm font-medium md:text-base text-end`}
    >
      {invoice.total} sar
    </p>
  </div>
  <div className="flex items-center justify-end flex-1">
    <p
      className={`${lusitana.className} truncate text-sm font-medium md:text-base text-end`}
    >
      {invoice.formattedCreatedAt}
    </p>
  </div>
</div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
