import { doSignOut } from "@/lib/actions/auth-actions";
import AppLogo from "../app-logo";
import ModeToggle from "../dashboard/mode-toggle";
import {Button } from "@/components/ui/button";
import {PowerIcon} from "lucide-react";
import StoreLogo from "./store-logo";
import Link from "next/link";
import StoreNavLinks from "./storeLinks";

export default function SideNav({storeId ,
  image,
  name,
  email,
  address,
}: {storeId : string | undefined
  image: string | undefined;
  name: string | undefined;
  email: string | undefined;
  address: string | undefined;
}) {



  return (
    <div className="flex h-full flex-col px-4 py-4 md:px-2">
      {/* App Logo */}
      <div className="mb-4">
        <AppLogo />
      </div>
      <Link href={`/store/${storeId}`}>      {/* Store Information */}
      <div className="mb-6 flex flex-col items-center">
        <StoreLogo image={image} name={name} />
        <h2 className="text-lg font-semibold text-center mt-2">{name}</h2>
        <div className="text-sm text-muted-foreground text-center break-words mt-1">
          <span className="block">{email}</span>
          <span className="block">{address}</span>
        </div>
      </div>
      </Link>
      {/* Spacer */}
  
      <StoreNavLinks storeId={storeId} />
      <div className="flex grow"></div>
      {/* Mode Toggle and Sign Out */}
      <div className="flex flex-col space-y-4 mt-2">
        <ModeToggle />
        <form
          action={async () => {
            "use server";
            await doSignOut();
          }}
        >
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground"
          >
            <PowerIcon className="w-6 mr-2" />
            <span className="hidden md:inline">Sign Out</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
