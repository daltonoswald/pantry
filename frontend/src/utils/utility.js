const capFirst = (item) => {
    return item.charAt(0).toUpperCase() + item.slice(1)
}

const handleDeleteFromPantry = async (id) => {
    const pantryItemToDelete = {
        pantryUsersToDelete: id
    }
    try {
        const token = localStorage.getItem('pantryAuthToken');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/pantry/delete-from-pantry`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(pantryItemToDelete),
            mode: 'cors',
        });
        if (response.status === 202) {
            window.location.reload();
        } else {
            console.error('There was an error removing this item')
        }
    } catch (error) {
        console.error(`Error requesting: `, error);
    }
}

const handleDeleteRecipe = async (id) => {
    const recipeToDelete = {
        recipeToDelete: id
    }
    try {
        const token = localStorage.getItem('pantryAuthToken');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/recipe/delete/${id}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(recipeToDelete),
            mode: 'cors',
        });
        const data = await response.json();
        if (response.ok) {
            return data;
        }
    } catch (error) {
        console.error(`Error requesting: `, error);
    }
}

const updateProfile = async (editData) => {
    const token = localStorage.getItem('pantryAuthToken');

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user/edit-profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(editData),
            mode: 'cors'
        });

        const data = await response.json();

        if (response.ok) {
            // console.log(data);
            return { success: true, message: data.message }
        } else {
            console.error('Error:', data.message)
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Error updating profile', error);
        return { success: false, message: 'An error occured.' };
    }
}

const favoriteRecipe = async (recipeToFavorite) => {
    const token = localStorage.getItem('pantryAuthToken');

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/recipe/favorite/${recipeToFavorite}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(recipeToFavorite),
            mode: 'cors'
        })

        const data = await response.json();
        if (response.ok) {
            // console.log(data);
            return { success: true, message: data.message }
        } else {
            console.error('Error:', data.message)
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Error favoriting recipe', error);
        return { success: false, message: 'An error occured.' };
    }
}

const unfavoriteRecipe = async (recipeToUnfavorite) => {
    const token = localStorage.getItem('pantryAuthToken');

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/recipe/unfavorite/${recipeToUnfavorite}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(recipeToUnfavorite),
            mode: 'cors'
        })

        const data = await response.json();
        if (response.ok) {
            // console.log(data);
            return { success: true, message: data.message }
        } else {
            console.error('Error:', data.message)
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Error favoriting recipe:', error);
        return { success: false, message: 'An error occured.' };
    }
}

const toggleFavoriteRecipe = async (recipeId) => {
    const token = localStorage.getItem('pantryAuthToken');

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/recipe/toggle-favorite/${recipeId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            mode: 'cors'
        });

        const data = await response.json();;

        if (response.ok) {
            return {
                success: true,
                isFavorited: data.isFavorited,
                message: data.message
            };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        return { success: false, message: 'An error occured.' };
    }
}

const getRecipesByPantry = async (limit = 5, minMatch = 0) => {
    const token = localStorage.getItem('pantryAuthToken');
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/recipe/by-pantry?limit=${limit}&minMatch=${minMatch}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            mode: 'cors'
        });

        const data = await response.json();

        if (response.ok) {
            // console.log(data);
            return { success: true, data: data }
        }
    } catch (error) {
        console.error('Error', error);
        return { success: false, message: 'An error occured.' };
    }
}

export { capFirst, handleDeleteFromPantry, handleDeleteRecipe, updateProfile, favoriteRecipe, unfavoriteRecipe, toggleFavoriteRecipe, getRecipesByPantry }