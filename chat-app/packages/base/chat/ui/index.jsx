import './index.css';
import { Message } from '@chatapp/message';
import { Loading } from '@chatapp/loading';
import { useChatLogic } from '@chatapp/usechat';

export const Chat = () => {
  const { messages, loading, handleSubmit, inputRef } = useChatLogic();

  const messageComponents = messages.map((message, index) => (
    <Message text={message.text} role={message.role} key={index} />
  ));

  return (
    <section className="chat">
      <section className="chat__messages">
        {messageComponents}
        {loading && <Loading />}
      </section>

      <form className="chat__form" onSubmit={handleSubmit}>
        <input type="text" className="chat__input" ref={inputRef} />
        <button className="chat__btn">Skicka!</button>
      </form>
    </section>
  );
};
