import Joi from 'joi';
import envFilePath from './env-file-path';

const JoiObject = Joi.object({
  // CLI
  NODE_ENV: Joi.string().valid('dev', 'prod').required(),
  PORT: Joi.string().min(4).max(4).required(),
  // AWS RDS
  AWS_RDS_HOST: Joi.string().required(),
  AWS_RDS_USERNAME: Joi.string().required(),
  AWS_RDS_SECRET: Joi.string().required(),
  AWS_RDS_DB_NAME: Joi.string().required(),
  // JWT
  JWT_SECRET: Joi.string().required(),
});

const configOptions = {
  envFilePath,
  isGlobal: true,
  validationSchema: JoiObject,
};

export default configOptions;
