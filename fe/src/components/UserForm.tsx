import {
  Stack,
  Card,
  TextInput,
  Center,
  Textarea,
} from '@mantine/core';
import type { FormState } from '../types/userform';

type UserFormProps = {
  formData: FormState;
  setFormData: React.Dispatch<React.SetStateAction<FormState>>;
};

export default function UserForm({ formData, setFormData }: UserFormProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>, field: string) => {

    const { value } = event.currentTarget;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Center>
      <Card radius="md" w="400px" p="lg" withBorder >
        <form>
          <Stack>
            <TextInput
              required
              label="Nume"
              placeholder="Nume"
              value={formData.nume}
              onChange={e => handleChange(e, "nume")}
              radius="md"
            />
            <TextInput
              required
              label="Prenume"
              placeholder="Prenume"
              value={formData.prenume}
              onChange={e => handleChange(e, "prenume")}
              radius="md"
            />

            <TextInput
              required
              label="Email"
              placeholder="hello@openhack.com"
              value={formData.email}
              onChange={e => handleChange(e, "email")}
              radius="md"
            />
            <TextInput
              required
              label="Locatie"
              placeholder="Bucuresti"
              value={formData.location}
              onChange={e => handleChange(e, "location")}
              radius="md"
            />
            <Textarea
              required
              label="Descriere Problema"
              placeholder="Descriere Problema"
              value={formData.description}
              onChange={e => handleChange(e, "description")}
              radius="md"
              h="100px"
            />

          </Stack>
        </form>
      </Card >
    </Center>
  );
}
