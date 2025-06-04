import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Phone, Mail, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { sendEmail } from "@/utils/email";
import { toast } from "sonner";

const pageTranslations = {
  en: {
    pageTitle: "Get in Touch",
    pageSubtitle: "Let's create something amazing together",
    formTitle: "Send us a Message",
    formSubtitle:
      "We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.",
    firstNameLabel: "First Name",
    firstNamePlaceholder: "John",
    lastNameLabel: "Last Name",
    lastNamePlaceholder: "Doe",
    emailLabel: "Email",
    emailPlaceholder: "john@example.com",
    messageLabel: "Message",
    messagePlaceholder: "Tell us about your project...",
    sendButton: "Send Message",
    sendingButton: "Sending...",
    infoTitle: "Contact Information",
    infoSubtitle:
      "Reach out through any of these channels and we'll respond within 24 hours.",
    phone: { title: "Phone", details: "0548005704" },
    email: { title: "Email", details: "8005704@gmail.com" },
    emailSuccess:
      "Your message has been sent successfully! We'll get back to you soon.",
    emailError: "Failed to send message. Please try again later.",
  },
  he: {
    pageTitle: "צור קשר",
    pageSubtitle: "בואו ניצור משהו מדהים ביחד",
    formTitle: "שלח לנו הודעה",
    formSubtitle:
      "נשמח לשמוע ממך. מלא את הטופס למטה ואנו נחזור אליך בהקדם האפשרי.",
    firstNameLabel: "שם פרטי",
    firstNamePlaceholder: "יוסי",
    lastNameLabel: "שם משפחה",
    lastNamePlaceholder: "כהן",
    emailLabel: "אימייל",
    emailPlaceholder: "yossi@example.com",
    messageLabel: "הודעה",
    messagePlaceholder: "ספר לנו על הפרויקט שלך...",
    sendButton: "שלח הודעה",
    sendingButton: "שולח...",
    infoTitle: "פרטי התקשרות",
    infoSubtitle: "פנה אלינו דרך אחד מהערוצים הבאים ואנו נגיב תוך 24 שעות.",
    phone: { title: "טלפון", details: "0548005704" }, // Details can be static
    email: { title: "אימייל", details: "8005704@gmail.com" },
    emailSuccess: "ההודעה שלך נשלחה בהצלחה! נחזור אליך בהקדם.",
    emailError: "שליחת ההודעה נכשלה. אנא נסה שוב מאוחר יותר.",
  },
};

export default function Contact({ lang = "he" }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const t = pageTranslations[lang];
  const isRTL = lang === "he";

  const contactInfo = [
    { icon: Phone, ...t.phone },
    { icon: Mail, ...t.email },
  ];

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await sendEmail(formData);

      if (result.success) {
        toast.success(t.emailSuccess || "Email sent successfully!");
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          message: "",
        });
      } else {
        toast.error(t.emailError || "Failed to send email. Please try again.");
      }
    } catch (error) {
      toast.error(t.emailError || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero Section */}
      <section className="relative h-[40vh] overflow-hidden">
        {/* ... hero content ... */}
        <div className="relative z-20 h-full flex items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
              {t.pageTitle}
            </h1>
            <p className="text-xl text-gray-200">{t.pageSubtitle}</p>
          </motion.div>
        </div>
        <motion.div
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-black/50 z-10" />
          <img
            src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            alt="Contact"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div
            className={`grid md:grid-cols-2 gap-12 ${
              isRTL ? "md:grid-flow-col-dense" : ""
            }`}
          >
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className={`space-y-8 ${isRTL ? "md:col-start-2" : ""}`}
            >
              <div>
                <h2 className="text-3xl font-bold mb-4">{t.formTitle}</h2>
                <p className="opacity-80">{t.formSubtitle}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div
                  className={`grid grid-cols-2 gap-4 ${
                    isRTL ? "grid-flow-col-dense" : ""
                  }`}
                >
                  <div className={`space-y-2 ${isRTL ? "col-start-2" : ""}`}>
                    <label htmlFor="firstName" className="text-sm font-medium">
                      {t.firstNameLabel}
                    </label>
                    <Input
                      required
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder={t.firstNamePlaceholder}
                    />
                  </div>
                  <div className={`space-y-2 ${isRTL ? "col-start-1" : ""}`}>
                    <label htmlFor="lastName" className="text-sm font-medium">
                      {t.lastNameLabel}
                    </label>
                    <Input
                      required
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder={t.lastNamePlaceholder}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    {t.emailLabel}
                  </label>
                  <Input
                    required
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t.emailPlaceholder}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    {t.messageLabel}
                  </label>
                  <Textarea
                    required
                    id="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder={t.messagePlaceholder}
                    className="h-32"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-pink-600 to-red-600 text-white font-medium hover:from-pink-700 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Send className="h-4 w-4 text-white" />
                    </motion.div>
                  ) : (
                    <span
                      className={`flex items-center gap-2 ${
                        isRTL ? "flex-row-reverse" : ""
                      }`}
                    >
                      <Send className="h-4 w-4 text-white" />
                      {t.sendButton}
                    </span>
                  )}
                </Button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className={`space-y-8 ${isRTL ? "md:col-start-1" : ""}`}
            >
              <div>
                <h2 className="text-3xl font-bold mb-4">{t.infoTitle}</h2>
                <p className="opacity-80">{t.infoSubtitle}</p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-end gap-4 p-4 rounded-lg bg-accent ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`p-3 rounded-full bg-primary/10 ${
                        isRTL ? "order-2" : ""
                      }`}
                    >
                      <info.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div
                      className={`${
                        isRTL ? "text-right order-1" : "text-left"
                      }`}
                    >
                      <h3 className="font-medium mb-1">{info.title}</h3>
                      <p className="opacity-80">{info.details}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
