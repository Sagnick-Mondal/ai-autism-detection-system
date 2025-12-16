import EmotionDetectionApp from "./components/EmotionDetectionApp";
import LandingPage from "./components/LandingPage";
import Navbar from "./components/Navbar";
import AboutPage from "./about/page";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <LandingPage />
      <EmotionDetectionApp />
      <AboutPage />
      <Footer />
    </>
  );
}
