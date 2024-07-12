import React, { useState, useEffect } from 'react';
import { TextField, Checkbox, Rating, Button, FormControlLabel, FormGroup } from '@mui/material';

function AddHolidayForm({ initialData, onSubmit }) {
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [price, setPrice] = useState('');
    const [deal, setDeal] = useState(false);
    const [rating, setRating] = useState(0);
    const [duration, setDuration] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [dealDetails, setDealDetails] = useState('');

    // Initialize form with initialData if present
    useEffect(() => {
        if (Object.keys(initialData).length !== 0) {
            console.log("here")
            setCity(initialData.city || '');
            setCountry(initialData.country || '');
            setPrice(initialData.price ? initialData.price.toString() : ''); // Ensure price is a string for the TextField
            setDeal(initialData.deal || false);
            setDealDetails(initialData.dealDetails || '');
            setRating(initialData.rating || 0);
            setDuration(initialData.duration || '');
            setImageUrl(initialData.imageUrl || '');
            setDescription(initialData.description || '');
            setTags(initialData.tags ? initialData.tags.join(', ') : ''); // Convert tags array back to string
        }
    }, [initialData]);

    console.log(initialData)

    const handleSubmit = (e) => {
        e.preventDefault();
        const newRecord = {
            city,
            country,
            price: Number(price),
            deal,
            dealDetails,
            rating,
            duration,
            imageUrl,
            description,
            tags: tags.split(',').map(tag => tag.trim()), // Assuming tags are entered as comma-separated values
        };
        onSubmit(newRecord); // Pass the new record up to the parent component for processing
        // Optionally reset form here if needed
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField label="City" value={city} onChange={(e) => setCity(e.target.value)} fullWidth margin="normal" required={true} />
            <TextField label="Country" value={country} onChange={(e) => setCountry(e.target.value)} fullWidth margin="normal" required={true} />
            <TextField label="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} fullWidth margin="normal" required={true} />
            <FormGroup>
                <FormControlLabel control={<Checkbox checked={deal} onChange={(e) => setDeal(e.target.checked)} />} label="Special Deal" />
                {
                    deal && <TextField label="Deal Details" value={dealDetails} onChange={(e) => setDealDetails(e.target.value)} fullWidth margin="normal" />
                }
            </FormGroup>
            <Rating name="rating" value={rating} onChange={(event, newValue) => setRating(newValue)} />
            <TextField label="Duration" value={duration} onChange={(e) => setDuration(e.target.value)} required={true} fullWidth margin="normal" />
            <TextField label="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} fullWidth margin="normal" />
            <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth margin="normal" />
            <TextField label="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} fullWidth margin="normal" />
            <Button type="submit" variant="contained" color="primary">{Object.keys(initialData).length !== 0 ? 'Update Record' : 'Add Record'}</Button>
        </form>
    );
}

export default AddHolidayForm;