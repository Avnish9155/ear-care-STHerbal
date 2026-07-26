import Header from "../components/Header";
import Hero from "../components/Hero";
import Benefits from "../components/Benefits";
import Product from "../components/Product";
import Ingredients from "../components/Ingredients";
import HowToUse from "../components/HowToUse";
import Reviews from "../components/Reviews";
import OrderForm from "../components/OrderForm";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />

        <Benefits />

        <Product />

        <Ingredients />

        <HowToUse />

        <Reviews />

        <OrderForm />
      </main>

      <Footer />
    </>
  );
}

export default Home;
