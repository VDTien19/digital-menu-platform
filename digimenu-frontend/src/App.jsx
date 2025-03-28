import { Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AdminLayout, ClientLayout, ServiceLayout } from './layouts';
import ProtectedRoute, { publicRoutes, privateRoutes } from './routes';
import { SlugProvider } from '~/contexts/SlugContext';

function App() {
    return (
        <Router>
            <Toaster position="top-center" reverseOrder={false} />
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
