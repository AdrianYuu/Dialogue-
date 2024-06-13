import { useState } from "react";
import InputForm from "../InputForm";

interface CreateChatModalProps {
  isOpen: boolean;

  onCreateChat: (userIds: string[]) => void;
  onCloseModal: () => void;
};

const CreateChatModal = (props: CreateChatModalProps) => {
  const [quantity, setQuantity] = useState<number>(0);
  const [userIds, setUserIds] = useState<string[]>([]);


  const isQuantityValid = (quantity: number) => {
    return !isNaN(quantity) && quantity > 0 && quantity <= 5;
  }

  const onQuantityChange = (quantity: number) => {
    if (isQuantityValid(quantity))
      setQuantity(quantity);
  };

  const onUserIdChange = (index: number, value: string) => {
    setUserIds((prevUserIds) => {
      const newUserIds = [...prevUserIds];
      newUserIds[index] = value;
      return newUserIds;
    });
  };

  const handleCloseModal = () => {
    setQuantity(0);
    setUserIds([]);
    props.onCloseModal();
  };

  const handleCreateChat = () => {
    props.onCreateChat(userIds);
    handleCloseModal();
  };


  const renderUserInputs = () => {
    return userIds.map((userId, index) => (
      <div key={index}>
        <InputForm
          label={`User #${index + 1}`}
          type="text"
          value={userId}
          placeholder="Enter User ID..."
          onChange={(value) => onUserIdChange(index, value)}
        />
      </div>
    ));
  };

  return (
    props.isOpen && (
      <dialog className="modal" open>
        <div className="modal-box bg-gray-800">
          <h3 className="font-bold text-xl text-white">Create New Chat!</h3>
          <InputForm
            label=""
            type="number"
            value={quantity}
            placeholder="User Count (max: 5)"
            onChange={(value) => onQuantityChange(Number(value))}
          />
          {renderUserInputs()}
          <div className="modal-action">
            <button className="btn" onClick={handleCreateChat}>
              Create
            </button>
            <button className="btn" onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      </dialog>
    )
  );
};

export default CreateChatModal;
