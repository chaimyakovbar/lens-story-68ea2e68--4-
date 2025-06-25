export const sendEmail = async (formData) => {
  try {
    // Use the standalone email server URL from environment variables
    const emailServerUrl = import.meta.env.VITE_EMAIL_SERVER_URL || 'http://localhost:3001';

    const response = await fetch(`${emailServerUrl}/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        from_name: `${formData.firstName} ${formData.lastName}`,
        from_email: formData.email,
        message: formData.message,
        to_name: "Netanel",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(errorText || "Failed to send email");
    }

    const data = await response.json();
    return {
      success: true,
      message: "Email sent successfully!",
      data,
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      message: "Failed to send email. Please try again.",
      error: error.message,
    };
  }
};
