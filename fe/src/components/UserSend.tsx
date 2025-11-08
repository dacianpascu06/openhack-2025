import { Button, Center, Modal } from "@mantine/core";
import type { FormState } from "../types/userform";
import React, { useState } from "react";
import axios from "axios";
import { IconCheck, IconX } from '@tabler/icons-react';

async function sendData(
  e: React.MouseEvent<HTMLButtonElement>,
  formData: FormState,
  setSuccess: (v: boolean) => void,
  setRespMsg: (s: string) => void,
  setError: (s: string | null) => void,
  setLoading: (v: boolean) => void
) {

  // Check if fields are filled
  if (!formData.nume || !formData.prenume || !formData.location || !formData.email || !formData.description) {
    alert("Va rugam sa completati toate campurile.");
    return;
  }

  // Check if photo is attached
  if (!formData.photo) {
    alert("Va rugam sa atasati o poza.");
    return;
  }

  e.preventDefault();
  const formDataToSend = new FormData();
  formDataToSend.append("nume", formData.nume);
  formDataToSend.append("prenume", formData.prenume);
  formDataToSend.append("location", formData.location);
  formDataToSend.append("email", formData.email);
  formDataToSend.append("description", formData.description);

  if (formData.photo) {
    formDataToSend.append("photo", formData.photo);
  }
  setLoading(true);
  try {
    const resp = await axios.post("http://127.0.0.1:5000/api/v1/create_ticket", formDataToSend);
    const data = resp.data || {};
    console.log("Response data:", data);
    setRespMsg(data.ticket_id ? data.ticket_id : "ff:ff:ff:ff:ff:ff");
    setSuccess(true);
    setError(null);
  } catch (error: any) {
    console.error(error);
    const msg = error?.response?.data?.error || error.message || "Eroare la trimitere";
    setError(String(msg));
    setSuccess(false);
  } finally {
    setLoading(false);
  }


}

export default function UserSend({ formData }: { formData: FormState }) {
  const [success, setSuccess] = useState(false);
  const [respMsg, setRespMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Center>
      <div>
        <Button
          onClick={(e) => sendData(e, formData, setSuccess, setRespMsg, setError, setLoading)}
          variant="default"
          w="200px"
          loading={loading}
          disabled={loading || success}
        >
          {success ? 'Trimis' : 'Trimite Petitia'}
        </Button>

        <Modal radius="lg" opened={success} onClose={() => setSuccess(false)} title={null} withCloseButton={false} centered>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <IconCheck size={48} color="#2f9e44" />
            <div style={{ fontSize: 18, fontWeight: 700, alignItems: 'center'}}>Raport creat cu succes <br/> ID: {respMsg}</div>
            <Button onClick={() => setSuccess(false)}>OK</Button>
          </div>
        </Modal>

        <Modal radius="lg" opened={!!error} onClose={() => setError(null)} title="Eroare" centered >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <IconX size={36} color="#ff6b6b" />
            <div>{error}</div>
            <Button variant="outline" onClick={() => setError(null)}>Close</Button>
          </div>
        </Modal>
      </div>
    </Center>
  );
}
