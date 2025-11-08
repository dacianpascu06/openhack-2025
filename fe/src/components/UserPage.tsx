import { Center, Divider, Group } from "@mantine/core";
import { HeroImageBackground } from "./HeroHeader";
import UserForm from "./UserForm";
import PhotoDrop from "./PhotoDrop";
import type { FormState } from "../types/userform";
import { useState } from "react";
import UserSend from "./UserSend";

export default function UserPage() {

  const [formData, setFormData] = useState<FormState>({
    nume: '',
    prenume: '',
    location: '',
    email: '',
    description: '',
    photo: null, // inițial nu este selectată nicio poză
  });

  return <div>
    <HeroImageBackground />
    <Divider h="30px"></Divider>
    <Center>
      <Group >
        <UserForm formData={formData} setFormData={setFormData} />
        <PhotoDrop setFormData={setFormData} />
      </Group>
    </Center>
    <Center>
      <Divider mt="50px" w="300px" h="40px" color="lightblue" />
    </Center>
    <UserSend formData={formData} />
  </div>
}
