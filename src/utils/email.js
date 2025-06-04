export const sendEmail = async (formData) => {
  try {
    console.log("Sending email with data:", {
      from_name: `${formData.firstName} ${formData.lastName}`,
      from_email: formData.email,
      message: formData.message,
      to_name: "Netanel",
    });

    const response = await fetch("/api/send-email", {
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

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(errorText || "Failed to send email");
    }

    const data = await response.json();
    console.log("Success response:", data);

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
