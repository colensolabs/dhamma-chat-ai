import DharmaChat from "@/components/chat/DharmaChat";

const Chat = () => {
  return (
    <main>
      <section aria-label="Chat" className="container py-4 md:py-6">
        <h1 className="sr-only">Dharma Guide Chat</h1>
        <DharmaChat />
      </section>
    </main>
  );
};

export default Chat;
