const capFirst = (item) => {
    return item.charAt(0).toUpperCase() + item.slice(1)
}

const handleDeleteFromPantry = async (id) => {
    console.log('id', id)
    const url = `http://localhost:3000/pantry/delete-from-pantry`;
    const pantryItemToDelete = {
        pantryUsersToDelete: id
    }
    try {
        const token = localStorage.getItem('pantryAuthToken');
        const response = await fetch(url, {
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
    console.log('util-id', id);
    const url = `http://localhost:3000/recipe/delete/${id}`
    const recipeToDelete = {
        recipeToDelete: id
    }
    try {
        const token = localStorage.getItem('pantryAuthToken');
        const response = await fetch(url, {
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
            // console.log('deleted');
            // console.log(data)
            return data;
        }
    } catch (error) {
        console.error(`Error requesting: `, error);
    }
}

export { capFirst, handleDeleteFromPantry, handleDeleteRecipe }