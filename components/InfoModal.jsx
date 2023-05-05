import { useEffect, useState } from "react";
import Modal from "./Modal";
import { HomeContext } from "@/context/HomeContext";
import { useContext } from "react";

export default function InfoModal() {
  const { showInfoModal, setShowInfoModal } = useContext(HomeContext);

  return (
    <Modal
      visible={showInfoModal}
      title="Just so you know"
      positive={() => {
        setShowInfoModal(!showInfoModal);
      }}
      positiveText="Gotcha"
    >
      <div className="flex flex-col justify-center content-center">
        <h2 className="p-3 text-xl my-2 text-slate-300 md:max-w-2xl">
          Toggle auto chat to automatically respond to ongoing conversations and
          open new matches every 5 minutes. (Do not close the page)
        </h2>
        <h2 className="p-3 text-xl my-2 text-slate-300 md:max-w-2xl">
          The stuff you write in your bio and the interests you select on Tinder
          will be used as context when generating messages. Make sure your
          Tinder profile is as rich as possible to ensure the best
          representation of you by the chat bot.
        </h2>
      </div>
    </Modal>
  );
}
