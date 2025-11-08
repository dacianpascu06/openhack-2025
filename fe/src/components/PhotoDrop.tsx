import { useRef } from 'react';
import { IconCloudUpload, IconDownload, IconX } from '@tabler/icons-react';
import { Center, Box, Button, Group, Text, useMantineTheme } from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import classes from '../css/PhotoDrop.module.css';
import type { FormState } from '../types/userform';



export default function DropZoneButton({ setFormData }: { setFormData: React.Dispatch<React.SetStateAction<FormState>> }) {
  const theme = useMantineTheme();
  const openRef = useRef<() => void>(null);

  const handleDrop = (files: File[]) => {
    setFormData((prev) => ({
      ...prev,
      photo: files[0],
    }));
  };

  return (
    <Center>
      <Box w="400px" className={classes.wrapper}>
        <Dropzone
          openRef={openRef}
          onDrop={handleDrop}
          className={classes.dropzone}
          radius="md"
          accept={[MIME_TYPES.jpeg]}
          maxSize={30 * 1024 ** 2}
        >
          <div style={{ pointerEvents: 'none' }}>
            <Group justify="center">
              <Dropzone.Accept>
                <IconDownload size={50} color={theme.colors.blue[6]} stroke={1.5} />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX size={50} color={theme.colors.red[6]} stroke={1.5} />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconCloudUpload size={50} stroke={1.5} className={classes.icon} />
              </Dropzone.Idle>
            </Group>


            <Text className={classes.description}>
              Trage și plasează poza aici (format JPEG)
            </Text>
          </div>
        </Dropzone>

        <Button className={classes.control} size="md" radius="xl" onClick={() => openRef.current?.()}>
          Selectează poza
        </Button>
      </Box>
    </Center>
  );
}
