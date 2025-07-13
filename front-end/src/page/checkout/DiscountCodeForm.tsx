import React from 'react';
import InputField from "../../components/ui/InputField";

interface DiscountCodeFormProps {
  discountCode: string;
  onDiscountCodeChange: (value: string) => void;
  onApplyDiscountCode: () => void;
}

const DiscountCodeForm: React.FC<DiscountCodeFormProps> = ({
  discountCode,
  onDiscountCodeChange,
  // onApplyDiscountCode
}) => {
  return (
    <div className="mb-6">
      <div className="p-6 border border-gray-300 rounded-lg bg-white shadow-sm space-y-4">
        <h2 className="text-2xl font-bold">Mã giảm giá</h2>
        <InputField
          type="text"
          placeholder="Nhập mã giảm giá"
          value={discountCode}
          onChange={(e) => onDiscountCodeChange(e.target.value)}
        />
        {/* <button
          onClick={onApplyDiscountCode}
          className="w-full p-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
        >
          Áp dụng mã
        </button> */}
      </div>
    </div>
  );
};

export default DiscountCodeForm;
