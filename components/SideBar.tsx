'use client';
import {
  CoinsIcon,
  HomeIcon,
  Layers2Icon,
  MenuIcon,
  ShieldCheckIcon,
  ShieldIcon,
} from 'lucide-react';
import React from 'react';
import Logo from './Logo';
import Link from 'next/link';
import { Button, buttonVariants } from './ui/button';
import { usePathname } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import UserAvailableCreditsBadge from './UserAvailableCreditsBadge';

const routes = [
  {
    href: '',
    label: 'Home',
    icon: HomeIcon,
  },
  {
    href: 'workflows',
    label: 'Workflows',
    icon: Layers2Icon,
  },
  {
    href: 'credentials',
    label: 'Credentials',
    icon: ShieldCheckIcon,
  },
  {
    href: 'billing',
    label: 'Billing',
    icon: CoinsIcon,
  },
];

const DesktopSidebar = () => {
  const pathname = usePathname();
  const activeRoute =
    routes.find((route) => route.href.length > 0 && pathname.includes(route.href)) ||
    routes[0];
  return (
    <div
      className="hidden relative md:block min-w-[280px] max-w-[280px] h-screen overflow-hidden w-full
     bg-primary/5 dark:bg-secondary/30 dark:text-foreground text-muted-foreground border-r-[0.5px] border-[#e5e5e5] border-separate "
    >
      <div className="flex items-center justify-center gap-2 border-b-[1px] border-[#e5e5e5] border-separate p-4">
        <Logo />
      </div>
      <div className="p-2">
        <UserAvailableCreditsBadge />
      </div>
      <div className="flex flex-col p-2">
        {routes.map((route) => {
          return (
            <Link
              href={`/${route.href}`}
              className={buttonVariants({
                variant:
                  activeRoute.href === route.href
                    ? 'sidebarItemActive'
                    : 'sidebarItem',
              })}
              key={route.href}
            >
              <route.icon size={20} />
              {route.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export function MobileSideBar() {
  const [isOpen, setOpen] = React.useState(false);
  const pathname = usePathname();
  const activeRoute =
    routes.find(
      (route) => route.href.length > 0 && pathname.includes(route.href)
    ) || routes[0];
  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="container flex items-center justify-between px-8">
        <Sheet open={isOpen} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant={'ghost'} size={'icon'}>
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent
            className="w-[400px] sm:w-[540px] space-x-4"
            side={'left'}
            aria-describedby="sidebar"
          >
            <SheetHeader>
              <SheetTitle>
                <Logo />
                <UserAvailableCreditsBadge />
              </SheetTitle>
              <SheetDescription></SheetDescription>
            </SheetHeader>

            <div className="flex flex-col mt-4 !ml-0 gap-1">
              {routes.map((route: any) => {
                return (
                  <Link
                    href={route.href}
                    className={buttonVariants({
                      variant:
                        activeRoute.href === route.href
                          ? 'sidebarItemActive'
                          : 'sidebarItem',
                    })}
                    key={route.href}
                    onClick={() => setOpen(() => !open)}
                  >
                    <route.icon size={20} />
                    {route.label}
                  </Link>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}

export default DesktopSidebar;
