import Button from "../Button/Button";
import styles from "./ContactForm.module.css";
import { MdMessage } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { HiMail } from "react-icons/hi";
import contactImage from "../../images/Contact.jpg";
import { send } from "@emailjs/browser";

const ContactForm = () => {
    const onSubmit = (event) => {
        event.preventDefault();

        const formData = {
            from_name: event.target.name.value,
            to_name: "Yashswi.dev",
            message: event.target.text.value
        };

        send(
            "service_lw3c74n",
            "template_3bpm9dj",
            formData,
            "AZOALSVe3kWyg0sds"
        )
            .then((response) => {
                alert("Message sent successfully!");
                console.log("SUCCESS!", response.status, response.text);
            })
            .catch((err) => {
                alert("Failed to send message, please try again.");
                console.error("FAILED...", err);
            });
    };

    return (
        <section className={styles.container}>
            <div className={styles.contact_form}>
                <div className={styles.top_btn}>
                    <Button
                    className={styles.formbuttons} 
                        text="VIA SUPPORT CHAT"
                        icon={<MdMessage fontSize="24px" />}
                    />
                    <Button
                    className={styles.formbuttons} 
                        text="VIA CALL"
                        icon={<FaPhoneAlt fontSize="24px" />}
                    />
                </div>
                <Button
                className={styles.formbuttons} 
                    isOutline={true}
                    text="VIA EMAIL FORM"
                    icon={<HiMail fontSize="24px" />}
                />

                <form onSubmit={onSubmit}>
                    <div className={styles.form_control}>
                        <label htmlFor="name">Name</label>
                        <input type="text" name="name" />
                    </div>
                    <div className={styles.form_control}>
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" />
                    </div>
                    <div className={styles.form_control}>
                        <label htmlFor="text">Text</label>
                        <textarea name="text" rows="8" />
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "end",
                        }}
                    >
                        <Button className={styles.formbuttons} text="SUBMIT" />
                    </div>
                </form>
            </div>
            <div className={styles.contact_image}>
                <img src={contactImage} alt="contact image" />
            </div>
        </section>
    );
};

export default ContactForm;
