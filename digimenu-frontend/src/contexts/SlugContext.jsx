import { createContext, useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import httpRequest from '~/utils/httpRequest';

const SlugContext = createContext();

function useSlug () {
    return useContext(SlugContext);
}

function SlugProvider({ children }) {
    const { slug } = useParams();
    const [resData, setResData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                if(slug) {
                    const response = await httpRequest.get(`/restaurants?slug=${slug}`);
                    setResData(response.data.length === 1 ? response.data[0] : null);
                    setLoading(false);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [slug]);

    const value = { slug, resData, setResData, loading, setLoading };

    return (
        <SlugContext.Provider value={value}>
            {children}
        </SlugContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export { SlugContext, SlugProvider, useSlug };