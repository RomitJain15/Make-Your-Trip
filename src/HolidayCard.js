
import React, { useRef } from 'react';
import { Grid, Card, CardContent, Typography, Chip, Button } from '@mui/material';
import { Bookmark } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import HolidayModal from './HolidayModal';
import BookingModal from './BookingModal';
import Tooltip from '@mui/material/Tooltip';
import DownloadPDF from './Misc/Download';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FaDownload } from 'react-icons/fa';

const HolidayCardNEW = ({ sortedData, user, handleBookingSubmit, handleOpenDrawer, editHoliday, deleteHoliday }) => {

  const downloadPdf = (element) => {
    console.log(element)
    const element_new = document.getElementById('Manojcard');

    html2canvas(element_new).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
      });
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save('holiday-card.pdf');
    });
  };

  return (
    < Grid container padding={'20px'} item spacing={4} xs={12} sm={12} md={12} lg={8}>
      {sortedData?.map((holiday, index) => (
        <Grid item key={index} xs={12} sm={6} md={4} lg={4}>
          <Card id="Manojcard" className="cardHoverEffect" style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '25rem', boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.3)' }}>
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
                  {holiday.deal && (

                    <Tooltip title={holiday.dealDetails}
                      componentsProps={{
                        tooltip: {
                          sx: {
                            fontSize: '1rem', // Set your desired font size here
                            backgroundColor: '#e3e3e3', // Keeping the background color as white
                            color: 'black'
                          }
                        }
                      }}
                    >
                      <span style={{ cursor: 'pointer' }}>
                        <Chip label="Special Deal" color="primary" />
                      </span>
                    </Tooltip>)}
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
            <div style={{ display: 'flex', justifyContent: 'space-evenly', padding: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              {
                holiday.booking && !holiday.booking.some(booking => booking.userId === user.id) ?
                  <BookingModal holiday={holiday} handleBookingSubmit={handleBookingSubmit} />
                  : <p style={{ margin: '10px' }} >Booked</p>
              }

              <Button style={{ margin: '10px' }} variant="outlined" onClick={() => handleOpenDrawer(holiday)}>Details </Button>
              <HolidayModal onEditHoliday={editHoliday} mode={'edit'} holidayData={holiday} />
              <DeleteIcon onClick={() => deleteHoliday(holiday._id)} style={{ cursor: 'pointer', color: 'red', margin: '10px' }} />
              <button onClick={(e) => downloadPdf(e.currentTarget.closest('.cardHoverEffect'))} style={{ margin: '10px' }}>
                <FaDownload />
              </button>
              {/* <DownloadPDF  holiday ={holiday}/> */}
            </div>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

}
export default HolidayCardNEW;