export enum MessageLog {
  INVALID_TOKEN = 'Invalid token',
  TOKEN_EXPIRED = 'Token expired',
  HTTP_CONFIG_NOT_FOUND = 'Http configuration infomation not found',
  DB_CONFIG_NOT_FOUND = 'Database configuration information not found',
  JWT_KEY_NOT_FOUND = 'JWT key not found',
  EXPIRE_TIME_NOT_FOUND = 'Expire time not found',
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
   * @description = voucher
   */
  VOUCHER_CANNOT_BE_DELETED = 'Voucher cannot be deleted',
}
