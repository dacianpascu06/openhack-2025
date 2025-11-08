import { Container, Overlay, Text, Title } from '@mantine/core';
import classes from './../css/HeroTitle.module.css';

export function HeroImageBackground() {
  return (
    <div className={classes.wrapper}>
      <Overlay color="#000" opacity={0.65} zIndex={1} />

      <div className={classes.inner}>
        <Title className={classes.title}>
          Easy Petition
        </Title>

        <Container size={640}>
          <Text size="lg" className={classes.description}>
            O modalitate ușoară și inteligentă de a trimite petiții către instituția potrivită, folosind inteligența artificială pentru a simplifica procesul și a asigura că solicitarea ta ajunge rapid acolo unde trebuie.
          </Text>
        </Container>

      </div>
    </div>
  );
}
