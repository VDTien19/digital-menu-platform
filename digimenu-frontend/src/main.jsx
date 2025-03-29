import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App.jsx';
import GlobalStyles from '~/components/GlobalStyles';
import { CategoryProvider } from '~/contexts/CategoryContext';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <GlobalStyles>
            <CategoryProvider>
                <App />
            </CategoryProvider>
        </GlobalStyles>
    </StrictMode>,
);
