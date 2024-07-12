import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Button, Drawer } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axiosWithAuth from './axiosWithAuth';
import moment from 'moment';
import { set } from 'mongoose';

function Profile() {

    const [profile, setProfile] = useState({});
    const [photo, setPhoto] = useState('');
    const navigate = useNavigate();
    const defaultPhotoURL = "https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg"

    const getProfile = async () => {
        axiosWithAuth().get('/api/profile')
            .then(response => {
                setProfile(response.data);
                if (response.data.image !== defaultPhotoURL) {
                    setPhoto(response.data.image);
                }
            })
            .catch(error => {
                console.error("Error fetching profile:", error);
            });
    }

    const handlePhotoChange = (event) => {
        if (event.target.files.length === 0) {
            // No file was selected (user cancelled the file dialog), so exit the function early
            return;
        }

        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            axiosWithAuth().put('/api/profile/photo', { image: reader.result })
                .then(response => {
                    setProfile(response.data);
                    setPhoto(response.data.image)
                })
                .catch(error => {
                    if (error.response.status === 413) {
                        alert("The image you selected is too large. Please select a smaller image.")
                    }
                    else {
                        console.error("Error updating photo:", error);
                    }
                });
        };
        reader.readAsDataURL(file);
    };

    const removePhoto = () => {
        setPhoto('');
        axiosWithAuth().put('/api/profile/photo', { image: defaultPhotoURL })
            .then(response => {
                setProfile(response.data);
            })
            .catch(error => {
                console.error("Error removing photo:", error);
            });
    };

    useEffect(() => {
        getProfile();
    }, []);

    return (
        <>
            <div className="gradientBackground" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', position: 'relative' }}>
                <div style={{ textAlign: 'center', display: 'flex' }}>
                    <img src="/favicon.ico" alt="Holiday" style={{ borderRadius: '25%', marginRight: '20px', height: '8rem', width: '8rem' }} />
                    <Typography variant="h1" className="titleText" style={{ fontSize: '5rem', letterSpacing: '3px', fontWeight: '600', color: '#FFFFFF', textShadow: '2px 2px 8px rgba(0,0,0,0.5)', marginTop: '1.5rem' }}>
                        <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                            MakeYourTrip
                        </div>
                    </Typography>
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
                <Card style={{ width: '100%', height: '35rem', maxWidth: '1000px', padding: '1rem', boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.1)', background: '#f5f5f5' }}>
                    <CardContent>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Typography variant="h2" style={{ marginBottom: '5rem', textDecoration: 'underline' }}>
                                Profile
                            </Typography>
                        </div>
                        <Grid container spacing={5} alignItems="center" paddingLeft='3rem'>
                            <Grid item xs={12} sm={4} style={{ textAlign: 'center' }}>
                                <img src={profile.image} alt="Profile" style={{ width: '200px', height: '200px', borderRadius: '50%', marginBottom: '1rem' }} />
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                    <input
                                        accept="image/*"
                                        type="file"
                                        onChange={handlePhotoChange}
                                        style={{ display: 'none' }}
                                        id="upload-photo"
                                    />
                                    <label htmlFor="upload-photo">
                                        <Button variant="contained" color="primary" component="span" size="small">
                                            Upload Photo
                                        </Button>
                                    </label>
                                    {photo && photo !== '' && (
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => {
                                                if (window.confirm('Are you sure you want to remove the photo?')) {
                                                    removePhoto();
                                                }
                                            }}
                                            size="small"
                                            style={{}}>
                                            Remove Photo
                                        </Button>
                                    )}
                                </div>
                            </Grid>                        <Grid item xs={12} sm={8}>
                                <Grid container direction="column" spacing={10}>
                                    <Grid item>
                                        <Typography variant="h6" style={{ fontSize: '2rem' }}>
                                            Name: {profile.name}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="h6" style={{ fontSize: '2rem' }}>
                                            Email: {profile.email}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="h6" style={{ fontSize: '2rem' }}>
                                            Joining Date: {moment(profile.joiningDate).format('DD/MM/YY')}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

export default Profile;