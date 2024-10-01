// SidebarMenu.js

import {
	Home,
	BarChart,
	DollarSign,
	Users,
	Settings,
	User,
	Lock,
	Table,
  } from 'lucide-react'; // Import icons from lucide-react
  
  const Waitermenu = [
	{
	  name: 'Dashboard',
	  href: '/waiter',
	  icon: Home, // Assign an icon to the menu item
	},
	{
	  name: 'Tabel Management',
	  href: '/waiter/tabel',
	  icon: Table
	//   subMenu: [
	// 	{ name: 'Monthly Sales', href: '/sales/monthly' },
	// 	{ name: 'Yearly Sales', href: '/sales/yearly' },
	//   ],
	},
	{
		name: 'Analytics',
		href: '/waiter/analytics',
		icon: BarChart,
	  },
	// {
	//   name: 'Customers',
	//   href: '/customers',
	//   icon: Users,
	// },
	// {
	//   name: 'Settings',
	//   href: '/settings',
	//   icon: Settings,
	//   subMenu: [
	// 	{ name: 'Profile Settings', href: '/settings/profile' },
	// 	{ name: 'Account Settings', href: '/settings/account' },
	//   ],
	// },
  ];
  
  export default Waitermenu;
  