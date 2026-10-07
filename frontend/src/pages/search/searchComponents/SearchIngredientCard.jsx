import { GoArrowUpRight } from 'react-icons/go';
import { Link } from 'react-router-dom';

export default function SearchIngredientCard({ ingredient, userStats }) {

    // return (
        // <Card>
        //     <Card.Body>
        //         {/* <Card.Title>{ingredient.name}</Card.Title> */}
        //         <Card.Title>
        //             <Link to={`/search?q=${ingredient.name}&t=recipes`}>{ingredient.name}</Link>    
        //         </Card.Title>
        //     </Card.Body>
        // </Card>
    // )

    return (
        <div className='search-ingredient-card'>
            <div className='search-ingredient-card-title'>
                <h4>{ingredient.name}</h4>
                <p>{ingredient.recipeCount} Recipes</p>
            </div>
            <div className='search-ingredient-card-body'>
                <Link to={`/search?q=${ingredient.name}&t=recipes`}>
                    <p>Explore more uses</p>
                    <GoArrowUpRight />
                </Link>
            </div>
        </div>
    )
}