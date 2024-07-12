import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, TextField, Button, Drawer, Checkbox, FormControlLabel, MenuItem, Select, Radio, FormControl, FormLabel, RadioGroup, Slider } from '@mui/material';
import './HolidayCardStyles.css';
import { Bookmark, Chat, Directions, EditRounded } from '@mui/icons-material';
import Chip from '@mui/material/Chip';
import { Tabs, Tab, Box } from '@mui/material';
import HolidayModal from './HolidayModal';
import axios from 'axios';
import { OriginalHolidayData } from './endpoints';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { redirect, useNavigate } from 'react-router-dom';
import axiosWithAuth from './axiosWithAuth';
import moment, { max, min } from 'moment';
import { Nav, NavDropdown, Navbar } from 'react-bootstrap';
import ChatGPT from './chatGPT';
import { jwtDecode } from 'jwt-decode';
import HolidayCardNEW from './HolidayCard';
import swal from 'sweetalert';

const HolidayCard = () => {
  const [holidayData, setHolidayData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [speacialDeal, setSpecialDeal] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentHoliday, setCurrentHoliday] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [sortBy, setSortBy] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: 'Hello! How can I help you today?',
      sender: 'ChatGPT',
      direction: 'incoming'
    }
  ]);
  const [typing, setTyping] = useState(false);
  const [response, setResponse] = useState('');
  const [user, setUser] = useState({ name: '', email: '', id: '' });
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [itinerary, setItinerary] = useState([]);
  const [priceRange, setPriceRange] = useState([]); // Example initial price range
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  user.name = localStorage.getItem('userName');
  user.id = localStorage.getItem('userId');

  const navigate = useNavigate();

  const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

  const tags = [...new Set(holidayData?.flatMap(holiday => holiday.tags))];

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handlesort = (event) => {
    setSortBy(event.target.value);
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    // Add your logic to handle sorting/filtering by price range
  };


  const clearSort = () => {
    setSortBy('');
  };

  const handleOpenDrawer = (holiday) => {
    setCurrentHoliday(holiday);
    setDrawerOpen(true);
  };

  const filteredData = holidayData?.filter(holiday => {
    const matchesSearchQuery = (holiday?.city?.toLowerCase() + " " + holiday?.country?.toLowerCase()).includes(searchQuery?.toLowerCase()) && (!speacialDeal || holiday.deal);
    const selectedTag = tags[selectedTab - 1];
    const matchesSelectedTag = selectedTab === 0 || holiday.tags?.includes(selectedTag);
    const withinPricerange = holiday.price >= priceRange[0] && holiday.price <= priceRange[1];
    return matchesSearchQuery && matchesSelectedTag && withinPricerange;
  });

  const sortedData = filteredData.sort((a, b) => {
    if (sortBy === 'city') {
      return a.city?.localeCompare(b.city);
    } else if (sortBy === 'price') {
      return a.price - b.price;
    }
    return 0; // In case of an unexpected sortBy value, don't sort
  });


  const getHoliday = () => {
    const token = localStorage.getItem('token');
    if (isTokenExpired(token)) {
      handleLogout();
    }
    axiosWithAuth().get('http://localhost:5000/api/holidays')
      .then(async response => {
        const holidays = response.data;
        const prices = holidays.map(holiday => holiday.price || 0);
        setMinPrice(Math.min(...prices) || 0);
        setMaxPrice(Math.max(...prices) || 10000);
        setPriceRange([Math.min(...prices), Math.max(...prices)]);
        setHolidayData(response.data); // Update state with the fresh list of holidays
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };
  // Call getHoliday on component mount
  useEffect(() => {
    getHoliday();
  }, []);

  const addHoliday = async (newHoliday) => {
    try {

      const postData = Array.isArray(newHoliday) ? newHoliday : [newHoliday];
      console.log(postData)
      // console.log(postData.imageUrl)
      if (postData[0].imageUrl == "") {
        console.log("Here1")
        const imageUrl = await fetchCityImageFromPixabay(postData[0].city);
        postData[0].imageUrl = imageUrl;
      }
      console.log(postData[0].imageUrl)
      console.log("Here 3")
      const response = await axiosWithAuth().post('/api/holidays', postData);
      if (response.data) {
        // Assuming your API returns the newly added holiday, including any MongoDB-generated fields like _id
        setHolidayData([...holidayData, response.data]);
        getHoliday();
      }
    } catch (error) {
      console.error('Error adding new holiday:', error);
    }
  };

  const addDefaultHoliday = async () => {
    try {
      const response = await axiosWithAuth().post('/api/holidays', OriginalHolidayData);
      if (response.data) {
        // Assuming your API returns the newly added holiday, including any MongoDB-generated fields like _id
        setHolidayData([...holidayData, response.data]);
        getHoliday();
      }
    } catch (error) {
      console.error('Error adding new holiday:', error);
    }
  };


  const editHoliday = async (holidayId, updatedHoliday) => {
    try {
      const response = await axiosWithAuth().put(`/api/editHolidays/${holidayId}`, updatedHoliday);
      if (response.data) {
        // Assuming your API returns the updated holiday
        // Update the holidayData state with the updated holiday
        setHolidayData(holidayData.map(holiday => holiday._id === holidayId ? response.data : holiday));
        getHoliday(); // Refresh the holiday list if necessary
      }
    } catch (error) {
      console.error('Error updating holiday:', error);
    }
  };

  async function deleteAllHolidays() {
    try {
      const response = await axiosWithAuth().delete('/api/DeleteAllHolidays');
      getHoliday(); // Assuming this updates the UI with the current holidays
    } catch (error) {
      console.error('Error deleting holidays:', error);
      alert('Failed to delete holidays');
    }
  }

  async function deleteHoliday(id) { // Corrected to async function declaration
    try {
      const response = await axiosWithAuth().delete(`/api/holidays/${id}`);
      getHoliday();
    } catch (error) {
      console.error('Error deleting holiday:', error);
      alert('Failed to delete holiday');
    }
  }

  const handleCommentSubmit = async () => {
    if (!commentInput.trim()) return;
    const newComment = { commentText: commentInput };
    try {
      const response = await axiosWithAuth().post('/api/comments/' + currentHoliday._id, newComment);
      const userAgreed = window.confirm("Comment added successfully. Refresh the page to see the changes.");
      if (userAgreed) {
        window.location.reload();
      }
      getHoliday();
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment');
    }
  };

  const handleBookingSubmit = async (holiday, startDate, guests) => {
    const amount = Number(guests) * holiday.price;
    try {
      const startDateObj = new Date(startDate);
      // Validate startDate is a valid date
      if (isNaN(startDateObj.getTime())) {
        throw new Error('Invalid start date');
      }
      console.log(startDateObj)
      const endDate = new Date(startDateObj.getTime() + Number(holiday.duration[0]) * 86400000);
      // Check if endDate is valid
      if (isNaN(endDate.getTime())) {
        throw new Error('Calculated end date is invalid');
      }
      const response = await axiosWithAuth().post('/api/bookings/' + holiday._id, {
        startDate,
        endDate: endDate.toISOString().split('T')[0], // Format endDate to YYYY-MM-DD
        amount,
        guests
      });
      getHoliday();
      swal({
        title: "Booking Successful!",
        text: "Your booking has been confirmed! You will receive an email with all the details shortly.",
        icon: "success",
        button: "Awesome!",
        closeOnClickOutside: false,
      });
    } catch (error) {
      console.error('Error booking holiday:', error);
      alert('Failed to book holiday: ' + error.message);
    }
  };

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convert to seconds
      return decoded.exp < currentTime;
    } catch (error) {
      console.error("Error decoding token:", error);
      return true; // Assume expired or invalid token on error
    }
  };

  const handleLogout = () => {
    localStorage.setItem('userName', '');
    localStorage.setItem('token', '');
    localStorage.setItem('userId', '');
    navigate('/login');
  }

  const handleMyBookings = () => {
    navigate('/mybookings');
  }

  const handleMyProfile = () => {
    navigate('/profile');
  }

  // chatgpt

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: 'user',
      direction: 'outgoing'
    }
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setTyping(true);
    await (processMessageToChatGPT(newMessages))
  };

  async function processMessageToChatGPT(chatMessage) {
    let apiMessages = chatMessage.map((messageObject) => {
      let role = "";
      if (messageObject.sender == "ChatGPT") {
        role = "assistant"
      } else {
        role = "user"
      }
      return { role: role, content: messageObject.message }
    }
    );

    const systemMessage = {
      role: "system",
      content: "I am a travel agent and i always give my responses relating to tourist destinations. I respond by creating a json object with following fields. city, country, duration, description."
    }

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      // model: "Travel",
      messages: [
        systemMessage,
        ...apiMessages
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + OPENAI_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      console.log("CHATGPT", data);
      return data.json();
    }).then((data) => {
      console.log(data);
      setMessages(
        [...chatMessage, {
          message: data.choices[0].message.content,
          sender: "ChatGPT",
          direction: 'incoming'
        }]
      );
      setTyping(false);
    });
  }

  const chatGPTAddHoliday = (response) => {

    console.log(response);
    if (response.cities) {
      let holidaysToAdd = JSON.parse(response);
      addHoliday(holidaysToAdd.cities);
      return;
    }
    if (response.destinations) {
      let holidaysToAdd = JSON.parse(response);
      addHoliday(holidaysToAdd.destinations);
      return;
    }
    let holidaysToAdd = JSON.parse(response);
    if (Array.isArray(holidaysToAdd)) {
      const promises = holidaysToAdd.map(holiday => {
        return fetchCityImageFromPixabay(holiday.city).then(imageUrl => {
          holiday["imageUrl"] = imageUrl;
        });
      });

      // Wait for all promises to resolve
      Promise.all(promises).then(() => {
        holidaysToAdd.forEach(holiday => {
          addHoliday(holiday);
        });
      });
    }
    else {
      fetchCityImageFromPixabay(holidaysToAdd.city).then(imageUrl => {
        holidaysToAdd["imageUrl"] = imageUrl;
        console.log("Image", holidaysToAdd.imageUrl);

        addHoliday(holidaysToAdd);
      })
    }
  };

  async function fetchCityImageFromPixabay(city) {
    const apiKey = process.env.REACT_APP_PIXABAY_API_KEY; // Replace with your Pixabay API key
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(city)}&image_type=photo`;

    try {
      const response = await axios.get(url);
      if (response.data && response.data.hits && response.data.hits.length > 0) {
        // Return the URL of the first image in the results
        return response.data.hits[0].webformatURL;
      } else {
        return 'No image found'; // Or any default image URL
      }
    } catch (error) {
      console.error('Error fetching image from Pixabay:', error);
      return 'Error fetching image'; // Or any default image URL
    }
  }

  const addItinerary = async (event, holiday) => {
    event.preventDefault();
    const role = "user";
    const apiMessage = { role: role, content: `I'm planning a trip to ${holiday.city} for ${holiday.duration}.` };

    const systemMessage = {
      role: "system",
      content: "I create a json object of the itinerary containing an array of json objects each having day number and activities for that day as an array and add atleast 3 activities for that day. Dont add any other text."
    };

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, apiMessage]
    };

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + OPENAI_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiRequestBody)
      });

      if (!response.ok) {
        alert("Something went wrong. Please try again.");
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data); // For debugging

      // Assuming you want to store the response in a state or variable
      const chatGPTResponse = JSON.parse(data.choices[0].message.content);

      console.log("ChatGPT Response:", chatGPTResponse); // For example, log it to the console

      const itinerary = chatGPTResponse.itinerary;

      axiosWithAuth().put(`/api/itinerary/${holiday._id}`, { itinerary })
        .then(response => {
          console.log("Itinerary added successfully:", response.data);
          const userAgreed = window.confirm("Itinerary added successfully. Refresh the page to see the changes.");
          if (userAgreed) {
            window.location.reload();
          }
        })
        .catch(error => {
          console.error("Error adding itinerary:", error);
        });

      // Here you can set the response to a state or handle it as needed
    } catch (error) {
      console.error("Failed to fetch from OpenAI:", error);
    }
  };

  const deleteItinerary = async (event, holiday) => {
    event.preventDefault();
    axiosWithAuth().delete(`/api/itinerary/delete/${holiday._id}`)
      .then(response => {
        console.log("Itinerary deleted successfully:", response.data);
        const userAgreed = window.confirm("Itinerary deleted successfully. Refresh the page to see the changes.");
        if (userAgreed) {
          window.location.reload();
        }
      })
      .catch(error => {
        console.error("Error deleting itinerary:", error);
      });
  }

  return (
    <>
      <div className="gradientBackground" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', position: 'relative' }}>
        <div style={{ textAlign: 'center' }}>
          <Typography variant="h1" className="titleText" style={{ fontSize: '5rem', letterSpacing: '3px', fontWeight: '600', color: '#FFFFFF', textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>
            MakeYourTrip
          </Typography>
        </div>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 20px', marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
            <HolidayModal onAddHoliday={addHoliday} mode={'add'} />
            <Button style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }} onClick={addDefaultHoliday}>Add Default Holidays</Button>
          </div>
        </div>
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button style={{ backgroundColor: '#f44336', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }} onClick={deleteAllHolidays}>Delete All Holidays</button>
        </div>

        <Nav className="user-nav-dropdown" style={{ backgroundColor: '#e0e0e0', padding: '10px', borderRadius: '5px', position: 'absolute', top: '20px', right: '20px' }}>
          <NavDropdown
            title={<span style={{ color: '#333', fontWeight: 'bold' }}>{user.name}</span>}
            id="nav-dropdown-user" // Added for better accessibility
            style={{ color: '#333' }} // This will not directly affect the dropdown items
          >
            <NavDropdown.Item onClick={handleLogout} style={{ color: '#333' }}>Logout</NavDropdown.Item>
            <NavDropdown.Item onClick={handleMyBookings} style={{ color: '#333' }}>My Bookings</NavDropdown.Item>
            <NavDropdown.Item onClick={handleMyProfile} style={{ color: '#333' }}>My Profile</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </div>


      <Tabs value={selectedTab} onChange={handleChange} aria-label="holiday tags" centered>
        <Tab label="All" />
        {tags?.map((tag, index) => (
          <Tab label={tag} key={index} />
        ))}
      </Tabs>

      <Grid container spacing={3} justifyContent="center" style={{ padding: '20px' }}>
        <Grid item xs={12} sm={12} md={12} lg={4}>
          <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', paddingBottom: '20px' }}>
            <TextField
              label="Search by City or Country"
              variant="outlined"
              fullWidth
              style={{ marginRight: '20px' }}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <FormControlLabel
            control={
              <Checkbox
                checked={speacialDeal}
                onChange={(e) => setSpecialDeal(e.target.checked)}
                color="primary"
              />
            }
            label="Show Special Deals Only"
            style={{ marginRight: '20px' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', marginRight: '20px', paddingTop: '20px', justifyContent: 'center', paddingBottom: '20px' }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Sort Options</FormLabel>
              <RadioGroup
                row
                aria-label="sort-options"
                name="row-radio-buttons-group"
                value={sortBy}
                onChange={handlesort}
              >
                <FormControlLabel value="price" control={<Radio />} label="Sort by Price" />
                <FormControlLabel value="city" control={<Radio />} label="Sort by City" />
              </RadioGroup>
              <Button style={{ margin: '10px' }} variant="outlined" onClick={clearSort}>Clear Sort</Button>
            </FormControl>
            <FormControl component="fieldset" style={{ marginTop: '20px' }}>
              <FormLabel component="legend">Price Range</FormLabel>
              <Box display="flex" alignItems="center">
                <Typography id="min-value" gutterBottom>
                  {minPrice}
                </Typography>
                <Slider
                  value={priceRange}
                  onChange={handlePriceChange}
                  valueLabelDisplay="auto"
                  aria-labelledby="range-slider"
                  min={minPrice}
                  max={maxPrice} // Adjust max value based on your data
                  style={{ marginLeft: 16, marginRight: 16 }} // Add some spacing around the slider
                />
                <Typography id="max-value" gutterBottom>
                  {maxPrice}
                </Typography>
              </Box>
            </FormControl>
          </div>

          {/* <div className='GPT'>
        <div style={{ position: 'relative', height: '500px' }}>
          <MainContainer>
            <ChatContainer>
              <MessageList
                scrollBehavior='smooth' 
                typingIndicator={ typing ? <TypingIndicator content='ChatGPT is typing...' /> : null}
              >
                {messages.map((message, index) => {
                  return <Message key={index} model={message} />
                })}  
              </MessageList>
              <MessageInput placeholder='Type Message Here' onSend={handleSend} />
            </ChatContainer>
          </MainContainer>
        </div>
      </div> */}

          <ChatGPT onSave={chatGPTAddHoliday} />

        </Grid>
        {/* < Grid container padding={'20px'} item spacing={4} xs={12} sm={12} md={12} lg={8}>
        {sortedData?.map((holiday, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={4}>
          <Card className="cardHoverEffect" style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.3)' }}>
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
                ))
                            
            }
            </div>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Price: ${holiday.price} - {holiday.duration}
          </Typography>
        </CardContent>
        <div style={{ display: 'flex', justifyContent: 'space-evenly', padding: '10px', alignItems: 'center' }}>
        {
          holiday.booking && !holiday.booking.some(booking => booking.userId === user.id) ? 
          <Button style={{ margin: '10px' }} variant="outlined" onClick={() => handleBookingSubmit(holiday)}>Book </Button>
          : <p style={{ margin: '10px' }} >Booked</p>
        }
        
        <Button style={{ margin: '10px' }} variant="outlined" onClick={() => handleOpenDrawer(holiday)}>Details </Button>
        <HolidayModal onEditHoliday={editHoliday} mode={'edit'} holidayData={holiday} />
        <DeleteIcon onClick={() => deleteHoliday(holiday._id)} style={{ cursor: 'pointer', color: 'red' }} />
        </div>
        
          </Card>
          </Grid>
        ))}
      </Grid> */}
        <HolidayCardNEW sortedData={sortedData} user={user} handleBookingSubmit={handleBookingSubmit} handleOpenDrawer={handleOpenDrawer} editHoliday={editHoliday} deleteHoliday={deleteHoliday} />
      </Grid>


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
                src={currentHoliday.imageUrl || "https://img.freepik.com/premium-photo/coast-beach-day_157744-1217.jpg"}
                alt={`Image of ${currentHoliday.city}, ${currentHoliday.country}`}
                style={{ width: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.3)', marginBottom: '20px' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <Typography variant="body1" style={{ color: '#555' }}>Price: ${currentHoliday.price}</Typography>
                <Typography variant="body1" style={{ color: '#555' }}>Duration: {currentHoliday.duration}</Typography>
                <Typography variant="body1" style={{ color: '#555' }}>Rating: {currentHoliday.rating}</Typography>
                <Typography variant="body1" style={{ textAlign: 'center', color: '#555' }}>{currentHoliday.description}</Typography>
                <div style={{ maxWidth: '450px', margin: '20px auto', backgroundColor: '#F5F5F5', padding: '20px', borderRadius: '10px', boxShadow: '0 6px 10px rgba(0,0,0,0.25)' }}>
                  <Typography variant="h6" style={{ textAlign: 'center', color: '#333', marginBottom: '24px', textDecoration: 'underline', fontWeight: '500' }}>Itinerary</Typography>
                  {
                    currentHoliday.itinerary.length > 0 ?
                      <>
                        <ul style={{ listStyleType: 'circle', padding: '0 20px', margin: 0 }}>
                          {currentHoliday.itinerary.map((day, index) => (
                            <li key={index} style={{ marginBottom: '15px', paddingLeft: '10px' }}>
                              <Typography variant="body1" style={{ color: '#555', fontWeight: '400' }}>
                                Day {day.day}: {day.activities.join(', ')}
                              </Typography>
                            </li>
                          ))}
                        </ul>
                        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                          <Button variant='contained' onClick={(event) => deleteItinerary(event, currentHoliday)}>Delete Itinerary</Button>
                        </div>
                      </>
                      : <Button variant='contained' onClick={(event) => addItinerary(event, currentHoliday)}>Add Itinerary</Button>
                  }
                </div>
                <div style={{ marginTop: '20px', padding: '20px' }}>
                  <div style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 'bold', color: '#333' }}>Comments</div>
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    style={{ width: 'calc(100% - 20px)', padding: '15px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '16px' }}
                  />
                  <button
                    onClick={handleCommentSubmit}
                    style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      padding: '15px 25px',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '16px'
                    }}
                  >
                    Submit Comment
                  </button>
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
};
export default HolidayCard;