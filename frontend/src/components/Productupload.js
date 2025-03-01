import { useState } from "react"

const Productupload = ({ onUpload }) => {
    const [file, setFile] = useState(null)

    const handleFileChange = e => {
        setFile(e.target.files[0])
    }
    const handleUpload = async () => {
        if (!file) {
            alert("Please select a CSV file first")
            return
        }
        const formData = new FormData()
        formData.append("file", file)
        await onUpload(formData)

    }

    return (
        <div>
            <input type="file" accept=".csv" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload CSV</button>
        </div>
    )
}

export default Productupload