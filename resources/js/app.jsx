import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import '../css/reset.css';
import '../css/app.css';

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.jsx', { eager: true });
        return pages[`./pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <>
                <Toaster
                    position="bottom-center"
                    reverseOrder={false}
                    toastOptions={{
                        duration: 2000,
                        style: {
                            borderRadius: '4px',
                            padding: '9px 20px',
                            color: '#fff',
                            fontWeight: '500',
                            fontSize: '1.38rem',
                            minWidth: '340px',
                            maxWidth: '500px',
                            background: '#000000ab',
                        },
                        success: {
                            style: {
                                background: '#000000ab',
                                minWidth: '260px',
                            },
                        },
                        error: {
                            style: {
                                background: '#000000ab',
                                minWidth: '300px',
                                maxWidth: '500px',
                            },
                        },
                        loading: {
                            style: {
                                background: '#000000ab',
                            },
                        },
                    }}
                />

                <App {...props} />
            </>,
        );
    },
});
