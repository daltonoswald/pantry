import { Link, useNavigate } from 'react-router-dom';
import { Card } from 'react-bootstrap';

export default function SearchRecipes({ recipe }) {
    const navigate = useNavigate();

    const handleNavigateToCard = () => {
        navigate(`/recipe/${recipe.id}`)
    }

    return (
        <Card onClick={handleNavigateToCard} style={{cursor: 'pointer' }}>
            {/* <Card.Img variant='top' src={recipe.image || defaultImage } /> */}
            <Card.Body>
                <Card.Title>{recipe.title}</Card.Title>
                <Card.Subtitle className='mb-2'>
                    <Link to={`/user/${recipe.user.username}`}>
                        {recipe.user.name}
                    </Link>
                    </Card.Subtitle>
                <Card.Text>{recipe.description}</Card.Text>
            </Card.Body>
        </Card>
    )
}