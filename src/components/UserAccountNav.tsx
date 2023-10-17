import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "./ui/dropdown-menu";

import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { Button } from "./ui/button";
import { Avatar } from "./ui/avatar";
import Image from "next/image";

import { AvatarFallback } from "./ui/avatar";
import { Icons } from "./ui/icons";
import Link from "next/link";
interface UserAccountNavProps {
  email: string | undefined;
  name: string;
  imageUrl: string;
}

const UseraccountNav = ({ email, imageUrl, name }: UserAccountNavProps) => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="overflow-visible">
          <Button className="rounded-full h-8 w-8 aspect-square bg-slate-400">
            <Avatar className="relative w-8 h-8">
              {imageUrl ? (
                <div className="relative aspect-square h-full w-full">
                  <Image
                    fill
                    src={imageUrl}
                    alt="profile pic"
                    referrerPolicy="no-referrer"
                  ></Image>
                </div>
              ) : (
                <AvatarFallback>
                  <span className="sr-only">{name}</span>
                  <Icons.user className="h-4 w-4 text-stone-900" />
                </AvatarFallback>
              )}
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white">
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-0.5 leading-none">
              {name && <p className="font-medium text-sm text-black">{name}</p>}
              {email && (
                <p className="w-[200px] truncate text-xs text-zinc-700">
                  {email}
                </p>
              )}
            </div>
          </div>
          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href="/dashboard">Dashboard</Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="cursor-pointer">
            <LogoutLink>Log out</LogoutLink>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UseraccountNav;
