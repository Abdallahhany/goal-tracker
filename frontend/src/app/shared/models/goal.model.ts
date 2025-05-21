export interface Goal {
  id?: string;
  title: string;
  description: string;
  isPublic: boolean;
  deadline: Date;
  completed?: boolean;
  ownerId?: string;
  order: number;
  parentId?: string | null;
  publicId?: string | null;
  children?: Goal[];
  createdAt?: Date;
  updatedAt?: Date;
}
