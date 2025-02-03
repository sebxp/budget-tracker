// components/Logout.tsx

import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';

const Logout = () => {
    const [showConfirm, setShowConfirm] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                // Invalidate the token on the backend
                await axios.post('/api/auth/logout', {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Remove the token from local storage
                localStorage.removeItem('token');

                // Redirect to the login page
                router.push('/');
            } catch (error) {
                console.error('Failed to logout:', error);
            }
        }
    };

    return (
        <>
            <button onClick={() => setShowConfirm(true)} style={logoutButtonStyle}>
                Logout
            </button>
            {showConfirm && (
                <ConfirmDialog
                    message="Are you sure you want to logout?"
                    onConfirm={handleLogout}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </>
    );
};

const logoutButtonStyle = {
    alignSelf: 'center',
    padding: '0.5rem 1rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
};

export default Logout;