const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
    teamname: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true,
    },
    tournamentBall: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Upload', uploadSchema);
