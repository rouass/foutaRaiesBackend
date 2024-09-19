const mongoose = require('mongoose');
const Fouta = require('./models/Fouta');

const mongoURI = 'mongodb+srv://rouasoussou:9iMbwrwGAiMaYuPs@fouta.hr6pd.mongodb.net/'; // replace with your MongoDB URI

async function insertFoutas() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Create and insert Foutas
    const foutasData = [
    
      {
        name: "Foula",
        description: "Striped waffle-textured fouta.",
        title: "Foula Fouta",
        ref: "FOU-BANDEB-001",
        dimension: "100x200 cm",
        colors: [
          { name: "Yellow", images: ["../../assets/3I3A2719.JPG"] },
          { name: "Green", images: ["../../assets/3I3A2768.JPG"] }
        ],
        image: "../../assets/3I3A2620.JPG",
        // subcategoryId: "66db5eb037135aa72b5213c6", 
      }
    ];

    for (const foutaData of foutasData) {
      const fouta = new Fouta(foutaData);
      await fouta.save();
    }

    console.log('Foutas inserted successfully');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error inserting foutas:', error);
    mongoose.disconnect();
  }
}

insertFoutas();
