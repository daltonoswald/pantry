import { Container, Row, Col, Form, FloatingLabel, Button, InputGroup, Alert, Spinner } from 'react-bootstrap';
import Header from '../../components/header/Header';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ErrorModal from '../../components/ErrorModal';
import { capFirst, handleDeleteFromPantry } from '../../utils/utility';
import ProfilePantry from './components/ProfilePantry'
import ProfileRecipes from './components/ProfileRecipes';
import EditProfile from '../../components/modals/EditProfile';
import { LuChefHat } from 'react-icons/lu';
import './profile.styles.css'


export default function Profile() {
    const navigate = useNavigate();
    const [myData, setMyData] = useState();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [profileData, setProfileData] = useState();
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [isFollowing, setIsFollowing] = useState(null);
    const [followedBy, setFollowedBy] = useState(null);
    const [openEditProfile, setOpenEditProfile] = useState(false);
    const token = localStorage.getItem('pantryAuthToken');
    const params = useParams();

    useEffect(() => {
        const getProfile = async () => {
            const url = `http://localhost:3000/user/profile/${params.username}`;
            const userToFind = {
                userToFind: params.username
            }
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(userToFind),
                    mode: 'cors'
                });

                const data = await response.json();

                if (!response.ok) {
                    setIsLoading(false);
                    console.error(`Error Data: `, data.error);
                    console.log('Error Message: ', data.error.message)
                    setMessage(data.error.message);
                } else {
                    console.log(data);
                    setProfileData(data.userProfile);
                    if (data.currentUser) {
                        setMyData(data.currentUser)
                    }
                    if (data.isOwnProfile) {
                        setIsOwnProfile(data.isOwnProfile)
                    }
                    setIsFollowing(data.isFollowing)
                    setFollowedBy(data.followsYou)
                    setMessage(null);
                    // setProfileData(profileData.profile);
                    // setMyData(profileData.user.user)
                    // setMessage(null);
                    // setIsLoading(false)
                }
            } catch (error) {
                console.error(`Errors: ${error.error.message}`);
                console.log('catch');
                setMessage(error);
            } finally {
                setIsLoading(false);
            }
        }
        getProfile();
    }, [params.username, navigate]);

    const handleFollow = async (e) => {
        e.preventDefault();
        const url = `http://localhost:3000/user/follow-user`
        const userToFollow = {
            userToFollow: profileData.username
        }
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(userToFollow),
                mode: 'cors',
            });
            const data = await response.json();
            if (response.ok) {
                console.log(data)
                window.location.reload();
            }
            if (!response.ok) {
                setMessage(data.message);
            }
        } catch (error) {
            console.error(`Error Requesting authentication:`, error);
            console.log(error)
        }
    }


    const handleUnfollow = async (e) => {
        e.preventDefault();
        const url = `http://localhost:3000/user/unfollow-user`
        const userToUnfollow = {
            userToFollow: profileData.username
        }
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(userToUnfollow),
                mode: 'cors',
            });
            const data = await response.json();
            if (response.ok) {
                console.log(data)
                window.location.reload();
            }
            if (!response.ok) {
                setMessage(data.message);
            }
        } catch (error) {
            console.error(`Error Requesting authentication:`, error);
            console.log(error)
        }
    }

    function handleOpenEditProfile() {
        console.log(openEditProfile)
        setOpenEditProfile(!openEditProfile)
    }

    if (isLoading) {
        return (
            <div className='app'>
                <Header />
                <Spinner />
                <p>Loading...</p>
            </div>
        )
    }

    if (!isLoading && message) {
        console.log(message)
        return (
            <div className='app'>
                <Header />
                <ErrorModal error={message} />
            </div>
        )
    }


    // if (!isLoading && !message) {
    //     return (
    //         <div className='app'>
    //             <Header />
    //             <Container>
    //                 <Row className='profile-header'>
    //                     <Col>
    //                         <Col className='profile-header-left'>
    //                             <Row className='profile-info'>
    //                                 <Col className='profile-picture'>
    //                                     <PersonSquare />
    //                                 </Col>
    //                                 <Col className='profile-names'>
    //                                     <h1>{profileData.username}</h1>
    //                                     <h2>{profileData.name}</h2>
    //                                 </Col>
    //                                 <Col>
    //                                     {(isFollowing && !isOwnProfile) && (
    //                                         <PersonFillDash onClick={handleUnFollow} />
    //                                     )}
    //                                     {(!isFollowing && !isOwnProfile) && (
    //                                         <PersonFillAdd onClick={handleFollow} />
    //                                     )}
    //                                     {(isOwnProfile) && (
    //                                         <Button onClick={handleOpenEditProfile}>Edit Profile</Button>
    //                                     )}
    //                                 </Col>
    //                             </Row>
    //                             <Row className='profile-follows'>
    //                                 <Col>
    //                                     <p>{profileData._count.following} Following</p>
    //                                 </Col>
    //                                 <Col>
    //                                     <p>{profileData._count.followedBy} Followers</p>
    //                                 </Col>
    //                             </Row>
    //                         </Col>
    //                     </Col>
    //                     <Col>
    //                         <p>{profileData.bio}</p>
    //                     </Col>
    //                     <Col>
    //                         <Col>
    //                             <p>{profileData.recipes.length} Recipes</p>
    //                         </Col>
    //                     </Col>
    //                 </Row>
    //                 <Row>
    //                     <Col>
    //                         <ProfilePantry myData={myData || null} profileData={profileData} isOwnProfile={isOwnProfile} isLoading={isLoading} />
    //                     </Col>
    //                     <Col>
    //                         <ProfileRecipes myData={myData || null} profileData={profileData} isOwnProfile={isOwnProfile} isLoading={isLoading} />
    //                     </Col> 
    //                 </Row>
    //             </Container>
    //             <EditProfile profileData={profileData} openEditProfile={openEditProfile} setOpenEditProfile={setOpenEditProfile} />
    //         </div>
    //     )
    // }

    if (!isLoading && !message) {
        return (
            <div className='app'>
                <Header />
                <div className='profile-container'>
                    <div className='profile-heading'>
                        <div className='profile-picture-container'>
                            {(profileData.image != null) ? (
                                <img src={profileData.image} className='profile-picture' />
                            ) : (
                                <LuChefHat className='profile-picture'/>
                            )}
                            <h2>{profileData.username}</h2>
                        </div>
                        <div className='profile-heading-info'>
                            <h1 className='profile-name'>{profileData.name}</h1>
                            <p className='profile-bio'>{profileData.bio}</p>
                            <div className='profile-heading-stats'>
                                <div className='profile-heading-followers'>
                                    <h4>{profileData._count.followedBy}</h4>
                                    <p>Followers</p>
                                </div>
                                <div className='profile-heading-following'>
                                    <h4>{profileData._count.following}</h4>
                                    <p>Following</p>
                                </div>
                                <div className='profile-heading-recipe-count'>
                                    <h4>{profileData._count.recipes}</h4>
                                    <p>Recipes</p>
                                </div>
                            </div>
                            <div className='profile-heading-follow'>
                                {(isFollowing && !isOwnProfile) ? (
                                    <button className='button-unfollow' onClick={handleUnfollow}>Unfollow</button>
                                ) : (!isFollowing && !isOwnProfile) ? (
                                    <button className='button-follow' onClick={handleFollow}>Follow</button>
                                ) : (isOwnProfile) && (
                                    <button className='button-edit-profile' onClick={handleOpenEditProfile}>Edit Profile</button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='profile-body'>
                        <ProfileRecipes myData={myData || null} profileData={profileData} isOwnProfile={isOwnProfile} isLoading={isLoading} />
                        <ProfilePantry myData={myData || null} profileData={profileData} isOwnProfile={isOwnProfile} isLoading={isLoading} />
                    </div>
                </div>
                <EditProfile profileData={profileData} openEditProfile={openEditProfile} setOpenEditProfile={setOpenEditProfile} />
            </div>
        )
    }
}