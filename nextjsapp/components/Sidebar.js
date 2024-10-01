import Adminmenu from '@/sidebar/adminmenu';
import Waitermenu from '@/sidebar/waitermenu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Sidebar = () => {
  const [menu, setMenu] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Retrieve roleId from session storage
    const roleId = sessionStorage.getItem('roleId');
    if (roleId === '1') {
      setMenu(Adminmenu);
    } else if (roleId === '2') {
      setMenu(Waitermenu);
    }
    setIsReady(true); // Ensure session storage is read before rendering
  }, []);

  if (!isReady) {
    return null; // Avoid rendering until session storage is read
  }

  return (
    <aside className="bg-gray-800 dark:bg-gray-900 text-white dark:text-gray-200 w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <nav>
        {menu.map((item) => (
          <SidebarItem key={item.href} item={item} />
        ))}
      </nav>
    </aside>
  );
};

const SidebarItem = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isActive = pathname === item.href;

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <Link
          href={item.href}
          className={`flex items-center block py-2.5 my-2 px-4 rounded transition duration-200 ${
            isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-700 hover:text-white'
          }`}
          onClick={item.subMenu ? handleToggle : null}
        >
          {item.icon && <item.icon className="mr-2 w-5 h-5" />}
          {item.name}
        </Link>
        {item.subMenu && (
          <button onClick={handleToggle} className="focus:outline-none">
            {isOpen ? <ChevronUp /> : <ChevronDown />}
          </button>
        )}
      </div>
      <div
        className={`ml-4 space-y-1 overflow-hidden transition-max-height duration-500 ease-in-out ${
          isOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        {item.subMenu &&
          item.subMenu.map((subItem) => (
            <Link
              key={subItem.href}
              href={subItem.href}
              className={`block py-1 px-4 rounded transition my-2 duration-200 ${
                pathname === subItem.href ? 'bg-blue-500 text-white' : 'hover:bg-gray-700 hover:text-white'
              }`}
            >
              {subItem.name}
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Sidebar;
