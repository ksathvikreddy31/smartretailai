import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../../../shared/services/api";
import PaymentGateway from "../components/PaymentGateway";

export default function Checkout() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [fetchingCart, setFetchingCart] = useState(true);
  const [orderInfo, setOrderInfo] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    shippingAddress: "",
    city: "",
    zipCode: "",
  });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const r = await api.get("/orders/cart");
        setCartItems(r.data || []);
      } catch (err) {
        console.error("Failed to fetch cart for checkout:", err);
      } finally {
        setFetchingCart(false);
      }
    };
    fetchCart();
  }, []);

  const { subtotal, tax, total } = useMemo(() => {
    const sub = cartItems.reduce((acc, item) => acc + (item.product_price * item.quantity), 0);
    const tx = Math.round(sub * 0.05); // 5% tax
    return {
      subtotal: sub,
      tax: tx,
      total: sub + tx
    };
  }, [cartItems]);

  const handlePaymentInfoChange = (info) => {
    setPaymentInfo(info);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.shippingAddress || !formData.city || !formData.zipCode) {
      alert("Please fill all shipping details");
      return;
    }

    if (!paymentInfo || !paymentInfo.method) {
      alert("Please select a payment method");
      return;
    }

    setLoading(true);
    try {
      // Create checkout request with payment info
      const checkoutRequest = {
        payment_info: paymentInfo,
        shipping_address: formData.shippingAddress,
        city: formData.city,
        zip_code: formData.zipCode,
      };

      const response = await api.post("/orders/checkout", checkoutRequest);
      setOrderInfo(response.data);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  if (submitted)
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center animate-slide-up">
        <div className="text-7xl mb-6">🎉</div>
        <h2 className="text-3xl font-black text-white mb-2">Order Confirmed!</h2>
        <p className="text-slate-400 mb-8">
          Thank you for your purchase. We've created {orderInfo?.order_ids?.length} separate orders for each retailer.
        </p>
        <div className="glass-card p-6 mb-10 text-left">
          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Summary</h4>
          <div className="flex justify-between mb-2">
            <span className="text-slate-300">Total Amount Paid</span>
            <span className="text-white font-bold text-xl">₹{orderInfo?.total_amount?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-300">Transaction ID</span>
            <span className="text-indigo-400 font-mono">TXN_{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/user/orders" className="premium-btn">Track My Orders</Link>
          <Link to="/user" className="secondary-btn">Continue Shopping</Link>
        </div>
      </div>
    );

  if (fetchingCart) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Preparing your checkout...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-slide-up">
      <h1 className="text-3xl font-black text-white mb-10">Checkout</h1>
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Shipping & Payment */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Details */}
          <section className="glass-card p-8 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
              Delivery Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="John"
                required
              />
              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Doe"
                required
              />
            </div>
            <Input
              label="Shipping Address"
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleInputChange}
              placeholder="123 Luxury Lane, Bangalore"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Bangalore"
                required
              />
              <Input
                label="Zip Code"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                placeholder="560001"
                required
              />
            </div>
          </section>

          {/* Payment Gateway */}
          <PaymentGateway onPaymentInfoChange={handlePaymentInfoChange} totalAmount={total} />
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass-card p-8 sticky top-24 border-indigo-500/20 space-y-6">
            <h3 className="text-xl font-bold text-white">Order Summary</h3>
            
            <div className="space-y-3 pb-6 border-b border-slate-700">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Subtotal ({cartItems.length} items)</span>
                <span className="text-white">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Shipping</span>
                <span className="text-emerald-400">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">GST (5%)</span>
                <span className="text-white">₹{tax.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-white font-bold">Total Payable</span>
              <span className="text-2xl font-black text-indigo-400">₹{total.toLocaleString()}</span>
            </div>

            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              By clicking "Complete Order", you agree to our terms of service. Orders from different retailers will be processed independently.
            </p>

            <button
              type="submit"
              disabled={loading || cartItems.length === 0}
              className="premium-btn w-full py-4 text-base"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Processing...
                </div>
              ) : "Complete Order"}
            </button>

            <div className="mt-6 flex items-center justify-center gap-4 grayscale opacity-50">
              <span className="text-[10px] font-bold text-slate-500">VISA</span>
              <span className="text-[10px] font-bold text-slate-500">MASTERCARD</span>
              <span className="text-[10px] font-bold text-slate-500">UPI</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
function Input({ label, ...props }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
      <input
        {...props}
        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-700"
      />
    </div>
  );
}
