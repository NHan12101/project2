import React, { useState } from "react";
import axios from "axios";

export default function Payment() {
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("stripe");
    const [loading, setLoading] = useState(false);

    const handlePay = async () => {
        if (!amount || Number(amount) <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post("/payments/create", {
                amount: Number(amount),
                method: method,
            });

            if (res.data.url) {
                window.location.href = res.data.url;
            } else {
                alert("Payment URL not returned");
            }
        } catch (error) {
            console.error(error);
            alert("Payment error");
        }

        setLoading(false);
    };

    const getCurrencyLabel = () => {
        return ["stripe", "paypal"].includes(method) ? "USD" : "VND";
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Payment Checkout</h1>

                <div style={styles.group}>
                    <label style={styles.label}>Amount ({getCurrencyLabel()})</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        style={styles.input}
                        placeholder={`Enter amount (${getCurrencyLabel()})`}
                    />
                </div>

                <div style={styles.group}>
                    <label style={styles.label}>Payment Method</label>
                    <select
                        style={styles.select}
                        value={method}
                        onChange={(e) => setMethod(e.target.value)}
                    >
                        <option value="stripe">Stripe (USD)</option>
                        <option value="paypal">PayPal (USD)</option>
                        <option value="momo">MoMo (VND)</option>
                        <option value="vnpay">VNPAY (VND)</option>
                    </select>
                </div>

                <button
                    onClick={handlePay}
                    style={loading ? styles.buttonDisabled : styles.button}
                    disabled={loading}
                >
                    {loading ? "Processing..." : "Pay Now"}
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        background: "#f2f2f7",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
    },
    card: {
        width: "420px",
        background: "#fff",
        padding: "32px",
        borderRadius: "16px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        fontFamily: "Arial, sans-serif",
    },
    title: {
        textAlign: "center",
        fontSize: "24px",
        marginBottom: "24px",
        fontWeight: "bold",
        color: "#333",
    },
    group: {
        marginBottom: "18px",
    },
    label: {
        display: "block",
        marginBottom: "6px",
        fontSize: "15px",
        fontWeight: "600",
        color: "#444",
    },
    input: {
        width: "100%",
        padding: "12px",
        fontSize: "15px",
        borderRadius: "10px",
        border: "1px solid #ccc",
        outline: "none",
        transition: "0.2s",
    },
    select: {
        width: "100%",
        padding: "12px",
        fontSize: "15px",
        borderRadius: "10px",
        border: "1px solid #ccc",
        outline: "none",
    },
    button: {
        width: "100%",
        padding: "14px",
        background: "#007bff",
        color: "#fff",
        fontSize: "17px",
        borderRadius: "10px",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
        transition: "0.2s",
    },
    buttonDisabled: {
        width: "100%",
        padding: "14px",
        background: "#7cb3ff",
        color: "#fff",
        fontSize: "17px",
        borderRadius: "10px",
        border: "none",
        cursor: "not-allowed",
        fontWeight: "bold",
    },
};
