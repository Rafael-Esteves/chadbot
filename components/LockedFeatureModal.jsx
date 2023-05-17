import { useEffect, useState } from "react";
import Modal from "./Modal";
import { HomeContext } from "@/context/HomeContext";
import { useContext } from "react";
import useTranslation from "next-translate/useTranslation";

export default function LockedFeatureModal() {
  const { showLockedFeatureModal, setShowLockedFeatureModal, goToPortal } =
    useContext(HomeContext);

  const { t } = useTranslation("main");

  return (
    <Modal
      visible={showLockedFeatureModal}
      title="Chadbot plus feature"
      positive={() => {
        goToPortal();
      }}
      positiveText={t("see_plans")}
      setVisible={setShowLockedFeatureModal}
    >
      <div className="text-white p-5">
        <h2 className="text-xl mb-2">{t("subscriber_only")}.</h2>
        <p>{t("unlock_feature")}</p>
        <p className="mb-3">{t("cancel_anytime")}</p>
      </div>
    </Modal>
  );
}
