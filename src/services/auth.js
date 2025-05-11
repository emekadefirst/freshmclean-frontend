import { apiCall, API } from "./api";


export function authenticate() {
    const access_token = localStorage.getItem('access_token');
    const refresh_token = localStorage.getItem('refresh_token');
    window.dispatchEvent(new Event("authChanged"));
    return !!(access_token && refresh_token);
}


export async function FromLogin(data) {
    const response = await apiCall("auth/login", data, "POST");
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);
    return response
}

export async function FromRegister(data) {
    const response = await apiCall("auth/register", data, "POST");
    return response;
}


export async function GetAuthenUser() {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API}/auth/user`, token)
    return response
}




export async function handleGoogleSignIn(response, navigate, toast) {
    const tokenData = JSON.stringify({ access_token: response.credential });  
    console.log(tokenData)
    try {
        const res = await fetch(`${API}/auth/google-auth`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: tokenData
        });

        const result = await res.json();
        console.log(result);

        if (res.status === 200) {
            localStorage.setItem("access_token", result.access_token);
            localStorage.setItem("refresh_token", result.refresh_token);
            toast.success("Signed in with Google!");
            navigate("/");
            window.location.reload();
        } else {
            throw new Error(result.detail);
        }
    } catch (error) {
        console.error("Google Sign-In error:", error);
        toast.error(error.message || "An error occurred during Google Sign-In.");
    }
}



