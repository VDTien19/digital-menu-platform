import { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [invoices, setInvoices] = useState([]);

    // Admin
    const [categories, setCategories] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [tables, setTables] = useState([]);
    const [staff, setStaff] = useState([]);

    const value = { 
        loading, setLoading,
        searchValue, setSearchValue, 
        invoices, setInvoices,
        categories, setCategories,
        dishes, setDishes,
        tables, setTables,
        staff, setStaff,
    };

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSearch = () => useContext(SearchContext);
