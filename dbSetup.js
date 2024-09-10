const mongoose = require('mongoose');
const Fouta = require('./models/Fouta');

mongoose
  .connect("mongodb+srv://rouasoussou:9iMbwrwGAiMaYuPs@fouta.hr6pd.mongodb.net/",
  { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connected to database!");
   })

  .catch((err) => {
    console.error("Connection failed:", err);
  });

async function updateDatabase() {
  try {
    // Find all Fouta documents
    const foutas = await Fouta.find();

    for (const fouta of foutas) {
      // 1. Remove the 'colors' field
      if (fouta.colors) {
        fouta.colors = undefined;
      }

      // 2. Convert 'dimension' string to an array 'dimensions'
      if (typeof fouta.dimension === 'string') {
        fouta.dimensions = [fouta.dimension]; // Convert to array
        fouta.dimension = undefined; // Remove old 'dimension' field
      }

      // 3. Move 'image' to 'images' array
      if (fouta.image) {
        fouta.images = fouta.images || [];
        fouta.images.push(fouta.image); // Add existing image to images array
        fouta.image = undefined; // Remove old 'image' field
      }

      // Save the updated document
      await fouta.save();
    }

    console.log('Database update complete.');
  } catch (error) {
    console.error('Error updating database:', error);
  } finally {
    mongoose.connection.close();
  }
}

updateDatabase();