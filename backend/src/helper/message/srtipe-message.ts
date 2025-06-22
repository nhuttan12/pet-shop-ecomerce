export const StripeErrorMessage = {
  STRIPE_PRODUCT_ID_MUST_BE_STRING: 'stripeProductId phải là một chuỗi',
  OLD_PRICE_ID_MUST_BE_STRING: 'oldPriceId phải là một chuỗi',
  NEW_AMOUNT_MUST_BE_NUMBER: 'newAmount phải là một số',
  CURRENCY_MUST_BE_STRING: 'currency phải là một chuỗi nếu được truyền vào',
  INTERVAL_MUST_BE_ENUM:
    'interval phải là một trong các giá trị: day, week, month, year',
  PRODUCT_NOT_FOUND: 'Không tìm thấy sản phẩm',
  STRIPE_PRICE_NOT_FOUND: 'Không tìm thấy giá trị trong stripe',
};
export const StripeMessageLog = {
  FAILED_TO_ATTACH_PAYMENT_METHOD: 'Failed to attach payment method',
  REFUND_PROCESS_SUCCESSFULLY_FOR_PAYMENT_INTENT:
    'Refund processed successfully for PaymentIntent',
  PRODUCT_CREATE_SUCCESSFULLY: 'Product created successfully',
  CUSTOMER_IN_STRIPE_CREATE_SUCCESSFULLY_WITH_EMAIL:
    'Customer created successfully with email',
  PRODUCT_UPDATE_SUCCESSFULLY: 'Product updated successfully',
};
