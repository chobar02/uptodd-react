import express from "express"
import cors from "cors"
import path from "path"
import fs from "fs"
import { upload } from "./middlewares/multer.js"
import { sendEmail } from "./utils/sendEmail.js"

const app = express()

// Enable CORS to allow requests from the frontend
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve the HTML form (if needed)
app.get("/upload", (req, res) => {
  res.sendFile(path.join(__dirname, "App.jsx")) // Adjust the path to your actual HTML file
})

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
      Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
  }
}



// POST endpoint for file upload and form data
app.post("/upload", upload.single("resume"), async (req, res) => {
    try {
        const { fullname, email, phone, gender, jobrole } = req.body
        const resume = req.file
        if(!fullname || !email || !phone || !gender || !jobrole || !resume) {
            return res.status(400).json({
                success : false, message : "All fields are required"
            })
        }

        const mail = await sendEmail(fullname, email, phone, gender, jobrole, resume)

        fs.unlinkSync(`uploads/${resume.filename}`)

        if(!mail) return res.status(400).json({success : false, message : "could not send the mail"})

        return res.status(200).json({success : true, message : "Application submitted successfully!"})
    } catch (error) {
        return res.status(500).json({success : false, message : "An unexpected error occurred on the server."})
    }
})
  


app.post("/test", async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 5000))
  return res
    .status(200)
    .json({ success: true, message: "Application submitted successfully!" })
})

// Start the server
const port = 5173
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
