import { useEffect, useState } from "react";
import Modal from "./Modal";
import { HomeContext } from "@/context/HomeContext";
import { useContext } from "react";

import useTranslation from "next-translate/useTranslation";

export default function TrialExpiredModal() {
  const { showTrialExpiredModal, goToPortal } = useContext(HomeContext);

  const { t } = useTranslation("main");

  return (
    <Modal
      visible={showTrialExpiredModal}
      title="Trial expired"
      positive={() => {
        goToPortal();
      }}
      positiveText={t("see_plans")}
    >
      <div className="text-white p-5">
        <h2 className="text-xl mb-2">{t("trial_expired")}</h2>
        <p>{t("continue_using")}</p>
        <p className="mb-3">{t("cancel_anytime")}</p>
      </div>
    </Modal>
  );
}
