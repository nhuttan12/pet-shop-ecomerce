/**
 * @description: message to throw out the console or terminal when
 *  meeting error in dev, or run in production
 */
export const MessageLog = {
  INVALID_TOKEN: 'Invalid token',
  TOKEN_EXPIRED: 'Token expired',
  HTTP_CONFIG_NOT_FOUND: 'Http configuration infomation not found',
  DB_CONFIG_NOT_FOUND: 'Database configuration information not found',
  JWT_KEY_NOT_FOUND: 'JWT key not found',
  EXPIRE_TIME_NOT_FOUND: 'Expire time not found',

  /**
   * @description configuration information for https server
   */
  HOST_MUST_BE_STRING: 'Host must be string',
  PORT_MUST_BE_NUMBER: 'Port must be number',
  HOST_IS_REQUIRED: 'Host is required',

  PORT_IS_REQUIRED: 'Port is required',
  HOST_CANNT_BE_EMPTY: 'Host can not be empty',
  PORT_CANNT_BE_EMPTY: 'Port can not be empty',

  JWT_KEY_MUST_BE_STRING: 'JWT key must be string',
  JWT_KEY_IS_REQUIRED: 'JWT key is required',
  JWT_KEY_CANNT_BE_EMPTY: 'JWT key can not be empty',

  EXPIRE_TIME_MUST_BE_NUMBER_OR_STRING: 'Expire time must be number or string',
  EXPIRE_TIME_IS_REQUIRED: 'Expire time is required',
  EXPIRE_TIME_CANNT_BE_EMPTY: 'Expire time can not be empty',

  /**
   * @description configuration information for database
   */
  DATABASE_MUST_BE_STRING: 'Database must be string',
  DATABASE_IS_REQUIRED: 'Database is required',
  DATABASE_CANNT_BE_EMPTY: 'Database can not be empty',

  DIALECT_MUST_BE_STRING: 'Dialect must be string',
  DIALECT_IS_REQUIRED: 'Dialect is required',
  DIALECT_CANNT_BE_EMPTY: 'Dialect can not be empty',

  USERNAME_MUST_BE_STRING: 'Username must be string',
  USERNAME_IS_REQUIRED: 'Username is required',
  USERNAME_CANNT_BE_EMPTY: 'Username can not be empty',

  PASSWORD_MUST_BE_STRING: 'Password must be string',
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_CANNT_BE_EMPTY: 'Password can not be empty',

  USER_CREATED_SUCCESS: 'User created successfully',
  NO_USER_CREATED: 'User creation failed, no user created',
  USER_LOGIN_SUCCESS: 'User login successfully',
  USER_LOGIN_FAILED: 'User login failed, no user login',
  USER_NOT_FOUND: 'User not found',
  USERNAME_OR_EMAIL_EXISTS: 'Username or email already exists',
  PASSWORD_MISMATCH: 'Password mismatch',
  INVALID_PASSWORD: 'Invalid password',
  USER_BANNED: 'User is banned',
  USER_NOT_ACTIVE: 'User is not active',

  /**
   * @description for cloudinary configuration information to check with joi message
   */
  CLOUDINARY_NAME_MUST_BE_A_STRING: 'Cloudinary name must be a string',
  CLOUDINARY_NAME_IS_REQUIRED: 'Cloudinary name is required',
  CLOUDINARY_NAME_CANNOT_BE_EMPTY: 'Cloudinary name cannot be empty',

  CLOUDINARY_API_KEY_MUST_BE_A_STRING: 'Cloudinary API key must be a string',
  CLOUDINARY_API_KEY_IS_REQUIRED: 'Cloudinary API key is required',
  CLOUDINARY_API_KEY_CANNOT_BE_EMPTY: 'Cloudinary API key cannot be empty',

  CLOUDINARY_API_SECRET_MUST_BE_A_STRING:
    'Cloudinary API secret must be a string',
  CLOUDINARY_API_SECRET_IS_REQUIRED: 'Cloudinary API secret is required',
  CLOUDINARY_API_SECRET_CANNOT_BE_EMPTY:
    'Cloudinary API secret cannot be empty',

  /**
   * @description: throw error for get infor from cloudinary
   */
  NO_RESULT_FROM_CLOUDINARY: 'No result fromt cloudinary',
  CLOUINARY_NAME_NOT_FOUND: 'cloudinary name was not found',
  CLOUINARY_API_KEY_NOT_FOUND: 'cloudinary api key was not found',

  /**
   * @description: throw error for get infor from gmail, and app password
   */
  EMAIL_IS_NOT_FOUND: 'Email go with app password is not found',
  APP_PASSWORD_IS_NOT_FOUND: 'App password is not found',

  /**
   * @description: throw error for get infor about domain
   */
  DOMAIN_CONFIG_NOT_FOUND: 'Domain was not found',

  /**
   * @description: throw error for get infor for send mail
   */
  APP_PASSWORD_MUST_BE_STRING: 'App password must be a string',
  APP_PASSWORD_REQUIRED: 'App password required',
  APP_PASSWORD_EMPTY: 'APP password empty',

  EMAIL_MUST_BE_STRING: 'Email must be a string',
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_EMPTY: 'Email is empty',

  /**
   * @description: throw error when user not loggin
   */
  USER_NOT_LOG_IN: 'User is not log in',
  INVALID_LOGIN_INFO: 'Invalid log in info',

  /**
   * @description: throw error when user have no permission to approach the resource
   */
  USER_IS_FORBIDDEN_TO_APPROACH_THE_RESOURCE:
    'User is forbidden to approach the resource',

  /**
   * @description: throw error when code with brand
   */
  BRAND_NOT_FOUND: 'Brand was not found',
  BRAND_CANNOT_BE_UPDATED: "Brand can't be update",

  /**
   * @description: throw error when code with image
   */
  IMAGE_CANNOT_BE_FOUND: "Image can't be found",

  /**
   * @description: throw error when code with category
   */
  CATEGORY_NOT_FOUND: 'Category cannot be found',

  /**
   * @description: throw error when code with cart
   */
  CART_NOT_FOUND: 'Cart not found',
  CART_CANNOT_BE_DELETED: 'Cart cannot be delete',
  CART_DETAIL_NOT_FOUND: 'Cart detail not found',

  ERROR_IN_UPDATE: 'Error in updating',
} as const;
