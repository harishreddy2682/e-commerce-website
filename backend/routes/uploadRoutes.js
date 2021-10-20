import express from 'express'
import path from 'path'
const router = express.Router()

const __dirname = path.resolve()

router.post('/', (req, res) => {
    if(req.files && req.files.file.mimetype.split('/')==='image'){
        const file = req.files.file
        const filename = `${Date.now()}-${file.name}`
        file.mv(`${__dirname}/uploads/${filename}`, (err) => {
            if(!err){
                res.send(`/uploads/${filename}`)
            } 
        })
    } else {
        res.send('Only image can be uploaded')
    }
})

export default router