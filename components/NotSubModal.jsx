import { useEffect, useState } from "react";
import Modal from "./Modal";
import { API } from "@/components/apiClient";

export default function NotSubModal({ visible }) {
  const [url, setUrl] = useState();
  useEffect(() => {
    const api = new API();
    const urlEffect = async () => {
      const portalUrl = await api.getPortalUrl();
      setUrl(portalUrl);
    };
    urlEffect();
  }, []);
  return (
    <Modal visible={visible}>
      <div className="text-white">
        <h2>Oops! Looks like your trial expired.</h2>
        <p>To continue using chadbot, subscribe for $9/month.</p>
        <p>You can cancel anytime!</p>
        <a href={url}>Add payment method</a>
      </div>
    </Modal>
  );
}
