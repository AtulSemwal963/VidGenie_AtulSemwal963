# VidGenie - Video Conversion Application

A full-stack web application for converting video files between different formats (MP4, AVI, MOV), extracting metadata, and generating thumbnails. Built with Next.js frontend and Node.js/Express backend.

## 🚀 Features

- **Video Format Conversion**: Convert between MP4, AVI, and MOV formats
- **Metadata Extraction**: Extract detailed video information (duration, resolution, codec, etc.)
- **Thumbnail Generation**: Generate multiple thumbnails from video files
- **Real-time Progress Tracking**: Live upload and conversion progress indicators
- **Modern UI**: Responsive design with dark theme and intuitive user experience
- **File Management**: Automatic file cleanup and organized output storage

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **JavaScript (ES6+)** - Modern JavaScript features

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **FFmpeg** - Video processing library (via fluent-ffmpeg)
- **Multer** - File upload middleware
- **CORS** - Cross-origin resource sharing
- **UUID** - Unique identifier generation

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **FFmpeg** - Required for video processing
- **npm** or **yarn** package manager

### Installing FFmpeg

#### Windows
1. Download FFmpeg from [https://ffmpeg.org/download.html](https://ffmpeg.org/download.html)
2. Extract to a folder (e.g., `C:\ffmpeg`)
3. Add `C:\ffmpeg\bin` to your system PATH
4. Verify installation: `ffmpeg -version`

#### macOS
```bash
brew install ffmpeg
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install ffmpeg
```

## 🚀 Setup and Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Callus_Assignment
```

### 2. Backend Setup
```bash
cd vidgenie_backend
npm install
```

### 3. Frontend Setup
```bash
cd ../vidgenie
npm install
```

### 4. Create Required Directories
```bash
# In vidgenie_backend directory
mkdir uploads
mkdir output
```

## 🏃‍♂️ Running the Application

### 1. Start the Backend Server
```bash
cd vidgenie_backend
node index.js
```
The backend will start on `http://localhost:4000`

### 2. Start the Frontend Development Server
```bash
cd vidgenie
npm run dev
```
The frontend will start on `http://localhost:3000`

### 3. Access the Application
Open your browser and navigate to `http://localhost:3000`

## 📁 Project Structure

```
Callus_Assignment/
├── vidgenie/                 # Frontend (Next.js)
│   ├── src/
│   │   └── app/
│   │       ├── page.js       # Main application page
│   │       ├── layout.js     # Root layout
│   │       └── globals.css   # Global styles
│   ├── public/               # Static assets
│   └── package.json
├── vidgenie_backend/         # Backend (Node.js/Express)
│   ├── routes/
│   │   ├── conversion.js     # Video conversion endpoints
│   │   ├── metadata.js       # Metadata extraction endpoints
│   │   └── thumbnail.js      # Thumbnail generation endpoints
│   ├── uploads/              # Temporary file storage
│   ├── output/               # Processed files storage
│   ├── index.js              # Main server file
│   └── package.json
└── README.md
```

## 🔧 Technical Implementation

### Frontend Architecture

**Component Structure:**
- Single-page application with multiple functional sections
- State management using React hooks (useState, useRef)
- File upload with drag-and-drop interface
- Real-time progress tracking with XMLHttpRequest and EventSource

**Key Features:**
- Responsive design with Tailwind CSS
- File format validation and size limits (100MB)
- Progress indicators for upload and conversion
- Error handling and user feedback
- Download functionality for converted files and thumbnails

### Backend Architecture

**API Endpoints:**
- `POST /api/convert` - Video format conversion
- `POST /api/metadata` - Extract video metadata
- `POST /api/thumbnail` - Generate video thumbnails
- `GET /api/convert/progress/:id` - Real-time conversion progress (SSE)

**File Processing:**
- Multer middleware for file uploads with size limits
- FFmpeg integration for video processing
- Temporary file management in `uploads/` directory
- Permanent storage in `output/` directory

**Progress Tracking:**
- Server-Sent Events (SSE) for real-time progress updates
- In-memory progress storage with UUID-based tracking
- Automatic cleanup of progress data

### Security Considerations

- File size limits (100MB) to prevent abuse
- File type validation through MIME types
- Temporary file cleanup after processing
- CORS configuration for cross-origin requests

## 🎯 Technical Decisions

### 1. **FFmpeg Integration**
- **Choice**: Used `fluent-ffmpeg` wrapper for Node.js
- **Reasoning**: Provides a clean API for FFmpeg operations, handles cross-platform compatibility, and offers event-driven progress tracking

### 2. **Real-time Progress Updates**
- **Choice**: Server-Sent Events (SSE) over WebSockets
- **Reasoning**: SSE is simpler for one-way communication, doesn't require connection management, and works well with HTTP infrastructure

### 3. **File Management Strategy**
- **Choice**: Separate `uploads/` and `output/` directories
- **Reasoning**: Clear separation of temporary and permanent files, easier cleanup, and better organization

### 4. **Frontend State Management**
- **Choice**: React hooks instead of external state management
- **Reasoning**: Sufficient for this application's complexity, reduces dependencies, and provides good performance

### 5. **Error Handling**
- **Choice**: Comprehensive error handling at both frontend and backend
- **Reasoning**: Better user experience, easier debugging, and graceful failure recovery

## 🚧 Challenges Encountered

### 1. **FFmpeg Installation and Configuration**
- **Challenge**: Ensuring FFmpeg is properly installed and accessible across different operating systems
- **Solution**: Provided detailed installation instructions and verified PATH configuration

### 2. **File Upload Progress Tracking**
- **Challenge**: Implementing accurate upload progress with XMLHttpRequest
- **Solution**: Used `xhr.upload.onprogress` event for real-time upload tracking

### 3. **Cross-Origin Resource Sharing (CORS)**
- **Challenge**: Handling file downloads from different origins
- **Solution**: Configured CORS middleware and used proper headers for file downloads

### 4. **Memory Management**
- **Challenge**: Preventing memory leaks with large file processing
- **Solution**: Implemented proper file cleanup and progress data management

### 5. **Progress Tracking Accuracy**
- **Challenge**: FFmpeg progress events don't always provide accurate percentages
- **Solution**: Used indeterminate progress bars when exact progress isn't available

## 🔮 Future Improvements

### 1. **Performance Enhancements**
- Implement video compression options
- Add batch processing capabilities
- Optimize file handling for large videos

### 2. **User Experience**
- Add drag-and-drop file upload
- Implement file preview before conversion
- Add conversion presets (quality, size, etc.)

### 3. **Security & Reliability**
- Add user authentication and file quotas
- Implement file virus scanning
- Add automatic backup and recovery

### 4. **Scalability**
- Implement queue system for multiple conversions
- Add cloud storage integration
- Implement microservices architecture

### 5. **Additional Features**
- Support for more video formats (WebM, MKV, etc.)
- Audio extraction and conversion
- Video editing capabilities (trim, crop, etc.)
- Integration with cloud storage services

## 🐛 Troubleshooting

### Common Issues

1. **FFmpeg not found**
   - Ensure FFmpeg is installed and added to PATH
   - Restart terminal/command prompt after installation

2. **Port already in use**
   - Change port in backend `index.js` (line 23)
   - Update frontend API calls accordingly

3. **File upload fails**
   - Check file size (max 100MB)
   - Verify file format is supported
   - Ensure uploads directory exists

4. **Conversion fails**
   - Check FFmpeg installation
   - Verify input file is not corrupted
   - Check available disk space

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Note**: This application is designed for educational and development purposes. For production use, consider implementing additional security measures, error handling, and scalability features. 