import fetch from "node-fetch";

async function testLogin() {
  try {
    const res = await fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@technnskill.com",
        password: "admin123",
      }),
    });

    console.log("status", res.status);
    const text = await res.text();
    console.log(text);
  } catch (err) {
    console.error(err);
  }
}

testLogin();
