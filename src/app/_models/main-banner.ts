export interface MainBanner {
  id: number;
  title: string;
  routerLink: string;
  description: string;
  label: string;
  autoPlay: number;
  isUserCanLeaf: boolean;
  photos: { id: number; src: string }[];
}
