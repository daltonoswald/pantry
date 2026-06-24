import { useState } from 'react';
import { Form, Button, Image, Spinner } from 'react-bootstrap';

export default function ImageUpload({ onUpload }) {
    const [preview, setPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const token = localStorage.getItem('pantryAuthToken');

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        console.log('HFC', file)
        if (!file) return;

        // Show local preview immediately
        setPreview(URL.createObjectURL(file));
        setIsUploading(true);

        const formData = new FormData();
        formData.append('image', file);
        console.log(Object.fromEntries(formData));

        try {
            console.log('trying')
            const url = `http://localhost:3000/recipe/upload-image`
            const response = await fetch(`http://localhost:3000/recipe/upload-image`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error(`Sever error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            if (response.ok) {
                console.log(data);
                onUpload(data.imageUrl);
            } else {
                console.error('Upload failed:', data.error);
            }
        } catch (error) {
            console.error('Error uploading image:', error)
            console.log(error)
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Form.Group className='mb-3'>
            <Form.Label>Recipe Image</Form.Label>
            <Form.Control
                type='file'
                accept='image/jpeg, image/png, image/webp'
                onChange={handleFileChange}
            />
            {isUploading && <Spinner animation='border' size='sm' className='mt-2' />}
            {preview && !isUploading && (
                <Image 
                    src={preview}
                    alt='Recipe preview'
                    className='mt-2'
                    style={{ maxHeight: '200px', objectFit: 'cover' }}
                    thumbnail
                />
            )}
        </Form.Group>
    )
}