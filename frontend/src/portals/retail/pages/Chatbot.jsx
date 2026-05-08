// // // import { useState } from "react";

// // // import {
// // //   HiOutlinePaperAirplane,
// // //   HiOutlineSparkles,
// // //   HiOutlineChartBar,
// // // } from "react-icons/hi2";

// // // import api from "../../../shared/services/api";

// // // export default function RetailChatbot() {
// // //   // ======================================
// // //   // STATES
// // //   // ======================================
// // //   const [msgs, setMsgs] = useState([
// // //     {
// // //       role: "bot",

// // //       text:
// // //         "Hello! I'm your SmartRetail AI Assistant 🤖\n\n" +
// // //         "You can ask me about:\n" +
// // //         "• Sales analytics\n" +
// // //         "• Inventory insights\n" +
// // //         "• Demand forecasting\n" +
// // //         "• Revenue reports\n" +
// // //         "• Restock recommendations",
// // //     },
// // //   ]);

// // //   const [input, setInput] = useState("");

// // //   const [loading, setLoading] = useState(false);

// // //   // ======================================
// // //   // SEND MESSAGE
// // //   // ======================================
// // //   const send = async (text) => {
// // //     if (!text.trim()) return;

// // //     // ==================================
// // //     // ADD USER MESSAGE
// // //     // ==================================
// // //     setMsgs((prev) => [
// // //       ...prev,

// // //       {
// // //         role: "user",
// // //         text,
// // //       },
// // //     ]);

// // //     setInput("");

// // //     setLoading(true);

// // //     try {
// // //       // ==================================
// // //       // API REQUEST
// // //       // ==================================
// // //       const res = await api.post(
// // //         "/ai/retail-chat",

// // //         {
// // //           message: text,
// // //         },
// // //       );

// // //       console.log("FULL AI RESPONSE:", res.data);

// // //       let botReply = "No AI response generated.";

// // //       // ==================================
// // //       // FORECAST AGENT
// // //       // ==================================
// // //       if (res.data.agent === "forecast_agent") {
// // //         const forecast = res.data.response;

// // //         console.log("FORECAST RESPONSE:", forecast);

// // //         // ================================
// // //         // FORECAST ERROR
// // //         // ================================
// // //         if (forecast.success === false) {
// // //           botReply = `⚠️ Forecast Error\n\n${forecast.message}`;
// // //         }

// // //         // ================================
// // //         // GLOBAL FORECAST
// // //         // ================================
// // //         else if (forecast.forecast_type === "global_forecast") {
// // //           const results = forecast.forecast?.results || [];

// // //           botReply = "📈 High Demand Forecast\n\n";

// // //           if (results.length === 0) {
// // //             botReply += "No forecast data available.";
// // //           } else {
// // //             results.forEach((item, index) => {
// // //               botReply +=
// // //                 `#${index + 1} ${item.product}\n` +
// // //                 `Category: ${item.category}\n` +
// // //                 `Current Stock: ${item.current_stock}\n` +
// // //                 `7-Day Forecast: ${item.forecast_7_days}\n` +
// // //                 `30-Day Forecast: ${item.forecast_30_days}\n` +
// // //                 `Trend: ${item.trend}\n` +
// // //                 `Stock Status: ${item.stock_status}\n` +
// // //                 `Recommendation: ${item.recommendation}\n\n`;
// // //             });
// // //           }
// // //         }

// // //         // ================================
// // //         // PRODUCT FORECAST
// // //         // ================================
// // //         else if (forecast.forecast_type === "product_forecast") {
// // //           botReply =
// // //             `📈 Forecast Analysis\n\n` +
// // //             `Product: ${forecast.product}\n\n` +
// // //             `Prediction: ${forecast.prediction}\n\n` +
// // //             `Stock Status: ${forecast.stock_status}\n\n` +
// // //             `Recommendation:\n${forecast.recommendation}\n\n` +
// // //             `AI Analysis:\n${forecast.analysis}`;
// // //         }

// // //         // ================================
// // //         // FALLBACK
// // //         // ================================
// // //         else {
// // //           botReply = JSON.stringify(forecast, null, 2);
// // //         }
// // //       }

// // //       // ==================================
// // //       // ANALYTICS AGENT
// // //       // ==================================
// // //       else if (res.data.agent === "analytics_agent") {
// // //         const analytics = res.data.response;

// // //         botReply =
// // //           typeof analytics === "string"
// // //             ? analytics
// // //             : JSON.stringify(analytics, null, 2);
// // //       }

// // //       // ==================================
// // //       // QA AGENT
// // //       // ==================================
// // //       else if (res.data.agent === "qa_agent") {
// // //         botReply = res.data.response;
// // //       }

// // //       // ==================================
// // //       // DEFAULT RESPONSE
// // //       // ==================================
// // //       else {
// // //         botReply = res.data.message || "No response available.";
// // //       }

// // //       // ==================================
// // //       // ADD BOT MESSAGE
// // //       // ==================================
// // //       setMsgs((prev) => [
// // //         ...prev,

// // //         {
// // //           role: "bot",
// // //           text: botReply,
// // //         },
// // //       ]);
// // //     } catch (err) {
// // //       console.error(err);

// // //       setMsgs((prev) => [
// // //         ...prev,

// // //         {
// // //           role: "bot",

// // //           text: "⚠️ Failed to connect to SmartRetail AI.",
// // //         },
// // //       ]);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   return (
// // //     <div className="space-y-6">
// // //       {/* HEADER */}
// // //       <div>
// // //         <h1 className="text-2xl font-bold text-slate-900">AI Chatbot</h1>

// // //         <p className="text-sm text-slate-500 mt-1">
// // //           Get AI-powered retail insights
// // //         </p>
// // //       </div>

// // //       {/* CHAT CONTAINER */}
// // //       <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden max-w-4xl">
// // //         {/* TOP BAR */}
// // //         <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center gap-3">
// // //           <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
// // //             <HiOutlineSparkles className="text-white text-lg" />
// // //           </div>

// // //           <div>
// // //             <h3 className="font-semibold text-white text-sm">
// // //               SmartRetail AI Assistant
// // //             </h3>

// // //             <p className="text-xs text-indigo-200">
// // //               AI Powered Retail Intelligence
// // //             </p>
// // //           </div>
// // //         </div>

// // //         {/* QUICK ACTIONS */}
// // //         <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex flex-wrap gap-2">
// // //           <button
// // //             onClick={() => send("Predict smartphone demand next month")}
// // //             className="px-3 py-2 text-xs rounded-xl bg-indigo-100 text-indigo-700 hover:bg-indigo-200 flex items-center gap-2"
// // //           >
// // //             <HiOutlineChartBar />
// // //             Forecast Smartphones
// // //           </button>

// // //           <button
// // //             onClick={() =>
// // //               send("What products will have high demand next month?")
// // //             }
// // //             className="px-3 py-2 text-xs rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200"
// // //           >
// // //             High Demand Forecast
// // //           </button>

// // //           <button
// // //             onClick={() => send("Show inventory analytics")}
// // //             className="px-3 py-2 text-xs rounded-xl bg-violet-100 text-violet-700 hover:bg-violet-200"
// // //           >
// // //             Inventory Analytics
// // //           </button>

// // //           <button
// // //             onClick={() => send("Which products need restocking?")}
// // //             className="px-3 py-2 text-xs rounded-xl bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
// // //           >
// // //             Restock Suggestions
// // //           </button>
// // //         </div>

// // //         {/* CHAT MESSAGES */}
// // //         <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-slate-50">
// // //           {msgs.map((m, i) => (
// // //             <div
// // //               key={i}
// // //               className={`flex ${
// // //                 m.role === "user" ? "justify-end" : "justify-start"
// // //               }`}
// // //             >
// // //               <div
// // //                 className={`max-w-[85%] whitespace-pre-line px-4 py-3 rounded-2xl text-sm shadow-sm ${
// // //                   m.role === "user"
// // //                     ? "bg-indigo-600 text-white rounded-br-md"
// // //                     : "bg-white border border-slate-200 text-slate-700 rounded-bl-md"
// // //                 }`}
// // //               >
// // //                 {m.text}
// // //               </div>
// // //             </div>
// // //           ))}

// // //           {/* LOADING */}
// // //           {loading && (
// // //             <div className="flex justify-start">
// // //               <div className="bg-white border border-slate-200 text-slate-500 rounded-2xl rounded-bl-md px-4 py-3 text-sm shadow-sm animate-pulse">
// // //                 SmartRetail AI is analyzing...
// // //               </div>
// // //             </div>
// // //           )}
// // //         </div>

// // //         {/* INPUT */}
// // //         <div className="px-6 pb-6 pt-4 bg-white border-t border-slate-100">
// // //           <form
// // //             onSubmit={(e) => {
// // //               e.preventDefault();

// // //               send(input);
// // //             }}
// // //             className="flex gap-2"
// // //           >
// // //             <input
// // //               value={input}
// // //               onChange={(e) => setInput(e.target.value)}
// // //               placeholder="Ask about forecasting, sales, inventory..."
// // //               className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
// // //             />

// // //             <button
// // //               type="submit"
// // //               disabled={loading}
// // //               className="px-4 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-md active:scale-95 transition-all disabled:opacity-50"
// // //             >
// // //               <HiOutlinePaperAirplane className="text-lg" />
// // //             </button>
// // //           </form>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }
// // import { useState } from "react";

// // import {
// //   HiOutlinePaperAirplane,
// //   HiOutlineSparkles,
// //   HiOutlineChartBar,
// //   HiOutlineExclamationTriangle,
// // } from "react-icons/hi2";

// // import api from "../../../shared/services/api";

// // export default function RetailChatbot() {
// //   // ======================================
// //   // STATES
// //   // ======================================

// //   const [msgs, setMsgs] = useState([
// //     {
// //       role: "bot",

// //       text:
// //         "Hello! I'm your SmartRetail ML Assistant 🤖\n\n" +
// //         "I can help with:\n\n" +
// //         "• Demand Forecasting\n" +
// //         "• Product Trend Analysis\n" +
// //         "• Anomaly Detection\n" +
// //         "• Inventory Insights\n" +
// //         "• Restock Recommendations",
// //     },
// //   ]);

// //   const [input, setInput] = useState("");

// //   const [loading, setLoading] = useState(false);

// //   // ======================================
// //   // SEND MESSAGE
// //   // ======================================

// //   const send = async (text) => {
// //     if (!text.trim()) return;

// //     // ==================================
// //     // USER MESSAGE
// //     // ==================================

// //     setMsgs((prev) => [
// //       ...prev,

// //       {
// //         role: "user",
// //         text,
// //       },
// //     ]);

// //     setInput("");

// //     setLoading(true);

// //     try {
// //       // ==================================
// //       // API REQUEST
// //       // ==================================

// //       const res = await api.post(
// //         "/ai/retail-chat",

// //         {
// //           message: text,
// //         },
// //       );

// //       console.log("FULL AI RESPONSE:", res.data);

// //       let botReply = "No AI response generated.";

// //       // ==================================
// //       // RETAIL ML AGENT
// //       // ==================================

// //       if (res.data.agent === "retail_ml_agent") {
// //         const mlResponse = res.data.response;

// //         console.log("ML RESPONSE:", mlResponse);

// //         if (typeof mlResponse === "string") {
// //           botReply = mlResponse;
// //         } else if (mlResponse.response) {
// //           botReply = mlResponse.response;
// //         } else {
// //           botReply = JSON.stringify(mlResponse, null, 2);
// //         }
// //       }

// //       // ==================================
// //       // ANALYTICS AGENT
// //       // ==================================
// //       else if (res.data.agent === "analytics_agent") {
// //         const analytics = res.data.response;

// //         botReply =
// //           typeof analytics === "string"
// //             ? analytics
// //             : JSON.stringify(analytics, null, 2);
// //       }

// //       // ==================================
// //       // QA AGENT
// //       // ==================================
// //       else if (res.data.agent === "qa_agent") {
// //         botReply = res.data.response;
// //       }

// //       // ==================================
// //       // DEFAULT RESPONSE
// //       // ==================================
// //       else {
// //         botReply = res.data.message || "No response available.";
// //       }

// //       // ==================================
// //       // ADD BOT MESSAGE
// //       // ==================================

// //       setMsgs((prev) => [
// //         ...prev,

// //         {
// //           role: "bot",
// //           text: botReply,
// //         },
// //       ]);
// //     } catch (err) {
// //       console.error(err);

// //       setMsgs((prev) => [
// //         ...prev,

// //         {
// //           role: "bot",

// //           text: "⚠️ Failed to connect to SmartRetail ML Assistant.",
// //         },
// //       ]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="space-y-6">
// //       {/* HEADER */}

// //       <div>
// //         <h1 className="text-2xl font-bold text-slate-900">
// //           AI Retail Assistant
// //         </h1>

// //         <p className="text-sm text-slate-500 mt-1">
// //           ML-Powered Retail Intelligence
// //         </p>
// //       </div>

// //       {/* CHAT CONTAINER */}

// //       <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden max-w-4xl">
// //         {/* TOP BAR */}

// //         <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center gap-3">
// //           <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
// //             <HiOutlineSparkles className="text-white text-lg" />
// //           </div>

// //           <div>
// //             <h3 className="font-semibold text-white text-sm">
// //               SmartRetail ML Assistant
// //             </h3>

// //             <p className="text-xs text-indigo-200">
// //               Forecasting + Analytics + AI
// //             </p>
// //           </div>
// //         </div>

// //         {/* QUICK ACTIONS */}

// //         <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex flex-wrap gap-2">
// //           {/* FORECAST */}

// //           <button
// //             onClick={() => send("Predict Smartphone demand next month")}
// //             className="px-3 py-2 text-xs rounded-xl bg-indigo-100 text-indigo-700 hover:bg-indigo-200 flex items-center gap-2"
// //           >
// //             <HiOutlineChartBar />
// //             Forecast Smartphones
// //           </button>

// //           {/* TREND */}

// //           <button
// //             onClick={() => send("Show Smartphone trend")}
// //             className="px-3 py-2 text-xs rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200"
// //           >
// //             Product Trends
// //           </button>

// //           {/* ANOMALY */}

// //           <button
// //             onClick={() => send("Detect anomaly in Smartphone sales")}
// //             className="px-3 py-2 text-xs rounded-xl bg-red-100 text-red-700 hover:bg-red-200 flex items-center gap-2"
// //           >
// //             <HiOutlineExclamationTriangle />
// //             Detect Anomalies
// //           </button>

// //           {/* INVENTORY */}

// //           <button
// //             onClick={() => send("Which products need restocking?")}
// //             className="px-3 py-2 text-xs rounded-xl bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
// //           >
// //             Restock Suggestions
// //           </button>

// //           {/* ANALYTICS */}

// //           <button
// //             onClick={() => send("Show inventory analytics")}
// //             className="px-3 py-2 text-xs rounded-xl bg-violet-100 text-violet-700 hover:bg-violet-200"
// //           >
// //             Inventory Analytics
// //           </button>
// //         </div>

// //         {/* CHAT MESSAGES */}

// //         <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-slate-50">
// //           {msgs.map((m, i) => (
// //             <div
// //               key={i}
// //               className={`flex ${
// //                 m.role === "user" ? "justify-end" : "justify-start"
// //               }`}
// //             >
// //               <div
// //                 className={`max-w-[85%] whitespace-pre-line px-4 py-3 rounded-2xl text-sm shadow-sm ${
// //                   m.role === "user"
// //                     ? "bg-indigo-600 text-white rounded-br-md"
// //                     : "bg-white border border-slate-200 text-slate-700 rounded-bl-md"
// //                 }`}
// //               >
// //                 {m.text}
// //               </div>
// //             </div>
// //           ))}

// //           {/* LOADING */}

// //           {loading && (
// //             <div className="flex justify-start">
// //               <div className="bg-white border border-slate-200 text-slate-500 rounded-2xl rounded-bl-md px-4 py-3 text-sm shadow-sm animate-pulse">
// //                 SmartRetail ML Assistant is analyzing...
// //               </div>
// //             </div>
// //           )}
// //         </div>

// //         {/* INPUT */}

// //         <div className="px-6 pb-6 pt-4 bg-white border-t border-slate-100">
// //           <form
// //             onSubmit={(e) => {
// //               e.preventDefault();

// //               send(input);
// //             }}
// //             className="flex gap-2"
// //           >
// //             <input
// //               value={input}
// //               onChange={(e) => setInput(e.target.value)}
// //               placeholder="Ask about forecasting, trends, anomalies..."
// //               className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
// //             />

// //             <button
// //               type="submit"
// //               disabled={loading}
// //               className="px-4 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-md active:scale-95 transition-all disabled:opacity-50"
// //             >
// //               <HiOutlinePaperAirplane className="text-lg" />
// //             </button>
// //           </form>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// import { useState } from "react";

// import {
//   HiOutlinePaperAirplane,
//   HiOutlineSparkles,
//   HiOutlineChartBar,
//   HiOutlineExclamationTriangle,
// } from "react-icons/hi2";

// import api from "../../../shared/services/api";

// export default function RetailChatbot() {
//   // ======================================
//   // STATES
//   // ======================================

//   const [msgs, setMsgs] = useState([
//     {
//       role: "bot",

//       text:
//         "Hello! I'm your SmartRetail ML Assistant 🤖\n\n" +
//         "I can help with:\n\n" +
//         "• Demand Forecasting\n" +
//         "• Product Trend Analysis\n" +
//         "• Anomaly Detection\n" +
//         "• Inventory Insights\n" +
//         "• Restock Recommendations",
//     },
//   ]);

//   const [input, setInput] = useState("");

//   const [loading, setLoading] = useState(false);

//   // ======================================
//   // SEND MESSAGE
//   // ======================================

//   const send = async (text) => {
//     if (!text.trim()) return;

//     // ==================================
//     // ADD USER MESSAGE
//     // ==================================

//     setMsgs((prev) => [
//       ...prev,

//       {
//         role: "user",
//         text,
//       },
//     ]);

//     setInput("");

//     setLoading(true);

//     try {
//       // ==================================
//       // API REQUEST
//       // ==================================

//       const res = await api.post(
//         "/ai/retail-chat",

//         {
//           message: text,
//         },
//       );

//       console.log("FULL AI RESPONSE:", res.data);

//       let botReply = "No AI response generated.";

//       // ==================================
//       // RETAIL ML AGENT
//       // ==================================

//       if (res.data.agent === "retail_ml_agent") {
//         const mlResponse = res.data.response;

//         console.log("ML RESPONSE:", mlResponse);

//         if (typeof mlResponse === "string") {
//           botReply = mlResponse;
//         } else if (mlResponse.response) {
//           botReply = mlResponse.response;
//         } else {
//           botReply = JSON.stringify(mlResponse, null, 2);
//         }
//       }

//       // ==================================
//       // ANALYTICS AGENT
//       // ==================================
//       else if (res.data.agent === "analytics_agent") {
//         const analytics = res.data.response;

//         console.log("ANALYTICS RESPONSE:", analytics);

//         // ==============================
//         // SUMMARY
//         // ==============================

//         botReply = analytics.summary;

//         // ==============================
//         // LOW STOCK
//         // ==============================

//         if (analytics.analytics?.low_stock_products?.length > 0) {
//           botReply += "\n\n⚠️ Low Stock Products:\n";

//           analytics.analytics.low_stock_products.forEach((item) => {
//             botReply += `• ${item.product} ` + `(${item.stock} units)\n`;
//           });
//         }

//         // ==============================
//         // TOP PRODUCTS
//         // ==============================

//         if (analytics.analytics?.top_products?.length > 0) {
//           botReply += "\n🏆 Top Products:\n";

//           analytics.analytics.top_products.forEach((item) => {
//             botReply += `• ${item.product} ` + `- ${item.units_sold} sold\n`;
//           });
//         }

//         // ==============================
//         // PAYMENT SUMMARY
//         // ==============================

//         if (analytics.analytics?.payments) {
//           const pay = analytics.analytics.payments;

//           botReply += `\n💰 Revenue: ` + `${pay.total_revenue}\n`;

//           botReply += `Completed Payments: ` + `${pay.completed}\n`;

//           botReply += `Pending Payments: ` + `${pay.pending}\n`;
//         }
//       }

//       // ==================================
//       // QA AGENT
//       // ==================================
//       else if (res.data.agent === "qa_agent") {
//         botReply = res.data.response;
//       }

//       // ==================================
//       // DEFAULT RESPONSE
//       // ==================================
//       else {
//         botReply = res.data.message || "No response available.";
//       }

//       // ==================================
//       // ADD BOT MESSAGE
//       // ==================================

//       setMsgs((prev) => [
//         ...prev,

//         {
//           role: "bot",
//           text: botReply,
//         },
//       ]);
//     } catch (err) {
//       console.error(err);

//       setMsgs((prev) => [
//         ...prev,

//         {
//           role: "bot",

//           text: "⚠️ Failed to connect to SmartRetail ML Assistant.",
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* HEADER */}

//       <div>
//         <h1 className="text-2xl font-bold text-slate-900">
//           AI Retail Assistant
//         </h1>

//         <p className="text-sm text-slate-500 mt-1">
//           ML-Powered Retail Intelligence
//         </p>
//       </div>

//       {/* CHAT CONTAINER */}

//       <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden max-w-4xl">
//         {/* TOP BAR */}

//         <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center gap-3">
//           <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
//             <HiOutlineSparkles className="text-white text-lg" />
//           </div>

//           <div>
//             <h3 className="font-semibold text-white text-sm">
//               SmartRetail ML Assistant
//             </h3>

//             <p className="text-xs text-indigo-200">
//               Forecasting + Analytics + AI
//             </p>
//           </div>
//         </div>

//         {/* QUICK ACTIONS */}

//         <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex flex-wrap gap-2">
//           <button
//             onClick={() => send("Predict Smartphone demand next month")}
//             className="px-3 py-2 text-xs rounded-xl bg-indigo-100 text-indigo-700 hover:bg-indigo-200 flex items-center gap-2"
//           >
//             <HiOutlineChartBar />
//             Forecast Smartphones
//           </button>

//           <button
//             onClick={() => send("Show Smartphone trend")}
//             className="px-3 py-2 text-xs rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200"
//           >
//             Product Trends
//           </button>

//           <button
//             onClick={() => send("Detect anomaly in Smartphone sales")}
//             className="px-3 py-2 text-xs rounded-xl bg-red-100 text-red-700 hover:bg-red-200 flex items-center gap-2"
//           >
//             <HiOutlineExclamationTriangle />
//             Detect Anomalies
//           </button>

//           <button
//             onClick={() => send("Which products need restocking?")}
//             className="px-3 py-2 text-xs rounded-xl bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
//           >
//             Restock Suggestions
//           </button>

//           <button
//             onClick={() => send("Show inventory analytics")}
//             className="px-3 py-2 text-xs rounded-xl bg-violet-100 text-violet-700 hover:bg-violet-200"
//           >
//             Inventory Analytics
//           </button>
//         </div>

//         {/* CHAT MESSAGES */}

//         <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-slate-50">
//           {msgs.map((m, i) => (
//             <div
//               key={i}
//               className={`flex ${
//                 m.role === "user" ? "justify-end" : "justify-start"
//               }`}
//             >
//               <div
//                 className={`max-w-[85%] whitespace-pre-line px-4 py-3 rounded-2xl text-sm shadow-sm ${
//                   m.role === "user"
//                     ? "bg-indigo-600 text-white rounded-br-md"
//                     : "bg-white border border-slate-200 text-slate-800 rounded-bl-md"
//                 }`}
//               >
//                 {m.text}
//               </div>
//             </div>
//           ))}

//           {/* LOADING */}

//           {loading && (
//             <div className="flex justify-start">
//               <div className="bg-white border border-slate-200 text-slate-500 rounded-2xl rounded-bl-md px-4 py-3 text-sm shadow-sm animate-pulse">
//                 SmartRetail ML Assistant is analyzing...
//               </div>
//             </div>
//           )}
//         </div>

//         {/* INPUT */}

//         <div className="px-6 pb-6 pt-4 bg-white border-t border-slate-100">
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();

//               send(input);
//             }}
//             className="flex gap-2"
//           >
//             <input
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Ask about forecasting, trends, anomalies..."
//               className="flex-1 px-4 py-3 rounded-xl bg-white text-black border border-slate-300 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />

//             <button
//               type="submit"
//               disabled={loading}
//               className="px-4 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-md active:scale-95 transition-all disabled:opacity-50"
//             >
//               <HiOutlinePaperAirplane className="text-lg" />
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";

import {
  HiOutlinePaperAirplane,
  HiOutlineSparkles,
  HiOutlineChartBar,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";

import api from "../../../shared/services/api";

export default function RetailChatbot() {
  // ======================================
  // STATES
  // ======================================

  const [msgs, setMsgs] = useState([
    {
      role: "bot",

      text: `Hello! I'm your SmartRetail ML Assistant 🤖

I can help with:

• Demand Forecasting
• Product Trend Analysis
• Anomaly Detection
• Inventory Insights
• Restock Recommendations`,
    },
  ]);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  // ======================================
  // SEND MESSAGE
  // ======================================

  const send = async (text) => {
    if (!text.trim()) return;

    // ==================================
    // ADD USER MESSAGE
    // ==================================

    setMsgs((prev) => [
      ...prev,

      {
        role: "user",
        text,
      },
    ]);

    setInput("");

    setLoading(true);

    try {
      // ==================================
      // API REQUEST
      // ==================================

      const res = await api.post(
        "/ai/retail-chat",

        {
          message: text,
        },
      );

      console.log("FULL AI RESPONSE:", res.data);

      let botReply = "No AI response generated.";

      // ==================================
      // RETAIL ML AGENT
      // ==================================

      if (res.data.agent === "retail_ml_agent") {
        const mlResponse = res.data.response;

        console.log("ML RESPONSE:", mlResponse);

        if (typeof mlResponse === "string") {
          botReply = mlResponse;
        } else if (mlResponse.response) {
          botReply = mlResponse.response;
        } else {
          botReply = JSON.stringify(mlResponse, null, 2);
        }
      }

      // ==================================
      // ANALYTICS AGENT
      // ==================================
      else if (res.data.agent === "analytics_agent") {
        const analytics = res.data.response;

        console.log("ANALYTICS RESPONSE:", analytics);

        // ==============================
        // SUMMARY
        // ==============================

        botReply = analytics.summary;

        // ==============================
        // LOW STOCK
        // ==============================

        if (analytics.analytics?.low_stock_products?.length > 0) {
          botReply += `

⚠️ Low Stock Products:
`;

          analytics.analytics.low_stock_products.forEach((item) => {
            botReply +=
              `• ${item.product} ` +
              `(${item.stock} units)
`;
          });
        }

        // ==============================
        // TOP PRODUCTS
        // ==============================

        if (analytics.analytics?.top_products?.length > 0) {
          botReply += `

🏆 Top Products:
`;

          analytics.analytics.top_products.forEach((item) => {
            botReply +=
              `• ${item.product} ` +
              `- ${item.units_sold} sold
`;
          });
        }

        // ==============================
        // PAYMENT SUMMARY
        // ==============================

        if (analytics.analytics?.payments) {
          const pay = analytics.analytics.payments;

          botReply += `

💰 Revenue: ${pay.total_revenue}

Completed Payments: ${pay.completed}

Pending Payments: ${pay.pending}
`;
        }
      }

      // ==================================
      // QA AGENT
      // ==================================
      else if (res.data.agent === "qa_agent") {
        botReply = res.data.response;
      }

      // ==================================
      // DEFAULT RESPONSE
      // ==================================
      else {
        botReply = res.data.message || "No response available.";
      }

      // ==================================
      // CLEAN RESPONSE
      // ==================================

      if (typeof botReply === "string") {
        botReply = botReply
          .replace(/\\n/g, "\n")
          .replace(/\n{3,}/g, "\n\n")
          .trim();
      }

      // ==================================
      // ADD BOT MESSAGE
      // ==================================

      setMsgs((prev) => [
        ...prev,

        {
          role: "bot",
          text: botReply,
        },
      ]);
    } catch (err) {
      console.error(err);

      setMsgs((prev) => [
        ...prev,

        {
          role: "bot",

          text: "⚠️ Failed to connect to SmartRetail ML Assistant.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          AI Retail Assistant
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          ML-Powered Retail Intelligence
        </p>
      </div>

      {/* CHAT CONTAINER */}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden max-w-4xl">
        {/* TOP BAR */}

        <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <HiOutlineSparkles className="text-white text-lg" />
          </div>

          <div>
            <h3 className="font-semibold text-white text-sm">
              SmartRetail ML Assistant
            </h3>

            <p className="text-xs text-indigo-200">
              Forecasting + Analytics + AI
            </p>
          </div>
        </div>

        {/* QUICK ACTIONS */}

        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex flex-wrap gap-2">
          {/* FORECAST */}

          <button
            onClick={() => send("Predict Smartphone demand next month")}
            className="px-3 py-2 text-xs rounded-xl bg-indigo-100 text-indigo-700 hover:bg-indigo-200 flex items-center gap-2"
          >
            <HiOutlineChartBar />
            Forecast Smartphones
          </button>

          {/* TREND */}

          <button
            onClick={() => send("Show Smartphone trend")}
            className="px-3 py-2 text-xs rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200"
          >
            Product Trends
          </button>

          {/* ANOMALY */}

          <button
            onClick={() => send("Detect anomaly in Smartphone sales")}
            className="px-3 py-2 text-xs rounded-xl bg-red-100 text-red-700 hover:bg-red-200 flex items-center gap-2"
          >
            <HiOutlineExclamationTriangle />
            Detect Anomalies
          </button>

          {/* RESTOCK */}

          <button
            onClick={() => send("Which products need restocking?")}
            className="px-3 py-2 text-xs rounded-xl bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
          >
            Restock Suggestions
          </button>

          {/* INVENTORY */}

          <button
            onClick={() => send("Show inventory analytics")}
            className="px-3 py-2 text-xs rounded-xl bg-violet-100 text-violet-700 hover:bg-violet-200"
          >
            Inventory Analytics
          </button>
        </div>

        {/* CHAT MESSAGES */}

        <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-slate-50">
          {msgs.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm shadow-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-indigo-600 text-white rounded-br-md"
                    : "bg-white border border-slate-200 text-slate-800 rounded-bl-md"
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>
              </div>
            </div>
          ))}

          {/* LOADING */}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 text-slate-500 rounded-2xl rounded-bl-md px-4 py-3 text-sm shadow-sm animate-pulse">
                SmartRetail ML Assistant is analyzing...
              </div>
            </div>
          )}
        </div>

        {/* INPUT */}

        <div className="px-6 pb-6 pt-4 bg-white border-t border-slate-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();

              send(input);
            }}
            className="flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about forecasting, trends, anomalies..."
              className="flex-1 px-4 py-3 rounded-xl bg-white text-black border border-slate-300 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-md active:scale-95 transition-all disabled:opacity-50"
            >
              <HiOutlinePaperAirplane className="text-lg" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
