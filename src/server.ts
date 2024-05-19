import express  from "express";
import multer,{StorageEngine} from "multer";
import {uploadFile} from './controllers/csvController'
import path from "path";

const app=express();
const port =3001

// Set EJS as the view engine
app.set('view engine', 'ejs');
// Set the directory for the views
app.set('views', path.join(__dirname, 'views'));


//file upload
app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));
app.get('/',(req,res)=>{
 //res.send('Hello');
 res.render('index'); // Render the 'index' template
});



// Configure Multer for file storage
//ref https://medium.com/@aman003malhotra/using-multer-to-store-files-in-express-a-comprehensive-guide-d1acd25ef4d5
const storage: StorageEngine = multer.diskStorage({
  // Define the destination directory for uploaded files
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  // Define the filename for uploaded files
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

// Create a Multer instance with the defined storage configuration
const upload = multer({ storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  } });

 

app.post('/upload-file',upload.single('csvInput'), uploadFile);
/*app.post('/upload-files', upload.array('csv', 10), (req, res) => {
  // 'csv' is the field name, '10' is the max number of files
  const files = req.files;
  if (!files) {
    return res.status(400).send('No files were uploaded.');
  }
  res.status(200).send('Files have been uploaded successfully.');
});
*/

app.listen(port,()=>{
     console.log(`Server is running on http://localhost:${port}`);
})
