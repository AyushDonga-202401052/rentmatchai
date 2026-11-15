'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronSelectorVertical,
  LogOut01,
  User01,
} from '@untitledui/icons';
import { Button as AriaButton } from 'react-aria-components';

import { Dropdown } from '@/src/components/base/dropdown/dropdown';
import { cx } from '@/src/utils/cx';
import { Avatar } from '@/src/components/base/avatar/avatar';
import { usePageCurtains } from '@/src/components/ui/page-curtains';

export interface DropdownAccountCardProps {
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'tenant' | 'landlord';
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onSignOut: () => void;
  onCloseMobileDrawer?: () => void;
  isExpanded?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export const DropdownAccountCardMD = ({
  name,
  email,
  avatarUrl,
  role,
  onSignOut,
  onCloseMobileDrawer,
  isExpanded = true,
  onOpenChange,
}: DropdownAccountCardProps) => {
  const router = useRouter();
  const { navigateWithCurtains } = usePageCurtains();

  const handleNavigate = (path: string, label: string) => {
    onCloseMobileDrawer?.();
    navigateWithCurtains(path, label);
  };

  const handleSignOut = () => {
    onCloseMobileDrawer?.();
    onSignOut();
    router.replace('/login');
  };

  return (
    <Dropdown.Root onOpenChange={onOpenChange}>
      <div className="relative flex items-center h-11 w-full">
        {/* Floating/Prominent Profile Picture (sits on top, larger than the box) */}
        <div className="absolute left-0 z-20 size-10 rounded-full shrink-0 flex items-center justify-center ring-2 ring-white dark:ring-[#211E1B] shadow-md bg-zinc-100 dark:bg-zinc-800 pointer-events-none transition-transform duration-200">
          <Avatar
            size="md"
            src={avatarUrl}
            alt={name}
            initials={name ? name.split(' ').map((n) => n[0]).filter(Boolean).join('').slice(0, 2).toUpperCase() : 'U'}
            status="online"
          />
        </div>

        {/* The Card Box (starts underneath the PFP and smoothly extends out to the right) */}
        <AriaButton
          aria-label={name}
          className={cx(
            'relative h-9.5 cursor-pointer rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/90 dark:bg-zinc-900/60 dark:hover:bg-zinc-800/70 dark:border-zinc-800/80 transition-[width,background-color] duration-250 ease-out outline-none focus:outline-none focus-visible:outline-none ring-0 flex items-center overflow-hidden',
            isExpanded ? 'w-full pl-11 pr-2' : 'w-10 pl-0 pr-0 justify-center'
          )}
        >
          {/* Inner content that slides out from under PFP */}
          <div
            className={`overflow-hidden transition-all duration-200 flex-1 flex items-center justify-between min-w-0 ${
              isExpanded
                ? 'opacity-100 max-w-[150px]'
                : 'opacity-0 max-w-0 pointer-events-none'
            }`}
          >
            <div className="min-w-0 flex-1 leading-tight whitespace-nowrap">
              <div className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100">{name}</div>
              <div className="truncate text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                {role === 'tenant' ? 'Tenant' : 'Landlord'}
              </div>
            </div>

            <div className="shrink-0 size-4 flex items-center justify-center text-zinc-400 dark:text-zinc-500 ml-1">
              <ChevronSelectorVertical className="size-3.5 stroke-[2.25px]" />
            </div>
          </div>
        </AriaButton>
      </div>

      <Dropdown.Popover
        placement={isExpanded ? 'top start' : 'right bottom'}
        offset={isExpanded ? 8 : 12}
        className="w-[236px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl ring-0 outline-none focus:outline-none focus-visible:outline-none p-1 text-zinc-800 dark:text-zinc-200 z-50"
      >
        <div className="border-b border-zinc-100 dark:border-zinc-800/80 px-4 py-3">
          <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
            {name}
          </p>
          <p className="truncate text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{email}</p>
          <p className="mt-1.5 inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {role} account
          </p>
        </div>

        <Dropdown.Menu className="py-1 outline-none focus:outline-none focus-visible:outline-none">
          <Dropdown.Item
            icon={User01}
            onAction={() => handleNavigate('/profile?tab=personal', 'Profile & Account')}
          >
            View Profile
          </Dropdown.Item>

          <Dropdown.Separator className="my-1 bg-zinc-200/80 dark:bg-zinc-800/80" />

          <Dropdown.Item
            icon={LogOut01}
            onAction={handleSignOut}
            destructive
          >
            Sign Out
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown.Root>
  );
};
