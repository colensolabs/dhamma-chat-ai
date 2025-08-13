import HeroDharma from "@/components/hero/HeroDharma";
import DharmaChat from "@/components/chat/DharmaChat";

const Index = () => {
  return (
    <main>
      <section aria-label="Hero" className="relative">
        <HeroDharma />
      </section>
      <section id="chat" aria-label="Chat" className="container py-10 md:py-16">
        <DharmaChat />
      </section>
    </main>
  );
};

export default Index;
