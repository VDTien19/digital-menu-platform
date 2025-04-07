import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from '~/store/store';

import './index.css';
import App from './App.jsx';
import GlobalStyles from '~/components/GlobalStyles';
import { CategoryProvider } from '~/contexts/CategoryContext';
import { ProductProvider } from '~/contexts/ProductContext';
import { SearchProvider } from '~/contexts/SearchContext';

createRoot(document.getElementById('root')).render(
    // <StrictMode>
        <GlobalStyles>
            <Provider store={store}>
                <CategoryProvider>
                    <ProductProvider>
                        <SearchProvider>
                            <App />
                        </SearchProvider>
                    </ProductProvider>
                </CategoryProvider>
            </Provider>
        </GlobalStyles>
    // </StrictMode>,
);
