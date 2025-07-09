/**
 * @description - config for paypal
 */
export enum PaypalConfigErrorMessage {
  CLIENT_ID_MUST_BE_STRING = 'Client ID must be a string',
  CLIENT_ID_REQUIRED = 'Client ID is required',
  CLIENT_ID_EMPTY = 'Client ID is empty',

  // Secret
  SECRET_MUST_BE_STRING = 'Secret must be a string',
  SECRET_REQUIRED = 'Secret is required',
  SECRET_EMPTY = 'Secret is empty',

  // Environment
  ENVIRONMENT_MUST_BE_STRING = 'Environment must be a string',
  ENVIRONMENT_REQUIRED = 'Environment is required',
  ENVIRONMENT_EMPTY = 'Environment is empty',

  // Client ID PayPal
  CLIENT_ID_PAYPAL_NOT_FOUND = 'Client ID PayPal not found',
  SECRET_PAYPAL_NOT_FOUND = 'Secret PayPal not found',
  ENVIRONMENT_PAYPAL_NOT_FOUND = 'Environment PayPal not found',

  // Return url paypal
  RETURN_URL_REQUIRED = 'Trường return_url là bắt buộc.',
  RETURN_URL_MUST_BE_STRING = 'Trường return_url phải là chuỗi.',
  RETURN_URL_EMPTY = 'Trường return_url không được để trống.',

  // Cancel url paypal
  CANCEL_URL_REQUIRED = 'Trường cancel_url là bắt buộc.',
  CANCEL_URL_MUST_BE_STRING = 'Trường cancel_url phải là chuỗi.',
  CANCEL_URL_EMPTY = 'Trường cancel_url không được để trống.',
}
