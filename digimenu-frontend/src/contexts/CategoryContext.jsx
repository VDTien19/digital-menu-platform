import { useState, useContext, createContext } from "react";

const CategoryContext = createContext();

function useCategory() {
    return useContext(CategoryContext);
}

function CategoryProvider({ children }) {
    const [activeCategory, setActiveCategory] = useState(null);

    const value = {
        activeCategory,
        setActiveCategory,
    };

    return (
        <CategoryContext.Provider value={value}>
            {children}
        </CategoryContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export { CategoryContext, CategoryProvider, useCategory };