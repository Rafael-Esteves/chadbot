import { useEffect, useState } from "react";
import Modal from "./Modal";
import { HomeContext } from "@/context/HomeContext";
import { useContext } from "react";

export default function LockedFeatureModal() {
  const { showLockedFeatureModal, setShowLockedFeatureModal, goToPortal } =
    useContext(HomeContext);

  return (
    <Modal
      visible={showLockedFeatureModal}
      title="Chadbot plus feature"
      positive={() => {
        goToPortal()
      }}
      positiveText="Add payment method"
      setVisible={setShowLockedFeatureModal}
    >
      <div className="text-white p-5">
        <h2 className="text-xl mb-2">
          Oops! Looks like this is a subscriber only feature.
        </h2>
        <p>To unlock all chadbot features, subscribe now for only $9/month.</p>
        <p className="mb-3">You can cancel anytime!</p>
      </div>
    </Modal>
  );
}
