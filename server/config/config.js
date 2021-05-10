// =============
// PUERTO
// =============

process.env.PORT = process.env.PORT || 3000;

// =============
// ENTORNO
// =============
process.env.NODE.ENV = process.env.NODE_ENV || 'dev';

// =============
// DATABASE
// =============

let urlDB;
if (process.env.NODE_ENV === 'dev'){
  urlDB = 'mongodb://localhost:27017/cafe';
}
else {
  urlDB = 'mongodb+srv://soyAdmin:9knBAmmZjAOVqqea@cluster0.93ndy.mongodb.net/cafe';
}

process.env.URLDB = urlDB;
