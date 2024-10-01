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
  
  const Adminmenu = [
	{
	  name: 'Dashboard',
	  href: '/admin',
	  icon: Home, // Assign an icon to the menu item
	},
	{
	  name: 'Staff',
	  href: '/admin/staff',
	  icon: DollarSign
	//   subMenu: [
	// 	{ name: 'Monthly Sales', href: '/sales/monthly' },
	// 	{ name: 'Yearly Sales', href: '/sales/yearly' },
	//   ],
	},
	{
		name: 'Table Management',
		href: '/admin/tabelmanagment/tabel',
		icon: Table ,
		  subMenu: [
		{ name: 'Tabels', href: '/admin/tabelmanagment/tabel' },
		{ name: 'Tabel View', href: '/admin/tabelmanagment' },
	  ],
	},
	{
		name: 'Analytics',
		href: '/admin/analytics',
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
  
  export default Adminmenu;
  