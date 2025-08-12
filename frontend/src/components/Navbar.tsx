import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./navigation-menu";
import IncomeMenuContent from './IncomeMenuContent';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
  <div className="bg-white-600 text-black p-4 flex items-center justify-between border-b border-gray-300">
    <Link to="/" className="text-2xl font-bold mr-8">Personal Finance Tracker</Link>

    {user ? (
      <div className="flex items-center gap-4">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Income</NavigationMenuTrigger>
            <NavigationMenuContent className='bg-white p-4 rounded-md shadow-sm'>
              <IncomeMenuContent />
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>Expenses</NavigationMenuTrigger>
            <NavigationMenuContent className='bg-white p-4 rounded-md shadow-sm'>
              <IncomeMenuContent />
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>Financial Goals</NavigationMenuTrigger>
            <NavigationMenuContent className='bg-white p-4 rounded-md shadow-sm'>
              <IncomeMenuContent />
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

    
      <button
        onClick={handleLogout}
        className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-700"
      >
        Logout
      </button>
      </div>
    ) : (
      <></>
    )
    }
    </div>
  );
};

export default Navbar;
