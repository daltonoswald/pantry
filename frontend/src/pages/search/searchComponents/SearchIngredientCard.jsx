import { GoPlusCircle, GoArrowUpRight, GoXCircle } from 'react-icons/go';
import { Link } from 'react-router-dom';
import usePantryItem from '../../../utils/usePantryItem';

export default function SearchIngredientCard({ ingredient }) {
    const { inPantry, add, remove } = usePantryItem(ingredient.name, ingredient.inPantry);

    return (
        <div className='search-ingredient-card'>
            <div className='search-ingredient-card-title'>
                <h4>{ingredient.name}
                    {inPantry
                    ? <GoXCircle className='remove-pantry-item-icon' onClick={remove} />
                    : <GoPlusCircle className='add-pantry-item-icon' onClick={add} />
                    }

                </h4>
                <p>{ingredient.recipeCount} {ingredient.recipeCount === 1 ? `Recipe` : `Recipes`}</p>
            </div>
            <div className='search-ingredient-card-body'>
                <Link to={`/search?q=${encodeURIComponent(ingredient.name)}&t=recipes`}>
                    <p>Explore more uses</p>
                    <GoArrowUpRight />
                </Link>
            </div>
        </div>
    )
}