"use client"; // This component is a client component

import React, { useState } from "react";

interface UserProfileContentProps {
  // onClose prop is no longer directly used here, as it"s passed to the wrapper panel
}

const UserProfileContent: React.FC<UserProfileContentProps> = () => {
  // Mock User Data
  const [userName, setUserName] = useState("Sapiens Ndatabaye");
  const [userBio, setUserBio] = useState("Pioneering disaster intelligence with cutting-edge map technology.");
  const [disasterScore, setDisasterScore] = useState(92);
  const [language, setLanguage] = useState("English");
  const [email, setEmail] = useState("sapiens.ndatabaye@example.com");

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    console.log("Saving profile changes:", { userName, userBio, language });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // Inline Styles for Consistency
  const inputStyle: React.CSSProperties = {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #444",
    backgroundColor: "#333",
    color: "#E0E0E0",
    fontSize: "1em",
    outline: "none",
    width: "calc(100% - 20px)", // Adjust for padding
    boxSizing: "border-box",
    fontFamily: "\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "12px 25px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "1em",
    transition: "background-color 0.2s ease-in-out, transform 0.1s ease-in-out",
    flexShrink: 0,
    fontFamily: "\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
  };

  const sectionHeaderStyle: React.CSSProperties = {
    fontSize: "1.3em",
    color: "#88ccff",
    marginBottom: "10px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    paddingBottom: "5px",
    fontWeight: "600",
  };

  const detailTextStyle: React.CSSProperties = {
    fontSize: "1em",
    lineHeight: "1.6",
    color: "#A0A0A0",
    fontFamily: "\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
  };

  const checkboxStyle: React.CSSProperties = {
      marginRight: "10px",
      width: "18px",
      height: "18px",
      cursor: "pointer",
      accentColor: "#007bff",
  };

  return (
    <div style={{ paddingBottom: "20px" }}> {/* Internal padding for content */}
      {/* Profile Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "25px",
        borderBottom: "1px solid #333",
        paddingBottom: "20px",
        marginBottom: "20px", // Added margin bottom for spacing
      }}>
        <img
          src="/user-avatar.png"
          alt="App Logo"
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "3px solid #007bff",
            boxShadow: "0 0 15px rgba(0,123,255,0.5)",
          }}
        />
        <div style={{ flexGrow: 1 }}>
          {isEditing ? (
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              style={inputStyle}
            />
          ) : (
            <h1 style={{ margin: "0", fontSize: "2em", color: "#88ccff", fontWeight: "600" }}>{userName}</h1>
          )}
          <p style={{ margin: "5px 0 0 0", fontSize: "0.95em", color: "#A0A0A0" }}>{email}</p>
        </div>
      </div>

      {/* Profile Details & About */}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <div>
          <h3 style={sectionHeaderStyle}>About</h3>
          {isEditing ? (
            <textarea
              value={userBio}
              onChange={(e) => setUserBio(e.target.value)}
              rows={3}
              style={{ ...inputStyle, width: "calc(100% - 24px)", minHeight: "60px" }}
            />
          ) : (
            <p style={detailTextStyle}>{userBio}</p>
          )}
        </div>

        <div>
          <h3 style={sectionHeaderStyle}>Disaster Preparedness</h3>
          <p style={detailTextStyle}>
            Disaster Insurance Score: <strong style={{ color: "#007bff" }}>{disasterScore}</strong> / 100
          </p>
        </div>

        <div>
          <h3 style={sectionHeaderStyle}>Preferences</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={detailTextStyle}>Language:</span>
            {isEditing ? (
              <select value={language} onChange={(e) => setLanguage(e.target.value)} style={inputStyle}>
                <option value="English">English</option>
                <option value="French">Français</option>
                <option value="Spanish">Español</option>
              </select>
            ) : (
              <span style={detailTextStyle}>{language}</span>
            )}
          </div>
        </div>

        <div>
          <h3 style={sectionHeaderStyle}>Notifications</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <label style={detailTextStyle}>
              <input type="checkbox" defaultChecked={true} style={checkboxStyle} />
              <span>Email Alerts for Local Disasters</span>
            </label>
            <label style={detailTextStyle}>
              <input type="checkbox" defaultChecked={false} style={checkboxStyle} />
              <span>SMS Updates</span>
            </label>
            <label style={detailTextStyle}>
              <input type="checkbox" defaultChecked={true} style={checkboxStyle} />
              <span>App Notifications for General Advisories</span>
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", justifyContent: isEditing ? "space-between" : "flex-end", marginTop: "25px", gap: "15px" }}>
        {isEditing ? (
          <>
            <button onClick={handleCancel} style={{ ...buttonStyle, backgroundColor: "#555" }}>
              Cancel
            </button>
            <button onClick={handleSave} style={{ ...buttonStyle, backgroundColor: "#007bff" }}>
              Save Changes
            </button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)} style={buttonStyle}>
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfileContent;