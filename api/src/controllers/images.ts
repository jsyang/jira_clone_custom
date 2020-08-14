import multer from 'multer';
import { catchErrors } from '../errors';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    // Store in client path so it can be served from there rather than api
    cb(null, '../client/files/images');
  },
  filename: (_req, file, cb) => {
    const { originalname } = file;
    const extension = originalname.split('.').pop();
    cb(null, `${file.fieldname}-${Date.now()}-${Math.floor(Math.random() * 1e3)}.${extension}`);
  },
});
const upload = multer({ storage });

export const uploadSingleImage = upload.single('image');

export const create = catchErrors((req, res) => {
  // Bounce the image filename back to the Quill image uploader
  // The image is served by the client server, not the API server
  res.json(`/images/${req.file.filename}`);
});
