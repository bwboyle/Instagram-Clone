import app from "./app";
import DbConfig from "./configs/db.config";

const PORT = process.env.PORT || 3000;

/* Connect to MongoDB */
DbConfig.connect("dev")
  .then(() => {
    // Start the server
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Could not connect to MongoDB: ${err}`);
  });
