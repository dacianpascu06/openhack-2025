import { Button, Center } from "@mantine/core";
import type { FormState } from "../types/userform";
import React from "react";
import axios from "axios";
async function sendData(e: React.MouseEvent<HTMLButtonElement>, formData: FormState) {

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
  try {
    await axios.post("http://127.0.0.1:5000/api/v1/create_ticket", formDataToSend);
    console.log("success")
  } catch (error) {
    console.log(error)
  }


}

export default function UserSend({ formData }: { formData: FormState }) {
  return <Center>
    <Button onClick={(e) => sendData(e, formData)} variant="default" w="200px">Trimite Petitia</Button>
  </Center>
}
