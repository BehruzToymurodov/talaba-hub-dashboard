import {
	BadgePercent,
	Building2,
	ClipboardCheck,
	GraduationCap,
	LayoutDashboard,
	Settings,
	ShieldCheck,
	Tags,
	Users,
} from 'lucide-react'

import type { Role } from '@/types'
import type { ComponentType } from 'react'

export type NavItem = {
	label: string
	href: string
	icon: ComponentType<{ className?: string }>
	roles: Role[]
}

export const NAV_ITEMS: NavItem[] = [
	{
		label: 'Dashboard',
		href: '/dashboard',
		icon: LayoutDashboard,
		roles: ['student', 'moderator', 'admin'],
	},
	{
		label: 'Universities',
		href: '/universities',
		icon: GraduationCap,
		roles: ['admin'],
	},
	{
		label: 'Companies',
		href: '/companies',
		icon: Building2,
		roles: ['admin'],
	},
	{
		label: 'Categories',
		href: '/categories',
		icon: Tags,
		roles: ['admin'],
	},
	{
		label: 'Discounts',
		href: '/discounts',
		icon: BadgePercent,
		roles: ['moderator', 'admin'],
	},
	{
		label: 'My Company',
		href: '/companies',
		icon: Building2,
		roles: ['moderator'],
	},
	{
		label: 'My Discounts',
		href: '/discounts',
		icon: BadgePercent,
		roles: ['student'],
	},
	{
		label: 'Student Applications',
		href: '/applications',
		icon: ClipboardCheck,
		roles: ['admin'],
	},
	{
		label: 'My Applications',
		href: '/applications/my',
		icon: ClipboardCheck,
		roles: ['student'],
	},
	{
		label: 'Apply for Verification',
		href: '/applications/apply',
		icon: GraduationCap,
		roles: ['student'],
	},
	{
		label: 'Supported Domains',
		href: '/domains',
		icon: ShieldCheck,
		roles: ['admin'],
	},
	{
		label: 'Users',
		href: '/users',
		icon: Users,
		roles: ['admin'],
	},
	{
		label: 'Settings',
		href: '/settings',
		icon: Settings,
		roles: ['student', 'moderator', 'admin'],
	},
]
