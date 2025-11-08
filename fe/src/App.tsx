import '@mantine/core/styles.css';

import { Center, MantineProvider } from '@mantine/core';

export default function App() {
  return <MantineProvider>
    <div>
      <Center>
        <h1>Hello</h1>
      </Center>
    </div>
  </MantineProvider>
}
