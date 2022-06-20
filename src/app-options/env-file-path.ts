let envFilePath = null;

switch (process.env.NODE_ENV) {
  case 'prod':
    envFilePath = '.prod.env';
  case 'dev':
  default:
    envFilePath = '.dev.env';
}

export default envFilePath;
