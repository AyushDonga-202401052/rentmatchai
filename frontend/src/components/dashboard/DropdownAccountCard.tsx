'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronSelectorVertical,
  LogOut01,
  Moon01,
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
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
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
  isDarkMode,
  onToggleDarkMode,
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
      <AriaButton
        aria-label={!isExpanded ? name : undefined}
        className={({ isPressed, isFocusVisible }) =>
          cx(
            'relative w-full h-10 cursor-pointer rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/90 dark:bg-zinc-900/60 dark:hover:bg-zinc-800/70 dark:border-zinc-800/80 transition-colors duration-150 outline-offset-2 outline-focus-ring flex items-center px-2 overflow-hidden',
            (isPressed || isFocusVisible) && 'outline-2'
          )
        }
      >
        <div className="w-8 h-8 shrink-0 flex items-center justify-center">
          <Avatar
            size="sm"
            src={avatarUrl}
            alt={name}
            initials={name ? name.split(' ').map((n) => n[0]).filter(Boolean).join('').slice(0, 2).toUpperCase() : 'U'}
            status="online"
          />
        </div>

        <div
          className={`overflow-hidden transition-all duration-200 flex-1 flex items-center justify-between min-w-0 ${
            isExpanded
              ? 'opacity-100 max-w-[150px] ml-2'
              : 'opacity-0 max-w-0 ml-0 pointer-events-none'
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

      <Dropdown.Popover
        placement={isExpanded ? 'top start' : 'right bottom'}
        offset={isExpanded ? 8 : 12}
        className="w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-1 text-zinc-800 dark:text-zinc-200 z-50 animate-in fade-in zoom-in-95 duration-150"
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

        <Dropdown.Menu className="py-1">
          <Dropdown.Item
            icon={User01}
            onAction={() => handleNavigate('/profile?tab=personal', 'Profile & Account')}
          >
            View Profile
          </Dropdown.Item>

          <Dropdown.Section
            selectionMode="single"
            selectedKeys={new Set(isDarkMode ? ['dark'] : [])}
            onSelectionChange={() => {
              onToggleDarkMode();
            }}
          >
            <Dropdown.Item
              id="dark"
              icon={Moon01}
              selectionIndicator="toggle"
            >
              Dark Mode
            </Dropdown.Item>
          </Dropdown.Section>

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
