export const sendEmail = async (formData) => {
  try {
    // Use the same environment variable as Collection component with production fallback
    const emailServerUrl =
      import.meta.env.VITE_API_BASE_URL ||
      "https://lens-story-68ea2e68-4.onrender.com";

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
