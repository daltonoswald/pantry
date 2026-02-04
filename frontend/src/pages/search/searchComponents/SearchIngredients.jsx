import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';

export default function SearchIngredients({ ingredient }) {

    return (
        <Card>
            <Card.Body>
                {/* <Card.Title>{ingredient.name}</Card.Title> */}
                <Card.Title>
                    <Link to={`/search?q=${ingredient.name}&t=recipes`}>{ingredient.name}</Link>    
                </Card.Title>
            </Card.Body>
        </Card>
    )
}