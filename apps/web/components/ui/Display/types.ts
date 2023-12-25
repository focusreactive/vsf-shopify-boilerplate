export type DisplayProps = {
  title: string;
  items: {
    image: string;
    title: string;
    subtitle: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    reverse: boolean;
    titleClass: string;
    subtitleClass: string;
    cardColor: string;
  }[];
};
