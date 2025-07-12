import ContactForm from "../components/ContactForm/ContactForm";
import ContactHeader from "../components/ContactHeader/ContactHeader";

const ContactUs = () => {
    return (
        <div>
            <main className="main_container">
                <ContactHeader />
                <ContactForm />
            </main>
        </div>
    );
};

export default ContactUs;
