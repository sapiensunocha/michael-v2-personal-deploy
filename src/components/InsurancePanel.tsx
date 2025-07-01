import React, { useState, useEffect } from 'react';
import { Firestore, doc, getDoc, setDoc } from 'firebase/firestore';

interface InsurancePanelProps {
  db: Firestore | null;
  userId: string | null;
}

const InsurancePanel: React.FC<InsurancePanelProps> = ({ db, userId }) => {
  const [isSubscribedToGDIF, setIsSubscribedToGDIF] = useState(false);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);

  const appTextStyle: React.CSSProperties = {
    fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    color: "#E0E0E0",
    lineHeight: 1.6,
  };

  const sectionStyle: React.CSSProperties = {
    backgroundColor: "rgba(30, 30, 30, 0.7)",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 20px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: isSubscribedToGDIF ? '#dc3545' : '#28a745',
    color: 'white',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1.05em',
    transition: 'background-color 0.2s ease-in-out',
    marginTop: '10px',
    ...appTextStyle,
  };

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (!db || !userId) {
        setLoadingSubscription(false);
        return;
      }
      setLoadingSubscription(true);
      try {
        const docRef = doc(db, `/artifacts/${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}/users/${userId}/gdifSubscriptions/subscriptionStatus`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setIsSubscribedToGDIF(docSnap.data().isSubscribed || false);
        } else {
          setIsSubscribedToGDIF(false);
        }
      } catch (err: any) {
        console.error("Failed to fetch GDIF subscription status:", err);
        setSubscriptionError("Failed to load subscription status.");
        setIsSubscribedToGDIF(false);
      } finally {
        setLoadingSubscription(false);
      }
    };

    fetchSubscriptionStatus();
  }, [db, userId]);

  const handleSubscriptionToggle = async () => {
    if (!db || !userId) {
      alert("Please login or ensure Firebase services are ready to manage your subscription.");
      return;
    }
    setLoadingSubscription(true);
    setSubscriptionError(null);
    const newSubscriptionStatus = !isSubscribedToGDIF;

    try {
      const docRef = doc(db, `/artifacts/${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}/users/${userId}/gdifSubscriptions/subscriptionStatus`);
      await setDoc(docRef, { isSubscribed: newSubscriptionStatus, lastUpdated: new Date().toISOString() }, { merge: true });
      setIsSubscribedToGDIF(newSubscriptionStatus);
      alert(`You have successfully ${newSubscriptionStatus ? 'subscribed to' : 'unsubscribed from'} GDIF!`);
    } catch (err: any) {
      console.error("Failed to update GDIF subscription:", err);
      setSubscriptionError("Failed to update subscription. Please try again.");
    } finally {
      setLoadingSubscription(false);
    }
  };

  return (
    <div style={{ padding: '10px 20px', ...appTextStyle, overflowY: 'auto', height: '100%' }}>
      <h2 style={{ color: "#88ccff", marginBottom: "20px", textAlign: "center" }}>Global Disaster Insurance Fund (GDIF)</h2>

      <div style={sectionStyle}>
        <h3 style={{ color: "#E0E0E0", marginBottom: "10px" }}>A New Era of Disaster Resilience</h3>
        <p style={{ fontSize: "0.95em", color: "#A0A0A0" }}>
          The Global Disaster Insurance Fund (GDIF) is a revolutionary initiative designed to provide rapid, pre-financed disaster response, especially for low-income countries. It uses a parametric insurance model, ensuring quick payouts based on objective triggers like wind speed or rainfall, rather than slow damage assessments.
        </p>
      </div>

      <div style={sectionStyle}>
        <h3 style={{ color: "#E0E0E0", marginBottom: "10px" }}>How GDIF Works:</h3>
        <ul style={{ listStyleType: 'disc', marginLeft: '20px', fontSize: '0.9em' }}>
          <li><strong>Pre-financed Liquidity:</strong> Funds are ready <em>before</em> disaster strikes.</li>
          <li><strong>Parametric Triggers:</strong> Payouts are automatic based on pre-defined, measurable event thresholds (e.g., hurricane wind speed, drought severity).</li>
          <li><strong>Multi-Layered Coverage:</strong> Protects nations, regions, and even individual households.</li>
          <li><strong>Faster Than Aid:</strong> Delivers funds 3-4 times faster than traditional humanitarian aid.</li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h3 style={{ color: "#E0E0E0", marginBottom: "10px" }}>Benefits for You:</h3>
        <p style={{ fontSize: "0.9em", color: "#A0A0A0" }}>
          By supporting or subscribing to GDIF, you contribute to a more resilient world. While direct individual payouts are primarily through microinsurance tiers in affected regions, your monthly contribution (simulated here) helps build this vital global safety net.
        </p>
      </div>

      <div style={sectionStyle}>
        <h3 style={{ color: "#88ccff", marginBottom: "10px", textAlign: "center" }}>Join the GDIF Initiative</h3>
        <p style={{ fontSize: "0.9em", color: "#A0A0A0", textAlign: "center", marginBottom: "15px" }}>
          Your monthly contribution helps protect vulnerable communities worldwide.
        </p>
        {loadingSubscription ? (
          <p style={{ textAlign: 'center', color: '#88ccff' }}>Loading subscription status...</p>
        ) : (
          <>
            <button
              onClick={handleSubscriptionToggle}
              style={buttonStyle}
              disabled={loadingSubscription}
            >
              {isSubscribedToGDIF ? "Unsubscribe from GDIF (Simulated)" : "Subscribe to GDIF (Simulated Payment)"}
            </button>
            <p style={{ fontSize: "0.8em", color: "#ffc107", marginTop: "10px", textAlign: "center" }}>
              * <strong>IMPORTANT:</strong> This is a simulated subscription within the app. Actual payment processing via Stripe requires a secure backend server, which is beyond the scope of this client-side environment.
            </p>
            {subscriptionError && <p style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '10px', textAlign: 'center' }}>{subscriptionError}</p>}
            {!userId && <p style={{ color: '#ffc107', textAlign: 'center', padding: '5px', fontSize: '0.8em' }}>Login to save your GDIF subscription status.</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default InsurancePanel;