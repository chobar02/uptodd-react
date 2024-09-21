import { useState } from 'react'

import './App.css'

function App() {
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const handleFileValidation = (file) => {
    const validExtensions = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (!validExtensions.includes(file.type)) {
      return 'Invalid file type. Only PDF, DOC, and DOCX are allowed.'
    }
    if (file.size > maxSize) {
      return 'File size exceeds the limit of 2MB.'
    }
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const file = e.target.resume.files[0]
    const fileValidationMessage = handleFileValidation(file)

    if (fileValidationMessage) {
      setErrorMessage(fileValidationMessage)
      setSuccessMessage("")
      return
    }

    const formData = new FormData(e.target) // Collect the form data

    try {
      console.log("Sending request to server...")
      const response = await fetch("http://localhost:3000", {
        method: "POST",
        body: formData,
      })

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorResult = await response.json()
        console.error("Error response:", errorResult)
        throw new Error(errorResult.message || "Network response was not ok.")
      }

      const result = await response.json()
      console.log("Response data:", result);

      // Check if the response is successful
      if (response.ok) {
        setSuccessMessage(result.message || "Application submitted successfully!")
        setErrorMessage("")
      } else {
        setErrorMessage(result.message || "Failed to submit the application. Please try again.")
        setSuccessMessage("")
      }
    } catch (error) {
      setErrorMessage("An error occurred while submitting your application. Please try again.")
      setSuccessMessage("")
      console.error("Error:", error);
    }
  }

  return (
    <div>
      <h2>Submit Your Job Application</h2>
      <form id="jobApplicationForm" onSubmit={handleSubmit} encType="multipart/form-data">
        <label htmlFor="fullname">Full Name:</label>
        <input type="text" id="fullname" name="fullname" required />
        <br /><br />

        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required />
        <br /><br />

        <label htmlFor="phone">Phone:</label>
        <input type="text" id="phone" name="phone" required />
        <br /><br />

        <label htmlFor="gender">Gender:</label>
        <select id="gender" name="gender" required>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <br /><br />

        <label htmlFor="jobrole">Job Role:</label>
        <select id="jobrole" name="jobrole" required>
          <option value="test">Test</option>
          <option value="dev">Dev</option>
          <option value="other">Other</option>
        </select>
        <br /><br />

        <label htmlFor="resume">Upload Resume (PDF/DOC/DOCX):</label>
        <input
          type="file"
          id="resume"
          name="resume"
          accept=".pdf, .doc, .docx"
          required
        />
        <br /><br />

        <button type="submit">Submit Application</button>
      </form>

      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  )
}

export default App
