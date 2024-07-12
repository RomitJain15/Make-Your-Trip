import React, { useState, useEffect } from 'react'; // Correct import statement
import axiosWithAuth from './axiosWithAuth'; // Ensure axiosWithAuth is imported correctly
import { Card, CardContent, Typography, Grid, Button, Drawer } from '@mui/material';
import { Bookmark } from '@mui/icons-material';
import Chip from '@mui/material/Chip';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

function Bookings() {
    const [bookings, setBookings] = useState([]); // Initialize as an array
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [currentHoliday, setCurrentHoliday] = useState(null);
    const [commentInput, setCommentInput] = useState('');

    const user = localStorage.getItem('userId');

    const itineraries = {
        Paris: [
            { day: 1, activities: ["Visit the Eiffel Tower", "Explore the Louvre Museum", "Stroll through Montmartre"] },
            { day: 2, activities: ["Tour Notre-Dame Cathedral", "Relax in Luxembourg Gardens", "Evening cruise on the Seine"] },
            { day: 3, activities: ["Shop in Le Marais", "Visit the Orsay Museum", "Dinner in the Latin Quarter"] },
            { day: 4, activities: ["Explore the Palace of Versailles", "Return to Paris for a show at Moulin Rouge"] },
            { day: 5, activities: ["Leisure day: Cafés and last-minute shopping", "Visit places missed in previous days"] },
            { day: 6, activities: ["Optional activities or rest day"] },
            { day: 7, activities: ["Departure"] }
        ],
        Tokyo: [
            { day: 1, activities: ["Visit the Senso-ji Temple", "Explore Asakusa", "Shop in Akihabara"] },
            { day: 2, activities: ["Tour the Imperial Palace", "Stroll through Ueno Park", "Evening in Shinjuku"] },
            { day: 3, activities: ["Day trip to Mount Fuji", "Return to Tokyo for dinner in Shibuya"] },
            { day: 4, activities: ["Explore the Meiji Shrine", "Shop in Harajuku", "Visit the Mori Art Museum"] },
            { day: 5, activities: ["Relax in Odaiba", "Last-minute shopping in Ginza", "Farewell dinner at a sushi restaurant"] }
        ],
        Cairo: [
            { day: 1, activities: ["Visit the Great Pyramids of Giza", "Explore the Sphinx", "Tour the Egyptian Museum"] },
            { day: 2, activities: ["Stroll through Old Cairo", "Shop in Khan El Khalili Bazaar", "Evening on the Nile"] },
            { day: 3, activities: ["Day trip to Saqqara and Memphis", "Evening at leisure in Cairo"] },
            { day: 4, activities: ["Visit the Citadel of Saladin", "Explore Coptic Cairo", "Dinner in a local restaurant"] },
            { day: 5, activities: ["Leisure day or optional activities"] },
            { day: 6, activities: ["More leisure time or optional tours"] },
            { day: 7, activities: ["Optional activities or rest day"] },
            { day: 8, activities: ["More leisure time or optional tours"] },
            { day: 9, activities: ["Last-minute shopping or sightseeing"] },
            { day: 10, activities: ["Departure"] }
        ],
        NewYork: [
            { day: 1, activities: ["Visit the Statue of Liberty", "Explore Central Park", "Shop in Times Square"] },
            { day: 2, activities: ["Tour the Metropolitan Museum of Art", "Walk the High Line", "Evening in Broadway"] },
            { day: 3, activities: ["Visit the 9/11 Memorial & Museum", "Stroll through Wall Street", "Dinner in Brooklyn"] },
            { day: 4, activities: ["Explore the Empire State Building", "Leisure time in Manhattan"] },
            { day: 5, activities: ["Leisure day or optional activities"] },
            { day: 6, activities: ["Departure"] }
        ],
        Sydney: [
            { day: 1, activities: ["Visit the Sydney Opera House", "Explore the Sydney Harbour Bridge", "Relax at Bondi Beach"] },
            { day: 2, activities: ["Tour the Royal Botanic Garden", "Visit the Art Gallery of NSW", "Evening in Darling Harbour"] },
            { day: 3, activities: ["Day trip to the Blue Mountains", "Return to Sydney for dinner at The Rocks"] },
            { day: 4, activities: ["Explore Taronga Zoo", "Shop in the Queen Victoria Building", "Visit the Sydney Tower Eye"] },
            { day: 5, activities: ["Leisure day or optional activities"] },
            { day: 6, activities: ["More leisure time or optional tours"] },
            { day: 7, activities: ["Last-minute shopping or sightseeing"] },
            { day: 8, activities: ["Departure"] }
        ],
        Rome: [
            { day: 1, activities: ["Visit the Colosseum", "Explore the Roman Forum", "Stroll through Piazza Navona"] },
            { day: 2, activities: ["Tour the Vatican Museums", "Visit St. Peter's Basilica", "Walk around the Vatican City"] },
            { day: 3, activities: ["Visit the Pantheon", "Enjoy gelato near the Spanish Steps", "Shop on Via del Corso"] },
            { day: 4, activities: ["Explore the Borghese Gallery and Gardens", "Relax in Trastevere neighborhood"] },
            { day: 5, activities: ["Day trip to Pompeii or Florence", "Evening at leisure in Rome"] },
            { day: 6, activities: ["Leisure day: Explore local neighborhoods", "Last-minute shopping"] },
            { day: 7, activities: ["Departure"] }
        ],
        London: [
            { day: 1, activities: ["Visit the British Museum", "Explore the Tower of London", "Walk across Tower Bridge"] },
            { day: 2, activities: ["Tour Westminster Abbey", "Visit the Houses of Parliament", "Enjoy the London Eye"] },
            { day: 3, activities: ["Stroll through Hyde Park", "Shop in Covent Garden", "See a show in the West End"] },
            { day: 4, activities: ["Explore the Victoria and Albert Museum", "Leisure time in Notting Hill"] }
        ],
        Bangkok: [
            { day: 1, activities: ["Visit the Grand Palace", "Explore Wat Pho", "Take a boat ride on the Chao Phraya River"] },
            { day: 2, activities: ["Tour Wat Arun", "Shop at Chatuchak Weekend Market", "Enjoy the nightlife in Silom"] },
            { day: 3, activities: ["Day trip to Ayutthaya", "Evening at leisure in Bangkok"] },
            { day: 4, activities: ["Explore the Jim Thompson House", "Shop in Siam Square", "Visit the Erawan Shrine"] },
            { day: 5, activities: ["Relax at Lumpini Park", "Visit the Bangkok National Museum", "Evening in Asiatique"] },
            { day: 6, activities: ["Leisure day: Explore local markets", "Enjoy Thai massage"] },
            { day: 7, activities: ["Day trip to the floating markets", "Evening at leisure"] },
            { day: 8, activities: ["Visit the Sea Life Bangkok Ocean World", "Last-minute shopping in MBK Center"] },
            { day: 9, activities: ["Departure"] }
        ],
        Dubai: [
            { day: 1, activities: ["Visit the Burj Khalifa", "Explore the Dubai Mall", "Watch the Dubai Fountain show"] },
            { day: 2, activities: ["Tour the Palm Jumeirah", "Relax at Jumeirah Beach", "Dinner cruise on Dubai Creek"] },
            { day: 3, activities: ["Explore the old Dubai and Dubai Museum", "Shop in the Gold Souk", "Visit the Spice Souk"] },
            { day: 4, activities: ["Day trip to Abu Dhabi", "Visit the Sheikh Zayed Grand Mosque", "Explore the Louvre Abu Dhabi"] },
            { day: 5, activities: ["Leisure day: Last-minute shopping or visit to the Dubai Frame"] }
        ],
        Cancun: [
            { day: 1, activities: ["Relax on the beaches of Cancun", "Visit the El Rey Maya ruins", "Evening at the Hotel Zone"] },
            { day: 2, activities: ["Day trip to Isla Mujeres", "Snorkeling or diving", "Explore the island on a golf cart"] },
            { day: 3, activities: ["Visit Xcaret Park", "Explore the underground rivers", "Enjoy the evening show"] },
            { day: 4, activities: ["Day trip to Chichen Itza", "Visit Cenote Ik Kil", "Explore Valladolid"] },
            { day: 5, activities: ["Relax at Playa Delfines", "Shop at La Isla Shopping Village"] },
            { day: 6, activities: ["Leisure day: Optional tours or water activities"] },
            { day: 7, activities: ["Departure"] }
        ],
    };

    const navigate = useNavigate()

    const getBookings = async () => {
        axiosWithAuth().get('/api/bookings')
            .then(response => {
                setBookings(response.data); // Assuming response.data is an array
            })
            .catch(error => {
                console.log('Error fetching bookings: ', error);
            });
    };

    useEffect(() => {
        getBookings();
    }, []); // Empty dependency array means this runs once on component mount

    const handleOpenDrawer = (holiday) => {
        setCurrentHoliday(holiday);
        setDrawerOpen(true);
    };

    const handleRemoveBooking = (holiday) => {
        holiday.booking.map((booking) => {
            if (booking.userId === localStorage.getItem('userId')) {
                axiosWithAuth().delete(`/api/bookings/${booking._id}`)
                    .then(response => {
                        getBookings();
                    })
                    .catch(error => {
                        console.log('Error removing booking: ', error);
                    });
            }
        });
    };

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

            <div>
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%', paddingTop: '50px' }}>
                    <h1>My Bookings</h1>
                </div>
                {bookings.length === 0 ? (
                    <h2 style={{
                        paddingLeft: '1rem',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#333',
                        padding: '20px',
                        textAlign: 'center',
                        margin: '20px 0',
                        fontFamily: 'Arial, sans-serif'
                    }}>
                        No Bookings
                    </h2>
                ) :
                    < Grid container padding={'80px'} item spacing={8} xs={12} sm={12} md={12} lg={12}>
                        {bookings?.map((holiday, index) => (
                            <Grid item key={index} xs={12} sm={6} md={4} lg={4}>
                                <Card className="cardHoverEffect" style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '90%', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.3)' }}>
                                    {holiday.deal && (
                                        <Bookmark style={{ position: 'absolute', top: 10, right: 10, color: 'red' }} />
                                    )}
                                    <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                                        <img
                                            src={holiday.imageUrl || "https://img.freepik.com/premium-photo/coast-beach-day_157744-1217.jpg"}
                                            alt={`Image of ${holiday.city}, ${holiday.country}`}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                                        />
                                    </div>
                                    <CardContent style={{ flexGrow: 0 }}>
                                        <Typography gutterBottom variant="h5" component="div">
                                            <div>
                                                <span style={{ marginRight: '10px' }}>
                                                    {holiday.city}, {holiday.country}
                                                </span>
                                                {holiday.deal && <Chip label="Special Deal" color="primary" />}
                                                <br />
                                                {holiday.tags?.map((tag, index) => (  // Display tags as Chips
                                                    <Chip key={index} label={tag} style={{ marginRight: '5px' }} />
                                                ))}
                                            </div>
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" >
                                            Price: ${holiday.price} - {holiday.duration}
                                            <br />
                                            Booked for {holiday.booking.find(booking => booking.userId === user).guests} guests
                                            <br />
                                            Start Date - {moment(holiday.booking.find(booking => booking.userId === user).startDate).format('DD/MM/YY')}
                                            <br />
                                            End Date - {moment(holiday.booking.find(booking => booking.userId === user).endDate).format('DD/MM/YY')}
                                            <br />
                                            <hr />
                                            <Typography variant="h6" color="text.secondary">
                                                Total Amount - ${holiday.booking.find(booking => booking.userId === user).Amount}
                                            </Typography>
                                        </Typography>
                                    </CardContent>
                                    <div style={{ display: 'flex', justifyContent: 'space-evenly', padding: '10px', alignItems: 'center' }}>
                                        <Button style={{ margin: '10px' }} variant="outlined" onClick={() => handleRemoveBooking(holiday)}>Remove Booking</Button>
                                        <Button style={{ margin: '10px' }} variant="outlined" onClick={() => handleOpenDrawer(holiday)}>Details </Button>
                                    </div>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                }
            </div>
            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <div style={{ width: '100%', height: '100%', backgroundColor: '#F5F5F5' }}>
                    {currentHoliday && (
                        <div style={{ width: '450px', padding: '20px', margin: 'auto', backgroundColor: '#F5F5F5' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button onClick={() => setDrawerOpen(false)} style={{ cursor: 'pointer', background: 'none', border: 'none', fontSize: '20px' }}>✖</button>
                            </div>
                            <Typography variant="h5" style={{
                                fontSize: '26px',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                color: '#333',
                                marginBottom: '20px',
                            }}>
                                {currentHoliday.city}, {currentHoliday.country} ({currentHoliday.id})
                            </Typography>
                            <img
                                src={currentHoliday.imageUrl}
                                alt={`Image of ${currentHoliday.city}, ${currentHoliday.country}`}
                                style={{ width: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.3)', marginBottom: '20px' }}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                <Typography variant="body1" style={{ color: '#555' }}>Price: ${currentHoliday.price}</Typography>
                                <Typography variant="body1" style={{ color: '#555' }}>Duration: {currentHoliday.duration}</Typography>
                                <Typography variant="body1" style={{ color: '#555' }}>Rating: {currentHoliday.rating}</Typography>
                                <Typography variant="body1" style={{ textAlign: 'center', color: '#555' }}>{currentHoliday.description}</Typography>
                                {itineraries[currentHoliday.city] && (
                                    <div style={{ maxWidth: '450px', margin: '20px auto', backgroundColor: '#F5F5F5', padding: '20px', borderRadius: '10px', boxShadow: '0 6px 10px rgba(0,0,0,0.25)' }}>
                                        <Typography variant="h6" style={{ textAlign: 'center', color: '#333', marginBottom: '24px', textDecoration: 'underline', fontWeight: '500' }}>Itinerary</Typography>
                                        <ul style={{ listStyleType: 'circle', padding: '0 20px', margin: 0 }}>
                                            {itineraries[currentHoliday.city].map((day, index) => (
                                                <li key={index} style={{ marginBottom: '15px', paddingLeft: '10px' }}>
                                                    <Typography variant="body1" style={{ color: '#555', fontWeight: '400' }}>
                                                        Day {day.day}: {day.activities.join(', ')}
                                                    </Typography>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <div style={{ marginTop: '20px', padding: '20px' }}>
                                    <div style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 'bold', color: '#333' }}>Comments</div>
                                    <div style={{ marginTop: '25px' }}>
                                        {currentHoliday.comments?.map((comment, index) => (
                                            <div key={index} style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '5px', fontSize: '16px' }}>
                                                <div style={{ color: '#555', display: 'flex', alignItems: 'center' }}>
                                                    {comment?.userId?.image && (
                                                        <img src={comment.userId.image} alt="user" style={{ width: '35px', height: '35px', borderRadius: '50%', marginRight: '10px' }} />
                                                    )}
                                                    {comment?.userId?.name} (added on {moment(comment.createdAt).format('DD/MM/YY')})
                                                </div>
                                                <div style={{ color: '#555' }}>{comment.comment}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Drawer>
        </>
    );
}

export default Bookings;