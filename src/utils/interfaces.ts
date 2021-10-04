export interface Profile {
  fullName: string;
  email: string;
  photo: string;
  id: string;
}

export interface Roll {
  userID: string;
  roll: string;
  likes: string[];
  comments: {
    user: string;
    comment: string;
  }[];
}

export type Rolls = string[];
