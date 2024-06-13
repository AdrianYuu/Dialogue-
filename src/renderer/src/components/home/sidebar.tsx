import DummyPP from '@renderer/assets/images/dummypp.png'
import { IConversation } from '@renderer/interfaces/ConversationInterface';

interface SidebarProps {
  conversations: IConversation[];

  onSelectConversation: (id: string | null) => Promise<void>;
  onToggleModal: () => void;
  onLogout: () => void;
};

const Sidebar = (props: SidebarProps) => {
  return (
    <div className="bg-gray-900 w-[8rem]">
      <div className="p-5 flex flex-col gap-5 h-full">
        <img
          src={DummyPP}
          alt="serverPic"
          className="rounded-full"
          onClick={() => props.onSelectConversation(null)}
        />
        <hr className="h-[3px] bg-gray-700 outline-none border-none rounded-xl" />
        <button className="btn" onClick={props.onToggleModal}>
          +
        </button>
        <div>
          {props.conversations.map((conversation, idx) => (
            <div key={idx}>
              <button onClick={() => props.onSelectConversation(conversation.id)}>
                <img src={DummyPP} alt="serverPic" className="rounded-full" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-center items-end h-full mb-[1.4rem]">
          <button onClick={props.onLogout} className="btn btn-error text-white">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
