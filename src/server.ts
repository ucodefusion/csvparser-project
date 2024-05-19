import express  from "express";
import path from "path";

const app=express();
const port =3001

app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));
app.get('/',(req,res)=>{
 res.send('Hello');
});

app.post('upload-file',(req,res)=>{
    res.send('File Upload');
});

app.listen(port,()=>{
     console.log(`Server is running on http://localhost:${port}`);
})
