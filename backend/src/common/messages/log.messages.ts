export enum MessageLog {
  INVALID_TOKEN = 'Invalid token',
  TOKEN_EXPIRED = 'Token expired',
  HTTP_CONFIG_NOT_FOUND = 'Http configuration infomation not found',
  DB_CONFIG_NOT_FOUND = 'Database configuration information not found',
  JWT_KEY_NOT_FOUND = 'JWT key not found',
  EXPIRE_TIME_NOT_FOUND = 'Expire time not found',

  /**
   * @description configuration information for https server
   */
  HOST_MUST_BE_STRING = 'Host must be string',
  PORT_MUST_BE_NUMBER = 'Port must be number',
  HOST_IS_REQUIRED = 'Host is required',

  PORT_IS_REQUIRED = 'Port is required',
  HOST_CANNT_BE_EMPTY = 'Host can not be empty',
  PORT_CANNT_BE_EMPTY = 'Port can not be empty',

  JWT_KEY_MUST_BE_STRING = 'JWT key must be string',
  JWT_KEY_IS_REQUIRED = 'JWT key is required',
  JWT_KEY_CANNT_BE_EMPTY = 'JWT key can not be empty',

  EXPIRE_TIME_MUST_BE_NUMBER_OR_STRING = 'Expire time must be number or string',
  EXPIRE_TIME_IS_REQUIRED = 'Expire time is required',
  EXPIRE_TIME_CANNT_BE_EMPTY = 'Expire time can not be empty',

  /**
   * @description configuration information for database
   */
  DATABASE_MUST_BE_STRING = 'Database must be string',
  DATABASE_IS_REQUIRED = 'Database is required',
  DATABASE_CANNT_BE_EMPTY = 'Database can not be empty',

  DIALECT_MUST_BE_STRING = 'Dialect must be string',
  DIALECT_IS_REQUIRED = 'Dialect is required',
  DIALECT_CANNT_BE_EMPTY = 'Dialect can not be empty',

  USERNAME_MUST_BE_STRING = 'Username must be string',
  USERNAME_IS_REQUIRED = 'Username is required',
  USERNAME_CANNT_BE_EMPTY = 'Username can not be empty',

  PASSWORD_MUST_BE_STRING = 'Password must be string',
  PASSWORD_IS_REQUIRED = 'Password is required',
  PASSWORD_CANNT_BE_EMPTY = 'Password can not be empty',

  /**
   * @description for cloudinary configuration information to check with joi message
   */
  CLOUDINARY_NAME_MUST_BE_A_STRING = 'Cloudinary name must be a string',
  CLOUDINARY_NAME_IS_REQUIRED = 'Cloudinary name is required',
  CLOUDINARY_NAME_CANNOT_BE_EMPTY = 'Cloudinary name cannot be empty',

  CLOUDINARY_API_KEY_MUST_BE_A_STRING = 'Cloudinary API key must be a string',
  CLOUDINARY_API_KEY_IS_REQUIRED = 'Cloudinary API key is required',
  CLOUDINARY_API_KEY_CANNOT_BE_EMPTY = 'Cloudinary API key cannot be empty',

  CLOUDINARY_API_SECRET_MUST_BE_A_STRING = 'Cloudinary API secret must be a string',
  CLOUDINARY_API_SECRET_IS_REQUIRED = 'Cloudinary API secret is required',
  CLOUDINARY_API_SECRET_CANNOT_BE_EMPTY = 'Cloudinary API secret cannot be empty',

  /**
   * @description = throw error for get infor from cloudinary
   */
  NO_RESULT_FROM_CLOUDINARY = 'No result fromt cloudinary',
  CLOUINARY_NAME_NOT_FOUND = 'cloudinary name was not found',
  CLOUINARY_API_KEY_NOT_FOUND = 'cloudinary api key was not found',

  /**
   * @description = throw error for get infor from gmail, and app password
   */
  EMAIL_IS_NOT_FOUND = 'Email go with app password is not found',
  APP_PASSWORD_IS_NOT_FOUND = 'App password is not found',

  /**
   * @description = throw error for get infor about domain
   */
  DOMAIN_CONFIG_NOT_FOUND = 'Domain was not found',

  /**
   * @description = throw error for get infor for send mail
   */
  APP_PASSWORD_MUST_BE_STRING = 'App password must be a string',
  APP_PASSWORD_REQUIRED = 'App password required',
  APP_PASSWORD_EMPTY = 'APP password empty',

  EMAIL_MUST_BE_STRING = 'Email must be a string',
  EMAIL_REQUIRED = 'Email is required',
  EMAIL_EMPTY = 'Email is empty',

  /**
   * @description = throw error when user have no permission to approach the resource
   */
  USER_IS_FORBIDDEN_TO_APPROACH_THE_RESOURCE = 'User is forbidden to approach the resource',

  /**
   * @description = throw error when code with image
   */
  IMAGE_CANNOT_BE_FOUND = "Image can't be found",

  /**
   * @description = throw error when code with category
   */
  CATEGORY_NOT_FOUND = 'Category cannot be found',

  /**
   * @description = config for paypal
   */
  CLIENT_ID_MUST_BE_STRING = 'Client ID must be a string',
  CLIENT_ID_REQUIRED = 'Client ID is required',
  CLIENT_ID_EMPTY = 'Client ID is empty',

  SECRET_MUST_BE_STRING = 'Secret must be a string',
  SECRET_REQUIRED = 'Secret is required',
  SECRET_EMPTY = 'Secret is empty',

  ENVIRONMENT_MUST_BE_STRING = 'Environment must be a string',
  ENVIRONMENT_REQUIRED = 'Environment is required',
  ENVIRONMENT_EMPTY = 'Environment is empty',

  CLIENT_ID_PAYPAL_NOT_FOUND = 'Client ID PayPal not found',
  SECRET_PAYPAL_NOT_FOUND = 'Secret PayPal not found',
  ENVIRONMENT_PAYPAL_NOT_FOUND = 'Environment PayPal not found',

  /**
   * @description = config for stripe
   */
  PUBLIC_KEY_MUST_BE_STRING = 'Public key must be a string',
  PUBLIC_KEY_REQUIRED = 'Public key is required',
  PUBLIC_KEY_EMPTY = 'Public key is empty',

  /**
   * @description = voucher
   */
  VOUCHER_CANNOT_BE_DELETED = 'Voucher cannot be deleted',
}
