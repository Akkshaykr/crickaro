import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import axios from "axios";
import "./upload.css";
import headerImage from "./assets/header.webp";
import footerImage from "./assets/footer.webp";
import ballImage from "./assets/ball.webp";

const districtsOfTamilNadu = [
    "Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli", "Tirunelveli", "Erode",
    "Vellore", "Thoothukudi", "Dindigul", "Thanjavur", "Virudhunagar", "Karur", "Namakkal",
    "Kanchavur", "Krishnagiri", "Ramanathapuram", "Sivagangai", "Cuddalore", "Dharmapuri",
    "Kanyakumari", "Nagapattinam", "Nilgiris", "Perambalur", "Pudukkottai", "Tenkasi",
    "Tirupattur", "Tiruvarur", "Viluppuram", "Thiruvannamalai"
];

const Upload = () => {
    const [image, setImage] = useState(null);
    const [district, setDistrict] = useState("");
    const [tournamentBall, setTournamentBall] = useState("");
    const [teamName, setTeamName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => setImage(reader.result);
            reader.readAsDataURL(file);
        } else {
            alert("Please upload a valid image file.");
        }
    };

    const handleDeleteImage = () => {
        setImage(null);
    };

    const handleSave = async () => {
        if (image && district && tournamentBall && startDate && endDate && startTime && endTime && teamName) {
            if (new Date(endDate) < new Date(startDate)) {
                alert("End date must be after start date.");
                return;
            }

            try {
                const response = await axios.post(`${import.meta.env.VITE_SERVER_APP_URL}/save-tournament`, {
                    image,
                    district,
                    tournamentBall,
                    teamname: teamName,
                    startDate: new Date(startDate).toISOString(),
                    endDate: new Date(endDate).toISOString(),
                    startTime,
                    endTime,
                });
                alert(response.data.message);
                setDistrict("");
                setTeamName("");
                setTournamentBall("");
                setStartDate("");
                setEndDate("");
                setStartTime("");
                setEndTime("");
                setImage(null);
            } catch (error) {
                console.error("Error saving details:", error);
                alert(`Error saving details: ${error.response ? error.response.data.message : error.message}`);
            }
        } else {
            alert("Please fill in all the details before saving.");
        }
    };

    const goToBlog = () => {
        navigate("/blog");
    };

    return (
        <div>
            <header className="header">
                <img src={headerImage} alt="Header" className="header-image" />
                <h1 className="header-text">You can upload your tournament notice here!</h1>

            </header>


            <div className="container">
                <div className="upload-container">
                    <h2 className="header-text">Upload Notice</h2>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="file-input"
                    />
                    {image && (
                        <div>
                            <Zoom>
                                <img src={image} alt="Uploaded Preview" className="uploaded-image" />
                            </Zoom>
                            <button onClick={handleDeleteImage} className="delete-button">
                                Delete Image
                            </button>
                        </div>
                    )}
                    <input
                        type="text"
                        placeholder="Team Name"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="text-input"
                        required
                    />
                    <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="select-input"
                    >
                        <option value="">Select District</option>
                        {districtsOfTamilNadu.map((district) => (
                            <option key={district} value={district}>
                                {district}
                            </option>
                        ))}
                    </select>
                    <select
                        value={tournamentBall}
                        onChange={(e) => setTournamentBall(e.target.value)}
                        className="select-input"
                    >
                        <option value="">Select Tournament Ball</option>
                        <option value="Rubber Ball">Rubber Ball</option>
                        <option value="Tennis Ball">Tennis Ball</option>
                        <option value="Hard Tennis">Hard Tennis</option>
                        <option value="Stitch Ball">Stitch Ball</option>
                    </select>
                    <div className="input-group">
                        <label>Start Date:</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="date-input"
                            required
                        />
                        <label>Start Time:</label>
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="time-input"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>End Date:</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="date-input"
                            required
                        />
                        <label>End Time:</label>
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="time-input"
                            required
                        />
                    </div>
                    <button onClick={handleSave} className="save-button">Save</button>
                </div>
            </div>


            <footer className="footer">

                <button onClick={goToBlog} className="image-button footer-ball-button">
                    <img src={ballImage} alt="Ball Button" className="ball-button-image" />
                    <h1 className="header-text">Click the ball if you need to upload your memories</h1>
                </button>
            </footer>
        </div>
    );
};

export default Upload;
