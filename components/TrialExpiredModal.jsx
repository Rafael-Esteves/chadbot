import { useEffect, useState } from "react";
import Modal from "./Modal";
import { HomeContext } from "@/context/HomeContext";
import { useContext } from "react";

export default function TrialExpiredModal() {
  const { showTrialExpiredModal, goToPortal } = useContext(HomeContext);

  return (
    <Modal
      visible={showTrialExpiredModal}
      title="Trial expired"
      positive={() => {
        goToPortal();
      }}
      positiveText="Add payment method"
    >
      <div className="text-white p-5">
        <h2 className="text-xl mb-2">Oops! Looks like your trial expired.</h2>
        <p>To continue using chadbot, subscribe for $9/month.</p>
        <p className="mb-3">You can cancel anytime!</p>
      </div>
    </Modal>
  );
}
