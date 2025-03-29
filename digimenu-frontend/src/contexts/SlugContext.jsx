import { createContext, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';

import httpRequest from '~/utils/httpRequest';

const SlugContext = createContext();

function useSlug () {
    return useContext(SlugContext);
}

function SlugProvider({ children }) {
    const { slug } = useParams();
    const [resData, setResData] = useState(null);
    const [loadding, setLoading] = useState(false);

    const value = { slug, resData, setResData, loadding, setLoading };

    return (
        <SlugContext.Provider value={value}>
            {children}
        </SlugContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export { SlugContext, SlugProvider, useSlug };