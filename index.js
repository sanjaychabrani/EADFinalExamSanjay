const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.set('view engine', 'ejs')
const path = require('path')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()+file.originalname}`)
    }
  })
  
const upload = multer({ storage: storage })

const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/ead').then(()=>{
    console.log("DB Connected")
}).catch((err)=>{
    console.log("DB connect ",err)
})

const Students = require('./models/Students')

app.get('/', (req, res)=>{
    res.render('home')
})
app.get('/addStudent', (req, res)=>{
    res.render('addStudent')
})
app.get('/uploads/:_filename', (req, res)=>{
    res.sendFile(path.join(__dirname, 'uploads', req.params._filename))
    //res.end()
})
app.post('/saveStudent', upload.single('image'),async (req, res)=>{
    const student = await Students.create({...req.body, image:req.file.filename})
    if(!student){
        return res.redirect('/addStudents')
    }
    res.redirect('/students')
})
app.get('/students', async (req, res)=>{
    const students = await Students.find();
    console.log(students)
    res.render('students', {students})
})
app.get('/updateStudent/:_id',async (req, res)=>{
    const student = await Students.findById(req.params._id)
    res.render('update',student)
})
app.post('/updateStudent/:_id',upload.single('image'), async (req, res)=>{
    if(!req.file){
        await Students.updateOne({_id:req.params._id}, {$set:{...req.body}})
    }
    else await Students.updateOne({_id:req.params._id}, {$set:{...req.body, image:req.file.filename}})
    
    res.redirect('/students')
})
app.get('/deleteStudent/:_id', async (req, res)=>{
    await Students.deleteOne({_id:req.params._id})
    res.redirect('/students')
})
app.listen(4000, ()=>console.log("Listening on port 4000"))