import { Button, Center } from "@mantine/core";
import type { FormState } from "../types/userform";
import React from "react";
import axios from "axios";
async function sendData(e: React.MouseEvent<HTMLButtonElement>, formData: FormState) {

  e.preventDefault();
  try {
    await axios.post("/your-endpoint", formData);
    // handle success (e.g., show a message)
  } catch (error) {
    console.log(error)
  }

}

export default function UserSend({ formData }: { formData: FormState }) {
  return <Center>
    <Button onClick={(e) => sendData(e, formData)} variant="default" w="200px">Trimite Petitia</Button>
  </Center>
}
