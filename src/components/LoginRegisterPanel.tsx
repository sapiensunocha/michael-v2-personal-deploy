import React, { useState } from 'react';
const __app_id = 'my-disaster-app';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { Firestore, doc, setDoc } from 'firebase/firestore';

interface LoginRegisterPanelProps {
  auth: Auth | null;
  db: Firestore | null;
  userId: string | null;
  setUser: (user: User | null) => void;
}

const LoginRegisterPanel: React.FC<LoginRegisterPanelProps> = ({ auth, db, userId, setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const appTextStyle: React.CSSProperties = {
    fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    color: "#E0E0E0",
    lineHeight: 1.6,
  };

  const inputStyle: React.CSSProperties = {
    width: 'calc(100% - 20px)',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '6px',
    border: '1px solid #444',
    backgroundColor: '#333',
    color: '#E0E0E0',
    fontSize: '1em',
    outline: 'none',
    boxSizing: 'border-box',
    ...appTextStyle,
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 20px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1.05em',
    transition: 'background-color 0.2s ease-in-out',
    marginTop: '10px',
    ...appTextStyle,
  };

  const toggleModeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: '#88ccff',
    cursor: 'pointer',
    fontSize: '0.9em',
    marginTop: '15px',
    textDecoration: 'underline',
    ...appTextStyle,
  };

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    if (!auth) {
      setError("Firebase Auth not initialized.");
      setLoading(false);
      return;
    }

    try {
      if (isRegisterMode) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        setUser(userCredential.user);
        // Optionally save additional user data to Firestore here
        if (db && userCredential.user.uid) {
            const userDocRef = doc(db, `/artifacts/${__app_id}/users/${userCredential.user.uid}/profile/details`);
            await setDoc(userDocRef, { email: userCredential.user.email, registeredAt: new Date().toISOString() });
        }
        alert("Registration successful! You are now logged in.");
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setUser(userCredential.user);
        alert("Login successful!");
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message || "An authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '10px 20px', ...appTextStyle }}>
      <h2 style={{ color: "#88ccff", marginBottom: "20px", textAlign: "center" }}>
        {isRegisterMode ? "Register New Account" : "Login"}
      </h2>
      {!auth ? (
        <p style={{ color: '#dc3545', textAlign: 'center' }}>Loading authentication services...</p>
      ) : (
        <form onSubmit={handleAuth}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
            aria-label="Email"
          />

          <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
            aria-label="Password"
          />

          {error && <p style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '10px', textAlign: 'center' }}>{error}</p>}

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? "Processing..." : (isRegisterMode ? "Register" : "Login")}
          </button>
          <button
            type="button"
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            style={toggleModeButtonStyle}
            disabled={loading}
          >
            {isRegisterMode ? "Already have an account? Login" : "New user? Register here"}
          </button>
        </form>
      )}
    </div>
  );
};

export default LoginRegisterPanel;
