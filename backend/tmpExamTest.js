import fetch from "node-fetch";

async function run() {
  const loginRes = await fetch("http://localhost:5000/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@technnskill.com",
      password: "admin123",
    }),
  });

  const loginBody = await loginRes.json();
  console.log("login status", loginRes.status, loginBody);
  if (!loginRes.ok) return;

  const createRes = await fetch("http://localhost:5000/api/exams", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${loginBody.token}`,
    },
    body: JSON.stringify({
      title: "Test Exam",
      subject: "Programming",
      duration: 30,
      passingMarks: 10,
      description: "Test exam description",
    }),
  });

  console.log("create status", createRes.status);
  console.log(await createRes.text());
}

run().catch(console.error);
