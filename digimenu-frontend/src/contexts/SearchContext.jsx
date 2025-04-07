import { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [searchValue, setSearchValue] = useState('');

    const value = { searchValue, setSearchValue };

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSearch = () => useContext(SearchContext);
