import { useRef, useState } from 'react';
import { IconCloudUpload, IconDownload, IconX } from '@tabler/icons-react';
import { Center, Box, Button, Group, Text, useMantineTheme } from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import classes from '../css/PhotoDrop.module.css';
import type { FormState } from '../types/userform';
import PhotoPreview from './PhotoPreview';



export default function DropZoneButton({ setFormData, onSend }: { setFormData: React.Dispatch<React.SetStateAction<FormState>>; onSend?: () => void }) {
  const theme = useMantineTheme();
  const openRef = useRef<() => void>(null);
  // local file state so user can preview/confirm before it's written into form state
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [confirmed, setConfirmed] = useState<boolean>(false);

  const handleDrop = (files: File[]) => {
    setLocalFile(files[0] ?? null);
  };

  const handleConfirm = () => {
    setFormData((prev) => ({ ...prev, photo: localFile }));
    setConfirmed(true);
  };

  const handleRemove = () => {
    setLocalFile(null);
    setFormData((prev) => ({ ...prev, photo: null }));
    setConfirmed(false);
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
          multiple={false}
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

        {/* show the select button only when no local file is chosen */}
        {!localFile && (
          <Button className={classes.control} size="md" radius="xl" onClick={() => openRef.current?.()}>
            Selectează poza
          </Button>
        )}

        {/* preview + confirm/remove UI */}
        <PhotoPreview file={localFile} onConfirm={handleConfirm} onRemove={handleRemove} confirmed={confirmed} />

      </Box>
    </Center>
  );
}
