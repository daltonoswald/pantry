import { Link } from 'react-router-dom';
import { Card, ListGroup } from 'react-bootstrap';

export default function SearchUsers({ user }) {

    return (
        <Card >
            <Card.Body>
                <Card.Title>
                    <Link to={`/user/${user.username}`}>{user.username}</Link>
                </Card.Title>
                <Card.Text>{user.bio}</Card.Text>
            </Card.Body>
            <Card.Body>
                <ListGroup horizontal >
                    <ListGroup.Item>{user._count.followedBy} Followers</ListGroup.Item>
                    <ListGroup.Item>{user._count.following} Following</ListGroup.Item>
                    <ListGroup.Item>{user._count.recipes} Recipes</ListGroup.Item>
                </ListGroup>
            </Card.Body>
        </Card>
    )
}