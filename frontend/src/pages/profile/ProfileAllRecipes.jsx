import Header from '../../components/header/Header';
import PageTitle from '../../components/PageTitle';
import { useNavigate, useParams, Link } from 'react-router-dom';


export default function ProfileAllRecipes() {
    const params = useParams();

    return (
        <div className='app'>
            <PageTitle title={`${params.username}'s recipes`} />
            <Header />
        </div>
    )
}