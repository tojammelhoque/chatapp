import toast from "react-hot-toast";

function ChatPage() {
  return <div>
    <button onClick={()=> toast.success("hello")}>clickme</button>
  </div>;
}

export default ChatPage;
