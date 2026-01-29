import { Card } from 'react-bootstrap';

export default function SearchIngredients({ ingredient }) {

    return (
        <Card >
            <Card.Body>
                <Card.Title>{ingredient.name}</Card.Title>
            </Card.Body>
        </Card>
    )
}