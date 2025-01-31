export interface MemberProps {
  user_name: string;
  profile_picture: string;
  is_block: boolean;
  amount_of_no_show: number;
  amount_of_book: number;
  add_time: string;
}

export interface CreateSessionType {
  location: string;
  date: string;
  time: string;
  limit_of_member: number;
  price: number;
  description: string;
}
