const sendEmail = async (email: string) => {
  const response = await fetch("/api/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: email,
      subject: "Hello from Next.js",
      text: "This is a test email.",
    }),
  });

  const data = await response.json();
  console.log(data);
};

export default sendEmail;
