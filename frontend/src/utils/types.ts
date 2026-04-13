export interface User {
  id: string;
  username: string;
  email: string;
  profileImage: string;
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  caption: string;
  image: string;
  rating: number;
  createdAt: string;
  userId?: string;
  user?: {
    id: string;
    username: string;
    profileImage: string;
  };
}
