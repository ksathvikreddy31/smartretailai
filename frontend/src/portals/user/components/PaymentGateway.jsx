import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { HiOutlineCheckCircle, HiCreditCard, HiOutlineDevicePhoneMobile, HiQrCode, HiOutlineTruck } from "react-icons/hi2";

const PAYMENT_METHODS = [
  {
    id: "credit-card",
    label: "Credit / Debit Card",
    value: "Credit Card",
    icon: HiCreditCard,
    description: "Fast and secure",
  },
  {
    id: "upi",
    label: "UPI",
    value: "UPI",
    icon: HiOutlineDevicePhoneMobile,
    description: "Direct bank transfer",
  },
  {
    id: "qr-code",
    label: "QR Code",
    value: "QR Code",
    icon: HiQrCode,
    description: "Scan with any UPI app",
  },
  {
    id: "cod",
    label: "Cash on Delivery",
    value: "Cash on Delivery",
    icon: HiOutlineTruck,
    description: "Pay when you receive",
  },
];

export default function PaymentGateway({ onPaymentInfoChange, totalAmount }) {
  const [selectedMethod, setSelectedMethod] = useState("Credit Card");
  const [qrCode, setQrCode] = useState(null);
  const [formData, setFormData] = useState({
    card_number: "",
    card_expiry: "",
    card_cvv: "",
    upi_id: "",
  });
  const [errors, setErrors] = useState({});

  // Generate QR code when QR method is selected
  useEffect(() => {
    if (selectedMethod === "QR Code") {
      const qrData = `upi://pay?pa=merchant@upi&pn=SmartRetail&am=${totalAmount.toFixed(2)}&cu=INR&tn=Smart%20Retail%20Order`;
      QRCode.toDataURL(qrData, (err, url) => {
        if (!err) setQrCode(url);
      });
    }
  }, [selectedMethod, totalAmount]);

  // Notify parent of payment info change
  useEffect(() => {
    onPaymentInfoChange({
      method: selectedMethod,
      ...formData,
    });
  }, [selectedMethod, formData, onPaymentInfoChange]);

  const handleMethodChange = (method) => {
    setSelectedMethod(method);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number (space every 4 digits)
    if (name === "card_number") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
    }

    // Format expiry date
    if (name === "card_expiry") {
      formattedValue = value.replace(/\D/g, "");
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + "/" + formattedValue.slice(2, 4);
      }
    }

    // Limit CVV to 3-4 digits
    if (name === "card_cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  return (
    <div className="space-y-8">
      {/* Payment Method Selection */}
      <section className="glass-card p-8 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          Payment Method
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PAYMENT_METHODS.map((method) => {
            const IconComponent = method.icon;
            const isSelected = selectedMethod === method.value;

            return (
              <button
                key={method.id}
                onClick={() => handleMethodChange(method.value)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <IconComponent className="w-5 h-5 text-indigo-400 mt-1" />
                    <div className="text-left">
                      <p className="text-sm font-bold text-white">{method.label}</p>
                      <p className="text-xs text-slate-400">{method.description}</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? "border-indigo-500 bg-indigo-500" : "border-slate-600"
                  }`}>
                    {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Dynamic Payment Fields */}
      <section className="glass-card p-8 space-y-6 animate-slide-up">
        {selectedMethod === "Credit Card" && (
          <CreditCardForm formData={formData} handleInputChange={handleInputChange} errors={errors} />
        )}

        {selectedMethod === "UPI" && (
          <UPIForm formData={formData} handleInputChange={handleInputChange} errors={errors} />
        )}

        {selectedMethod === "QR Code" && <QRCodeForm qrCode={qrCode} totalAmount={totalAmount} />}

        {selectedMethod === "Cash on Delivery" && (
          <CashOnDeliveryMessage totalAmount={totalAmount} />
        )}
      </section>
    </div>
  );
}

function CreditCardForm({ formData, handleInputChange, errors }) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold text-white uppercase tracking-widest">Card Details</h4>
      
      <div>
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
          Card Number
        </label>
        <input
          type="text"
          name="card_number"
          value={formData.card_number}
          onChange={handleInputChange}
          placeholder="1234 5678 9012 3456"
          maxLength="19"
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-700 font-mono"
        />
        {errors.card_number && <p className="text-xs text-red-400 mt-1">{errors.card_number}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
            Expiry Date
          </label>
          <input
            type="text"
            name="card_expiry"
            value={formData.card_expiry}
            onChange={handleInputChange}
            placeholder="MM / YY"
            maxLength="5"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-700"
          />
          {errors.card_expiry && <p className="text-xs text-red-400 mt-1">{errors.card_expiry}</p>}
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
            CVV
          </label>
          <input
            type="password"
            name="card_cvv"
            value={formData.card_cvv}
            onChange={handleInputChange}
            placeholder="***"
            maxLength="4"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-700"
          />
          {errors.card_cvv && <p className="text-xs text-red-400 mt-1">{errors.card_cvv}</p>}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-xs text-blue-400">
          🔒 Your payment details are encrypted and secure. We never store full card information.
        </p>
      </div>
    </div>
  );
}

function UPIForm({ formData, handleInputChange, errors }) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold text-white uppercase tracking-widest">UPI Payment</h4>
      
      <div>
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
          UPI ID
        </label>
        <input
          type="text"
          name="upi_id"
          value={formData.upi_id}
          onChange={handleInputChange}
          placeholder="yourname@bank"
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-700"
        />
        {errors.upi_id && <p className="text-xs text-red-400 mt-1">{errors.upi_id}</p>}
      </div>

      <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
        <p className="text-xs text-green-400">
          ✓ You'll receive a payment request on your registered UPI app. Approve to complete payment.
        </p>
      </div>
    </div>
  );
}

function QRCodeForm({ qrCode, totalAmount }) {
  return (
    <div className="space-y-6">
      <h4 className="text-sm font-bold text-white uppercase tracking-widest">Scan to Pay</h4>

      {qrCode && (
        <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg">
          <img src={qrCode} alt="Payment QR Code" className="w-48 h-48" />
          <p className="text-sm text-slate-600 text-center">
            Scan this QR code with any UPI app to complete payment
          </p>
        </div>
      )}

      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
        <p className="text-xs text-amber-400">
          📱 Open any UPI app (Google Pay, PhonePe, Paytm, etc.) and scan this QR code.
        </p>
      </div>

      <div className="text-center p-4 bg-slate-800/50 rounded-lg">
        <p className="text-slate-400 text-sm">Amount to Pay</p>
        <p className="text-2xl font-bold text-white mt-1">₹{totalAmount.toLocaleString()}</p>
      </div>
    </div>
  );
}

function CashOnDeliveryMessage({ totalAmount }) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold text-white uppercase tracking-widest">Cash on Delivery</h4>

      <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-4">
        <HiOutlineCheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
        <div>
          <p className="text-sm font-bold text-white mb-2">Payment at Delivery</p>
          <p className="text-sm text-slate-300 mb-3">
            You can pay when the order is delivered to your address. Make sure you have exact change or inform the delivery partner in advance.
          </p>
          <div className="text-sm p-3 bg-slate-800/50 rounded text-slate-300">
            <strong>Amount Due:</strong> ₹{totalAmount.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <p className="text-xs text-blue-400">
          💡 Tip: Inform delivery partner about payment method beforehand for smooth transaction.
        </p>
      </div>
    </div>
  );
}
