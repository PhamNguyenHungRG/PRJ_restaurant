import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageTitle = () => {
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.startsWith('/cashier')) {
            document.title = 'Cashier';
        } else if (location.pathname.startsWith('/order')) {
            document.title = 'Order';
        } else if (location.pathname.startsWith('/kitchen')) {
            document.title = 'Kitchen';
        } else if (location.pathname.startsWith('/dashboard')) {
            document.title = 'Admin Dashboard';
        } else if (location.pathname.startsWith('/user')) {
            document.title = 'Employee Management';    
        } else if (location.pathname.startsWith('/food')) {
            document.title = 'Food Management';
        } else if (location.pathname.startsWith('/category')) {
            document.title = 'Category Management';
        } else if (location.pathname.startsWith('/ingredient')) {
            document.title = 'Ingredient Management';
          } else if (location.pathname.startsWith('/inventory')) {
            document.title = 'Inventory Stats';
          } else if (location.pathname.startsWith('/')) {
            document.title = 'Login';  
        } else {
            document.title = 'React App';
        }
    }, [location]);

    return null; // không render gì cả
};

export default PageTitle;