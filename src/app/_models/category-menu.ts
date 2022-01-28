export interface CategoryMenu {
  id: number;
  name: string;
  routerLink: any;
  isTulip: boolean;
  items?: CategoryMenu[];
}
