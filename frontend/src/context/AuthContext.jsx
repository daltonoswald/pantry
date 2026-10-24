import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);
const TOKEN_KEY = 'pantryAuthToken';
const USERNAME_KEY = 'pantryUsername';

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
    const [username, setUsername] = useState(() => localStorage.getItem(USERNAME_KEY));
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(!!localStorage.getItem(TOKEN_KEY));
    const url = `http://localhost:3000/user/stats`;

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USERNAME_KEY);
        setToken(null);
        setUsername(null);
        setUser(null);
    }, []);

    const login = useCallback((newToken, newUsername) => {
        localStorage.setItem(TOKEN_KEY, newToken);
        localStorage.setItem(USERNAME_KEY, newUsername);
        setToken(newToken);
        setUsername(newUsername);
    }, []);

    const refreshUser = useCallback(async () => {
        const activeToken = localStorage.getItem(TOKEN_KEY);
        if (!activeToken) {
            setUser(null);
            setIsLoading(false);
            return;
        }
        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${activeToken}`
                },
            });
            if (!response.ok) {
                logout();
                return;
            }
            const { stats } = await response.json();
            setUsername(stats.username);
            setUser({
                id: stats.id,
                username: stats.username,
                stats: {
                    pantryItems: stats.pantryItems.length,
                    recipes: stats._count.recipes,
                    favorites: stats._count.recipeFavorites,
                    followers: stats._count.followedBy,
                },
            });
        } catch (error) {
            console.error(`Error loading user:`, error);
        } finally {
            setIsLoading(false);
        }
    }, [logout, url]);

    useEffect(() => {
        refreshUser();
    }, [token, refreshUser]);

    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === TOKEN_KEY) setToken(e.newValue);
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const value = useMemo(() => ({
        token,
        username,
        user,
        isLoggedIn: !!token,
        isLoading,
        login,
        logout,
        refreshUser,
    }), [token, username, user, isLoading, login, logout, refreshUser]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used inside an AuthProvider');
    return context;
}