import multer from 'multer';

// Use memory storage so we can stream files directly to Cloudinary
const storage = multer.memoryStorage();

// File validation to only accept image types
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit files to 5MB
  },
});

export default upload;
