export interface Advantages {
  title: string;
  subTitle: string;
  leftBlock: Block;
  centerBlock: Block;
  rightBlock: Block;
}

interface Block {
  img: string;
  title: string;
  description: string;
}
