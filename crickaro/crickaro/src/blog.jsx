import React, { useEffect, useState } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import axios from "axios";
import "./Blog.css"; // Ensure proper styles are defined

const Blog = () => {
    const [blogImages, setBlogImages] = useState([]); // Start with an empty array for images
    const [blogText, setBlogText] = useState('');
    const [teamName, setTeamName] = useState('');
    const [district, setDistrict] = useState('');

    useEffect(() => {
        // You can fetch existing blogs if you want to display them elsewhere, otherwise remove this
    }, []);

    // Convert image file to Base64
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleBlogImageChange = async (e) => {
        const files = Array.from(e.target.files);
        const updatedBlogImages = [];

        for (const file of files) {
            const base64Image = await fileToBase64(file); // Convert each image to Base64
            updatedBlogImages.push({ src: base64Image }); // Add a new entry for each image
        }

        setBlogImages(prevImages => [...prevImages, ...updatedBlogImages]);
    };

    const handleDeleteBlogImage = (index) => {
        const updatedBlogImages = blogImages.filter((_, i) => i !== index);
        setBlogImages(updatedBlogImages);
    };
    const handleSaveBlog = async () => {
        if (blogText && district && teamName && blogImages.length > 0) {
            try {
                const response = await axios.post(`${import.meta.env.VITE_SERVER_APP_URL}/api/save-blog`, {
                    images: blogImages.map(image => image.src),
                    text: blogText,
                    district,
                    teamName
                });
                alert(response.data.message);

                // Clear the form after saving
                setBlogImages([]);
                setBlogText('');
                setTeamName('');
                setDistrict('');
            } catch (error) {
                console.error("Error saving blog:", error);
                alert(`Error saving blog: ${error.response ? error.response.data.message : error.message}`);
            }
        } else {
            alert('Please fill in the text, image, district, and team name before saving.');
        }
    };


    const districts = [
        "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri",
        "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur",
        "Krishnagiri", "Madurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur",
        "Pudukkottai", "Ramanathapuram", "Salem", "Sivaganga", "Tenkasi",
        "Tiruchirappalli", "Tirunelveli", "Tiruppur", "Vellore", "Virudhunagar",
    ];

    return (
        <div className="blog-page">
            <h2 className="header-text">Blog Section</h2>
            <input
                type="file"
                accept="image/*"
                multiple // Allow multiple file selection
                onChange={handleBlogImageChange}
                className="file-input"
            />
            {blogImages.map((blogImage, index) => (
                <div key={index} className="blog-image-container">
                    {blogImage.src && (
                        <Zoom>
                            <img src={blogImage.src} alt="Blog" className="blog-image" />
                        </Zoom>
                    )}
                    <button onClick={() => handleDeleteBlogImage(index)} className="delete-button">
                        Delete
                    </button>
                </div>
            ))}
            <textarea
                placeholder="Add your blog text here"
                value={blogText} // Use state for blog text
                onChange={(e) => setBlogText(e.target.value)}
                className="blog-textarea"
            />
            <input
                placeholder="Team Name"
                value={teamName} // Use state for team name
                onChange={(e) => setTeamName(e.target.value)}
                className="team-name-input"
            />
            <select
                value={district} // Use state for district
                onChange={(e) => setDistrict(e.target.value)}
                className="select-input"
            >
                <option value="" disabled>Select District</option>
                {districts.map((district) => (
                    <option key={district} value={district}>
                        {district}
                    </option>
                ))}
            </select>
            <button onClick={handleSaveBlog} className="save-button">
                Save Blog
            </button>
        </div>
    );
};

export default Blog;
