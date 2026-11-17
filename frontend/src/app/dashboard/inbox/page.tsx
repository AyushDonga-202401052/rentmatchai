'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Inbox,
  Search,
  Phone,
  Calendar,
  Building2,
  Clock,
  CheckCircle2,
  CheckCheck,
  Send,
  Paperclip,
  PanelRightClose,
  PanelRightOpen,
  ArrowLeft,
  ShieldCheck,
  MapPin,
  ExternalLink,
  User,
  X,
} from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { useProperty } from '@/src/context/PropertyContext';
import {
  Message,
  MessageContent,
  MessageAvatar,
  MessageHeader,
} from '@/src/components/ui/message';
import { Bubble, BubbleContent } from '@/src/components/ui/bubble';
import {
  InputGroup,
  InputGroupTextarea,
  InputGroupAddon,
  InputGroupButton,
} from '@/src/components/ui/input-group';
import { ScrollArea, ScrollBar } from '@/src/components/ui/scroll-area';
import { Button } from '@/src/components/ui/button';
import { Skeleton } from '@/src/components/ui/skeleton';

export function InboxSkeleton() {
  return (
    <div className="h-full w-full flex bg-zinc-50 dark:bg-[#171513] text-zinc-900 dark:text-zinc-100 overflow-hidden select-none transition-colors duration-200">
      {/* 1. Left Conversation List Pane Skeleton */}
      <aside className="w-full md:w-80 lg:w-96 flex flex-col border-r border-zinc-200 dark:border-zinc-800/80 bg-white/95 dark:bg-[#211E1B]/95 shrink-0 h-full">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800/80 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="size-8 rounded-xl bg-zinc-200/80 dark:bg-zinc-800/80" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-28 rounded bg-zinc-200/80 dark:bg-zinc-800/80" />
                <Skeleton className="h-3 w-36 rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
              </div>
            </div>
            <Skeleton className="h-5 w-16 rounded-full bg-zinc-200/60 dark:bg-zinc-800/60" />
          </div>
          <Skeleton className="h-8 w-full rounded-xl bg-zinc-200/70 dark:bg-zinc-800/70" />
          <div className="flex gap-1.5 pt-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-14 rounded-lg bg-zinc-200/60 dark:bg-zinc-800/60" />
            ))}
          </div>
        </div>

        <div className="p-2 space-y-2 flex-1 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="p-3.5 border-b border-zinc-100 dark:border-zinc-800/60 flex items-center gap-3.5"
            >
              <Skeleton className="size-10 rounded-full bg-zinc-200/70 dark:bg-zinc-800/70 shrink-0" />
              <div className="flex-1 space-y-1.5 min-w-0">
                <Skeleton className="h-3.5 w-28 rounded bg-zinc-200/80 dark:bg-zinc-800/80" />
                <Skeleton className="h-3 w-20 rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* 2. Middle Active Chat Pane Skeleton */}
      <section className="hidden md:flex flex-1 flex-col h-full bg-white dark:bg-[#171513] overflow-hidden">
        <div className="h-16 border-b border-zinc-200 dark:border-zinc-800/80 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full bg-zinc-200/70 dark:bg-zinc-800/70" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-36 rounded bg-zinc-200/80 dark:bg-zinc-800/80" />
              <Skeleton className="h-3 w-48 rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="size-8 rounded-lg bg-zinc-200/70 dark:bg-zinc-800/70" />
            <Skeleton className="size-8 rounded-lg bg-zinc-200/70 dark:bg-zinc-800/70" />
          </div>
        </div>
        <div className="flex-1 p-6 space-y-4">
          <Skeleton className="h-10 w-3/4 max-w-md rounded-2xl bg-zinc-200/50 dark:bg-zinc-800/50" />
          <div className="flex justify-end">
            <Skeleton className="h-12 w-64 rounded-2xl bg-zinc-200/70 dark:bg-zinc-800/70" />
          </div>
        </div>
      </section>
    </div>
  );
}

interface ChatMessageItem {
  id: string;
  sender: 'user' | 'participant' | 'system';
  senderName: string;
  avatarText?: string;
  timestamp: string;
  content: string;
  tourCard?: {
    propertyTitle: string;
    date: string;
    time: string;
    status: string;
  };
}

interface ConversationItem {
  id: string;
  participantName: string;
  participantHandle: string;
  participantRole: string;
  participantAvatar: string;
  participantAvatarUrl: string;
  isOnline: boolean;
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyRent: string;
  propertyImage: string;
  propertyBeds: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  category: 'Enquiries' | 'Tours' | 'All';
  messages: ChatMessageItem[];
}

const INITIAL_CONVERSATIONS: ConversationItem[] = [
  {
    id: 'conv-1',
    participantName: 'Olivia Rhye',
    participantHandle: '@olivia',
    participantRole: 'Landlord',
    participantAvatar: 'OR',
    participantAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    isOnline: true,
    propertyId: 'prop-1',
    propertyTitle: '3 BHK High-Floor Flat, Kudasan',
    propertyLocation: 'Near Infocity, Kudasan, Gandhinagar',
    propertyRent: '₹28,000/mo',
    propertyImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
    propertyBeds: '3 BHK',
    lastMessage: 'Sounds great! You can buzz flat 702 when you arrive at the tower lobby.',
    lastTimestamp: '12m ago',
    unreadCount: 1,
    category: 'Tours',
    messages: [
      {
        id: 'm-1',
        sender: 'system',
        senderName: 'System',
        timestamp: 'Yesterday, 10:15 AM',
        content: 'Direct rental channel initiated. RentMatch zero-brokerage guarantee active.',
      },
      {
        id: 'm-2',
        sender: 'user',
        senderName: 'You',
        timestamp: 'Yesterday, 10:20 AM',
        content: 'Hello Olivia, I saw your 3 BHK listing in Kudasan. Is covered parking included in the rent?',
      },
      {
        id: 'm-3',
        sender: 'participant',
        senderName: 'Olivia Rhye',
        avatarText: 'OR',
        timestamp: 'Yesterday, 11:05 AM',
        content: 'Hello! Yes, one covered basement slot is designated for this flat. Maintenance is ₹2,000/month.',
      },
      {
        id: 'm-4',
        sender: 'user',
        senderName: 'You',
        timestamp: 'Today, 2:10 PM',
        content: 'Could we schedule a walkthrough tour tomorrow evening?',
      },
      {
        id: 'm-5',
        sender: 'participant',
        senderName: 'Olivia Rhye',
        avatarText: 'OR',
        timestamp: '1h ago',
        content: 'Sure, you are welcome to visit tomorrow between 4 PM and 6 PM.',
        tourCard: {
          propertyTitle: '3 BHK High-Floor Flat, Kudasan',
          date: 'Tomorrow, Nov 9',
          time: '4:30 PM IST',
          status: 'Confirmed',
        },
      },
      {
        id: 'm-6',
        sender: 'user',
        senderName: 'You',
        timestamp: '45m ago',
        content: 'Perfect, I will be there at 4:30 PM sharp with my ID documents.',
      },
      {
        id: 'm-7',
        sender: 'participant',
        senderName: 'Olivia Rhye',
        avatarText: 'OR',
        timestamp: '12m ago',
        content: 'Sounds great! You can buzz flat 702 when you arrive at the tower lobby.',
      },
    ],
  },
  {
    id: 'conv-2',
    participantName: 'Phoenix Baker',
    participantHandle: '@phoenix',
    participantRole: 'Landlord',
    participantAvatar: 'PB',
    participantAvatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    isOnline: false,
    propertyId: 'prop-2',
    propertyTitle: '2 BHK Fully Furnished, Infocity',
    propertyLocation: 'Near DA-IICT, Infocity, Gandhinagar',
    propertyRent: '₹22,000/mo',
    propertyImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
    propertyBeds: '2 BHK',
    lastMessage: 'The current tenant moves out this weekend, so it will be freshly painted and available from Monday!',
    lastTimestamp: '2h ago',
    unreadCount: 2,
    category: 'Enquiries',
    messages: [
      {
        id: 'm-201',
        sender: 'user',
        senderName: 'You',
        timestamp: 'Yesterday, 4:00 PM',
        content: 'Hi Phoenix, does the flat have high speed Wi-Fi infrastructure ready?',
      },
      {
        id: 'm-202',
        sender: 'participant',
        senderName: 'Phoenix Baker',
        avatarText: 'PB',
        timestamp: 'Yesterday, 4:25 PM',
        content: 'Maintenance includes covered car parking and water charges. For Wi-Fi, JioFiber and Airtel Xstream lines are already terminated inside the hall.',
      },
      {
        id: 'm-203',
        sender: 'user',
        senderName: 'You',
        timestamp: 'Yesterday, 5:10 PM',
        content: 'That is great. Are kitchen appliances like the refrigerator and chimney covered under owner maintenance?',
      },
      {
        id: 'm-204',
        sender: 'participant',
        senderName: 'Phoenix Baker',
        avatarText: 'PB',
        timestamp: 'Yesterday, 6:00 PM',
        content: 'Yes, both the Samsung double-door fridge and Faber chimney have active AMC contracts until next year.',
      },
      {
        id: 'm-205',
        sender: 'user',
        senderName: 'You',
        timestamp: '3h ago',
        content: 'Excellent. What is the earliest available move-in date?',
      },
      {
        id: 'm-206',
        sender: 'participant',
        senderName: 'Phoenix Baker',
        avatarText: 'PB',
        timestamp: '2h ago',
        content: 'The current tenant moves out this weekend, so it will be freshly painted and available from Monday!',
      },
    ],
  },
  {
    id: 'conv-3',
    participantName: 'Demi Wilkinson',
    participantHandle: '@demi',
    participantRole: 'Landlord',
    participantAvatar: 'DW',
    participantAvatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
    isOnline: true,
    propertyId: 'prop-3',
    propertyTitle: '1 BHK Cozy Studio, Raysan',
    propertyLocation: 'Near PDPU, Raysan, Gandhinagar',
    propertyRent: '₹14,500/mo',
    propertyImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
    propertyBeds: '1 BHK',
    lastMessage: 'Just sent the drive link to your email! Let me know if you would like to see the terrace area too.',
    lastTimestamp: 'Yesterday',
    unreadCount: 0,
    category: 'Enquiries',
    messages: [
      {
        id: 'm-301',
        sender: 'user',
        senderName: 'You',
        timestamp: '2 days ago',
        content: 'Hi Demi, what are the security deposit terms?',
      },
      {
        id: 'm-302',
        sender: 'participant',
        senderName: 'Demi Wilkinson',
        avatarText: 'DW',
        timestamp: '2 days ago',
        content: 'The security deposit is 2 months rent, fully refundable on vacating.',
      },
      {
        id: 'm-303',
        sender: 'user',
        senderName: 'You',
        timestamp: 'Yesterday, 11:30 AM',
        content: 'Is there 100% DG power backup in this building during summer outages?',
      },
      {
        id: 'm-304',
        sender: 'participant',
        senderName: 'Demi Wilkinson',
        avatarText: 'DW',
        timestamp: 'Yesterday, 12:15 PM',
        content: 'Yes, the tower has dual generator backup for all common lifts and up to 1.5 kVA per apartment for lights and fans.',
      },
      {
        id: 'm-305',
        sender: 'user',
        senderName: 'You',
        timestamp: 'Yesterday, 2:00 PM',
        content: 'Could you share a quick video walkthrough before we arrange an in-person visit?',
      },
      {
        id: 'm-306',
        sender: 'participant',
        senderName: 'Demi Wilkinson',
        avatarText: 'DW',
        timestamp: 'Yesterday',
        content: 'Just sent the drive link to your email! Let me know if you would like to see the terrace area too.',
      },
    ],
  },
  {
    id: 'conv-4',
    participantName: 'Natali Craig',
    participantHandle: '@natali',
    participantRole: 'Landlord',
    participantAvatar: 'NC',
    participantAvatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80',
    isOnline: true,
    propertyId: 'prop-4',
    propertyTitle: '3 BHK Garden Villa, Urjanagar',
    propertyLocation: 'Near TCS Campus, Urjanagar, Gandhinagar',
    propertyRent: '₹35,000/mo',
    propertyImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
    propertyBeds: '3 BHK',
    lastMessage: 'Yes, small trained pets are very welcome! We just ask for a simple pet addendum in the rental agreement.',
    lastTimestamp: '3d ago',
    unreadCount: 0,
    category: 'Tours',
    messages: [
      {
        id: 'm-401',
        sender: 'user',
        senderName: 'You',
        timestamp: '4d ago',
        content: 'Hi Natali, is the garden private to this villa or shared with other units?',
      },
      {
        id: 'm-402',
        sender: 'participant',
        senderName: 'Natali Craig',
        avatarText: 'NC',
        timestamp: '4d ago',
        content: 'Yes, the private garden and patio are exclusively for this unit.',
      },
      {
        id: 'm-403',
        sender: 'user',
        senderName: 'You',
        timestamp: '3d ago',
        content: 'Who handles the lawn mowing and landscaping maintenance?',
      },
      {
        id: 'm-404',
        sender: 'participant',
        senderName: 'Natali Craig',
        avatarText: 'NC',
        timestamp: '3d ago',
        content: 'Society gardeners visit twice every week on Tuesday and Friday mornings, included in the monthly rent.',
      },
      {
        id: 'm-405',
        sender: 'user',
        senderName: 'You',
        timestamp: '3d ago',
        content: 'Also, are small pets permitted on the premises?',
      },
      {
        id: 'm-406',
        sender: 'participant',
        senderName: 'Natali Craig',
        avatarText: 'NC',
        timestamp: '3d ago',
        content: 'Yes, small trained pets are very welcome! We just ask for a simple pet addendum in the rental agreement.',
      },
    ],
  },
  {
    id: 'conv-5',
    participantName: 'Drew Cano',
    participantHandle: '@drew',
    participantRole: 'Landlord',
    participantAvatar: 'DC',
    participantAvatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    isOnline: false,
    propertyId: 'prop-5',
    propertyTitle: '2 BHK Modern Apartment, Sargasan',
    propertyLocation: 'Near CH-Road, Sargasan, Gandhinagar',
    propertyRent: '₹19,000/mo',
    propertyImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80',
    propertyBeds: '2 BHK',
    lastMessage: 'We split the government stamp duty and digital registration 50/50 through RentMatch verified legal service.',
    lastTimestamp: '5d ago',
    unreadCount: 0,
    category: 'Enquiries',
    messages: [
      {
        id: 'm-501',
        sender: 'user',
        senderName: 'You',
        timestamp: '6d ago',
        content: 'Hi Drew, what is the minimum lease lock-in period?',
      },
      {
        id: 'm-502',
        sender: 'participant',
        senderName: 'Drew Cano',
        avatarText: 'DC',
        timestamp: '6d ago',
        content: 'Standard lease is 11 months with a 1-month mutual notice period.',
      },
      {
        id: 'm-503',
        sender: 'user',
        senderName: 'You',
        timestamp: '5d ago',
        content: 'How are the rental agreement registration costs split?',
      },
      {
        id: 'm-504',
        sender: 'participant',
        senderName: 'Drew Cano',
        avatarText: 'DC',
        timestamp: '5d ago',
        content: 'We split the government stamp duty and digital registration 50/50 through RentMatch verified legal service.',
      },
    ],
  },
  {
    id: 'conv-6',
    participantName: 'Orlando Diggs',
    participantHandle: '@orlando',
    participantRole: 'Landlord',
    participantAvatar: 'OD',
    participantAvatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&q=80',
    isOnline: true,
    propertyId: 'prop-6',
    propertyTitle: '4 BHK Luxury Penthouse, GIFT City',
    propertyLocation: 'Tower 2, GIFT City, Gandhinagar',
    propertyRent: '₹60,000/mo',
    propertyImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
    propertyBeds: '4 BHK',
    lastMessage: 'Yes, all clubhouse amenities including Olympic lap pool, squash courts, and gym are fully complimentary for occupants.',
    lastTimestamp: '1w ago',
    unreadCount: 0,
    category: 'Tours',
    messages: [
      {
        id: 'm-601',
        sender: 'user',
        senderName: 'You',
        timestamp: '1w ago',
        content: 'Hi Orlando, does the penthouse include private elevator access?',
      },
      {
        id: 'm-602',
        sender: 'participant',
        senderName: 'Orlando Diggs',
        avatarText: 'OD',
        timestamp: '1w ago',
        content: 'The penthouse has private elevator access and 3 dedicated parking bays.',
      },
      {
        id: 'm-603',
        sender: 'user',
        senderName: 'You',
        timestamp: '1w ago',
        content: 'Does the society clubhouse include swimming pool and gym access for tenants?',
      },
      {
        id: 'm-604',
        sender: 'participant',
        senderName: 'Orlando Diggs',
        avatarText: 'OD',
        timestamp: '1w ago',
        content: 'Yes, all clubhouse amenities including Olympic lap pool, squash courts, and gym are fully complimentary for occupants.',
      },
    ],
  },
  {
    id: 'conv-7',
    participantName: 'Candice Wu',
    participantHandle: '@candice',
    participantRole: 'Verified Landlord',
    participantAvatar: 'CW',
    participantAvatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80',
    isOnline: true,
    propertyId: 'prop-7',
    propertyTitle: '2 BHK Sky View Apartment, Raysan',
    propertyLocation: 'Near PDPU Road, Raysan, Gandhinagar',
    propertyRent: '₹24,000/mo',
    propertyImage: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80',
    propertyBeds: '2 BHK',
    lastMessage: 'Yes, Adani PNG piped gas connection is installed and operational with individual meter billing.',
    lastTimestamp: '1w ago',
    unreadCount: 1,
    category: 'Enquiries',
    messages: [
      {
        id: 'm-701',
        sender: 'system',
        senderName: 'System',
        timestamp: '1w ago',
        content: 'Direct rental channel initiated. RentMatch zero-brokerage guarantee active.',
      },
      {
        id: 'm-702',
        sender: 'user',
        senderName: 'You',
        timestamp: '1w ago',
        content: 'Hello Candice! Is your 2 BHK in Raysan east-facing with morning sunlight?',
      },
      {
        id: 'm-703',
        sender: 'participant',
        senderName: 'Candice Wu',
        avatarText: 'CW',
        timestamp: '1w ago',
        content: 'Hi! Yes, both bedrooms and the main balcony face east, directly overlooking the botanical green belt.',
      },
      {
        id: 'm-704',
        sender: 'user',
        senderName: 'You',
        timestamp: '1w ago',
        content: 'That sounds peaceful. Is piped natural gas (PNG) connected in the kitchen?',
      },
      {
        id: 'm-705',
        sender: 'participant',
        senderName: 'Candice Wu',
        avatarText: 'CW',
        timestamp: '1w ago',
        content: 'Yes, Adani PNG piped gas connection is installed and operational with individual meter billing.',
      },
    ],
  },
  {
    id: 'conv-8',
    participantName: 'Lana Steiner',
    participantHandle: '@lana',
    participantRole: 'Verified Owner',
    participantAvatar: 'LS',
    participantAvatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
    isOnline: false,
    propertyId: 'prop-8',
    propertyTitle: 'Studio Living Spaces, Infocity',
    propertyLocation: 'Block C, Supermall, Infocity, Gandhinagar',
    propertyRent: '₹13,000/mo',
    propertyImage: 'https://images.unsplash.com/photo-1502005229762-ee1b2b8ab275?w=600&q=80',
    propertyBeds: 'Studio',
    lastMessage: 'Yes, there is a 4-foot solid wood desk and a mesh ergonomic chair already set up.',
    lastTimestamp: '1w ago',
    unreadCount: 0,
    category: 'Enquiries',
    messages: [
      {
        id: 'm-801',
        sender: 'user',
        senderName: 'You',
        timestamp: '1w ago',
        content: 'Hi Lana, is the studio available for single working professional occupancy?',
      },
      {
        id: 'm-802',
        sender: 'participant',
        senderName: 'Lana Steiner',
        avatarText: 'LS',
        timestamp: '1w ago',
        content: 'Absolutely, most residents in this wing are IT consultants and software engineers from Infocity.',
      },
      {
        id: 'm-803',
        sender: 'user',
        senderName: 'You',
        timestamp: '1w ago',
        content: 'Perfect, does it include a dedicated workstation desk and ergonomic chair?',
      },
      {
        id: 'm-804',
        sender: 'participant',
        senderName: 'Lana Steiner',
        avatarText: 'LS',
        timestamp: '1w ago',
        content: 'Yes, there is a 4-foot solid wood desk and a mesh ergonomic chair already set up.',
      },
    ],
  },
  {
    id: 'conv-9',
    participantName: 'Koray Okumus',
    participantHandle: '@koray',
    participantRole: 'Landlord',
    participantAvatar: 'KO',
    participantAvatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
    isOnline: true,
    propertyId: 'prop-9',
    propertyTitle: '3 BHK Duplex House, Randheja',
    propertyLocation: 'Near Riverfront Road, Randheja, Gandhinagar',
    propertyRent: '₹31,000/mo',
    propertyImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80',
    propertyBeds: '3 BHK',
    lastMessage: 'Certainly! The 3kW solar system generates surplus power and keeps summer electric bills minimal.',
    lastTimestamp: '2w ago',
    unreadCount: 0,
    category: 'Tours',
    messages: [
      {
        id: 'm-901',
        sender: 'user',
        senderName: 'You',
        timestamp: '2w ago',
        content: 'Hello Koray, does the duplex house in Randheja have an independent borewell or municipal water supply?',
      },
      {
        id: 'm-902',
        sender: 'participant',
        senderName: 'Koray Okumus',
        avatarText: 'KO',
        timestamp: '2w ago',
        content: 'It has 24/7 Gandhinagar municipal water connection along with a 2000L underground tank and automatic pump.',
      },
      {
        id: 'm-903',
        sender: 'user',
        senderName: 'You',
        timestamp: '2w ago',
        content: 'Can we inspect the rooftop solar panels when we visit?',
      },
      {
        id: 'm-904',
        sender: 'participant',
        senderName: 'Koray Okumus',
        avatarText: 'KO',
        timestamp: '2w ago',
        content: 'Certainly! The 3kW solar system generates surplus power and keeps summer electric bills minimal.',
      },
    ],
  },
  {
    id: 'conv-10',
    participantName: 'Ava Wright',
    participantHandle: '@ava',
    participantRole: 'Verified Landlord',
    participantAvatar: 'AW',
    participantAvatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&q=80',
    isOnline: false,
    propertyId: 'prop-10',
    propertyTitle: '1 BHK Furnished Flat, Vavol',
    propertyLocation: 'Near Railway Underpass, Vavol, Gandhinagar',
    propertyRent: '₹12,500/mo',
    propertyImage: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80',
    propertyBeds: '1 BHK',
    lastMessage: 'We can do 1.5 months deposit if you can finalize the lease agreement this week!',
    lastTimestamp: '2w ago',
    unreadCount: 0,
    category: 'Enquiries',
    messages: [
      {
        id: 'm-1001',
        sender: 'user',
        senderName: 'You',
        timestamp: '2w ago',
        content: 'Hi Ava, are maintenance charges included in the ₹12,500 monthly rent?',
      },
      {
        id: 'm-1002',
        sender: 'participant',
        senderName: 'Ava Wright',
        avatarText: 'AW',
        timestamp: '2w ago',
        content: 'Maintenance is ₹1,200 additional per month which covers 24/7 security, waste collection, and lift AMC.',
      },
      {
        id: 'm-1003',
        sender: 'user',
        senderName: 'You',
        timestamp: '2w ago',
        content: 'Got it. Is the security deposit negotiable for immediate occupancy?',
      },
      {
        id: 'm-1004',
        sender: 'participant',
        senderName: 'Ava Wright',
        avatarText: 'AW',
        timestamp: '2w ago',
        content: 'We can do 1.5 months deposit if you can finalize the lease agreement this week!',
      },
    ],
  },
  {
    id: 'conv-11',
    participantName: 'Zaid Schwartz',
    participantHandle: '@zaid',
    participantRole: 'Landlord',
    participantAvatar: 'ZS',
    participantAvatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&q=80',
    isOnline: true,
    propertyId: 'prop-11',
    propertyTitle: '4 BHK Executive Villa, Pethapur',
    propertyLocation: 'Near Sabarmati Vista, Pethapur, Gandhinagar',
    propertyRent: '₹48,000/mo',
    propertyImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
    propertyBeds: '4 BHK',
    lastMessage: 'Yes, a 2-year lock-in works great for us. We can add a standard 5% escalation clause for year two.',
    lastTimestamp: '2w ago',
    unreadCount: 0,
    category: 'Tours',
    messages: [
      {
        id: 'm-1101',
        sender: 'user',
        senderName: 'You',
        timestamp: '2w ago',
        content: 'Hello Zaid, does the 4 BHK villa in Pethapur have private servant quarters?',
      },
      {
        id: 'm-1102',
        sender: 'participant',
        senderName: 'Zaid Schwartz',
        avatarText: 'ZS',
        timestamp: '2w ago',
        content: 'Yes, there is an attached servant room with a dedicated external entrance and washroom.',
      },
      {
        id: 'm-1103',
        sender: 'user',
        senderName: 'You',
        timestamp: '2w ago',
        content: 'Would you consider a 24-month lease with a locked rental rate?',
      },
      {
        id: 'm-1104',
        sender: 'participant',
        senderName: 'Zaid Schwartz',
        avatarText: 'ZS',
        timestamp: '2w ago',
        content: 'Yes, a 2-year lock-in works great for us. We can add a standard 5% escalation clause for year two.',
      },
    ],
  },
  {
    id: 'conv-12',
    participantName: 'Lori Bryson',
    participantHandle: '@lori',
    participantRole: 'Verified Owner',
    participantAvatar: 'LB',
    participantAvatarUrl: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=200&q=80',
    isOnline: false,
    propertyId: 'prop-12',
    propertyTitle: '2 BHK Cozy Haven, Kudasan',
    propertyLocation: 'Behind Swagat Holiday Mall, Kudasan, Gandhinagar',
    propertyRent: '₹21,000/mo',
    propertyImage: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&q=80',
    propertyBeds: '2 BHK',
    lastMessage: 'Yes, the gated complex has 20 designated guest parking slots with security register check-in.',
    lastTimestamp: '3w ago',
    unreadCount: 0,
    category: 'Enquiries',
    messages: [
      {
        id: 'm-1201',
        sender: 'user',
        senderName: 'You',
        timestamp: '3w ago',
        content: 'Hi Lori, how far is your flat from the Kudasan metro station?',
      },
      {
        id: 'm-1202',
        sender: 'participant',
        senderName: 'Lori Bryson',
        avatarText: 'LB',
        timestamp: '3w ago',
        content: 'It is approximately 800 meters, roughly an 8-minute comfortable walk along the tree-lined pedestrian avenue.',
      },
      {
        id: 'm-1203',
        sender: 'user',
        senderName: 'You',
        timestamp: '3w ago',
        content: 'Is visitor parking available for weekend guests?',
      },
      {
        id: 'm-1204',
        sender: 'participant',
        senderName: 'Lori Bryson',
        avatarText: 'LB',
        timestamp: '3w ago',
        content: 'Yes, the gated complex has 20 designated guest parking slots with security register check-in.',
      },
    ],
  },
  {
    id: 'conv-13',
    participantName: 'Alisa Hester',
    participantHandle: '@alisa',
    participantRole: 'Landlord',
    participantAvatar: 'AH',
    participantAvatarUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&q=80',
    isOnline: true,
    propertyId: 'prop-13',
    propertyTitle: '3 BHK Modern Residency, Sargasan',
    propertyLocation: 'Kh-Road Junction, Sargasan, Gandhinagar',
    propertyRent: '₹27,500/mo',
    propertyImage: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=600&q=80',
    propertyBeds: '3 BHK',
    lastMessage: 'Saturday at 3:00 PM works perfectly. Let me know when you reach Sargasan circle!',
    lastTimestamp: '3w ago',
    unreadCount: 1,
    category: 'Tours',
    messages: [
      {
        id: 'm-1301',
        sender: 'user',
        senderName: 'You',
        timestamp: '3w ago',
        content: 'Hi Alisa, are all bedrooms fitted with split inverter air conditioners?',
      },
      {
        id: 'm-1302',
        sender: 'participant',
        senderName: 'Alisa Hester',
        avatarText: 'AH',
        timestamp: '3w ago',
        content: 'Yes, all 3 bedrooms and the drawing hall have Daikin 5-star inverter ACs installed last summer.',
      },
      {
        id: 'm-1303',
        sender: 'user',
        senderName: 'You',
        timestamp: '3w ago',
        content: 'Can we do an in-person walkthrough this Saturday afternoon?',
      },
      {
        id: 'm-1304',
        sender: 'participant',
        senderName: 'Alisa Hester',
        avatarText: 'AH',
        timestamp: '3w ago',
        content: 'Saturday at 3:00 PM works perfectly. Let me know when you reach Sargasan circle!',
      },
    ],
  },
  {
    id: 'conv-14',
    participantName: 'Joshua Wilson',
    participantHandle: '@joshua',
    participantRole: 'Verified Owner',
    participantAvatar: 'JW',
    participantAvatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&q=80',
    isOnline: false,
    propertyId: 'prop-14',
    propertyTitle: '1 BHK Minimalist Studio, Sector 7',
    propertyLocation: 'Near Gh-Road Central Vista, Sector 7, Gandhinagar',
    propertyRent: '₹11,000/mo',
    propertyImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
    propertyBeds: '1 BHK',
    lastMessage: 'No restrictions at all, residents have complete culinary freedom.',
    lastTimestamp: '3w ago',
    unreadCount: 0,
    category: 'Enquiries',
    messages: [
      {
        id: 'm-1401',
        sender: 'user',
        senderName: 'You',
        timestamp: '3w ago',
        content: 'Hi Joshua, is the flat pet-friendly for a small cat?',
      },
      {
        id: 'm-1402',
        sender: 'participant',
        senderName: 'Joshua Wilson',
        avatarText: 'JW',
        timestamp: '3w ago',
        content: 'Yes, cats and small pets are allowed in this building.',
      },
      {
        id: 'm-1403',
        sender: 'user',
        senderName: 'You',
        timestamp: '3w ago',
        content: 'Great, are there any restrictions on cooking non-vegetarian food?',
      },
      {
        id: 'm-1404',
        sender: 'participant',
        senderName: 'Joshua Wilson',
        avatarText: 'JW',
        timestamp: '3w ago',
        content: 'No restrictions at all, residents have complete culinary freedom.',
      },
    ],
  },
  {
    id: 'conv-15',
    participantName: 'Sienna Hewitt',
    participantHandle: '@sienna',
    participantRole: 'Landlord',
    participantAvatar: 'SH',
    participantAvatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80',
    isOnline: true,
    propertyId: 'prop-15',
    propertyTitle: '2 BHK Green View Apartment, Sector 11',
    propertyLocation: 'Near Civil Hospital Road, Sector 11, Gandhinagar',
    propertyRent: '₹20,000/mo',
    propertyImage: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600&q=80',
    propertyBeds: '2 BHK',
    lastMessage: 'Yes, a Kent Grand RO water purifier is fitted under the sink and recently serviced.',
    lastTimestamp: '1mo ago',
    unreadCount: 0,
    category: 'Enquiries',
    messages: [
      {
        id: 'm-1501',
        sender: 'user',
        senderName: 'You',
        timestamp: '1mo ago',
        content: 'Hi Sienna, does the 2 BHK in Sector 11 have an open modular kitchen layout?',
      },
      {
        id: 'm-1502',
        sender: 'participant',
        senderName: 'Sienna Hewitt',
        avatarText: 'SH',
        timestamp: '1mo ago',
        content: 'Yes, it is an open European-style kitchen with soft-close Blum drawers and quartz countertops.',
      },
      {
        id: 'm-1503',
        sender: 'user',
        senderName: 'You',
        timestamp: '1mo ago',
        content: 'Is RO water purifier pre-installed in the kitchen?',
      },
      {
        id: 'm-1504',
        sender: 'participant',
        senderName: 'Sienna Hewitt',
        avatarText: 'SH',
        timestamp: '1mo ago',
        content: 'Yes, a Kent Grand RO water purifier is fitted under the sink and recently serviced.',
      },
    ],
  },
  {
    id: 'conv-16',
    participantName: 'Amélie Laurent',
    participantHandle: '@amelie',
    participantRole: 'Verified Landlord',
    participantAvatar: 'AL',
    participantAvatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80',
    isOnline: true,
    propertyId: 'prop-16',
    propertyTitle: '3 BHK Penthouse Suite, GIFT City',
    propertyLocation: 'Building 14C, GIFT SEZ, Gandhinagar',
    propertyRent: '₹55,000/mo',
    propertyImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
    propertyBeds: '3 BHK',
    lastMessage: 'Yes, power and water supplies are managed directly via the central GIFT smart utility network with zero downtime.',
    lastTimestamp: '1mo ago',
    unreadCount: 0,
    category: 'Tours',
    messages: [
      {
        id: 'm-1601',
        sender: 'user',
        senderName: 'You',
        timestamp: '1mo ago',
        content: 'Hi Amélie, what is the building maintenance charge for the GIFT City penthouse?',
      },
      {
        id: 'm-1602',
        sender: 'participant',
        senderName: 'Amélie Laurent',
        avatarText: 'AL',
        timestamp: '1mo ago',
        content: 'Maintenance is ₹4,500/month which covers district cooling system access, concierge desk, and automated waste chutes.',
      },
      {
        id: 'm-1603',
        sender: 'user',
        senderName: 'You',
        timestamp: '1mo ago',
        content: 'Does the tower offer direct connection to the underground utility tunnel in GIFT City?',
      },
      {
        id: 'm-1604',
        sender: 'participant',
        senderName: 'Amélie Laurent',
        avatarText: 'AL',
        timestamp: '1mo ago',
        content: 'Yes, power and water supplies are managed directly via the central GIFT smart utility network with zero downtime.',
      },
    ],
  },
];

const QUICK_REPLIES = [
  'Is this property still available for immediate move-in?',
  'What are the security deposit terms?',
  'Can I schedule a walkthrough visit tomorrow?',
  'Are pets permitted in this building?',
];

export default function DashboardInboxPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationItem[]>(INITIAL_CONVERSATIONS);
  const [activeConversation, setActiveConversation] = useState<ConversationItem | null>(INITIAL_CONVERSATIONS[0]);
  const [filterTab, setFilterTab] = useState<'All' | 'Unread' | 'Enquiries' | 'Tours'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [mobileThreadOpen, setMobileThreadOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      const viewport = messagesEndRef.current.closest('[data-slot="scroll-area-viewport"]') as HTMLElement | null;
      if (viewport) {
        viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
      }
    }
  }, [activeConversation?.id, activeConversation?.messages]);

  const handleSelectConversation = (conv: ConversationItem) => {
    setActiveConversation(conv);
    setMobileThreadOpen(true);
    // Mark as read
    if (conv.unreadCount > 0) {
      setConversations((prev) =>
        prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c))
      );
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || !activeConversation) return;

    const newMsg: ChatMessageItem = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      senderName: 'You',
      timestamp: 'Just now',
      content: text.trim(),
    };

    const updatedConvs = conversations.map((c) => {
      if (c.id === activeConversation.id) {
        return {
          ...c,
          lastMessage: text.trim(),
          lastTimestamp: 'Just now',
          messages: [...c.messages, newMsg],
        };
      }
      return c;
    });

    setConversations(updatedConvs);
    setActiveConversation((prev) => (prev ? { ...prev, messages: [...prev.messages, newMsg] } : null));
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      if (filterTab === 'Unread' && c.unreadCount === 0) return false;
      if (filterTab === 'Enquiries' && c.category !== 'Enquiries') return false;
      if (filterTab === 'Tours' && c.category !== 'Tours') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.participantName.toLowerCase().includes(q) ||
          c.participantHandle.toLowerCase().includes(q) ||
          c.propertyTitle.toLowerCase().includes(q) ||
          c.lastMessage.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [conversations, filterTab, searchQuery]);

  if (!mounted) {
    return <InboxSkeleton />;
  }

  return (
    <div className="h-full w-full flex bg-zinc-50 dark:bg-[#171513] text-zinc-900 dark:text-zinc-100 overflow-hidden transition-colors duration-200">
      {/* 1. Left Conversation List Pane */}
      <aside
        className={`${
          mobileThreadOpen ? 'hidden md:flex' : 'flex'
        } w-full md:w-80 lg:w-96 flex-col border-r border-zinc-200 dark:border-zinc-800/80 bg-white/95 dark:bg-[#211E1B]/95 backdrop-blur-md shrink-0 h-full min-h-0 overflow-hidden`}
      >
        {/* Pane Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800/80 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Conversations</h2>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Direct renter-owner communication
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60">
              {conversations.length} Active
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search conversations, listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-8 pr-8 py-1.5 text-base sm:text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-zinc-300 dark:focus:border-zinc-700 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 active:scale-95 touch-manipulation"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-0.5">
            {(['All', 'Unread', 'Enquiries', 'Tours'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilterTab(tab)}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer shrink-0 active:scale-[0.98] ${
                  filterTab === tab
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-2xs font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-850'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation Items List (Clean full-width divided rows matching Untitled UI) */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="divide-y divide-zinc-200/80 dark:divide-zinc-800/80">
            {filteredConversations.map((conv) => {
              const isSelected = conv.id === activeConversation?.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`flex items-center gap-3.5 px-4 py-3.5 transition-colors cursor-pointer select-none relative ${
                    isSelected
                      ? 'bg-zinc-100/90 dark:bg-[#25211d] text-zinc-900 dark:text-white'
                      : 'hover:bg-zinc-50/80 dark:hover:bg-[#201d1a]/80 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  {/* Sliding Orange Active Indicator */}
                  {isSelected && (
                    <motion.div
                      layoutId="active-chat-indicator"
                      className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#E8510E] dark:bg-[#F06A32] z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  {/* Circular Avatar */}
                  <div className="relative shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={conv.participantAvatarUrl}
                      alt={conv.participantName}
                      className="size-11 rounded-full object-cover ring-1 ring-zinc-200/80 dark:ring-zinc-700/80"
                    />
                    {conv.isOnline && (
                      <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#211E1B]" />
                    )}
                  </div>

                  {/* Name and Handle */}
                  <div className="min-w-0 flex-1 leading-tight">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-semibold text-sm truncate text-zinc-900 dark:text-white">
                        {conv.participantName}
                      </span>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 shrink-0">
                        {conv.lastTimestamp}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-1 mt-0.5">
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate font-normal">
                        {conv.participantHandle}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="size-4 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold text-[9px] flex items-center justify-center shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredConversations.length === 0 && (
              <div className="text-center py-12 text-zinc-400 dark:text-zinc-500 text-xs">
                <Inbox size={28} className="mx-auto mb-2 opacity-40" />
                No messages found.
              </div>
            )}
          </div>
        </ScrollArea>
      </aside>

      {/* 2. Middle Active Thread Chat Pane */}
      {activeConversation ? (
        <section
          className={`${
            mobileThreadOpen ? 'flex' : 'hidden md:flex'
          } flex-1 flex-col h-full min-w-0 min-h-0 overflow-hidden bg-zinc-50 dark:bg-[#171513] relative`}
        >
          {/* Active Conversation Top Bar */}
          <header className="h-16 border-b border-zinc-200 dark:border-zinc-800/80 px-4 sm:px-6 flex items-center justify-between bg-white/90 dark:bg-[#211E1B]/90 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileThreadOpen(false)}
                className="md:hidden p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800"
                aria-label="Back to conversations list"
              >
                <ArrowLeft size={18} />
              </button>

              <div className="relative shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeConversation.participantAvatarUrl}
                  alt={activeConversation.participantName}
                  className="size-9.5 rounded-full object-cover ring-1 ring-zinc-300 dark:ring-zinc-700"
                />
                {activeConversation.isOnline && (
                  <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white truncate">
                    {activeConversation.participantName}
                  </h3>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 font-normal">
                    {activeConversation.participantHandle}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <ShieldCheck size={12} /> Verified Owner
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 truncate">
                  <span className="truncate">{activeConversation.propertyTitle}</span>
                  <span>•</span>
                  <span className="text-zinc-900 dark:text-zinc-100 font-semibold">{activeConversation.propertyRent}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800/80 cursor-pointer"
                title="Direct Encrypted Call"
                onClick={() => alert(`Starting direct encrypted call with ${activeConversation.participantName}...`)}
              >
                <Phone size={15} />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800/80 cursor-pointer"
                title="Toggle property details panel"
                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
              >
                {isDetailsOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
              </Button>
            </div>
          </header>

          {/* Active Message Stream */}
          <ScrollArea className="flex-1 min-h-0">
            <div className="max-w-3xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
              {/* Zero-Brokerage Trust Banner */}
              <div className="p-3.5 rounded-2xl bg-zinc-100/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs flex items-center gap-2.5">
                <ShieldCheck size={18} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span className="leading-relaxed">
                  RentMatch Verified Channel: You are connected directly with the verified owner. Zero brokerage fees apply.
                </span>
              </div>

              {/* Messages Mapping */}
              {activeConversation.messages.map((msg) => {
                if (msg.sender === 'system') {
                  return (
                    <div key={msg.id} className="flex justify-center my-4">
                      <span className="px-3 py-1 rounded-full bg-zinc-200/60 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 text-[11px] font-medium border border-zinc-300/50 dark:border-zinc-700/50">
                        {msg.content}
                      </span>
                    </div>
                  );
                }

                const isMe = msg.sender === 'user';
                return (
                  <Message key={msg.id} align={isMe ? 'end' : 'start'}>
                    <MessageAvatar
                      className={`size-8 text-xs font-bold overflow-hidden ${
                        isMe
                          ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                          : 'bg-white text-zinc-800 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 shadow-2xs'
                      }`}
                    >
                      {isMe ? (
                        user?.firstName?.[0] || 'U'
                      ) : activeConversation.participantAvatarUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={activeConversation.participantAvatarUrl}
                          alt={msg.senderName}
                          className="size-full object-cover"
                        />
                      ) : (
                        msg.avatarText || 'P'
                      )}
                    </MessageAvatar>

                    <MessageContent>
                      <MessageHeader>
                        <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                          {isMe ? 'You' : msg.senderName}
                        </span>
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 ml-2">
                          {msg.timestamp}
                        </span>
                      </MessageHeader>

                      <Bubble
                        align={isMe ? 'end' : 'start'}
                        variant={isMe ? 'default' : 'muted'}
                        className="max-w-[85%] sm:max-w-[75%]"
                      >
                        <BubbleContent
                          className={`p-3.5 text-xs sm:text-sm leading-relaxed rounded-2xl ${
                            isMe
                              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                              : 'bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-xs'
                          }`}
                        >
                          {msg.content}

                          {/* Tour Card */}
                          {msg.tourCard && (
                            <div className="mt-3.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200/90 dark:border-zinc-800/90 text-zinc-900 dark:text-zinc-100 shadow-2xs space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-zinc-900 dark:text-white">
                                  <Calendar size={13} />
                                  Property Walkthrough Tour
                                </span>
                                <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                  {msg.tourCard.status}
                                </span>
                              </div>
                              <p className="text-xs font-semibold">{msg.tourCard.propertyTitle}</p>
                              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                                <span>{msg.tourCard.date}</span>
                                <span>•</span>
                                <span>{msg.tourCard.time}</span>
                              </div>
                            </div>
                          )}
                        </BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Bottom Message Input Area */}
          <footer className="p-4 sm:p-6 pt-0 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:pb-6 border-t border-zinc-200 dark:border-zinc-800/80 bg-white/90 dark:bg-[#211E1B]/90 backdrop-blur-md shrink-0">
            <div className="max-w-3xl mx-auto space-y-3">
              {/* Quick Replies */}
              <ScrollArea className="w-full whitespace-nowrap py-1">
                <div className="flex items-center gap-1.5 pb-1">
                  <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider shrink-0 mr-1">
                    Quick replies:
                  </span>
                  {QUICK_REPLIES.map((reply, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(reply)}
                      className="px-3 py-1 rounded-full text-xs bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer active:scale-95 border border-zinc-200/60 dark:border-zinc-700/60 shrink-0"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              {/* Message Textarea */}
              <InputGroup className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-2 transition-all shadow-lg outline-none focus:outline-none focus:ring-0 focus-within:ring-0 focus-within:border-zinc-300 dark:focus-within:border-zinc-700 focus-visible:ring-0 focus-visible:outline-none has-[[data-slot=input-group-control]:focus-visible]:ring-0 has-[[data-slot=input-group-control]:focus-visible]:border-zinc-300 dark:has-[[data-slot=input-group-control]:focus-visible]:border-zinc-700">
                <InputGroupTextarea
                  placeholder={`Type a message to ${activeConversation.participantName}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="text-base sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 min-h-12 max-h-36 py-1 px-2 resize-none outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none ring-0"
                />

                <InputGroupAddon
                  align="block-end"
                  className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80 pt-2 px-1 text-xs"
                >
                  <div className="flex items-center gap-2 text-zinc-500">
                    <button
                      type="button"
                      className="p-1 rounded-md text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                      title="Attach documents or photos"
                      onClick={() => alert('Attachment upload ready')}
                    >
                      <Paperclip size={15} />
                    </button>
                    <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">•</span>
                    <span className="hidden sm:inline text-[10px] text-zinc-400 dark:text-zinc-500">
                      Press <kbd className="px-1 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700 font-mono text-[9px]">Enter</kbd> to send
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <InputGroupButton
                      size="icon-xs"
                      variant="default"
                      onClick={() => handleSendMessage()}
                      disabled={!inputText.trim()}
                      className="size-7 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 disabled:bg-zinc-100 dark:disabled:bg-zinc-800 disabled:text-zinc-400 dark:disabled:text-zinc-600 text-white dark:text-zinc-900 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                      aria-label="Send message"
                    >
                      <Send size={13} strokeWidth={2.2} />
                    </InputGroupButton>
                  </div>
                </InputGroupAddon>
              </InputGroup>
            </div>
          </footer>
        </section>
      ) : null}

      {/* 3. Right Property & Contact Details Pane (Toggleable) */}
      {isDetailsOpen && activeConversation && (
        <aside className="hidden xl:flex w-80 h-full min-h-0 overflow-hidden border-l border-zinc-200 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-950/70 backdrop-blur-md flex-col shrink-0 animate-in slide-in-from-right duration-200 transition-colors">
          <ScrollArea className="flex-1 min-h-0">
            <div className="space-y-6 p-5">
              {/* Linked Property Card */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
                  Inquired Property
                </h4>
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 overflow-hidden shadow-xs group">
                  <div className="relative aspect-video w-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeConversation.propertyImage}
                      alt={activeConversation.propertyTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-zinc-900/80 text-white text-[10px] font-bold backdrop-blur-xs">
                      {activeConversation.propertyRent}
                    </div>
                  </div>
                  <div className="p-3.5 space-y-2">
                    <h5 className="font-bold text-xs text-zinc-900 dark:text-white line-clamp-1">
                      {activeConversation.propertyTitle}
                    </h5>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                      <MapPin size={12} className="shrink-0 text-zinc-600 dark:text-zinc-400" />
                      <span className="truncate">{activeConversation.propertyLocation}</span>
                    </div>
                    <div className="pt-2 border-t border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between text-[11px]">
                      <span className="font-medium text-zinc-600 dark:text-zinc-300">
                        {activeConversation.propertyBeds} Layout
                      </span>
                      <a
                        href={`/properties/${activeConversation.propertyId}`}
                        className="text-zinc-900 dark:text-white hover:underline font-semibold inline-flex items-center gap-1"
                      >
                        Listing Details <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Participant Profile Card */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
                  Contact Information
                </h4>
                <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-full overflow-hidden ring-1 ring-zinc-300 dark:ring-zinc-700 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={activeConversation.participantAvatarUrl}
                        alt={activeConversation.participantName}
                        className="size-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-zinc-900 dark:text-white">
                        {activeConversation.participantName}
                      </p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                        {activeConversation.participantHandle} • Verified {activeConversation.participantRole}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-200/80 dark:border-zinc-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                      <span>Response Rate</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">98% (Within 1 hr)</span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                      <span>Identity Verification</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Aadhaar Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
                  Quick Actions
                </h4>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-xs font-medium border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 cursor-pointer"
                    onClick={() => alert(`Scheduling tour with ${activeConversation.participantName}`)}
                  >
                    <Calendar size={14} className="mr-2 text-zinc-500" />
                    Schedule Walkthrough Tour
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-xs font-medium border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 cursor-pointer"
                    onClick={() => alert('Opening standard rental agreement modal...')}
                  >
                    <Building2 size={14} className="mr-2 text-zinc-500" />
                    Review Rental Agreement
                  </Button>
                </div>
              </div>

              {/* Security & Guarantee Note */}
              <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-zinc-700 dark:text-zinc-300 text-xs space-y-1.5">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck size={14} /> RentMatch AI Guarantee
                </span>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Never pay deposits or token amounts before an in-person walkthrough. Verified listings protect your funds with zero broker commissions.
                </p>
              </div>
            </div>
          </ScrollArea>
        </aside>
      )}
    </div>
  );
}
