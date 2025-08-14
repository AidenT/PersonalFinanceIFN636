import { Link } from 'react-router-dom';
import { NavigationMenuLink } from './navigation-menu';

const IncomeMenuContent = () => {
  return (
      <ul className="grid w-[300px] gap-4 ">
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/income">
                    <div className="font-medium">Add Income</div>
                    <div className="text-muted-foreground">
                      Add one off or recurring income.
                    </div>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link to="/income">
                    <div className="font-medium">Update or Remove Income</div>
                    <div className="text-muted-foreground">
                      Changes to your income? Make sure you update them here.
                    </div>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
  );
};

export default IncomeMenuContent;
