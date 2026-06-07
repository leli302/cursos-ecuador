const multer = require('multer');
const path = require('path');
const { sanitizeFilename } = require('../utils/helpers');
const { MEDIA_TYPES, MAX_FILE_SIZE } = require('../utils/constants');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = path.join(process.env.STORAGE_PATH || './storage');

    if (file.fieldname === 'avatar') {
      uploadPath = path.join(uploadPath, 'avatars');
    } else if (file.fieldname === 'course_image') {
      uploadPath = path.join(uploadPath, 'cursos', 'imagenes');
    } else if (file.fieldname === 'category_image') {
      uploadPath = path.join(uploadPath, 'categorias');
    } else if (file.fieldname === 'video') {
      uploadPath = path.join(uploadPath, 'cursos', 'videos');
    } else if (file.fieldname === 'pdf') {
      uploadPath = path.join(uploadPath, 'cursos', 'pdfs');
    } else if (file.fieldname === 'resource') {
      uploadPath = path.join(uploadPath, 'cursos', 'recursos');
    } else {
      uploadPath = path.join(uploadPath, 'otros');
    }

    // Crear directorio si no existe
    const fs = require('fs');
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = sanitizeFilename(path.basename(file.originalname, ext));
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = {
    'avatar': ['image/jpeg', 'image/png', 'image/webp'],
    'course_image': ['image/jpeg', 'image/png', 'image/webp'],
    'category_image': ['image/jpeg', 'image/png', 'image/webp'],
    'video': ['video/mp4', 'video/webm', 'video/mpeg'],
    'pdf': ['application/pdf'],
    'resource': [
      'application/pdf',
      'image/jpeg', 'image/png', 'image/webp',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/zip',
      'application/x-rar-compressed'
    ]
  };

  const allowed = allowedMimes[file.fieldname] || allowedMimes['resource'];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE
  }
});

module.exports = upload;
