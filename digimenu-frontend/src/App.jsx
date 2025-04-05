import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster, ToastBar } from 'react-hot-toast';

import './App.css';
import { AdminLayout, ClientLayout, ServiceLayout } from './layouts';
import ProtectedRoute, { publicRoutes, privateRoutes } from './routes';
import { SlugProvider } from '~/contexts/SlugContext';

function App() {
    return (
        <Router>
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: 'rgba(22, 22, 22, 0.9',
                        color: '#fff',
                        fontSize: '1.3rem',
                        borderRadius: '8px',
                        padding: '6px 2px',
                        width: '100%',
                    },
                }}
            >
                {(t) => (
                    <ToastBar
                        toast={t}
                        style={{
                            ...t.style,
                            animation: t.visible
                                ? 'custom-enter 0.4s ease'
                                : 'custom-exit 0.4s ease forwards',
                        }}
                    />
                )}
            </Toaster>
            <div className="app">
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Page = route.component;

                        let Layout = ClientLayout;

                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.layout === null) {
                            Layout = Fragment;
                        }

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <SlugProvider>
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    </SlugProvider>
                                }
                            />
                        );
                    })}

                    {privateRoutes.map((route, index) => {
                        const Page = route.component;

                        let Layout;

                        if (route.layout === 'admin') {
                            Layout = AdminLayout;
                        } else if (route.layout === 'staff') {
                            Layout = ServiceLayout;
                        }

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <ProtectedRoute>
                                        <SlugProvider>
                                            <Layout>
                                                <Page />
                                            </Layout>
                                        </SlugProvider>
                                    </ProtectedRoute>
                                }
                            />
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
