export interface HeroSectionProps {
  title: string;
  subtitle: string;
  buttonText: string;
  onButtonClick?: () => void;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  imageSrc: string;
}