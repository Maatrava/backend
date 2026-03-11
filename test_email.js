const run = async () => {
    try {
        // 1. Signup
        const signupRes = await fetch("http://localhost:5000/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "Test User Email", email: `testemail${Date.now()}@example.com`, password: "password123", phone: "1234567890" })
        });
        const signupData = await signupRes.json();
        console.log("Signup:", signupData);

        const token = signupData.token;

        // 2. Update profile
        const updateRes = await fetch("http://localhost:5000/api/user/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ name: "Updated Name via API", email: `newemail${Date.now()}@example.com`, phone: "9876543210", profilePicture: "http://example.com/pic.jpg" })
        });
        const updateData = await updateRes.json();
        console.log("Update profile:", updateData);

        // 3. Get profile
        const getRes = await fetch("http://localhost:5000/api/user/profile", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const getData = await getRes.json();
        console.log("Get profile:", getData);
    } catch (e) { console.error(e) }
};

run();
