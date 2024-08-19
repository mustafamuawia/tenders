import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { routes } from './routes'; // Adjust the path if necessary

const DynamicTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const currentRoute = routes.find(route => route.layout + route.path === location.pathname);
    if (currentRoute) {
      document.title = currentRoute.name ? `${currentRoute.name} - UNV` : 'UNV';
    } else {
      document.title = 'UNV';
    }
  }, [location]);

  return null;
};

export default DynamicTitle;
