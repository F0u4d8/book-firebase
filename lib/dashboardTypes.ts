export declare interface UserInfo {
    id : string 
    address : string
    email : string
  name:string
  phoneNumber : Number
  userType : string
  } 


  
export type FormattedCustomersTable = {
  id: string
  name: string
  email: string
  image_url: string
  total_invoices: number
  total_pending: string
  total_paid: string
}



export declare interface UserInfo {
  id : string 
  address : string
  email : string
name:string
phoneNumber : Number
userType : string
} 

export declare interface latestOrdersType {
id : string ,
storeName? : string ,
formattedCreatedAt : string ,
storeEmail? : string ,
total? : string  ,
createdAt? : any
}


export type MonthlyRevenueType = {
  month: string; // Format: YYYY-MM
  revenue: number;
}[];

export type StoreType = {
  id: string;
  name?: string;
  email?: string;
  totalRevenue?: number;
  orderCount?: number;
  clientCount?: number;
  [key: string]: any; // For additional fields in the store document
};