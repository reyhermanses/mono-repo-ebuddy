export const login = async (email: string, password: string) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Login gagal");
        }

        const data = await response.json();
        localStorage.setItem("token", data.token);
        return data;
    } catch (error: any) {
        throw new Error(error.message || "Terjadi kesalahan");
    }
};

export const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
};
