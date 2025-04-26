import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import { allowedUsers } from "../constants";

function GoogleAuth() {
  const handleSuccess = (credentialResponse) => {
    const decoded = jwt_decode(credentialResponse.credential);
    console.log(decoded);
    if (allowedUsers.includes(decoded.email)) {
      console.log("✅ Login allowed for:", decoded.email);
    } else {
      console.error("❌ Access denied for:", decoded.email);
      alert("You are not authorized to access this application.");
    }
    alert("Login Success!");
  };

  const handleError = () => {
    alert("Login Failed");
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
}

export default GoogleAuth;
