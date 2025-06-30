"use client";

import React, { useState } from "react";

const UserProfileContent: React.FC = () => {
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

  const inputStyle: React.CSSProperties = {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #CED4DA",
    backgroundColor: "#FFFFFF",
    color: "#333333",
    fontSize: "1em",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    transition: "border-color 0.2s ease",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "8px 16px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#0077B6",
    color: "#FFFFFF",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.95em",
    transition: "background-color 0.3s ease, transform 0.2s ease",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
  };

  const sectionHeaderStyle: React.CSSProperties = {
    fontSize: "1.2em",
    color: "#0077B6",
    marginBottom: "10px",
    borderBottom: "1px solid #E0E0E0",
    paddingBottom: "5px",
    fontWeight: "600",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
  };

  const detailTextStyle: React.CSSProperties = {
    fontSize: "1em",
    lineHeight: "1.6",
    color: "#6B7280",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
  };

  const checkboxStyle: React.CSSProperties = {
    marginRight: "10px",
    width: "18px",
    height: "18px",
    cursor: "pointer",
    accentColor: "#0077B6",
  };

  return (
    <div style={{ padding: "20px", height: "calc(100% - 60px)", overflowY: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "20px", borderBottom: "1px solid #E0E0E0", paddingBottom: "20px", marginBottom: "20px" }}>
        <img
          src="/user-avatar.png"
          alt="User Avatar"
          style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", border: "2px solid #0077B6", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", transition: "transform 0.3s ease" }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
        <div style={{ flexGrow: 1 }}>
          {isEditing ? (
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#0077B6")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#CED4DA")}
            />
          ) : (
            <h1 style={{ margin: 0, fontSize: "1.8em", color: "#333333", fontWeight: "600", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>{userName}</h1>
          )}
          <p style={{ margin: "5px 0 0 0", fontSize: "0.9em", color: "#6B7280", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>{email}</p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <div>
          <h3 style={sectionHeaderStyle}>About</h3>
          {isEditing ? (
            <textarea
              value={userBio}
              onChange={(e) => setUserBio(e.target.value)}
              rows={3}
              style={{ ...inputStyle, width: "100%", minHeight: "60px" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#0077B6")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#CED4DA")}
            />
          ) : (
            <p style={detailTextStyle}>{userBio}</p>
          )}
        </div>

        <div>
          <h3 style={sectionHeaderStyle}>Disaster Preparedness</h3>
          <p style={detailTextStyle}>
            Disaster Insurance Score: <strong style={{ color: "#0077B6" }}>{disasterScore}</strong> / 100
          </p>
        </div>

        <div>
          <h3 style={sectionHeaderStyle}>Preferences</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={detailTextStyle}>Language:</span>
            {isEditing ? (
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#0077B6")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#CED4DA")}
              >
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

      <div style={{ display: "flex", justifyContent: isEditing ? "space-between" : "flex-end", marginTop: "25px", gap: "10px" }}>
        {isEditing ? (
          <>
            <button
              onClick={handleCancel}
              style={{ ...buttonStyle, backgroundColor: "#6B7280" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#4B5563"; e.currentTarget.style.transform = "scale(1.05)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#6B7280"; e.currentTarget.style.transform = "scale(1)"; }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={buttonStyle}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#005A8A"; e.currentTarget.style.transform = "scale(1.05)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#0077B6"; e.currentTarget.style.transform = "scale(1)"; }}
            >
              Save Changes
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            style={buttonStyle}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#005A8A"; e.currentTarget.style.transform = "scale(1.05)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#0077B6"; e.currentTarget.style.transform = "scale(1)"; }}
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfileContent;