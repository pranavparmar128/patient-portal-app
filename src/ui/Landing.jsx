import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const Landing = () => {
  const [accessToken, setAccessToken] = useState(
    sessionStorage.getItem("accessToken") || null
  );
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Liferay OAuth configuration
  const clientId =
    import.meta.env.VITE_LIFERAY_CLIENT_ID ||
    "id-ce7013dd-821f-8235-b46d-be98795d2e45";
  const clientSecret =
    import.meta.env.VITE_LIFERAY_CLIENT_SECRET ||
    "secret-874d72f5-e962-55c7-47f0-9fab37979713";
  const authorizeUrl = "http://localhost:8080/o/oauth2/authorize";
  const tokenUrl = "http://localhost:8080/o/oauth2/token";
  const redirectUri = "http://localhost:5173/grant-type-authorization-code";
  const userApiUrl =
    "http://localhost:8080/o/headless-admin-user/v1.0/my-user-account";

  // Handle OAuth redirect and check if already logged in
  useEffect(() => {
    if (accessToken) {
      // If already logged in, redirect to home
      navigate("/home", { state: { userData } });
      return;
    }

    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get("code");
    console.log("Authorization Code:", code);

    if (!code) {
      setError("No authorization code found in URL");
      return;
    }

    const payload = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    });
    console.log("Token Request Payload:", payload.toString());

    axios
      .post(tokenUrl, payload, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        const token = response.data.access_token;
        setAccessToken(token);
        sessionStorage.setItem("accessToken", token); // Persist token
        fetchUserData(token);
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.error
          ? `Failed to exchange authorization code: ${
              err.response.data.error
            } - ${err.response.data.error_description || ""}`
          : `Failed to exchange authorization code: ${err.message}`;
        setError(errorMessage);
        console.error("Error Details:", err.response?.data);
      });
  }, [accessToken, navigate, location.search, userData]);

  // Fetch user data with access token
  const fetchUserData = async (token) => {
    try {
      const response = await axios.get(userApiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(response.data);
      // Redirect to home page with user data
      navigate("/home", { state: { userData: response.data } });
    } catch (err) {
      setError("Failed to fetch user data");
      console.error(err);
    }
  };

  // Initiate OAuth authorization
  const handleLogin = () => {
    const scopes = [
      "Liferay.Headless.Delivery.POST",
      "Liferay.Headless.Delivery.GET",
      "liferay-json-web-services.everything.read",
      "liferay-json-web-services.everything.write",
      "liferay-json-web-services.everything.read.documents.download",
      "liferay-json-web-services.everything.read.userprofile",
    ];
    const authUrl = `${authorizeUrl}?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scopes.join(" "))}`;
    console.log("Authorization URL:", authUrl);
    window.location.href = authUrl;
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        {accessToken ? (
          <p>Redirecting to home page...</p>
        ) : (
          <div className="relative isolate px-6 lg:px-8">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            ></div>
            <div className="mx-auto max-w-2xl sm:py-20">
              <div className="text-center">
                <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl"></h1>

                <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
                    Portal for Efficient Hospital Data Management
                  </span>{" "}
                </h1>
                <p className="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">
                  A unified platform to efficiently manage appointments, medical
                  records, and hospital rooms.
                </p>

                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <a
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:cursor-pointer"
                    onClick={handleLogin}
                  >
                    Login <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Landing;
